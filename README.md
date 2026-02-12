# Dreams Saver 🌙✨

A beautiful web application for recording, storing, and gaining AI-powered insights from your dreams using Google's Gemini AI.

## Features

- 🎨 **Dreamy, ethereal UI** - Calming dark mode design with soft gradients
- 📝 **Unlimited dream entries** - Record as many dreams as you want
- 🤖 **AI-powered insights** - Get personalized dream analysis from Gemini AI
- 🔒 **Secure & Private** - Your dreams are encrypted and completely private
- 💰 **Freemium model** - 5 free AI insights, unlimited for $8/month
- 🏷️ **Tags & Metadata** - Optional mood tracking and custom tags
- 🔍 **Search functionality** - Easily find past dreams

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (serverless)
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth
- **AI**: Google Gemini 1.5 Pro
- **Payments**: Stripe
- **Deployment**: Vercel (recommended)

## Project Structure

```
dream-app/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   └── signup-with-dream/route.ts
│   │   ├── insights/
│   │   │   └── generate/route.ts
│   │   └── stripe/
│   │       └── webhook/route.ts
│   ├── dashboard/
│   │   └── page.tsx
│   ├── dream/
│   │   └── [dreamId]/page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── gemini.ts
│   └── supabase.ts
├── supabase/
│   └── schema.sql
├── .env.example
└── package.json
```
## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- A Supabase account
- A Google AI Studio account (for Gemini API)
- A Stripe account (for payments)

### 1. Clone and Install

```bash
cd C:\Users\Swarneil Pradhan\ai-sandbox\dream-app
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API to get your credentials
3. Go to SQL Editor and run the entire `supabase/schema.sql` file
4. Enable Email Auth in Authentication > Providers

### 3. Set Up Gemini AI

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Copy the key for your `.env.local` file

### 4. Set Up Stripe

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Create a new product for the $8/month subscription
3. Get your API keys from Developers > API Keys
4. Set up a webhook endpoint for production:
   - URL: `https://your-domain.com/api/stripe/webhook`
   - Events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`

### 5. Configure Environment Variables

Create a `.env.local` file in the root directory:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_PRICE_ID=your_stripe_price_id_for_subscription

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses the following main tables:

- **profiles** - User profiles with subscription status and insight counts
- **dream_entries** - Dream records with content and metadata
- **dream_metadata** - Optional mood and tags for dreams
- **dream_insights** - AI-generated insights linked to dreams
- **subscriptions** - Stripe subscription tracking

All tables have Row-Level Security (RLS) enabled to ensure users can only access their own data.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add all environment variables from `.env.local`
4. Deploy!

### Post-Deployment

1. Update your Stripe webhook URL to your production domain
2. Update `NEXT_PUBLIC_APP_URL` in environment variables
3. Test the signup flow and payment integration
## Features Breakdown

### Free Tier
- ✅ Unlimited dream entries
- ✅ 5 AI-powered insights
- ✅ Search and filter dreams
- ✅ Tags and mood tracking
- ✅ Secure cloud storage

### Premium Tier ($8/month)
- ✅ Everything in Free tier
- ✅ **Unlimited AI insights**
- ✅ Priority support

## Development Notes

### Key Files

- `app/page.tsx` - Landing page with first dream submission
- `app/dashboard/page.tsx` - Main dashboard showing all dreams
- `app/dream/[dreamId]/page.tsx` - Individual dream detail and insight view
- `app/api/insights/generate/route.ts` - API endpoint for generating AI insights
- `app/api/stripe/webhook/route.ts` - Stripe webhook handler
- `lib/gemini.ts` - Gemini AI integration
- `lib/supabase.ts` - Supabase client and type definitions
- `supabase/schema.sql` - Complete database schema with RLS

### Styling

The app uses a custom dreamy aesthetic with:
- Deep Night background (#0A071B)
- Astral Blue accents (#4A4E69)
- Soft Lavender highlights (#C3B1E1)
- Muted grays for secondary text
- Tailwind CSS for utility-first styling

## Troubleshooting

### Common Issues

1. **Authentication errors**: Check Supabase credentials and RLS policies
2. **AI insights not generating**: Verify GEMINI_API_KEY is correct
3. **Payment webhooks failing**: Ensure STRIPE_WEBHOOK_SECRET matches Stripe dashboard
4. **Database errors**: Run schema.sql again to ensure all tables and triggers exist

## Future Enhancements

- 📱 Mobile app (React Native)
- 🎙️ Voice-to-text dream recording
- 📊 Dream analytics and patterns
- 🌍 Dream journal export (PDF)
- 👥 Optional dream sharing (private links)
- 🔔 Dream reminder notifications

## License

MIT License - feel free to use this project as you wish!

## Credits

Built with ❤️ using Next.js, Supabase, Gemini AI, and Stripe.