# HI Agent — Backend Service

This repository contains the backend service for **HI Agent**, a 24/7 AI Voice Agent built for the home service trades. It runs on Node.js and Express, designed to be deployed instantly on Render.

## 🌟 What This Does
1. **Webhook Handler**: Receives live POST payloads from Vapi.ai whenever a voice call ends.
2. **Database Logging**: Saves all call metadata, transcripts, durations, and caller phone numbers to MongoDB Atlas for your records.
3. **Instant Email Notifications**: Uses Resend to automatically email the business owner a complete call transcript and summary the second a call finishes.
4. **Contact Form API**: Handles traditional web form submissions from the frontend.

---

## 🚀 Deployment (Render)

This backend is designed to be deployed on [Render](https://render.com).

1. Connect your GitHub repository to Render and create a new **Web Service**.
2. Render will automatically detect the `render.yaml` configuration file and set up the build commands (`npm install && npm run build`) and start commands (`npm start`).
3. You MUST provide the following Environment Variables in the Render dashboard:

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `MONGODB_DB_NAME` | Name of your database (e.g., `hi-agent`) |
| `RESEND_API_KEY` | Your API key from Resend.com |
| `NOTIFICATION_EMAIL`| Where call summaries should be sent (e.g. `hassan@smartlogicsllc.com`) |
| `VAPI_WEBHOOK_SECRET`| A random secure string you generate. You must paste this same string into your Vapi.ai Webhook settings to secure your endpoint. |

---

## 💻 Local Development

To run this backend on your local machine:

1. Copy `.env.example` to `.env` (or just use `.env`).
2. Fill in the keys (MongoDB, Resend).
3. Run the following commands:

```bash
# Install dependencies
npm install

# Start the development server (with auto-reload)
npm run dev
```
The server will run on `http://localhost:3001`.

### Simulating a Call Webhook locally
If you want to test the email notification and database saving without making an actual phone call, you can run the mock seed script from the root repository:
```bash
npx ts-node ../database/seeds/test-call-log.ts
```

---

## 📂 File Structure

```text
src/
├── index.ts                 # Main Express server setup & config
├── routes/
│   ├── webhook.ts           # Receives payload from Vapi
│   └── contact.ts           # Receives form data from website
├── services/
│   ├── email.ts             # Resend email logic
│   └── db.ts                # MongoDB connection logic
├── models/
│   ├── CallLog.ts           # Mongoose Schema for calls
│   └── ContactForm.ts       # Mongoose Schema for leads
└── middleware/
    └── validateVapi.ts      # Verifies the VAPI_WEBHOOK_SECRET
```
