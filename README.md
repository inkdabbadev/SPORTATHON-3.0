# SPORTATHON 3.0

Next.js admin console for SPORTATHON 3.0 roster, team, and event management.

## Stack

- Next.js 16
- React 19
- TypeScript
- MongoDB with Mongoose
- bcrypt password hashing
- signed HTTP-only admin session cookies
- Zod validation

## Setup

```bash
npm install
cp .env.example .env
```

Update `.env`:

```bash
MONGODB_URI=mongodb://USER:PASSWORD@HOST-00-00.mongodb.net:27017,HOST-00-01.mongodb.net:27017,HOST-00-02.mongodb.net:27017/sportathon-3?ssl=true&replicaSet=YOUR-REPLICA-SET&authSource=admin&retryWrites=true&w=majority
MONGODB_DNS_SERVERS=8.8.8.8,1.1.1.1
AUTH_SECRET=replace-with-a-long-random-secret-at-least-32-characters
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-with-a-strong-password
```

Seed the initial event settings and admin user:

```bash
npm run seed
```

Run locally:

```bash
npm run dev
```

Open `http://localhost:3000/admin`.

## Routes

- `/` redirects to `/admin`
- `/admin` admin app entry point
- `/admin/login` admin login
- `/admin/dashboard` protected dashboard
- `/admin/players` protected player management
- `/admin/teams` protected team management
- `/admin/settings` protected event settings

## Production Notes

- Use MongoDB Atlas for a simple managed database.
- Deploy this as one Vercel project. The app is admin-only:
  - Admin: `https://your-domain.com/admin`
  - Root: `https://your-domain.com/` redirects to `/admin`
- Keep `AUTH_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` private.
- If your local DNS blocks Atlas SRV lookups, keep `MONGODB_DNS_SERVERS=8.8.8.8,1.1.1.1`.
- Run `npm run seed` once after configuring production environment variables.
- For 100-500 users, one Next.js deployment plus MongoDB Atlas is enough.
