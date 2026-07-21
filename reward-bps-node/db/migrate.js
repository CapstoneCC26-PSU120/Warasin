require("dotenv").config();
const fs = require("fs");
const path = require("path");
const pool = require("../src/db");

async function migrate() {
  const sql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const stmt of statements) {
    await pool.query(stmt);
  }

  console.log(`Schema diterapkan (${statements.length} statement).`);
  await pool.end();
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
