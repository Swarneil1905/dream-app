# Dreams Saver - Testing & Verification Guide

## ✅ How to Verify Everything is Working

### Phase 1: Environment Setup Verification

Run these checks before starting the dev server:

1. **Check Node.js Version**
   ```bash
   node --version
   # Should be v18.0.0 or higher
   ```

2. **Verify Dependencies Installed**
   ```bash
   npm list --depth=0
   # Should show all packages from package.json
   ```

3. **Check .env.local File Exists**
   ```bash
   dir .env.local
   # or use: ls .env.local
   # Should exist in root directory
   ```

4. **Verify Environment Variables**
   Open `.env.local` and ensure these are NOT empty:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - GEMINI_API_KEY

### Phase 2: Database Verification

1. **Log into Supabase Dashboard**
   - Go to https://supabase.com
   - Select your project
   - Click on **Table Editor** (left sidebar)

2. **Verify Tables Exist**
   You should see these tables:
   - ✅ profiles
   - ✅ dream_entries
   - ✅ dream_metadata
   - ✅ dream_insights
   - ✅ subscriptions

3. **Check RLS Policies**
   - Click on any table
   - Click the **RLS** toggle (should be ON/green)
   - Click **View Policies** to see the security rules

### Phase 3: Application Startup

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Watch for Errors**
   Look for these success messages:
   ```
   ✓ Ready in XXXXms
   ✓ Compiled / in XXXms
   ○ Local: http://localhost:3000
   ```

3. **If You See Errors:**
   - "Cannot find module" → Run `npm install` again
   - "Invalid environment variable" → Check `.env.local`
   - Port 3000 in use → Change port: `npm run dev -- -p 3001`

### Phase 4: Frontend Testing Checklist

#### Landing Page (http://localhost:3000)
- [ ] Page loads without errors
- [ ] Dreamy background gradient is visible
- [ ] "Dreams Saver" title displays correctly
- [ ] Three feature boxes show (✨ AI Insights, 🌙 Unlimited Dreams, 🔒 Private)
- [ ] Dream text area is visible and large
- [ ] Email and password fields work
- [ ] "Begin your journey" button is visible

#### Test User Registration
1. [ ] Enter a test dream: "I was flying over mountains"
2. [ ] Enter email: `test@example.com`
3. [ ] Enter password: `password123`
4. [ ] Click "Begin your journey"
5. [ ] Should redirect to `/dashboard`

#### Dashboard Page (http://localhost:3000/dashboard)
- [ ] "Dreams Saver" header shows at top
- [ ] "Free insights: 5/5" displays in header (or current count)
- [ ] "Logout" button is visible
- [ ] "Your Dreams" heading shows
- [ ] Dream count shows correctly
- [ ] "+ Record New Dream" button works
- [ ] Search bar is functional
- [ ] First dream is visible in list
- [ ] Clicking dream navigates to detail page

#### New Dream Modal
1. [ ] Click "+ Record New Dream"
2. [ ] Modal appears with form
3. [ ] Title field (optional)
4. [ ] Dream text area (required)
5. [ ] Mood dropdown with options
6. [ ] Tags input field
7. [ ] Cancel button works
8. [ ] Save Dream button works
9. [ ] Modal closes after save
10. [ ] New dream appears in list

#### Dream Detail Page
- [ ] Full dream text displays
- [ ] Date/time shows correctly
- [ ] Word count is accurate
- [ ] Mood tag appears (if set)
- [ ] Custom tags display (if set)
- [ ] "Back to Dashboard" link works
- [ ] AI Insight section is visible
- [ ] "Generate Insight" button displays
- [ ] Remaining insights count shows

#### AI Insight Generation
1. [ ] Click "Generate Insight"
2. [ ] Loading spinner appears
3. [ ] Message: "Generating your personalized insight..."
4. [ ] Wait 5-10 seconds
5. [ ] Insight appears with sections:
   - [ ] Summary section
   - [ ] Emotional Analysis section
   - [ ] Symbolic Interpretation section
   - [ ] Full Analysis section
6. [ ] Generated timestamp shows
7. [ ] Insight count decreases by 1

#### Login Flow
1. [ ] Go to http://localhost:3000/login
2. [ ] Enter registered email
3. [ ] Enter password
4. [ ] Click "Sign in"
5. [ ] Redirects to dashboard
6. [ ] All dreams are visible

### Phase 5: API Endpoint Testing

You can test APIs directly using your browser's console or a tool like Postman:

#### Test Login API
```javascript
fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123'
  })
}).then(r => r.json()).then(console.log)
// Should return: { success: true, user: {...} }
```

#### Test Insight Generation API
```javascript
// First, log in, then:
fetch('http://localhost:3000/api/insights/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    dreamId: 'your-dream-id-here',
    dreamText: 'I was flying over mountains',
    metadata: { user_mood: 'joyful', tags: ['flying', 'nature'] }
  })
}).then(r => r.json()).then(console.log)
// Should return insight data
```

### Phase 6: Database Query Verification

In Supabase Dashboard > SQL Editor, run these queries:

#### Check User Creation
```sql
SELECT id, email, created_at, ai_insight_count_free, subscription_status 
FROM profiles 
ORDER BY created_at DESC 
LIMIT 5;
```
Expected: See your test user with 5 or fewer insights remaining

#### Check Dreams
```sql
SELECT id, title, content, created_at, word_count 
FROM dream_entries 
ORDER BY created_at DESC 
LIMIT 5;
```
Expected: See your test dreams

#### Check Insights Generated
```sql
SELECT di.dream_id, di.summary, di.generated_at, de.title
FROM dream_insights di
JOIN dream_entries de ON di.dream_id = de.id
ORDER BY di.generated_at DESC
LIMIT 5;
```
Expected: See insights if you've generated any

### Common Issues and Fixes

#### Issue: "Failed to fetch" errors everywhere
**Fix:**
1. Check `.env.local` file exists and has correct values
2. Restart dev server: `Ctrl+C` then `npm run dev`
3. Clear browser cache and cookies
4. Try incognito/private browsing mode

#### Issue: "Unauthorized" or "403" errors
**Fix:**
1. Check Supabase RLS policies are enabled
2. Verify you're logged in (check dashboard header)
3. Try logging out and back in
4. Check browser console for detailed errors

#### Issue: AI insights not generating
**Fix:**
1. Check `GEMINI_API_KEY` in `.env.local`
2. Verify Gemini API key is valid at https://makersuite.google.com
3. Check browser console for error messages
4. Ensure you have remaining free insights

#### Issue: Database errors or missing tables
**Fix:**
1. Go to Supabase > SQL Editor
2. Delete all tables if they exist
3. Re-run the complete `supabase/schema.sql` file
4. Refresh browser and try again

#### Issue: Signup creates account but loses dream
**Fix:**
- This is a known edge case in the current implementation
- The dream should still be saved, just check the dashboard
- If not, manually add it via "+ Record New Dream"

#### Issue: Port 3000 already in use
**Fix:**
```bash
# Use a different port
npm run dev -- -p 3001
# Then access at http://localhost:3001
```

### Performance Testing

#### Load Time Targets
- Landing page: < 2 seconds
- Dashboard: < 3 seconds
- Dream detail: < 2 seconds
- AI insight generation: 5-15 seconds (depends on Gemini API)

#### Browser Console Checks
Open Developer Tools (F12) and check:
- **Console tab**: Should have no red errors
- **Network tab**: All requests should be 200 or 304 status
- **Application tab**: Check Local Storage for session data

### Security Verification

#### Test RLS Policies
1. Create two different user accounts
2. Login as User A and create dreams
3. Logout and login as User B
4. User B should NOT see User A's dreams
5. Each user should only see their own data

#### Test Authentication
1. Try accessing `/dashboard` without logging in
2. Should redirect to `/login`
3. Try accessing a specific dream URL without auth
4. Should redirect or show error

### Final Checklist

Before considering the app "production ready":

- [ ] All pages load without errors
- [ ] User signup works correctly
- [ ] Login/logout works
- [ ] Dreams are saved and retrieved
- [ ] AI insights generate successfully
- [ ] Free tier counting works (5 insights max)
- [ ] Search functionality works
- [ ] Metadata (mood, tags) saves correctly
- [ ] RLS prevents cross-user data access
- [ ] No console errors in browser
- [ ] Mobile responsive (test on phone or resize browser)
- [ ] Environment variables are secure
- [ ] Database schema is complete

## 🎉 All Tests Passing?

If everything above works, your Dreams Saver app is fully functional!

Next steps:
1. Add real Stripe integration for payments
2. Deploy to Vercel
3. Add custom domain
4. Enable email confirmations in Supabase
5. Add rate limiting for production

## 📝 Reporting Issues

If you find issues:
1. Check browser console for errors
2. Check Supabase logs (Dashboard > Logs)
3. Review the error messages carefully
4. Refer to main documentation (README.md)
5. Double-check environment variables