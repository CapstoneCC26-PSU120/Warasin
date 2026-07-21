const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../db");
const { issueToken, clearToken } = require("../middleware/auth");

const router = express.Router();

function homeForRole(role) {
  if (role === "admin") return "/penilaian";
  if (role === "ketua") return "/voting";
  return "/dashboard";
}

const TITLE = "Login - Reward System";

router.get("/", (req, res) => {
  if (req.user) return res.redirect(homeForRole(req.user.role));
  res.render("login", { title: TITLE, error: null });
});

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  try {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    const crypto = require("crypto");
    const user = rows[0];
    let valid = false;

    if (user) {
      if (!user.password.startsWith("$2")) {
        // Legacy MD5 password check
        const md5hash = crypto.createHash('md5').update(password).digest('hex');
        if (md5hash === user.password) {
          valid = true;
          // Transparently upgrade to bcrypt
          const newHash = await bcrypt.hash(password, 10);
          await pool.query("UPDATE users SET password = $1 WHERE id = $2", [newHash, user.id]);
        }
      } else {
        valid = await bcrypt.compare(password, user.password);
      }
    }

    if (!valid) {
      return res.render("login", { title: TITLE, error: "Username atau password salah!" });
    }

    issueToken(res, user);
    res.redirect(homeForRole(user.role));
  } catch (err) {
    console.error(err);
    res.render("login", { title: TITLE, error: "Terjadi kesalahan, coba lagi." });
  }
});

router.get("/logout", (req, res) => {
  clearToken(res);
  res.redirect("/");
});

module.exports = router;
