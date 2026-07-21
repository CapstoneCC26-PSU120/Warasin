const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../db");
const { requireRole, issueToken } = require("../middleware/auth");

const router = express.Router();

const PERTANYAAN = [
  "Integritas dan etika kerja",
  "Kerja sama",
  "Tanggung jawab",
  "Komunikasi",
  "Kedisiplinan",
  "Inisiatif",
  "Kualitas kerja",
  "Kepemimpinan",
  "Loyalitas",
  "Kontribusi organisasi",
];

const TITLE_DASHBOARD = "Dashboard User";
const TITLE_FINAL_VOTE = "Penilaian Final";
const TITLE_PENGATURAN = "Pengaturan Akun";

async function getSesiAktif() {
  const { rows } = await pool.query(
    "SELECT * FROM sesi_final WHERE status = 'buka' ORDER BY id DESC LIMIT 1"
  );
  return rows[0] || null;
}

router.get("/dashboard", requireRole("user"), async (req, res) => {
  const sesi = await getSesiAktif();
  let sudahVote = false;

  if (sesi) {
    const { rows } = await pool.query(
      "SELECT id FROM final_vote WHERE user_id = $1 AND sesi_id = $2 LIMIT 1",
      [req.user.id, sesi.id]
    );
    sudahVote = rows.length > 0;
  }

  res.render("user/dashboard", {
    title: TITLE_DASHBOARD,
    sesiId: sesi ? sesi.id : 0,
    sudahVote,
  });
});

router.get("/final-vote", requireRole("user"), async (req, res) => {
  const sesi = await getSesiAktif();
  if (!sesi) {
    return res.render("user/final_vote", {
      title: TITLE_FINAL_VOTE,
      belumBuka: true,
      sudahVote: false,
      kandidat: [],
      pertanyaan: PERTANYAAN,
      success: false,
    });
  }

  const { rows: cekVote } = await pool.query(
    "SELECT id FROM final_vote WHERE user_id = $1 AND sesi_id = $2 LIMIT 1",
    [req.user.id, sesi.id]
  );
  if (cekVote.length > 0) {
    return res.render("user/final_vote", {
      title: TITLE_FINAL_VOTE,
      belumBuka: false,
      sudahVote: true,
      kandidat: [],
      pertanyaan: PERTANYAAN,
      success: false,
    });
  }

  const { rows: top3 } = await pool.query(`
    SELECT k.id, k.nama, k.divisi, p.total
    FROM penilaian p
    JOIN kandidat k ON k.id = p.kandidat_id
    ORDER BY p.total DESC
    LIMIT 3
  `);

  res.render("user/final_vote", {
    title: TITLE_FINAL_VOTE,
    belumBuka: false,
    sudahVote: false,
    kandidat: top3,
    pertanyaan: PERTANYAAN,
    success: req.query.success === "1",
  });
});

router.post("/final-vote", requireRole("user"), async (req, res) => {
  const sesi = await getSesiAktif();
  if (!sesi) return res.redirect("/final-vote");

  const { rows: cekVote } = await pool.query(
    "SELECT id FROM final_vote WHERE user_id = $1 AND sesi_id = $2 LIMIT 1",
    [req.user.id, sesi.id]
  );
  if (cekVote.length > 0) return res.redirect("/final-vote");

  // req.body.kandidat = array of { id, jawaban1..10 } (index via loop position, id explicit)
  const raw = req.body.kandidat || {};
  const rows = Array.isArray(raw) ? raw : Object.values(raw);

  for (const row of rows) {
    const kandidatId = parseInt(row.id, 10);
    const jawaban = [];
    let total = 0;
    for (let i = 1; i <= 10; i++) {
      const v = parseInt(row[`jawaban${i}`], 10) || 0;
      jawaban.push(v);
      total += v;
    }

    await pool.query(
      `INSERT INTO final_vote
        (user_id, kandidat_id, sesi_id, total_nilai,
         jawaban1, jawaban2, jawaban3, jawaban4, jawaban5,
         jawaban6, jawaban7, jawaban8, jawaban9, jawaban10)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
      [req.user.id, kandidatId, sesi.id, total, ...jawaban]
    );
  }

  res.redirect("/final-vote?success=1");
});

router.get("/pengaturan", requireRole("user"), async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
    req.user.id,
  ]);
  res.render("user/pengaturan", {
    title: TITLE_PENGATURAN,
    user: rows[0],
    error: null,
    success: false,
  });
});

router.post("/pengaturan", requireRole("user"), async (req, res) => {
  const { username, password_lama, password_baru, konfirmasi } = req.body;
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
    req.user.id,
  ]);
  const user = rows[0];

  const cocok = await bcrypt.compare(password_lama, user.password);
  if (!cocok) {
    return res.render("user/pengaturan", {
      title: TITLE_PENGATURAN,
      user,
      error: "Password lama salah!",
      success: false,
    });
  }

  if (password_baru && password_baru !== konfirmasi) {
    return res.render("user/pengaturan", {
      title: TITLE_PENGATURAN,
      user,
      error: "Konfirmasi password tidak cocok!",
      success: false,
    });
  }

  if (password_baru) {
    const hash = await bcrypt.hash(password_baru, 10);
    await pool.query(
      "UPDATE users SET username = $1, password = $2 WHERE id = $3",
      [username, hash, req.user.id]
    );
  } else {
    await pool.query("UPDATE users SET username = $1 WHERE id = $2", [
      username,
      req.user.id,
    ]);
  }

  const { rows: updated } = await pool.query(
    "SELECT * FROM users WHERE id = $1",
    [req.user.id]
  );
  issueToken(res, updated[0]);

  res.render("user/pengaturan", {
    title: TITLE_PENGATURAN,
    user: updated[0],
    error: null,
    success: true,
  });
});

module.exports = router;
