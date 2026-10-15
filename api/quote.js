const limitWindow = 10 * 60 * 1000;
const maxRequests = 6;
const requests = new Map();

function clean(value, max = 300) {
  return typeof value === 'string' ? value.trim().replace(/[<>]/g, '').slice(0, max) : '';
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function reply(res, status, data) {
  return res.status(status).json(data);
}

module.exports = async function quote(req, res) {
  if (req.method !== 'POST') return reply(res, 405, { error: 'Method not allowed.' });
  if (Number(req.headers['content-length'] || 0) > 20_000) return reply(res, 413, { error: 'Request too large.' });

  const payload = typeof req.body === 'string' ? (() => {
    try { return JSON.parse(req.body); } catch { return null; }
  })() : req.body;
  if (!payload || typeof payload !== 'object') return reply(res, 400, { error: 'Invalid request.' });
  if (clean(payload.website, 200)) return reply(res, 200, { ok: true });

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  const now = Date.now();
  const recent = (requests.get(ip) || []).filter(time => now - time < limitWindow);
  if (recent.length >= maxRequests) return reply(res, 429, { error: 'Too many requests. Please try again later.' });
  recent.push(now);
  requests.set(ip, recent);

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
    return reply(res, 400, { error: 'Please check your name, phone number, and quantity.' });
  }
  if (details.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.Email)) {
    return reply(res, 400, { error: 'Please enter a valid email address.' });
  }
  if (!process.env.RESEND_API_KEY || !process.env.QUOTE_TO_EMAIL || !process.env.QUOTE_FROM_EMAIL) {
    console.error('Quote mailer is missing RESEND_API_KEY, QUOTE_TO_EMAIL, or QUOTE_FROM_EMAIL.');
    return reply(res, 503, { error: 'Quote email is not configured yet. Please contact us by WhatsApp.' });
  }

  const rows = [...Object.entries(fields), ...Object.entries(details)]
    .filter(([, value]) => value)
    .map(([label, value]) => `<tr><th align="left" style="padding:8px 12px;border-bottom:1px solid #ddd">${escapeHtml(label)}</th><td style="padding:8px 12px;border-bottom:1px solid #ddd">${escapeHtml(value)}</td></tr>`)
    .join('');
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
      return reply(res, 502, { error: 'We could not send your enquiry right now. Please try again or use WhatsApp.' });
    }
    return reply(res, 200, { ok: true });
  } catch (error) {
    console.error('Quote email request failed:', error);
    return reply(res, 502, { error: 'We could not send your enquiry right now. Please try again or use WhatsApp.' });
  }
};
