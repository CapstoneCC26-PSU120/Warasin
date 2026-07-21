# reward-BPS (Node.js + Turso)

Rewrite dari versi PHP+MySQL asli. Semua fitur dipertahankan (login per
role, voting ketua, penilaian admin, laporan+chart, kelola akun,
manajemen kandidat, penilaian final user), tampilan dirapikan.
Database pakai **Turso** (SQLite di edge, free tier permanen tanpa kartu
kredit), hosting pakai **Vercel** (free tier permanen tanpa kartu kredit).
Autentikasi memakai JWT di cookie (bukan session server) supaya cocok
dijalankan di platform serverless.

## Stack
- Node.js + Express + EJS (server-rendered, tanpa build step)
- **Turso** (libSQL / SQLite terdistribusi) — free tier: 500 database,
  9 GB storage total, cukup jauh untuk skala aplikasi ini
- Auth: JWT di httpOnly cookie + bcrypt untuk hash password
- Deploy: **Vercel** (free tier, tanpa kartu kredit)

## 1. Setup database gratis (Turso)

1. Daftar di turso.tech (gratis, tanpa kartu kredit) — bisa langsung pakai
   akun GitHub.
2. Install Turso CLI di komputer lokal:
   ```bash
   curl -sSfL https://get.tur.so/install.sh | bash
   ```
   (Windows: pakai WSL, atau lihat dokumentasi resmi Turso untuk cara lain)
3. Login lewat CLI:
   ```bash
   turso auth login
   ```
4. Buat database baru:
   ```bash
   turso db create reward-bps
   ```
5. Ambil connection URL dan token:
   ```bash
   turso db show reward-bps --url
   turso db tokens create reward-bps
   ```
   Simpan hasil keduanya — nanti diisi ke `TURSO_DATABASE_URL` dan
   `TURSO_AUTH_TOKEN`.

*(Alternatif tanpa install CLI: buat database lewat dashboard web
turso.tech, lalu ambil URL & token dari sana juga.)*

## 2. Jalankan lokal dulu (opsional tapi disarankan)

```bash
npm install
cp .env.example .env
# isi TURSO_DATABASE_URL & TURSO_AUTH_TOKEN dari langkah di atas
# isi JWT_SECRET dengan string acak panjang

npm run migrate   # menerapkan skema tabel ke database Turso
npm run seed       # membuat akun admin awal (admin / admin123)
npm run dev        # jalan di http://localhost:3000
```

Login pakai `admin` / `admin123`, lalu langsung ganti password lewat
**Kelola Akun**, dan tambahkan akun untuk pegawai/ketua lain lewat menu
yang sama. Tambahkan data kandidat lewat menu **Data Pegawai**.

## 3. Deploy ke Vercel (gratis)

1. Push folder ini ke repo GitHub baru.
2. Daftar/login di vercel.com pakai akun GitHub.
3. **Add New Project** → pilih repo ini → Vercel otomatis mendeteksi
   `vercel.json`.
4. Di bagian **Environment Variables**, tambahkan:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - `JWT_SECRET` = string acak panjang
   - `NODE_ENV` = `production`
5. Klik **Deploy**. Selesai — dapat URL `https://nama-project.vercel.app`
   gratis selamanya, tanpa kartu kredit, tanpa server yang "tidur".

Skema tabel & akun admin awal cukup dibuat **sekali** lewat `npm run
migrate` dan `npm run seed` dari komputer lokal (dengan `TURSO_DATABASE_URL`
production di `.env`) — Vercel tidak perlu menjalankan ini lagi setiap
deploy, karena datanya sudah tersimpan permanen di Turso.

## Kenapa Turso dan bukan Supabase/Neon?

Semua sama-sama gratis selamanya tanpa kartu kredit. Bedanya cuma teknis:
Turso pakai SQLite (lebih ringan, cocok untuk trafik kecil-menengah),
Supabase/Neon pakai Postgres (lebih berat tapi lebih relasional).
Untuk aplikasi internal seperti ini, dua-duanya sama-sama cukup — kode
ini sudah disiapkan agar bisa pakai salah satunya tanpa mengubah kode di
`src/routes/`, cuma `src/db.js` yang beda (lapisan koneksi database).

## Perbedaan dari versi PHP asli

- Password di-hash pakai bcrypt (bukan MD5) — lebih aman.
- Alur "Penilaian Final Kandidat" disederhanakan jadi satu halaman berisi
  3 kandidat sekaligus (bukan wizard 3 langkah terpisah), supaya tidak
  butuh session server yang tidak cocok dengan platform serverless.
- Tampilan dirapikan pakai satu file CSS bersama, warna & layout konsisten
  di semua halaman.
- Data kandidat/pegawai contoh dari file asli **tidak** ikut dipindahkan
  (untuk menjaga privasi) — tambahkan data pegawai asli sendiri lewat
  menu Data Pegawai & Kelola Akun setelah deploy.
