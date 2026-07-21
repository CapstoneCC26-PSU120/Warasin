const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

function issueToken(res, user) {
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
      divisi: user.divisi,
    },
    SECRET,
    { expiresIn: "8h" }
  );
  res.cookie("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 8 * 60 * 60 * 1000,
  });
}

function currentUser(req) {
  const token = req.cookies && req.cookies.session;
  if (!token) return null;
  try {
    return jwt.verify(token, SECRET);
  } catch (e) {
    return null;
  }
}

function attachUser(req, res, next) {
  req.user = currentUser(req);
  res.locals.user = req.user;
  next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.redirect("/");
    }
    next();
  };
}

function clearToken(res) {
  res.clearCookie("session");
}

module.exports = { issueToken, currentUser, attachUser, requireRole, clearToken };
