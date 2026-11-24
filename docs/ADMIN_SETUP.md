# Digital Field. (`DF.`) Admin Panel Setup Guide

This guide explains how to connect the `#/admin` content panel to Supabase so you can edit contact details, portfolio work, and key page copy without touching code.

---

## 1. Create a Supabase Project

1. Sign in at [supabase.com](https://supabase.com) and click **New project**.
2. Choose an organization, give the project a name (for example, `digital-field-cms`), set a strong database password, and pick the region closest to your visitors (for example, Dubai / Middle East / Frankfurt).
3. Wait a couple of minutes for the database to finish provisioning.

---

## 2. Run the Database & Security Script

1. In your Supabase project, open **SQL Editor** from the left sidebar and click **New query**.
2. Copy the entire contents of `supabase/schema.sql` from this repository and paste it into the SQL Editor.
3. Click **Run** (bottom right). You should see a success confirmation.

This script creates:
- `public.admins` — the allowlist of users permitted to edit content.
- `public.site_content` — draft and published JSON content for Site Settings, Performance Marketing, Search Intelligence, DF. Studio, and Industries.
- `public.portfolio_items` — Selected Work items for DF. Studio.
- `portfolio-media` — a public-read, admin-write Storage bucket limited to JPEG, PNG, and WebP images up to 5 MB.
- Row Level Security (RLS) policies on every table and storage object so the public can only read published content and only listed admins can write.

---

## 3. Create Your Admin User (No Public Sign-Up)

1. In the Supabase Dashboard, go to **Authentication** -> **Providers** -> **Email** and verify **Allow new users to sign up** is turned **off** (or keep sign-ups disabled in **Authentication** -> **Sign In / Providers** -> **User Signups**). The `#/admin` page has no sign-up screen.
2. Go to **Authentication** -> **Users** -> **Add user** -> **Create new user**.
3. Enter your admin email and a strong password, check **Auto Confirm User**, and click **Create user**.
4. Copy the new user's **User UID** (UUID) from the Users list, or run this SQL in **SQL Editor** (replace the email with your admin email):

```sql
insert into public.admins (user_id, email)
select id, email
from auth.users
where email = 'your-admin-email@example.com'
on conflict (user_id) do nothing;
```

Only users present in `public.admins` (or granted `{"role": "admin"}` in server-side `app_metadata`) can write data or upload images.

---

## 4. Configure Allowed Site & Redirect URLs

1. In the Supabase Dashboard, go to **Authentication** -> **URL Configuration**.
2. Set **Site URL** to your live domain (for example, `https://digitalfield.co`).
3. Under **Redirect URLs**, add your live domain and any preview/staging domains you use:
   - `https://digitalfield.co`
   - `https://digitalfield.co/**`
   - (Optional for local testing) `http://localhost:3000/**`

---

## 5. Set the Two Environment Variables on Your Hosting Platform

1. In Supabase, go to **Project Settings** -> **Data API** (or **API Keys**).
2. Copy:
   - **Project URL** -> use for `VITE_SUPABASE_URL`
   - **anon / publishable public key** -> use for `VITE_SUPABASE_ANON_KEY`
3. In your hosting provider (Vercel, Netlify, Cloudflare Pages, Cloud Run, etc.), add these two environment variables and redeploy:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

**Important Security Note:** Never place the Supabase `service_role` (or `secret`) key in frontend environment variables, `.env`, or any `VITE_*` variable. Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` belong in the browser bundle.

---

## 6. Open `#/admin`

Navigate directly to `/#/admin` on your deployed site (for example, `https://digitalfield.co/#/admin`). This route is intentionally excluded from navigation menus, `robots.txt`, and `sitemap.xml`, and serves a `noindex` meta tag.

---

## 7. Rotating Keys & Revoking Access

- **Rotate the `anon` key**: In Supabase **Project Settings** -> **API Keys**, roll the anon/publishable key, update `VITE_SUPABASE_ANON_KEY` in your hosting platform environment settings, and trigger a fresh build/deploy so the new key takes effect.
- **Revoke an admin**: Delete their row from `public.admins` in **Table Editor** or via SQL (`delete from public.admins where email = '...';`), and optionally delete or ban the user in **Authentication** -> **Users**.
- **Reset an admin password**: Use **Authentication** -> **Users** in the Supabase Dashboard to send a password recovery email or update the user directly.
