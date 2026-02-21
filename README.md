<div align="center">

# 📄 DocuSeal

### AI-Powered Legal Document Generator

**Generate professional legal documents in 60 seconds — free, no lawyer needed.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)](https://prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Live Demo](https://docuseal.ai) · [Report Bug](https://github.com/AnmolDotX/docuseal/issues) · [Request Feature](https://github.com/AnmolDotX/docuseal/issues)

</div>

---

## ✨ What It Does

DocuSeal lets anyone generate production-ready legal documents using AI — no legal knowledge required. Users fill in a short form, AI generates a context-aware document, and they can download it instantly as a formatted file.

**8 document types supported:**

| Document | Free Tier | Paid Tier |
|----------|-----------|-----------|
| 🔒 Privacy Policy | ✅ | ✅ |
| 📋 Terms of Service | ✅ | ✅ |
| 🤝 NDA Agreement | ✅ | ✅ |
| 📝 Client Contract | ❌ | ✅ |
| 💼 Freelancer Agreement | ❌ | ✅ |
| 🍪 Cookie Policy | ❌ | ✅ |
| 👔 Employment Contract | ❌ | ✅ |
| 💰 Refund Policy | ❌ | ✅ |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Database** | PostgreSQL via Supabase |
| **ORM** | Prisma 5 |
| **Auth** | NextAuth.js v5 (Google OAuth + Email/Password) |
| **AI** | Google Gemini 1.5 Flash (free tier) |
| **Payments** | Stripe (subscriptions, webhooks, billing portal) |
| **Email** | Resend |
| **Styling** | Tailwind CSS + Shadcn/ui |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free)
- A [Google Cloud Console](https://console.cloud.google.com) project (free)
- A [Gemini API key](https://aistudio.google.com) (free)
- A [Stripe](https://stripe.com) account (free for test mode)
- A [Resend](https://resend.com) account (free)

### 1. Clone the repository

```bash
git clone https://github.com/AnmolDotX/docuseal.git
cd docuseal
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local` with your credentials (see [Environment Variables](#-environment-variables) below).

### 4. Push the database schema

```bash
npm run db:push
```

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you're live.

---

## 🔑 Environment Variables

| Variable | Description | Free? |
|----------|-------------|-------|
| `DATABASE_URL` | Supabase PostgreSQL connection string | ✅ Free |
| `DIRECT_URL` | Same as DATABASE_URL for direct connections | ✅ Free |
| `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` | ✅ Free |
| `NEXTAUTH_URL` | `http://localhost:3000` for dev | ✅ Free |
| `GOOGLE_CLIENT_ID` | Google Cloud Console → OAuth 2.0 | ✅ Free |
| `GOOGLE_CLIENT_SECRET` | Google Cloud Console → OAuth 2.0 | ✅ Free |
| `GEMINI_API_KEY` | [aistudio.google.com](https://aistudio.google.com) | ✅ Free |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API keys | ✅ Free (test mode) |
| `STRIPE_WEBHOOK_SECRET` | `stripe listen --forward-to localhost:3000/api/billing/webhook` | ✅ Free |
| `STRIPE_*_PRICE_ID` | Stripe Dashboard → Product catalog | ✅ Free (test mode) |
| `RESEND_API_KEY` | [resend.com](https://resend.com) → API Keys | ✅ Free |
| `FROM_EMAIL` | Verified domain email e.g. `noreply@yourdomain.com` | ✅ Free |

See `.env.example` for the full template.

---

## 📁 Project Structure

```
docuseal/
├── prisma/
│   └── schema.prisma          # Database schema (User, Subscription, Document…)
├── src/
│   ├── app/
│   │   ├── (auth)/            # Login, signup, verify-email, forgot/reset password
│   │   ├── (app)/
│   │   │   └── dashboard/     # Main app dashboard
│   │   ├── api/
│   │   │   ├── auth/          # NextAuth route handler
│   │   │   ├── billing/       # Stripe checkout, portal, webhook
│   │   │   ├── generate/      # AI document generation endpoint
│   │   │   └── pdf/           # Document export endpoint
│   │   ├── tools/             # 8 SEO-optimized tool pages
│   │   │   ├── privacy-policy/
│   │   │   ├── terms-of-service/
│   │   │   ├── nda/
│   │   │   └── …
│   │   ├── page.tsx           # Landing page
│   │   ├── sitemap.ts         # Dynamic sitemap
│   │   └── robots.ts          # Robots.txt
│   ├── components/
│   │   ├── Providers.tsx      # NextAuth SessionProvider
│   │   └── tool/
│   │       └── DocumentToolUI.tsx  # Reusable generation form
│   ├── lib/
│   │   ├── ai.ts              # Gemini AI integration + all 8 prompts
│   │   ├── auth-actions.ts    # Server actions: signup, verify, reset
│   │   ├── db.ts              # Prisma singleton
│   │   ├── email.ts           # Resend email templates
│   │   ├── plans.ts           # Plan limits and pricing
│   │   ├── stripe.ts          # Stripe client + price ID mapping
│   │   └── utils.ts           # Shared utilities
│   ├── auth.ts                # NextAuth v5 configuration
│   └── middleware.ts          # Route protection
```

---

## 💳 Pricing Tiers

| Feature | Free | Starter ($19/mo) | Pro ($49/mo) |
|---------|------|-------------------|--------------|
| Documents/month | 3 | 20 | Unlimited |
| Document types | 3 | All 8 | All 8 |
| AI generation | ✅ | ✅ | ✅ |
| Watermark-free PDF | ❌ | ✅ | ✅ |
| Team seats | 1 | 1 | 5 |
| Priority support | ❌ | ❌ | ✅ |

---

## 🔐 Authentication Features

- ✅ Google OAuth one-click sign in
- ✅ Email/password with bcrypt hashing
- ✅ Email verification flow (token-based, 24hr expiry)
- ✅ Password reset with secure tokens
- ✅ Email enumeration protection
- ✅ Auto-creation of free subscription on signup

---

## 💸 Stripe Integration

- ✅ 14-day free trial on all paid plans
- ✅ Automatic VAT/GST tax collection
- ✅ Promo codes support
- ✅ Billing portal (self-serve plan management)
- ✅ Dunning emails on payment failure (3-strike system)
- ✅ Webhook idempotency (no duplicate processing)

---

## 🛠️ Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio (DB GUI)
npm run db:generate  # Regenerate Prisma client
```

---

## 🌍 SEO Architecture

Each of the 8 tool pages is a standalone SEO-optimized page with:
- Unique `<title>` and `<meta description>` targeting high-volume keywords
- `FAQ` schema markup (`application/ld+json`) for rich results
- Canonical URLs
- OpenGraph + Twitter card tags
- Breadcrumb navigation
- 200+ words of supporting SEO content

The `/sitemap.xml` is auto-generated with tool pages at priority `0.9`.

---

## 📜 License

MIT — free to use, modify, and distribute.

---

## ⚠️ Disclaimer

Documents generated by DocuSeal are AI-generated and provided for informational purposes only. They do not constitute legal advice. For matters involving significant legal risk, consult a licensed attorney in your jurisdiction.

---

<div align="center">
Built with ❤️ by <a href="https://github.com/AnmolDotX">@AnmolDotX</a>
</div>
