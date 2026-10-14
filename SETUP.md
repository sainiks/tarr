# Quote email setup

Quote requests are sent from the server with Resend; the visitor's email app is never opened.

1. Install Node.js 18 or newer.
2. Create a Resend account, verify the sending domain, and create an API key.
3. Copy `.env.example` to `.env` and set `RESEND_API_KEY`, `QUOTE_TO_EMAIL`, and `QUOTE_FROM_EMAIL`. The `from` address must use a domain verified in Resend.
4. Start the storefront with `npm start` and open `http://localhost:3000`.

Keep `.env` private. On deployment, set the same values as server environment variables and run `npm start`. Requests use `POST /api/quote`; do not serve this form as a static-only website if you need email delivery. Until mail settings are configured, the form returns a setup error and the WhatsApp option remains available.
