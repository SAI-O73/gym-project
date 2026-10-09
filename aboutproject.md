# RUDRAFIT Project Description

## Project Overview

RUDRAFIT is a responsive web application for fitness training, nutrition planning, and personal progress tracking. It brings together account and profile management, fitness calculators, diet and workout plans, and an AI fitness assistant in one application. The interface uses a black-and-red visual identity and includes animated page transitions and interactive motion effects.

The app is built as a React single-page application. Supabase provides authentication and hosted profile data storage, while an Express server proxies AI and contact-email requests.

## Main Features

- Account registration and sign-in with email, session persistence, password reset, and account deletion.
- User profile details including name, email, weight, height, age, gender, fitness goal, and profile image.
- BMR and protein calculators that use personal metrics and fitness goals.
- Personalized diet plan summaries and workout library pages.
- AI Coach chat with suggested prompts, retry support, and RUDRAFIT-focused guidance.
- Contact form email delivery through the backend proxy.
- Responsive navigation, page transitions, scroll reveals, notifications, and a reduced-motion-aware home-page marquee.

## Frontend Technologies

- **React 19**: Builds the app interface from reusable components and pages.
- **Vite 8**: Provides local development, hot module replacement, and the production build.
- **React Router**: Handles client-side navigation and protected pages for signed-in users.
- **Tailwind CSS 4**: Supplies utility-first styling through the Vite Tailwind plugin.
- **Framer Motion**: Provides page transitions, image motion, scroll reveals, and other animations.
- **React Icons**: Supplies interface icons.
- **Chart.js**, **react-chartjs-2**, and **react-circular-progressbar**: Support charts and progress visualizations.
- **Three.js**, **React Three Fiber**, and **Drei**: Provide libraries for interactive 3D visuals.
- **Lottie React**: Supports Lottie animations.
- **React Hot Toast**: Displays success, error, and status notifications.
- **Axios**: Makes HTTP requests to the AI proxy.

The route definitions and shared application layout are in `src/App.jsx`. Page components are in `src/pages/`, reusable interface components are in `src/components/`, and shared API integrations are in `src/services/`.

## Backend and Data Services

### Supabase

Supabase provides the hosted authentication and database backend:

- **Supabase Auth** handles user registration, email/password sign-in, sessions, Google OAuth support, and password resets.
- **Supabase PostgreSQL** stores profile records in the `public.profiles` table.
- **Row Level Security (RLS)** policies limit profile reads and writes to the authenticated user whose ID matches the profile row.
- A **Supabase Edge Function**, `delete-account`, validates the signed-in user and uses the Supabase Admin API to delete the account.

The Supabase client and data helpers are in `src/services/supabase.js`. The profile table and RLS policies are documented in `supabase/profiles.sql`; the account deletion function is in `supabase/functions/delete-account/index.ts`.

### Express Proxy

The Node.js server uses **Express 5** to provide API endpoints without putting the Gemini API key in browser requests. It uses **CORS** and JSON middleware, **Axios** for the Gemini API request, and **dotenv** for loading server environment variables.

- `POST /ask` accepts a chat message and requests an answer from Gemini.
- `POST /contact` validates a contact message and sends it with **Resend**.
- The `server/proxy.cjs` version, which the `start:proxy` package script runs, includes token-bucket throttling and retries for Gemini rate-limit responses.
- `server/proxy.js` contains a similar proxy implementation.

## AI Chatbot

The AI Coach interface is implemented in `src/pages/GymAssistant.jsx`, and its browser-side request helper is `src/services/gemini.js`.

The normal request flow is:

1. The user submits a message in the AI Coach page.
2. The frontend helper sends the message to the configured Express proxy at `/ask`.
3. The proxy builds a RUDRAFIT-focused prompt and calls **Google Gemini 2.0 Flash** using the Gemini Generative Language API.
4. The server returns the generated answer for display in the chat.

When no proxy URL is configured, or when the proxy reports a rate limit, the frontend can answer common greetings and app or fitness questions with built-in fallback responses. The AI Coach also includes suggested prompts, a loading state, chat clearing, and retry handling.

## Contact Email Flow

The frontend contact form sends its message to `POST /contact`. The Express server uses the **Resend API** to deliver it. Resend credentials remain server-side and are read from environment variables.

## Environment Configuration

Configure these values in the appropriate local or deployment environment. Do not commit secret keys to source control.

### Frontend

- `VITE_SUPABASE_URL`: Supabase project URL.
- `VITE_SUPABASE_ANON_KEY`: Supabase public anon key.
- `VITE_GEMINI_PROXY_URL`: Base URL of the Express proxy, for example `http://localhost:3001` for local development.
- `VITE_AUTH_REDIRECT` and `VITE_RESET_REDIRECT`: Optional redirect URLs for email confirmation and password reset.

### Express Proxy

- `GEMINI_API_KEY`: Gemini API key. Keep this on the server; do not expose it in frontend code.
- `PORT`: Optional proxy port; defaults to `3001`.
- `GEMINI_RATE_LIMIT_PER_SEC`: Optional Gemini request rate limit used by `server/proxy.cjs`.
- `RESEND_API_KEY`: Resend API key for contact email delivery.
- `CONTACT_FROM_EMAIL`: Optional verified sender address for contact email.

### Supabase Edge Function

The `delete-account` Edge Function requires `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` in its server-side environment. The service role key must never be placed in the frontend.

## Running the Project

Install dependencies and start the Vite frontend:

```bash
npm install
npm run dev
```

Start the Express proxy separately in another terminal:

```bash
npm run start:proxy
```

Create a production frontend build with:

```bash
npm run build
```

Preview a production build locally with:

```bash
npm run preview
```

## Key Tools and Configuration Files

- `package.json`: Runtime dependencies and npm scripts.
- `vite.config.js`: Vite, React, and Tailwind CSS plugin configuration.
- `tailwind.config.js`: Brand colors and Tailwind content paths.
- `src/App.jsx`: Application routes, shared navigation/footer, and page transitions.
- `src/services/supabase.js`: Supabase authentication and profile operations.
- `src/services/gemini.js`: Frontend AI request and fallback-response logic.
- `server/proxy.cjs`: Express AI and contact endpoints, throttling, and Gemini retries.
- `supabase/profiles.sql`: Profile schema and row-level security policies.
- `supabase/functions/delete-account/index.ts`: Authenticated account deletion endpoint.

## Summary

RUDRAFIT combines a React/Vite frontend with Supabase for authentication and profile persistence, an Express proxy for server-side AI and email integrations, Google Gemini 2.0 Flash for conversational fitness guidance, and Resend for contact email delivery. The result is a single fitness app for users to manage their profile, explore training and nutrition content, calculate personal targets, and ask the AI Coach for guidance.