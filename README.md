# Alpha AP Math Justification Training

4-week web-based justification training course for 10 AP Math students at Alpha High School.

## Tech Stack

- **Next.js 14** (App Router)
- **Firebase** (Firestore + Auth)
- **Claude API** (Anthropic) - problem generation + Socratic feedback
- **Tailwind CSS** + Aceternity UI + Magic UI
- **GSAP** - animations
- **KaTeX** - math rendering

## Design System

Based on the Alpha logo aesthetic:
- **Primary**: Alpha blue (#2C4F5E) - geometric low-poly bird
- **Accent**: Electric cyan (#00D9FF) - digital transformation effects
- **Effects**: Glassmorphism, particle disintegration, geometric precision

## Getting Started

### Quick Setup

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Firebase and Claude API keys

# 3. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 📖 Full Setup Guide

**First time?** → See [docs/SETUP.md](docs/SETUP.md) for detailed Firebase and Claude API configuration

### 🔐 Authentication

**Development Login:**
- Student: `ananya-001` / `demo`
- Admin: `sebastian-admin` / `admin`

Visit `/login` to authenticate. See [SECURITY.md](SECURITY.md) for production auth roadmap.

## Project Structure

```
├── app/                    # Next.js App Router
├── components/
│   ├── ui/                # Reusable UI components (Aceternity/Magic UI)
│   ├── student/           # Student-facing components
│   └── admin/             # Admin dashboard components
├── services/
│   ├── data/              # Data service layer (Firebase/TimeBack adapters)
│   └── claude/            # Claude API integration
├── lib/
│   ├── firebase/          # Firebase configuration
│   ├── types/             # TypeScript type definitions
│   ├── design-system.ts   # Alpha design tokens
│   └── utils.ts           # Utility functions
└── public/
    └── assets/            # Static assets (logos, images)
```

## Build Steps

Following the CLAUDE.md specifications:

- [x] **Step 1**: Project setup (COMPLETE)
  - Next.js 14 + TypeScript + Tailwind
  - Firebase + Claude API dependencies
  - Data service layer with Firebase/TimeBack adapters
  - Alpha design system + UI components
  - Landing page with Alpha branding

- [x] **Step 2**: Authentication & Security (COMPLETE)
  - Middleware for route protection
  - Mock authentication (development)
  - Role-based access control (student/admin)
  - Security headers
  - Login/unauthorized pages

- [x] **Step 3**: Student session view (COMPLETE)
  - Week 1 overview page with WOW effects
  - Pre-FRQ practice page (5-phase workflow)
  - Split-screen layout with CERC form
  - LaTeX math rendering
  - XP system (15-35 XP range)

- [ ] **Step 4**: Claude API integration (Socratic feedback)
- [ ] **Step 5**: AI feedback loop (inline dialogue)
- [ ] **Step 6**: Badge system with GSAP animations
- [ ] **Step 7**: Admin dashboard (progress tracking)
- [ ] **Step 8**: Exit ticket system
- [ ] **Step 9**: Boss Battle mode (Week 4)
- [ ] **Step 10**: Firebase Auth integration (replace mock)
- [ ] **Step 11**: TimeBack adapter implementation
- [ ] **Step 12**: Deploy to Vercel

## Documentation

- 📖 **[Setup Guide](docs/SETUP.md)** - Complete Firebase and Claude API configuration
- 🔐 **[Security](SECURITY.md)** - Authentication system and production roadmap
- 🎨 **[CLAUDE.md](CLAUDE.md)** - Full project specifications and context

## Contributing

This is a private project for Alpha High School. For questions or contributions, contact the project lead.

## License

Proprietary - Alpha High School © 2026
