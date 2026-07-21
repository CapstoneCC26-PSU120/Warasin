require("dotenv").config();
const bcrypt = require("bcryptjs");
const pool = require("../src/db");

async function seed() {
  const username = process.env.SEED_ADMIN_USERNAME || "admin";
  const password = process.env.SEED_ADMIN_PASSWORD || "admin123";
  const hash = await bcrypt.hash(password, 10);

  await pool.query(
    `INSERT INTO users (username, password, role, divisi)
     VALUES ($1, $2, 'admin', 'ADMIN')
     ON CONFLICT (username) DO NOTHING`,
    [username, hash]
  );

  console.log(`Admin awal dibuat -> username: ${username}, password: ${password}`);
  console.log("Segera ganti password ini lewat menu Kelola Akun setelah login pertama.");
  await pool.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
