const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../db");
const { requireRole } = require("../middleware/auth");

const router = express.Router();

/* ================= PENILAIAN (dashboard utama admin) ================= */

router.get("/penilaian", requireRole("admin"), async (req, res) => {
  const { rows: kandidat } = await pool.query(`
    SELECT DISTINCT k.*
    FROM kandidat k
    WHERE k.id IN (SELECT internal_id FROM voting)
       OR k.id IN (SELECT eksternal_id FROM voting)
    ORDER BY k.divisi ASC, k.nama ASC
  `);

  const { rows: nilaiRows } = await pool.query("SELECT * FROM penilaian");
  const nilaiByKandidat = {};
  nilaiRows.forEach((n) => (nilaiByKandidat[n.kandidat_id] = n));

  const { rows: top3 } = await pool.query(`
    SELECT k.nama, k.divisi, p.total
    FROM penilaian p
    JOIN kandidat k ON k.id = p.kandidat_id
    ORDER BY p.total DESC
    LIMIT 3
  `);

  const { rows: sesiRows } = await pool.query(
    "SELECT * FROM sesi_final ORDER BY id DESC LIMIT 1"
  );
  const sesiAktif = sesiRows[0];

  res.render("admin/penilaian", {
    title: "Admin - Penilaian",
    kandidat,
    nilaiByKandidat,
    top3,
    sesiTerbuka: sesiAktif && sesiAktif.status === "buka",
  });
});

router.post("/penilaian", requireRole("admin"), async (req, res) => {
  const raw = req.body.kandidat || {};
  const rows = Array.isArray(raw) ? raw : Object.values(raw);

  for (const row of rows) {
    const kandidatId = parseInt(row.id, 10);
    const skp = parseInt(row.skp, 10) || 0;
    const kjk = parseInt(row.kjk, 10) || 0;
    const total = skp - kjk;

    await pool.query(
      `INSERT INTO penilaian (kandidat_id, skp, kjk, total)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (kandidat_id) DO UPDATE
       SET skp = $2, kjk = $3, total = $4`,
      [kandidatId, skp, kjk, total]
    );
  }
  res.redirect("/penilaian");
});

router.post("/penilaian/reset", requireRole("admin"), async (req, res) => {
  await pool.query("DELETE FROM voting");
  await pool.query("DELETE FROM penilaian");
  await pool.query("UPDATE sesi_final SET status = 'tutup'");
  res.redirect("/penilaian");
});

/* ================= SESI ================= */

router.post("/buka-sesi", requireRole("admin"), async (req, res) => {
  await pool.query("UPDATE sesi_final SET status = 'tutup'");
  await pool.query("INSERT INTO sesi_final (status) VALUES ('buka')");
  res.redirect("/penilaian");
});

router.post("/tutup-sesi", requireRole("admin"), async (req, res) => {
  await pool.query("UPDATE sesi_final SET status = 'tutup'");
  res.redirect("/penilaian");
});

/* ================= KELOLA AKUN ================= */

router.get("/kelola-akun", requireRole("admin"), async (req, res) => {
  const { rows: users } = await pool.query(
    "SELECT * FROM users ORDER BY role DESC, username ASC"
  );

  let editData = null;
  if (req.query.edit) {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      req.query.edit,
    ]);
    editData = rows[0] || null;
  }

  res.render("admin/kelola_akun", {
    title: "Kelola Akun",
    users,
    editData,
    error: req.query.error === "exists" ? "Username sudah digunakan!" : null,
  });
});

router.post("/kelola-akun", requireRole("admin"), async (req, res) => {
  const { username, password, role, divisi, id } = req.body;

  if (id) {
    // update
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      await pool.query(
        "UPDATE users SET username=$1, password=$2, role=$3, divisi=$4 WHERE id=$5",
        [username, hash, role, divisi, id]
      );
    } else {
      await pool.query(
        "UPDATE users SET username=$1, role=$2, divisi=$3 WHERE id=$4",
        [username, role, divisi, id]
      );
    }
  } else {
    const { rows: existing } = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );
    if (existing.length > 0) {
      return res.redirect("/kelola-akun?error=exists");
    }
    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (username, password, role, divisi) VALUES ($1,$2,$3,$4)",
      [username, hash, role, divisi]
    );
  }
  res.redirect("/kelola-akun");
});

router.post("/kelola-akun/reset/:id", requireRole("admin"), async (req, res) => {
  const hash = await bcrypt.hash("123456", 10);
  await pool.query("UPDATE users SET password = $1 WHERE id = $2", [
    hash,
    req.params.id,
  ]);
  res.redirect("/kelola-akun");
});

router.post("/kelola-akun/hapus/:id", requireRole("admin"), async (req, res) => {
  await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
  res.redirect("/kelola-akun");
});

/* ================= MANAJEMEN KANDIDAT ================= */

router.get("/kandidat", requireRole("admin"), async (req, res) => {
  const { rows: kandidat } = await pool.query(
    "SELECT * FROM kandidat ORDER BY id DESC"
  );

  let editData = null;
  if (req.query.edit) {
    const { rows } = await pool.query(
      "SELECT * FROM kandidat WHERE id = $1",
      [req.query.edit]
    );
    editData = rows[0] || null;
  }

  res.render("admin/kandidat", { title: "Manajemen Kandidat", kandidat, editData });
});

router.post("/kandidat", requireRole("admin"), async (req, res) => {
  const { nama, divisi, id } = req.body;
  if (id) {
    await pool.query("UPDATE kandidat SET nama=$1, divisi=$2 WHERE id=$3", [
      nama,
      divisi,
      id,
    ]);
  } else {
    await pool.query("INSERT INTO kandidat (nama, divisi) VALUES ($1,$2)", [
      nama,
      divisi,
    ]);
  }
  res.redirect("/kandidat");
});

router.post("/kandidat/hapus/:id", requireRole("admin"), async (req, res) => {
  await pool.query("DELETE FROM kandidat WHERE id = $1", [req.params.id]);
  res.redirect("/kandidat");
});

/* ================= LAPORAN ================= */

router.get("/laporan", requireRole("admin"), async (req, res) => {
  const { rows: sesiList } = await pool.query(
    "SELECT id, status, created_at FROM sesi_final ORDER BY id ASC"
  );

  let activeSesiId = parseInt(req.query.sesi_id, 10) || 0;
  if (!activeSesiId) {
    const buka = sesiList.find((s) => s.status === "buka");
    activeSesiId = buka ? buka.id : sesiList[0] ? sesiList[0].id : 0;
  }

  const sesiWithData = [];
  for (const sesi of sesiList) {
    const { rows } = await pool.query(
      `SELECT k.nama, SUM(f.total_nilai) as total_nilai, COUNT(f.user_id) as total_suara
       FROM final_vote f
       JOIN kandidat k ON f.kandidat_id = k.id
       WHERE f.sesi_id = $1
       GROUP BY k.nama
       ORDER BY total_nilai DESC`,
      [sesi.id]
    );
    sesiWithData.push({ ...sesi, hasil: rows });
  }

  res.render("admin/laporan", {
    title: "Laporan Hasil Penilaian",
    sesiList: sesiWithData,
    activeSesiId,
  });
});

router.post("/laporan/reset/:sesiId", requireRole("admin"), async (req, res) => {
  await pool.query("DELETE FROM final_vote WHERE sesi_id = $1", [
    req.params.sesiId,
  ]);
  res.redirect("/laporan?sesi_id=" + req.params.sesiId);
});

router.post("/laporan/hapus-sesi/:sesiId", requireRole("admin"), async (req, res) => {
  await pool.query("DELETE FROM final_vote WHERE sesi_id = $1", [
    req.params.sesiId,
  ]);
  await pool.query("DELETE FROM sesi_final WHERE id = $1", [
    req.params.sesiId,
  ]);
  const { rows } = await pool.query(
    "SELECT id FROM sesi_final ORDER BY id ASC LIMIT 1"
  );
  const nextId = rows[0] ? rows[0].id : 0;
  res.redirect("/laporan?sesi_id=" + nextId);
});

module.exports = router;
