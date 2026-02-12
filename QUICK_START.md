# Dreams Saver - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- A Supabase account (free tier is fine)
- A Google AI Studio account (free)
- A Stripe account (for payments - optional for testing)

### Step 1: Install Dependencies
```bash
cd "C:\Users\Swarneil Pradhan\ai-sandbox\dream-app"
npm install
```

### Step 2: Set Up Supabase (5 minutes)

1. Go to https://supabase.com and create a new project
2. Wait for the project to initialize (~2 minutes)
3. Go to **Project Settings > API**
   - Copy the `Project URL` 
   - Copy the `anon/public` key
   - Copy the `service_role` key (click "Reveal" first)
4. Go to **SQL Editor** (left sidebar)
5. Click **New Query** and paste the ENTIRE contents of `supabase/schema.sql`
6. Click **Run** to execute the schema
7. Go to **Authentication > Providers** and ensure **Email** is enabled

### Step 3: Set Up Gemini AI (2 minutes)

1. Go to https://makersuite.google.com/app/apikey
2. Click **Create API Key**
3. Copy the generated API key

### Step 4: Create Environment File

Create a file named `.env.local` in the root directory:

```env
# Supabase (from Step 2)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Gemini AI (from Step 3)
GEMINI_API_KEY=your-gemini-api-key-here

# Stripe (Optional for now - use dummy values)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_dummy
STRIPE_SECRET_KEY=sk_test_dummy
STRIPE_WEBHOOK_SECRET=whsec_dummy
STRIPE_PRICE_ID=price_dummy

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 5: Run the App
```bash
npm run dev
```

Open http://localhost:3000 in your browser!

## 🎯 Testing the App

### First-Time User Flow
1. On the landing page, enter:
   - A dream description in the text box
   - Your email
   - A password (min 6 characters)
2. Click **"Begin your journey"**
3. You'll be redirected to the dashboard

### Dashboard Features
- View all your dreams
- Search through dreams
- Click **"+ Record New Dream"** to add more
- Click any dream to view details

### Dream Detail Page
- View your full dream text
- See metadata (date, word count, mood, tags)
- Click **"Generate Insight"** to get AI analysis
- View AI-generated insights (you get 5 free!)

## 🔧 Troubleshooting

### "Failed to fetch" errors
- Make sure all environment variables are set correctly in `.env.local`
- Restart the dev server after changing `.env.local`

### "Unauthorized" or auth errors
- Check that you ran the `supabase/schema.sql` file
- Verify your Supabase URL and keys are correct
- Make sure Email auth is enabled in Supabase

### AI insights not generating
- Verify your `GEMINI_API_KEY` is correct
- Check the browser console for detailed error messages
- Ensure you have free insights remaining (check dashboard header)

### Database errors
- Go to Supabase > SQL Editor
- Run the schema.sql file again to ensure all tables exist
- Check Supabase > Table Editor to verify tables are created

## 📱 What's Working

✅ **User Registration & Login**
- Sign up with first dream submission
- Login for returning users
- Secure session management

✅ **Dream Management**
- Unlimited dream entries
- Search functionality
- Optional metadata (mood, tags, title)
- Automatic word count

✅ **AI Insights**
- Powered by Google Gemini 1.5 Pro
- Structured analysis with:
  - High-level summary
  - Emotional tone analysis
  - Symbolic interpretation
  - Full comprehensive analysis
- Free tier: 5 insights
- Premium tier: Unlimited (requires Stripe setup)

✅ **Beautiful UI**
- Dreamy, ethereal design
- Dark mode optimized
- Smooth transitions
- Responsive layout

## 🎨 Color Palette Reference

The app uses these custom colors (already configured):
- **Deep Night**: `#0A071B` - Main background
- **Astral Blue**: `#4A4E69` - Primary buttons and accents
- **Soft Lavender**: `#C3B1E1` - Secondary highlights
- **Cloud White**: `#F0F4F8` - Primary text
- **Muted Gray**: `#A3A8C0` - Secondary text
- **Insight Tint**: `#1D1A3A` - AI insight section background

## 🔐 Security Features

✅ Row-Level Security (RLS) enabled on all tables
✅ Users can only access their own data
✅ Secure authentication via Supabase Auth
✅ API routes protected with auth checks
✅ Environment variables for sensitive data

## 📊 Database Schema

The app creates these tables automatically:
- `profiles` - User information and subscription status
- `dream_entries` - Dream content
- `dream_metadata` - Optional mood and tags
- `dream_insights` - AI-generated analyses
- `subscriptions` - Stripe subscription tracking

## 💳 Stripe Setup (Optional for Testing)

To enable actual payments:

1. Create a Stripe account at https://stripe.com
2. Create a product for $8/month subscription
3. Get your API keys from Developers > API Keys
4. Update `.env.local` with real Stripe keys
5. After deployment, set up webhook at `https://your-domain.com/api/stripe/webhook`

## 🚀 Ready to Deploy?

See the main README.md for deployment instructions to Vercel!