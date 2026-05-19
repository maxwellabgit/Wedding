// Supabase configuration for the RSVP form.
// The publishable key (sb_publishable_...) is safe to ship in the browser:
// Row Level Security on the `rsvps` table restricts it to insert-only.
//
// Schema (run once in Supabase SQL Editor if you haven't already):
//   create table rsvps (
//     id uuid default gen_random_uuid() primary key,
//     name text not null,
//     email text not null,
//     attending text not null check (attending in ('yes', 'no')),
//     message text,
//     created_at timestamptz default now()
//   );
//   alter table rsvps enable row level security;
//   create policy "Allow anonymous insert" on rsvps for insert with check (true);
window.SUPABASE_CONFIG = {
  url: "https://uuxfphoxjsgodlrougjp.supabase.co",
  publishableKey: "sb_publishable_vw9-bX6JGFtbMI7K5mdbCg_xJkoSc8T",
  tableName: "rsvps",
};

// Gallery — single source of truth. Add/remove paths to change the carousel.
window.GALLERY_IMAGES = [
  "public/IMG_6862.jpeg",
  "public/IMG_6867.jpeg",
  "public/IMG_6921.jpeg",
  "public/IMG_6939.jpeg",
  "public/Peachy_20250803014004100.jpeg",
  "public/Peachy_20250803014336394.jpeg",
  "public/weddingphoto2.webp",
  "public/weddingphoto7.webp",
  "public/weddingphoto1.webp",
  "public/weddingphoto3.webp",
];
