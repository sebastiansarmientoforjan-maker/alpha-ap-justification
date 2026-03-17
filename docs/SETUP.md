# 🚀 Setup Guide - AP Math Justification

## Quick Start

### 1. Clone & Install

```bash
git clone <repo-url>
cd alpha-ap-justification
npm install
```

### 2. Configure Environment Variables

```bash
# Copy the template
cp .env.example .env.local

# Edit .env.local with your values
nano .env.local  # or use your preferred editor
```

### 3. Firebase Setup (Required)

#### A. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Name: `alpha-ap-justification`
4. Enable Google Analytics (optional)

#### B. Enable Authentication
1. In Firebase Console → Authentication
2. Click "Get started"
3. Enable sign-in methods:
   - ✅ **Email/Password** (for development)
   - ✅ **Google** (recommended for production)

#### C. Enable Firestore Database
1. In Firebase Console → Firestore Database
2. Click "Create database"
3. Choose location (us-central1 recommended)
4. Start in **Test mode** (for development)
5. Later, update security rules (see `firestore.rules`)

#### D. Get Client Configuration
1. Project Settings → General
2. Scroll to "Your apps"
3. Click "Web app" icon (</>)
4. Register app: `AP Math Justification Web`
5. Copy the config values to `.env.local`:

```javascript
// Firebase gives you this:
const firebaseConfig = {
  apiKey: "AIza...",              // → NEXT_PUBLIC_FIREBASE_API_KEY
  authDomain: "project.firebaseapp.com", // → NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  projectId: "project-id",        // → NEXT_PUBLIC_FIREBASE_PROJECT_ID
  storageBucket: "project.appspot.com",  // → NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456",    // → NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123:web:abc"          // → NEXT_PUBLIC_FIREBASE_APP_ID
};
```

#### E. Get Admin SDK Credentials (Server-side)
1. Project Settings → Service Accounts
2. Click "Generate new private key"
3. Download JSON file (KEEP THIS SECRET!)
4. Add to `.env.local`:

```bash
FIREBASE_ADMIN_PROJECT_ID="your-project-id"
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"
```

**⚠️ Important:** The private key includes `\n` characters. Keep them as literal `\n` in the .env file, or use quotes.

### 4. Claude API Setup (Required)

1. Go to [Anthropic Console](https://console.anthropic.com)
2. Create an account / Sign in
3. Navigate to "API Keys"
4. Click "Create Key"
5. Copy the key to `.env.local`:

```bash
ANTHROPIC_API_KEY="sk-ant-api03-..."
```

**Cost estimate:** ~$0.01 per student session (Socratic feedback)

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Test Login

**Development Mock Users:**
- Student: `ananya-001` / `demo`
- Admin: `sebastian-admin` / `admin`

**⚠️ Note:** Mock auth is for development only. Firebase Auth will replace this.

---

## Production Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

**Environment Variables in Vercel:**
- Go to Project Settings → Environment Variables
- Add all variables from `.env.example`
- Use different Firebase projects for staging/production

### Security Checklist

- [ ] Firebase security rules updated (not in test mode)
- [ ] HTTPS enabled
- [ ] Environment variables set in hosting platform (not in code)
- [ ] `.env.local` in `.gitignore` (already configured)
- [ ] Firebase Admin SDK key kept secret
- [ ] Claude API key kept secret

---

## Troubleshooting

### "Firebase not initialized"
- Check that all `NEXT_PUBLIC_FIREBASE_*` variables are set
- Restart dev server after adding variables

### "Authentication required"
- Clear browser cookies
- Re-login at `/login`
- Check middleware is not blocking public routes

### "Claude API error"
- Verify `ANTHROPIC_API_KEY` is set correctly
- Check API key hasn't expired
- Verify you have API credits

### "Firestore permission denied"
- Update Firestore security rules
- Check user is authenticated
- Verify role permissions

---

## Next Steps

1. ✅ Complete this setup
2. 📖 Read [SECURITY.md](../SECURITY.md) for auth roadmap
3. 🔧 Configure Firebase security rules
4. 👥 Add student roster to Firestore
5. 🧪 Test practice sessions

---

## Support

- Technical issues: Check `CLAUDE.md` for project context
- Security questions: See `SECURITY.md`
- Firebase docs: https://firebase.google.com/docs
- Anthropic docs: https://docs.anthropic.com

**Last Updated:** 2026-03-13
