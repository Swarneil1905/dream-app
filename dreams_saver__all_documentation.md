# Dreams Saver 

## Project Description
A webapp that tracks your dreams and gives insights using AI. We'll use Gemini AI to give insights. The app should be stylized and somewhat dreamy. 

There should be a landing page describing the product along with a text box for users to submit their first dream. This will sign the user up and submit their dream. The user will have a dashboard page that displays all of their recordings. If they click on a recording, they should be taken to another page that contains their recordings and meta information as well as the AI insight/significance. 

For the free tier they will be able to record as many dreams as they wish, but they'll only get 5 free AI insights. There will be one subscription that allows them unlimited AI insights for $8/month

## Product Requirements Document
Product Requirements Document (PRD) - Dreams Saver

Version: 1.0
Date: October 26, 2023
Author: [Your Name/Team]

1. Introduction

1.1 Purpose
This Product Requirements Document (PRD) details the requirements for "Dreams Saver," a web application designed to help users record, store, and gain personalized insights from their dreams using Gemini AI. This document serves as the blueprint for design, development, and testing, outlining the goals, features, user experience, and technical specifications.

1.2 Goals
The primary goals of Dreams Saver are:
1. To provide a seamless, aesthetically pleasing platform for capturing dream experiences immediately upon waking.
2. To leverage Gemini AI to generate personalized, reflective insights on recorded dreams.
3. To implement a clear and fair tiered subscription model (freemium with a paid upgrade).
4. To ensure user data privacy and security through robust authentication and authorization.

1.3 Target Audience
The primary audience is adults aged 18–40 interested in self-reflection, personal growth, mental health awareness, and creativity. They seek an intuitive, non-technical solution to track dream patterns and gain personalized insights beyond generic online interpretations.

2. Features and Functionality

2.1 Core Features

2.1.1 Landing Page
The initial landing page must be visually aligned with the dreamy aesthetic (muted colors, soft gradients). It will feature a brief description of the app's value proposition and a prominent call-to-action: an input box for the user's first dream submission, which doubles as the initial sign-up mechanism.

2.1.2 User Authentication & Onboarding
Authentication will be handled via Supabase Auth (email/password or magic link). The very first dream entry submitted on the landing page will trigger the account creation process, simplifying onboarding friction.

2.1.3 Dream Recording Input
Subsequent dream entry, accessible via the dashboard, must be distraction-free.
Input Method: Primary requirement is a large, optimized text area for quick typing.
Minimum Requirement: Dream text itself is mandatory for a valid recording.
Optional Metadata Capture (for subsequent entries):
    - Optional Mood/Emotional Tone Selection (e.g., calm, anxious, joyful, confused).
    - Optional Tags/Keywords entry.
    - Automatic Date and Time capture upon submission.
Voice-to-text is deferred for a future enhancement.

2.1.4 Dream Dashboard
The central hub after login. It must display all recorded dreams in a list format.
Organization Features:
    - Search functionality (by keywords within dream text or tags).
    - Sorting/Filtering by date (most recent first by default).
Basic Usage Metrics Display:
    - Total dreams recorded.
    - Remaining free AI insights count (for free tier users).
Lightweight Summary Insights (Secondary):
    - Simple trend indicators for dream frequency.
    - Visualization of the most common user-applied tags.

2.1.5 Dream Detail View
When a user clicks on a specific dream entry from the dashboard:
Metadata Presentation: Display captured metadata (Date/Time, Length/Word Count, Mood, Tags) clearly near the top, separated contextually from the main text.
Raw Dream Text: Display the user's original entry.
AI Insight Section: If an insight exists (or is being generated), it must be visually distinct and presented below the raw text and metadata.

2.1.6 AI Insight Generation (Gemini Integration)
The core value driver. Insights are only generated upon user request or automatically upon initial dream save, pending available free usage or subscription status.
AI Prompt Requirements (Input to Gemini):
    - Raw dream text.
    - Available metadata (tags, date context).
Gemini Output Structure (Must include, but not be limited to):
    - High-level dream summary.
    - Emotional analysis (tone identification).
    - Symbolic/Metaphorical interpretations (framed as reflection prompts).
    - Possible real-world connection prompts.
Gemini Tone: Supportive, calm, introspective, non-diagnostic. Avoid clinical or deterministic language.
Loading State: Clear UI feedback (loading indicators) must be provided during API latency.

2.2 Subscription and Monetization

2.2.1 Free Tier (Freemium)
Users can record unlimited dreams.
Limitation: Capped at five (5) total AI insights generated across the lifetime of the account.
Usage Tracking: A persistent, non-intrusive indicator tracks usage (e.g., "3 of 5 free insights remaining").

2.2.2 Paid Tier ($8/Month)
A single subscription offering unlimited AI insights.
Upgrade Path: When a free user attempts to generate an insight past the limit of 5, the insight generation is blocked, and a clear prompt directs them to the subscription page.
Access Control: Existing dream text and metadata remain fully viewable regardless of tier. Only new insight generation is gated.

2.2.3 Payment Gateway
Stripe will be used exclusively via Stripe Checkout for transaction handling.
Integration Requirement: Webhook handling to update user subscription status in the Supabase database reliably.
Cancellation Policy: Users can cancel anytime; access remains until the end of the current billing period.

3. Technical Specifications

3.1 Technology Stack
Frontend: React (with Next.js Server Components).
Styling: Tailwind CSS.
Backend/Database/Auth: Next.js API Routes, Supabase (PostgreSQL, Auth, RLS).
Deployment: Vercel.
AI Service: Gemini API.
Payments: Stripe.

3.2 Data Model (Conceptual)
The Supabase relational database must accommodate:
Users (Auth integration).
DreamEntries (Text, Date/Time, Dream Length).
DreamMetadata (Links to DreamEntries, optional Mood, optional Tags).
UserSubscriptionStatus (Links to User, Stripe Customer ID, Subscription Status, Billing Cycle End).
InsightUsageTracking (Links to User, Insight Count used).

3.3 Security and Privacy
Authentication: Supabase Auth integration.
Data Access Control: Mandatory Row-Level Security (RLS) in Supabase ensuring users can only access, read, or write their own data.
Configuration: Sensitive keys (Stripe keys, Gemini API key) must be managed via secure environment variables on the hosting platform (Vercel).
Communication: All application traffic must use HTTPS.

4. Non-Functional Requirements

4.1 Performance
Initial load times for the landing page and dashboard must be fast (<2 seconds). The UI must remain responsive during background AI generation calls.

4.2 Usability and Design
Aesthetic Focus: Dreamy, ethereal, calming. Use dark/muted backgrounds (blues, purples), subtle gradients, and clean typography.
Layout: Minimalist with generous white/negative space to promote focus and reflection.

4.3 Scalability
The use of Vercel, Supabase, and managed Stripe services is intended to support initial growth without immediate infrastructure overhaul.

4.4 Error Handling and Feedback
Users must receive clear feedback for every action:
Successful dream save confirmation.
Loading indicators during AI processing.
Clear messaging when payment/subscription issues arise.
Informative messages when free insight limits are reached.

5. Metadata Requirements Summary

5.1 Dream Metadata Capture
The following information must be associated with every dream entry and accessible on the detail page:
1. Date and Time Recorded (Automatic Capture).
2. Dream Length (Calculated Word Count / Estimated Reading Time).
3. Optional User-Selected Mood/Tone.
4. Optional User-Added Tags/Keywords.

5.2 Presentation of Metadata
Metadata must be presented cleanly near the top of the Dream Detail Page, acting as contextual information separate from the primary dream text and the AI interpretation layer.

## Technology Stack
# Dreams Saver: Technology Stack Document

## 1. Overview

This document outlines the recommended technology stack for the "Dreams Saver" web application. The stack is chosen to deliver a modern, scalable, secure, and highly performant application that aligns with the specified requirements for a full-stack JavaScript environment, leveraging managed services for simplicity and rapid deployment.

## 2. Core Architecture Philosophy

The architecture follows a Monorepo/Full-Stack approach using Next.js to unify the frontend and backend logic (API routes, server components) within a single codebase. This minimizes overhead, enhances developer experience, and supports fast iteration.

## 3. Frontend Stack

| Component | Technology | Justification |
| :--- | :--- | :--- |
| Framework | **Next.js (React)** | Provides Server Components (RSC) for high initial load performance and improved SEO, crucial for a polished initial user experience. Supports the required hybrid rendering model. |
| Styling | **Tailwind CSS** | Enables rapid, utility-first styling, perfectly suited for achieving the specific dreamy, minimalist aesthetic required, with easy implementation of dark mode and custom themes. |
| UI/UX Components | **React** | The core library for building the interactive user interface components (Dashboard, Input Forms, Detail Views). |
| State Management | **React Hooks (useState, useContext)** | Sufficient for the initial scope. Complex global state management (like Redux/Zustand) is deferred unless complexity demands it, favoring simplicity. |
| Design Aesthetic | **Custom Implementation** | Styling will adhere strictly to the guidelines: dark/muted backgrounds, soft gradients, generous spacing, and subtle animations to create a calming, introspective feel. |

## 4. Backend & Data Services

| Component | Technology | Justification |
| :--- | :--- | :--- |
| Application Logic/API | **Next.js API Routes (Serverless Functions)** | Handles all server-side operations, including database interactions, authentication checks, and communication with external services (Gemini, Stripe). Keeps the architecture unified under Next.js. |
| Database | **PostgreSQL (via Supabase)** | A robust, relational database ideal for structured data storage (Users, Dreams, Metadata, Subscription Status). Offers guaranteed transactional integrity and excellent performance for relational queries. |
| Database Access & Security | **Supabase (PostgREST)** | Provides a secure PostgreSQL backend with instant APIs and crucial built-in Row-Level Security (RLS) to enforce strict user data isolation, meeting critical security requirements. |
| Authentication | **Supabase Auth** | Manages user sign-up, login (Email/Password or Magic Link), and session management. Integrates seamlessly with Supabase RLS policies. |

## 5. External Services & Integrations

| Component | Technology | Justification |
| :--- | :--- | :--- |
| AI Insights Generation | **Google Gemini API** | Directly satisfies the core requirement for personalized, reflective dream analysis. The integration will occur securely via Next.js API routes. |
| Payment Processing | **Stripe** | Industry standard for handling subscriptions ($8/month). Stripe Checkout will be used for a secure, low-friction payment flow. Webhooks will be implemented to update user subscription status in the Supabase database. |
| Image/Media (Future) | *Not currently required* | If storage of user-uploaded images or media becomes necessary, **Supabase Storage** would be the natural fit. |

## 6. Deployment & Infrastructure

| Component | Technology | Justification |
| :--- | :--- | :--- |
| Hosting & CI/CD | **Vercel** | Ideal platform for Next.js applications. Provides seamless Git integration, instant preview deployments for collaboration, and auto-scaling capabilities to handle anticipated initial traffic volumes efficiently. |
| Environment Variables | **Vercel Environment Variables & .env.local** | Used to securely store sensitive keys (e.g., Gemini API Key, Stripe Secret Key, Supabase Service Role Key) outside of source code control. |

## 7. Data Model & Security Notes

### Dream Metadata Capture:
All metadata (Date/Time, Word Count, Mood, Tags) will be stored in the `dreams` table alongside the core `dream_text`. Date/Time is automatically captured server-side upon creation.

### AI Insight Usage Tracking:
A dedicated mechanism (e.g., a counter column in the `users` table or a separate `usage_log` table) linked to the user ID will track AI insight usage against the limit of 5 for the free tier. This logic must be enforced server-side within the API route that calls the Gemini API.

### Row-Level Security (RLS):
Mandatory RLS policies must be configured on all database tables (`users`, `dreams`, `subscriptions`) ensuring that `auth.uid() = user_id` is the primary access constraint for all read/write operations.

## 8. Technology Justification Summary

The chosen stack (Next.js, Tailwind CSS, Supabase, Vercel) aligns perfectly with the modern JavaScript full-stack preference. It provides:

1.  **Unified Development:** Reduced context switching by keeping frontend and backend within Next.js.
2.  **Rapid Iteration:** Tailwind CSS for fast styling and Vercel for instant deployment pipelines.
3.  **Security and Scalability:** Managed services (Supabase, Vercel, Stripe) handle infrastructural scaling and robust security primitives (RLS, Auth) out-of-the-box, allowing focus on feature development.
4.  **Core Requirement Fulfillment:** Direct integration pathways for Gemini AI and Stripe payments are clearly defined within this environment.

## Project Structure
PROJECT STRUCTURE DOCUMENT: DREAMSAVER

1. TOP-LEVEL DIRECTORY STRUCTURE

/DreamsSaver
├── .next/ (Generated by Next.js, managed by Gitignore)
├── node_modules/ (Project dependencies, managed by Gitignore)
├── public/ (Static assets)
├── src/ (Application source code)
│   ├── app/ (Next.js 13 App Router structure)
│   ├── components/ (Reusable React components)
│   ├── lib/ (Utility libraries, external integrations)
│   ├── styles/ (Global CSS and Tailwind configuration)
│   └── types/ (TypeScript definitions)
├── .env.local (Local environment variables, sensitive)
├── .eslintrc.json (ESLint configuration)
├── .gitignore (Files and directories to ignore in Git)
├── next.config.js (Next.js configuration)
├── package.json (Project dependencies and scripts)
├── postcss.config.js (PostCSS configuration for Tailwind)
├── tailwind.config.js (Tailwind CSS configuration)
└── tsconfig.json (TypeScript configuration)

2. DETAILED DIRECTORY STRUCTURE AND CONTENTS

2.1. public/

    /public
    ├── favicon.ico (Application icon)
    └── images/ (For any static assets like logos or background textures if needed)
        └── dream_motif.svg (Example of a subtle, ethereal background asset)

2.2. src/

    /src
    ├── app/ (Next.js App Router)
        ├── (auth)/
        │   ├── layout.tsx (Layout wrapper for authentication pages)
        │   └── login/page.tsx (Login/Sign Up page - handles initial dream submission)
        ├── (dashboard)/
        │   ├── layout.tsx (Authenticated layout wrapper, includes sidebar/header)
        │   ├── page.tsx (Main Dashboard: Dream List, Search/Filter, Usage Stats)
        │   └── dream/[dreamId]/page.tsx (Dream Detail Page: Display dream, metadata, and AI Insight)
        ├── api/ (API Routes/Server Actions for backend logic)
            ├── dreams/route.ts (Handles CRUD operations for dreams)
            ├── insights/route.ts (Handles calls to Gemini API and usage tracking)
            ├── stripe/webhook/route.ts (Stripe Webhook endpoint for subscription updates)
            └── auth/[...nextauth]/route.ts (Supabase Auth integration setup)
        ├── global-error.tsx (Root error boundary)
        ├── global-layout.tsx (Root layout wrapper)
        ├── layout.tsx (Root layout structure)
        ├── loading.tsx (Global loading indicator)
        └── page.tsx (Landing Page: Product description and initial sign-up/dream input)

    ├── components/ (Reusable UI elements)
        ├── auth/
        │   └── AuthForm.tsx (Unified form for sign-up/login)
        ├── dashboard/
        │   ├── DreamCard.tsx (Summary card for dashboard list view)
        │   ├── DreamFilterBar.tsx (Search and sorting controls)
        │   └── UsageStats.tsx (Displays free insight count: X of 5 used)
        ├── dreams/
        │   ├── DreamEditor.tsx (Modal or dedicated form for adding/editing dreams)
        │   └── DreamView.tsx (Component to display single dream entry, metadata, and AI analysis)
        ├── layout/
        │   ├── AppHeader.tsx (Navigation and user profile access)
        │   └── Sidebar.tsx (Navigation structure for authenticated users)
        ├── marketing/
        │   └── HeroSection.tsx (Landing page main presentation)
        ├── payments/
        │   └── UpgradePrompt.tsx (Displayed when free insights are exhausted)
        └── ui/ (Atomic/Primitive components built with Tailwind)
            ├── Button.tsx
            ├── Input.tsx
            ├── Modal.tsx
            └── LoadingSpinner.tsx

    ├── lib/ (Core business logic and external integrations)
        ├── supabase/ (Supabase client setup and interactions)
        │   ├── client.ts (Browser-side Supabase instance)
        │   └── server.ts (Server-side Supabase instance for API routes)
        │   └── middleware.ts (Middleware/Server Actions setup)
        ├── stripe/
        │   ├── client.ts (Stripe elements/checkout initialization)
        │   └── server.ts (Stripe server logic, session creation)
        ├── db/ (Database related utility functions/schemas if needed)
        │   └── schema.sql (Conceptual SQL for RLS and table structure)
        ├── gemini/
        │   └── analyzer.ts (Functionality to call the Gemini API with structured prompting)
        └── utils.ts (General helper functions, e.g., date formatting)

    ├── styles/
        └── globals.css (Base styles, Tailwind imports, and custom dreamy styles)

    └── types/ (TypeScript definitions)
        ├── index.d.ts
        ├── database.types.ts (Generated from Supabase)
        └── component.types.ts (Props definitions for common components)

3. DATABASE STRUCTURE NOTES (Conceptual - managed via Supabase)

A. users (Managed by Supabase Auth)
    - id (UUID, primary key, maps to auth.users)
    - subscription_status (ENUM: 'free', 'premium')
    - stripe_customer_id (String)

B. dreams
    - id (UUID, primary key)
    - user_id (UUID, foreign key to users)
    - content (Text, the raw dream text)
    - created_at (Timestamp)

C. dream_metadata
    - dream_id (UUID, primary key, foreign key to dreams)
    - recorded_at (Timestamp, for internal tracking if different from created_at)
    - word_count (Integer)
    - mood (Text/Enum: e.g., 'anxious', 'calm')
    - tags (Text Array)

D. ai_insights
    - dream_id (UUID, primary key, foreign key to dreams)
    - insight_summary (Text)
    - emotional_analysis (Text)
    - symbolic_interpretation (Text)
    - generated_at (Timestamp)

E. usage_tracking
    - user_id (UUID, primary key, foreign key to users)
    - insights_used_free (Integer, increments up to 5)
    - insights_used_total (Integer)

4. SECURITY AND CONFIGURATION NOTES

.env.local must contain:
    - NEXT_PUBLIC_SUPABASE_URL
    - NEXT_PUBLIC_SUPABASE_ANON_KEY
    - SUPABASE_SERVICE_ROLE_KEY (For server-side admin access)
    - GEMINI_API_KEY
    - STRIPE_SECRET_KEY
    - STRIPE_PRICE_ID_MONTHLY

Row-Level Security (RLS) must be enabled on all tables (dreams, dream_metadata, ai_insights, usage_tracking) ensuring that SELECT, INSERT, UPDATE, DELETE operations are restricted to the authenticated user_id matching the row's user_id.

## Database Schema Design
Dreams Saver: Database Schema Design (schemaDesign)

1. Overview and Design Philosophy

This schema is designed to be robust, secure, and scalable, utilizing PostgreSQL features provided by Supabase. The core design prioritizes data integrity, straightforward relationships, and easy implementation of Row-Level Security (RLS). The structure separates user information, dream records, associated metadata, AI analysis results, and subscription status.

2. Entity-Relationship Diagram (Conceptual)

[Note: As this is plain text output, the ERD is described structurally.]

*   **Users** (Primary Entity) relates 1:M to **DreamEntries**.
*   **DreamEntries** relates 1:1 to **DreamMetadata** (optional, for cleaner structure, though fields could be inline).
*   **DreamEntries** relates 1:1 to **DreamInsights**.
*   **Users** relates 1:1 (or 1:M depending on subscription history complexity, but 1:1 for current status) to **Subscriptions**.

3. Detailed Table Schemas

3.1. Users Table (Auth integration handled by Supabase Auth, this table tracks app-specific data)

Table Name: `profiles` (Recommended structure when using Supabase Auth)

| Column Name | Data Type | Constraints/Notes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key, Foreign Key to auth.users(id) | User ID linking to Supabase Auth. |
| `username` | VARCHAR(100) | Unique, Nullable | User-friendly identifier (if required). |
| `email` | VARCHAR(255) | Unique, Not Null | User email address (for communication). |
| `created_at` | TIMESTAMPZ | Not Null, Default NOW() | Record creation time. |
| `ai_insight_count_free` | INTEGER | Not Null, Default 5, Max 5 | Tracks remaining free AI insights (Max 5). |
| `subscription_status` | ENUM ('free', 'active') | Not Null, Default 'free' | Current subscription tier. |

3.2. Dream Entries Table

Table Name: `dream_entries`

| Column Name | Data Type | Constraints/Notes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key, Default uuid_generate_v4() | Unique identifier for the dream entry. |
| `user_id` | UUID | Foreign Key (profiles.id), Not Null | Owner of the dream entry. RLS enforced here. |
| `title` | VARCHAR(255) | Nullable | Short title for the dream (optional, for dashboard context). |
| `content` | TEXT | Not Null | The raw text of the dream recording. Minimum length enforced via application logic. |
| `recorded_at` | TIMESTAMPZ | Not Null, Default NOW() | System-captured date and time of entry submission. |
| `word_count` | INTEGER | Nullable | Calculated field: Dream length (word count). |
| `created_at` | TIMESTAMPZ | Not Null, Default NOW() | Database record creation time. |

3.3. Dream Metadata Table (For optional, structured fields related to a specific dream)

Table Name: `dream_metadata`

| Column Name | Data Type | Constraints/Notes | Description |
| :--- | :--- | :--- | :--- |
| `dream_id` | UUID | Primary Key, Foreign Key (dream_entries.id) | Links this metadata to a specific dream. |
| `user_mood` | VARCHAR(50) | Nullable | User-selected optional mood (e.g., 'Anxious', 'Joyful'). |
| `tags` | TEXT[] (Array of Text) | Nullable | User-entered optional keywords/tags (e.g., {'flying', 'water', 'lost'}). |
| `updated_at` | TIMESTAMPZ | Default NOW() | Last time metadata was updated. |

3.4. AI Insight Table

Table Name: `dream_insights`

| Column Name | Data Type | Constraints/Notes | Description |
| :--- | :--- | :--- | :--- |
| `dream_id` | UUID | Primary Key, Foreign Key (dream_entries.id) | Links the insight to the original dream. One-to-one relationship. |
| `analysis_text` | TEXT | Nullable | The full, structured analysis text generated by Gemini AI. |
| `summary` | TEXT | Nullable | High-level summary from AI. |
| `emotional_tone` | JSONB | Nullable | Structured data on dominant emotions identified by AI. |
| `symbolic_interpretation` | TEXT | Nullable | Metaphorical interpretations. |
| `generated_at` | TIMESTAMPZ | Not Null, Default NOW() | Time the insight was generated. |
| `usage_cost` | INTEGER | Not Null, Default 1 | Tracks the cost (1 unit per generation). |

3.5. Subscription and Payment Tracking Table

Table Name: `subscriptions`

| Column Name | Data Type | Constraints/Notes | Description |
| :--- | :--- | :--- | :--- |
| `user_id` | UUID | Primary Key, Foreign Key (profiles.id) | Links subscription to the user. |
| `stripe_customer_id` | VARCHAR(255) | Unique, Nullable | Stripe Customer ID. |
| `stripe_subscription_id` | VARCHAR(255) | Unique, Nullable | Active Stripe Subscription ID. |
| `current_period_end` | TIMESTAMPZ | Nullable | When the paid access expires. |
| `plan_name` | VARCHAR(50) | Not Null, Default 'free' | Current plan identifier (e.g., 'free', 'unlimited_pro'). |
| `last_webhook_event` | JSONB | Nullable | For debugging/auditing Stripe webhook events. |

4. Key Relationship Summary and Constraint Logic

4.1. Row-Level Security (RLS)

RLS must be enabled on all tables (`profiles`, `dream_entries`, `dream_metadata`, `dream_insights`, `subscriptions`).

*   **Access Policy:** `user_id = auth.uid()` (for entry ownership) or `id = auth.uid()` (for profile/subscription). Users can only read, create, update, or delete records where the `user_id` column matches the currently authenticated user's ID provided by Supabase Auth.

4.2. AI Insight Usage Logic

1.  When a user requests an insight:
    *   Check `profiles.subscription_status`.
    *   If 'free': Check if `ai_insight_count_free` > 0.
    *   If insight is generated successfully:
        *   If 'free', decrement `ai_insight_count_free` by 1.
        *   If the count reaches 0, update `subscription_status` to 'limit_reached' (or similar intermediate state if necessary, though updating the UI based on the count is sufficient).
2.  If a user has an 'active' subscription, the insight generation is unrestricted, and `ai_insight_count_free` should be ignored (or conceptually set to infinity).

4.3. Data Flow and Updates

*   Dream Entry Submission: Inserts into `dream_entries`. If optional metadata is provided, inserts into `dream_metadata`.
*   AI Insight Generation: Inserts into `dream_insights` linked via `dream_id`.
*   Subscription Update: Webhooks from Stripe update the `subscriptions` table, which triggers an update to `profiles.subscription_status` and potentially clears/sets limits in `ai_insight_count_free` if the plan changes.

## User Flow
USERFLOW DOCUMENTATION: DREAMS SAVER

1. OVERVIEW AND GOALS

This document outlines the primary user journeys (flows) for Dreams Saver, a web application designed to capture, store, and analyze user dreams using Gemini AI. The primary goal is to provide a frictionless experience for dream capture while delivering personalized, introspective insights, all within a calm, stylized interface.

User Persona Focus: Adults (18-40) seeking self-reflection, valuing privacy and an intuitive experience.

2. CORE USER FLOWS

2.1. Flow 1: Initial Landing & First Dream Capture (Onboarding)

Trigger: New, unauthenticated user visits the landing page.

Steps:
A. User lands on the Dreams Saver Landing Page.
    *   UI: Features calming, ethereal design (dark/muted colors, soft accents). Clear headline communicating value proposition (Capture Dreams, Discover Insights).
    *   Content: Brief overview of app features (AI analysis, pattern tracking) and privacy commitment.
B. User locates the primary input area.
    *   UI: Prominently features a large, distraction-free text area pre-labeled for the first entry (e.g., "What did you dream about just now?").
C. User enters dream text (Required minimum length enforced).
D. User optionally selects Mood/Tags (Optional metadata capture).
E. User clicks "Save Dream & Sign Up".
F. System initiates Supabase authentication flow (Email/Password or Magic Link initiated).
G. Upon successful authentication, the system performs the following actions:
    *   Creates new User record in Supabase.
    *   Saves the submitted dream text and metadata to the Dreams table (linking to the new User ID).
    *   Initializes AI Insight usage counter for the user (Sets to 0/5 used).
G. System automatically redirects the authenticated user to the Dream Dashboard.

Wireframe Description (Landing Page): Minimalist hero section. Large, central text input field optimized for immediate typing. Footer with links (Privacy, About).

2.2. Flow 2: Dream Dashboard Navigation & Management

Trigger: Authenticated user navigates to the main application dashboard.

Steps:
A. User lands on the Dashboard.
    *   UI: Displays a stylized list of all past dream entries (chronological by default).
    *   Header/Sidebar displays user status:
        *   Total Dreams Recorded count.
        *   AI Insight Usage Tracker (e.g., "5 free insights remaining").
        *   Call to Action (CTA) for Subscription Upgrade if nearing/at limit.
B. User interacts with organizational tools.
    *   Filtering/Sorting: Options visible for Date (Newest/Oldest) and Keyword Search input field.
C. User clicks on a specific Dream List Item (Card/Row).
D. System navigates the user to the Dream Detail Page for that entry.

Wireframe Description (Dashboard): Clean list view. Search/Filter bar prominently placed above the list. Summary statistics subtly placed in a top corner banner. Dream list items are minimal, showing only the title/first line and date recorded.

2.3. Flow 3: Adding a Subsequent Dream (Post-Onboarding)

Trigger: Authenticated user is on the Dashboard and wishes to add a new dream.

Steps:
A. User clicks a prominent "Record New Dream" button (or similar CTA, potentially fixed at the top/bottom of the dashboard).
B. System presents a focused input modal or navigates to a dedicated New Entry page (prioritizing distraction-free input).
C. User enters Dream Text (Required).
D. User optionally selects Mood, adds Tags/Keywords.
E. User clicks "Save Dream".
F. System saves the dream entry immediately. The Insight Generation step is conditional:
    *   IF User has free insights remaining (Usage < 5): Insight generation is automatically triggered in the background.
    *   IF User has reached the free insight limit (Usage = 5): Insight generation is NOT triggered. The dream is saved, and the user is returned to the dashboard.
G. System returns the user to the Dashboard. If Insight was generated, the newly added entry may briefly flash or appear at the top of the list.

Wireframe Description (New Entry Interface): Large modal overlay or dedicated page. Primary focus is the text area. Secondary, less emphasized optional fields (Mood selector, Tag input) are clearly separated.

2.4. Flow 4: Viewing Dream Detail and AI Insight

Trigger: User clicks on a dream entry from the Dashboard (Flow 2.C).

Steps:
A. System navigates to the Dream Detail Page.
B. Display Metadata Section (Top, Minimalist Layout):
    *   Date and Time Recorded (Auto-captured).
    *   Dream Length (Word Count / Estimated Read Time).
    *   User-selected Mood(s) and Tags.
C. Display Raw Dream Text Section (Central Focus).
D. Display AI Insight Section (Visually Distinct Container):
    *   IF Insight has already been generated: Displays the full insight summary (Summary, Emotional Analysis, Interpretations, Reflection Prompts).
    *   IF Insight has NOT been generated (and user is eligible):
        *   Displays a loading state ("Generating Reflection with Gemini AI...").
        *   Backend calls Gemini API using dream text and metadata.
        *   Upon successful response, the Insight is stored in the database, the usage counter increments, and the UI updates to show the generated insight.
    *   IF Insight generation is gated (User at 5/5 free limit):
        *   Displays a blocked message: "Unlock deeper reflection."
        *   CTA: "Upgrade to Unlimited Insights ($8/mo)".

Wireframe Description (Detail Page): Clear vertical separation. Metadata container is subtle (small text, clean dividers). Dream text is primary. AI Insight container uses a contrasting background shade or border to denote its reflective nature.

2.5. Flow 5: Subscription Upgrade and Payment

Trigger: User attempts to generate an insight when the free limit is reached, OR User navigates directly to a subscription page.

Steps:
A. User clicks "Upgrade to Unlimited Insights".
B. System verifies the user is authenticated.
C. System redirects the user to the Stripe Checkout flow configured for the $8/month plan.
D. User completes payment details on the secure Stripe domain.
E. Stripe processes payment and sends a success webhook to the backend (Next.js API Route).
F. Backend API Route updates the User record in Supabase:
    *   Sets AI Insight usage counter to 0 (or changes tier status to 'Unlimited').
G. Stripe redirects the user back to the Dreams Saver application (e.g., the Dashboard).
H. The UI updates immediately to reflect the new status (e.g., Insight generation is now possible on all dreams).

Wireframe Description (Upgrade Prompt): Clear explanation of value (unlimited insights) vs. current status. Seamless redirection to Stripe, minimizing app-side friction during the financial transaction.

3. INTERACTION PATTERNS

3.1. Input Optimization (Rapid Capture)
All text input fields (especially subsequent dream entry) utilize large font sizes and ample padding for ease of use shortly after waking. Form submission relies on a single primary action button, minimizing decision fatigue.

3.2. AI Latency Handling
For the 3-8 second expected latency during Gemini insight generation, a non-blocking, visually appealing loading indicator must be used within the Insight Section container, adhering to the calm, ethereal style (e.g., subtly animated soft gradients or orbiting particles).

3.3. Metadata Presentation
Metadata (date, tags) is visually deemphasized relative to the dream text and the AI insight. It serves as secondary context, ensuring the user focuses on the narrative first.

3.4. Access Control (RLS Enforcement)
Every data retrieval action initiated from the dashboard or detail view must be secured via Supabase Row Level Security, ensuring the User ID context is always present and enforced server-side.

## Styling Guidelines
DREAMSAVER STYLING GUIDELINES DOCUMENT

1.0 INTRODUCTION

This document outlines the styling guidelines, design system components, color palette, and UI/UX principles for the Dreams Saver web application. The primary goal of the aesthetic is to create a calm, introspective, and slightly ethereal user experience that reinforces the application's purpose as a personal reflection space.

2.0 DESIGN PRINCIPLES

The styling should adhere to the following core principles:

2.1 Ethereal Calm: Visuals must feel soothing and non-demanding. Avoid harsh lines, oversaturated colors, or high-contrast elements that create visual fatigue.
2.2 Minimalist Flow: Layouts must prioritize clarity and focus on the dream content. Generous negative space and simple navigation patterns are crucial.
2.3 Gentle Interaction: Transitions, animations, and micro-interactions should be subtle and flowing, suggesting a sense of calm movement rather than immediate reaction.
2.4 Data Context: Metadata and AI insights must be visually separated from the raw dream entry to clearly delineate the user's content from the reflection layers.

3.0 COLOR PALETTE

The palette utilizes deep, muted tones for backgrounds and soft, ethereal highlights for primary interactive elements.

3.1 Primary Colors

| Name | Hex Code | Usage |
| :--- | :--- | :--- |
| Deep Night (Background) | #0A071B | Primary background color for main pages and dark mode consistency. |
| Astral Blue (Primary Accent) | #4A4E69 | Used for primary buttons, active states, and key structural elements. |
| Soft Lavender (Secondary Accent) | #C3B1E1 | Used for secondary highlights, subtle borders, and active link indicators. |

3.2 Neutrals and Text

| Name | Hex Code | Usage |
| :--- | :--- | :--- |
| Cloud White (Primary Text) | #F0F4F8 | Main text color for high readability against dark backgrounds. |
| Muted Gray (Secondary Text/Metadata) | #A3A8C0 | Used for timestamps, metadata labels, and less critical informational text. |
| Insight Tint (AI Section Background) | #1D1A3A | Lightly differentiated background for the AI insight panel. |

3.3 Semantic Colors (Used Sparingly)

Standard colors for error states (e.g., reaching the insight limit) should be muted versions of traditional red/orange, avoiding aggressive saturation.

4.0 TYPOGRAPHY

Typography must balance modern professionalism with a soft, readable quality.

4.1 Font Stack

| Element | Primary Font (Headings/Emphasis) | Secondary Font (Body/Readability) |
| :--- | :--- | :--- |
| Font Family | A clean, modern sans-serif (e.g., Inter or similar) with slightly rounded edges. | The same font family, ensuring consistent styling. |
| Rationale | Prioritize excellent readability on dark backgrounds. |

4.2 Sizing and Weight

*   **H1 (Page Titles, Landing Page Headline):** 3.5rem, Bold (700).
*   **H2 (Section Headings, Dashboard Summary):** 2rem, Semi-Bold (600).
*   **Body Text (Dream Content, General Copy):** 1.125rem (18px), Regular (400). This size supports long-form reading.
*   **Metadata/Labels:** 0.875rem (14px), Light (300).

5.0 UI COMPONENTS AND LAYOUT

5.1 Landing Page

The landing page must immediately convey the "dreamy" and reflective nature of the app.

*   **Background:** Subtle, dark background using Deep Night (#0A071B), possibly incorporating a very low-opacity, slow-moving gradient or abstract, organic shape overlay that suggests nebulous forms or starlight.
*   **Input Focus:** The initial dream submission text box should be centered and highly prominent, inviting immediate interaction. It should use the Astral Blue for its border when active and Cloud White for its placeholder text.
*   **Call to Action (CTA):** Sign-up/Submit buttons should use the Astral Blue background with Cloud White text, employing a very subtle hover effect (e.g., a slight brightness increase or shadow shift).

5.2 Dashboard (Dream List View)

The dashboard organizes entries clearly while maintaining the overall subdued aesthetic.

*   **List Items:** Each dream entry preview should reside in a card or row using the Deep Night background, perhaps with a very thin, Soft Lavender separator line or border to delineate entries.
*   **Information Density:** Prioritize dream date and a truncated title/first line of text. Metadata tags should appear as small, muted pills (using Muted Gray background).
*   **Usage Indicator:** The AI insight usage counter (e.g., "3/5 Insights Remaining") must be displayed clearly but unobtrusively, likely in the top navigation or a dedicated sidebar component, using Muted Gray text transitioning to Soft Lavender as the limit nears.

5.3 Dream Detail Page

This page must clearly separate the raw entry, contextual metadata, and the AI reflection.

*   **Dream Text Area:** Dominates the primary view, utilizing the standard Body Text style against the Deep Night background. Ample vertical padding/margins are required.
*   **Metadata Block:** Displayed horizontally or in a compact column *above* the dream text. Use Muted Gray for labels and slightly smaller font size (0.875rem). This block should feel contextual and secondary to the content itself.
*   **AI Insight Block:** Visually separated by placing it within a container using the **Insight Tint** (#1D1A3A) background color. This tint subtly lifts the analysis layer off the main content.
    *   The section heading ("Gemini Insight") should use H2 size and Astral Blue color.
    *   The content within should use Cloud White text but maintain a softer tone as per Gemini requirements.

5.4 Input Modals/Forms (Dream Submission)

New dream inputs (from the dashboard) must be distraction-free.

*   **Focus:** The main input text area should be large, spanning most of the available width, optimized for quick typing.
*   **Optional Fields:** Mood selection and tags should use minimalist UI elements (e.g., dropdowns or chip inputs) styled with Soft Lavender accents. They should be visually collapsed or deemphasized until clicked.

6.0 INTERACTION AND ANIMATION

Interactions must feel smooth and deliberate. Tailwind's utility classes for transitions (e.g., `transition-all`, `duration-300`) should be universally applied to interactive elements.

6.1 Hover States
Buttons and actionable list items should react with a subtle brightening or a slight lift (box-shadow increase using Astral Blue) rather than sharp color changes.

6.2 Loading States
When waiting for the AI insight generation, a visual cue is mandatory. This should be an ethereal, slow-pulsing loading animation (e.g., a pulsating Soft Lavender glow around the analysis area) rather than a standard spinner, reinforcing the non-instantaneous, thoughtful nature of the analysis.

6.3 Scrolling
Scrollbars should be minimized or styled to match the color scheme (thin, using Muted Gray) to reduce visual noise, especially on the dashboard and dream detail pages where content is plentiful.

7.0 AESTHETIC ACCENTS

Visual metaphors should be subtle and secondary:

*   **Celestial Elements:** Use very low-opacity SVGs or background patterns featuring faint star fields, subtle crescent moons, or wispy cloud borders in the peripheral areas of the application (e.g., global containers or background headers), rendered in a light blue or white tint. These elements should never compete with the content.
*   **Borders and Dividers:** Use thin lines of Soft Lavender or Muted Gray instead of heavy separators.
