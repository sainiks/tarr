# Quote email setup

Quote requests are sent from the server with Resend; the visitor's email app is never opened.

1. Install Node.js 18 or newer.
2. Create a Resend account, verify the sending domain, and create an API key.
3. Copy `.env.example` to `.env` and set `RESEND_API_KEY`, `QUOTE_TO_EMAIL`, and `QUOTE_FROM_EMAIL`. The `from` address must use a domain verified in Resend.
4. Start the storefront with `npm start` and open `http://localhost:3000`.

Keep `.env` private. For Vercel, add `RESEND_API_KEY`, `QUOTE_TO_EMAIL`, and `QUOTE_FROM_EMAIL` under **Project Settings → Environment Variables**, then redeploy. `vercel.json` serves the storefront assets and deploys `api/quote.js` as the `POST /api/quote` function. Until mail settings are configured, the form returns a setup error and the WhatsApp option remains available.

For local use, set the same values in `.env` and run `npm start`.
