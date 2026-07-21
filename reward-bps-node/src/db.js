const { createClient } = require("@libsql/client");

const client = createClient({
  url: (process.env.TURSO_DATABASE_URL || "").trim(),
  authToken: (process.env.TURSO_AUTH_TOKEN || "").trim(),
});

/**
 * Semua query di seluruh app ditulis gaya Postgres ($1, $2, ...).
 * Fungsi ini mengonversinya ke placeholder "?" gaya SQLite/Turso,
 * termasuk menangani kasus satu $N dipakai berkali-kali dalam satu
 * query (misal di klausa ON CONFLICT ... DO UPDATE SET).
 * Dengan begini seluruh route (admin.js, user.js, ketua.js, auth.js)
 * TIDAK perlu diubah sama sekali saat pindah dari Postgres ke Turso.
 */
function toSqlite(sql, params) {
  const args = [];
  const converted = sql.replace(/\$(\d+)/g, (_, n) => {
    args.push(params[Number(n) - 1]);
    return "?";
  });
  return { sql: converted, args };
}

const pool = {
  async query(sql, params = []) {
    const { sql: converted, args } = toSqlite(sql, params);
    const rs = await client.execute({ sql: converted, args });
    return { rows: rs.rows };
  },
  async end() {
    client.close();
  },
};

module.exports = pool;
