require("dotenv").config();
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");

const { attachUser } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const ketuaRoutes = require("./routes/ketua");
const userRoutes = require("./routes/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(attachUser);

app.use("/", authRoutes);
app.use("/", adminRoutes);
app.use("/", ketuaRoutes);
app.use("/", userRoutes);

app.use((req, res) => {
  res.status(404).send("Halaman tidak ditemukan");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Terjadi kesalahan pada server (500). Silakan coba lagi.");
});

module.exports = app;
