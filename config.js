// Supabase configuration — add your keys when ready
// 1. Create a project at supabase.com
// 2. In SQL Editor, run:
//    create table rsvps (
//      id uuid default gen_random_uuid() primary key,
//      name text not null,
//      email text not null,
//      attending text not null check (attending in ('yes', 'no')),
//      message text,
//      created_at timestamptz default now()
//    );
//    alter table rsvps enable row level security;
//    create policy "Allow anonymous insert" on rsvps for insert with check (true);
// 3. Replace YOUR_PROJECT_REF and YOUR_ANON_KEY below (Settings > API)
window.SUPABASE_CONFIG = {
  url: "https://YOUR_PROJECT_REF.supabase.co",
  anonKey: "YOUR_ANON_KEY",
  tableName: "rsvps",
};

// Gallery — single source of truth. Add/remove paths to change the carousel.
window.GALLERY_IMAGES = [
  "public/weddingphoto2.webp",
  "public/IMG_6934.jpeg",
  "public/weddingphoto7.webp",
  "public/Peachy_20250803013648591.jpeg",
  "public/weddingphoto4.webp",
  "public/DJI_20250704_151605_432.jpeg",
  "public/weddingphoto9.webp",
  "public/IMG_5381.jpeg",
  "public/weddingphoto1.webp",
  "public/IMG_6939.jpeg",
  "public/weddingphoto6.webp",
  "public/3A4A0677.jpeg",
  "public/weddingphoto3.webp",
  "public/Peachy_20250803014004100.jpeg",
  "public/IMG_6936.jpeg",
  "public/weddingphoto8.webp",
  "public/IMG_5157.jpeg",
  "public/IMG_6949.jpeg",
];
