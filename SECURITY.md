# Security Documentation

## Authentication System

### Current Implementation (Development)

The application currently uses **cookie-based mock authentication** for development purposes.

#### Flow:
1. User logs in at `/login` with mock credentials
2. Cookies are set: `auth-token`, `user-role`, `user-id`
3. Middleware validates cookies and protects routes
4. Server components use `lib/auth.ts` helpers to get user

#### Mock Users:
```typescript
// Student accounts
ananya-001 / demo
emily-001 / demo

// Admin account
sebastian-admin / admin
```

### Route Protection

#### Middleware (`middleware.ts`)
- Protects `/admin/*` routes (admin role required)
- Protects `/student/*` routes (student role required)
- Public routes: `/`, `/login`, `/unauthorized`, `/api/*`
- Adds security headers (X-Frame-Options, CSP, etc.)

#### Auth Helpers (`lib/auth.ts`)
```typescript
// Server-side only
getAuthUser()      // Returns AuthUser | null
requireAuth()      // Throws if not authenticated
requireRole(role)  // Throws if wrong role

// Client-side only
getClientUserId()  // Returns user ID from cookie
getClientUserRole() // Returns role from cookie
```

### Security Headers

Middleware adds the following headers to all responses:
- `X-Frame-Options: DENY` - Prevent clickjacking
- `X-Content-Type-Options: nosniff` - Prevent MIME sniffing
- `X-XSS-Protection: 1; mode=block` - Enable XSS protection
- `Referrer-Policy: strict-origin-when-cross-origin` - Control referrer info

## Production Roadmap

### Phase 1: Firebase Authentication (Immediate Priority)
**Status**: 🔴 Not Implemented

Replace mock auth with Firebase:
1. Install Firebase SDK
2. Set up Firebase project
3. Implement Firebase Auth provider (Google, Email/Password)
4. Replace cookie auth with Firebase tokens
5. Verify tokens server-side with Firebase Admin SDK

**Files to update:**
- `app/login/page.tsx` - Use Firebase Auth UI
- `middleware.ts` - Verify Firebase ID tokens
- `lib/auth.ts` - Decode Firebase tokens

### Phase 2: TimeBack OAuth Integration (Future)
**Status**: 🟡 Planned

Integrate with Alpha School's TimeBack platform:
1. Register OAuth2 client with TimeBack
2. Implement OAuth2 authorization code flow
3. Store TimeBack tokens securely
4. Sync user roster from OneRoster API
5. Submit XP/grades to TimeBack via OneRoster Gradebook

**Endpoints:**
- Auth: `prod-beyond-timeback-api-2-idp.auth.us-east-1.amazoncognito.com`
- OneRoster: `https://api.alpha-1edtech.ai/ims/oneroster/rostering/v1p2`
- Gradebook: `https://api.alpha-1edtech.ai/ims/oneroster/gradebook/v1p2`

### Phase 3: Enhanced Security
**Status**: 🟡 Future

Additional security measures:
- [ ] Rate limiting on login endpoint
- [ ] CSRF protection for forms
- [ ] Session rotation
- [ ] Audit logging for admin actions
- [ ] Content Security Policy (CSP)
- [ ] HTTPS enforcement in production
- [ ] Secure cookie attributes (httpOnly, secure, sameSite)

## Current Vulnerabilities

### ⚠️ Development Only - NOT Production Ready

1. **Mock Authentication** - No real credential verification
2. **Client-side cookies** - Can be manipulated
3. **No token expiration** - 24h static expiration
4. **No session invalidation** - Logout only clears client cookies
5. **No refresh tokens** - No token renewal mechanism

### Mitigations for Development
- Use only in trusted development environments
- Never deploy to public internet with mock auth
- Always behind VPN/localhost

## Environment Variables

Required for production:

```bash
# Firebase (Phase 1)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_PRIVATE_KEY=
FIREBASE_ADMIN_CLIENT_EMAIL=

# TimeBack OAuth (Phase 2)
TIMEBACK_CLIENT_ID=
TIMEBACK_CLIENT_SECRET=
TIMEBACK_REDIRECT_URI=
TIMEBACK_API_BASE=https://api.alpha-1edtech.ai

# Application
NEXTAUTH_SECRET=  # Generate with: openssl rand -base64 32
NEXTAUTH_URL=https://your-domain.com
```

## Compliance

### FERPA (Family Educational Rights and Privacy Act)
- Student data must be protected
- Access logs required
- Parental consent for students under 18
- Data breach notification procedures

**Current Status**: 🔴 Not compliant (development only)

### Production Requirements:
- [ ] End-to-end encryption for PII
- [ ] Audit logs for all data access
- [ ] Data retention policies
- [ ] User consent management
- [ ] Right to data deletion

## Testing

### Test Authentication Flow
```bash
# 1. Start dev server
npm run dev

# 2. Navigate to protected route (should redirect)
curl -i http://localhost:3000/student

# 3. Login with mock user
# Visit http://localhost:3000/login
# Use: ananya-001 / demo

# 4. Verify access granted
curl -i --cookie "auth-token=ananya-001;user-role=student;user-id=ananya-001" http://localhost:3000/student

# 5. Try admin route with student cookie (should get 403)
curl -i --cookie "auth-token=ananya-001;user-role=student;user-id=ananya-001" http://localhost:3000/admin
```

## Contact

For security concerns or questions:
- Sebastian (Project Lead)
- Never commit `.env` files
- Report vulnerabilities via private channel

---

**Last Updated**: 2026-03-13
**Review Cycle**: Before each production deployment
