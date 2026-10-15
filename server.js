const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
// Load a local .env without adding a runtime dependency. Deployment env vars take precedence.
try {
  for (const line of fs.readFileSync(path.join(root, '.env'), 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2');
  }
} catch (error) { if (error.code !== 'ENOENT') throw error; }
const port = Number(process.env.PORT || 3000);
const limitWindow = 10 * 60 * 1000;
const maxRequests = 6;
const requests = new Map();
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml' };

function send(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(data));
}
function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 20_000) { reject(new Error('Request too large')); req.destroy(); }
    });
    req.on('end', () => {
      try { resolve(JSON.parse(body)); } catch { reject(new Error('Invalid request')); }
    });
    req.on('error', reject);
  });
}
function clean(value, max = 300) {
  return typeof value === 'string' ? value.trim().replace(/[<>]/g, '').slice(0, max) : '';
}
function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}
async function handleQuote(req, res) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const recent = (requests.get(ip) || []).filter(time => now - time < limitWindow);
  if (recent.length >= maxRequests) return send(res, 429, { error: 'Too many requests. Please try again later.' });
  recent.push(now); requests.set(ip, recent);

  let payload;
  try { payload = await readJson(req); } catch (error) { return send(res, 400, { error: error.message }); }
  if (clean(payload.website, 200)) return send(res, 200, { ok: true });
  const customer = payload.customer || {};
  const item = payload.item || {};
  const fields = {
    'System': clean(item.category),
    'Part family': clean(item.family),
    'Model / item no.': clean(item.itemNo || item.model),
    'Machine / OEM reference': clean(item.machineNo),
    'Fitment details': clean(item.specs, 1000),
    'Part / machine reference': clean(item.reference)
  };
  const details = {
    'Name': clean(customer.name, 120),
    'Phone': clean(customer.phone, 40),
    'Email': clean(customer.email, 200),
    'Company': clean(customer.company, 160),
    'Quantity': clean(customer.quantity, 12),
    'Delivery pincode': clean(customer.pincode, 20)
  };
  if (!details.Name || !details.Phone || !/^\d+$/.test(details.Quantity) || Number(details.Quantity) < 1) {
    return send(res, 400, { error: 'Please check your name, phone number, and quantity.' });
  }
  if (details.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.Email)) return send(res, 400, { error: 'Please enter a valid email address.' });
  if (!process.env.RESEND_API_KEY || !process.env.QUOTE_TO_EMAIL || !process.env.QUOTE_FROM_EMAIL) {
    console.error('Quote mailer is missing RESEND_API_KEY, QUOTE_TO_EMAIL, or QUOTE_FROM_EMAIL.');
    return send(res, 503, { error: 'Quote email is not configured yet. Please contact us by WhatsApp.' });
  }
  const rows = [...Object.entries(fields), ...Object.entries(details)].filter(([, value]) => value).map(([label, value]) => `<tr><th align="left" style="padding:8px 12px;border-bottom:1px solid #ddd">${escapeHtml(label)}</th><td style="padding:8px 12px;border-bottom:1px solid #ddd">${escapeHtml(value)}</td></tr>`).join('');
  const subjectRef = fields['Model / item no.'] || fields['Part / machine reference'] || 'New quote request';
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.QUOTE_FROM_EMAIL,
        to: [process.env.QUOTE_TO_EMAIL],
        reply_to: details.Email || undefined,
        subject: `Quote request — ${subjectRef}`,
        html: `<h2>New quotation request</h2><table style="border-collapse:collapse;font-family:Arial,sans-serif">${rows}</table>`
      })
    });
    if (!response.ok) {
      console.error('Resend rejected quote email:', response.status, await response.text());
      return send(res, 502, { error: 'We could not send your enquiry right now. Please try again or use WhatsApp.' });
    }
    return send(res, 200, { ok: true });
  } catch (error) {
    console.error('Quote email request failed:', error);
    return send(res, 502, { error: 'We could not send your enquiry right now. Please try again or use WhatsApp.' });
  }
}

const server = http.createServer(async (req, res) => {
  const pathname = new URL(req.url, `http://${req.headers.host || 'localhost'}`).pathname;
  if (req.method === 'POST' && pathname === '/api/quote') return handleQuote(req, res);
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, { error: 'Method not allowed.' });
  const requested = pathname === '/' ? 'index.html' : decodeURIComponent(pathname).replace(/^\/+/, '');
  const file = path.resolve(root, requested);
  if (!file.startsWith(`${root}${path.sep}`) && file !== path.join(root, 'index.html')) return send(res, 404, { error: 'Not found.' });
  fs.readFile(file, (error, content) => {
    if (error) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' });
    res.end(req.method === 'HEAD' ? undefined : content);
  });
});
server.listen(port, () => console.log(`SinghWorks quote site running at http://localhost:${port}`));
