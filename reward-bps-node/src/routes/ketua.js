const express = require("express");
const pool = require("../db");
const { requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/voting", requireRole("ketua"), async (req, res) => {
  const { rows: cek } = await pool.query(
    "SELECT id FROM voting WHERE user_id = $1",
    [req.user.id]
  );
  const sudahVoting = cek.length > 0;

  const { rows: internal } = await pool.query(
    "SELECT id, nama, divisi FROM kandidat WHERE divisi = $1 ORDER BY nama ASC",
    [req.user.divisi]
  );
  const { rows: eksternal } = await pool.query(
    "SELECT id, nama, divisi FROM kandidat ORDER BY divisi ASC, nama ASC"
  );

  let error = null;
  if (req.query.error === "incomplete") error = "Data tidak lengkap!";
  if (req.query.error === "already") error = "Anda sudah voting!";

  res.render("ketua/voting", {
    title: "Voting Ketua",
    sudahVoting,
    internal,
    eksternal,
    error,
  });
});

router.post("/voting", requireRole("ketua"), async (req, res) => {
  const internalId = parseInt(req.body.internal, 10) || 0;
  const eksternalId = parseInt(req.body.external, 10) || 0;

  if (!internalId || !eksternalId) {
    return res.redirect("/voting?error=incomplete");
  }

  const { rows: cek } = await pool.query(
    "SELECT id FROM voting WHERE user_id = $1",
    [req.user.id]
  );
  if (cek.length > 0) {
    return res.redirect("/voting?error=already");
  }

  await pool.query(
    "INSERT INTO voting (user_id, internal_id, eksternal_id) VALUES ($1,$2,$3)",
    [req.user.id, internalId, eksternalId]
  );

  res.redirect("/voting");
});

module.exports = router;
