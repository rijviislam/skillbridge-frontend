# SkillBridge Frontend

A full-stack tutoring platform frontend built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## Project Structure

```
skillbridge/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── tutors/
│   │   ├── page.tsx                # Browse tutors
│   │   └── [id]/page.tsx           # Tutor profile + booking
│   ├── auth/
│   │   ├── login/page.tsx          # Login
│   │   └── register/page.tsx       # Register
│   ├── dashboard/                  # Student dashboard
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Overview
│   │   ├── bookings/page.tsx       # Bookings + reviews
│   │   └── profile/page.tsx        # Profile
│   ├── tutor/                      # Tutor dashboard
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── availability/page.tsx
│   │   └── profile/page.tsx
│   └── admin/                      # Admin dashboard
│       ├── layout.tsx
│       ├── page.tsx                # Stats overview
│       ├── users/page.tsx          # User management
│       ├── bookings/page.tsx       # All bookings
│       └── categories/page.tsx     # Category management
├── components/
│   ├── ui/                         # Reusable UI components
│   ├── layout/                     # Navbar, Sidebar, Footer
│   └── tutor/                      # TutorCard, etc.
├── context/
│   └── AuthContext.tsx             # Auth state + JWT management
├── lib/
│   ├── api.ts                      # Axios instance + all API calls
│   └── utils.ts                    # Helper functions
└── types/
    └── index.ts                    # TypeScript types
```

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Run development server
```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) — or `http://localhost:3000` if your backend runs elsewhere.

> **Note**: If your backend also runs on port 3000, start Next.js with a different port:
> ```bash
> npm run dev -- -p 3001
> ```

## Role-Based Access

| Role    | Dashboard         | Access              |
|---------|-------------------|---------------------|
| Student | `/dashboard`      | Browse, book, review |
| Tutor   | `/tutor/dashboard` | Profile, sessions, availability |
| Admin   | `/admin`          | Users, bookings, categories |

## API Endpoints Used

All API calls are in `lib/api.ts`. The frontend expects these from your backend:

- `POST /api/auth/register` — `{ name, email, password, role }` → `{ token, user }`
- `POST /api/auth/login` — `{ email, password }` → `{ token, user }`
- `GET /api/auth/me` — returns current user
- `GET /api/tutors` — list tutors (supports filters)
- `GET /api/tutors/:id` — single tutor
- `GET /api/categories` — all categories
- `POST /api/bookings` — create booking
- `GET /api/bookings` — get user's bookings
- `PATCH /api/bookings/:id` — update booking status
- `PUT /api/tutor/profile` — update tutor profile
- `GET /api/tutor/availability` — get availability
- `PUT /api/tutor/availability` — update availability
- `POST /api/reviews` — create review
- `GET /api/admin/users` — all users
- `PATCH /api/admin/users/:id` — ban/unban user
- `GET /api/admin/bookings` — all bookings
- `GET /api/admin/stats` — platform statistics
- `POST /api/categories` — create category (admin)
- `PUT /api/categories/:id` — update category (admin)
- `DELETE /api/categories/:id` — delete category (admin)
