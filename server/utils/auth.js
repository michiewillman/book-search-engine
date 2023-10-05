const jwt = require("jsonwebtoken");
// Adds layer of protection to token
const secret = process.env.TOKEN_SECRET;
// Token duration before it expires
const expiration = "2h";

module.exports = {
  // Authentication
  authMiddleware: function (req, res, next) {
    // Send token information through these routes
    let token = req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    if (!token) {
      return res.status(400).json({ message: "You have no token!" });
    }

    // Verification of token
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      // Set verified data to context.user
      req.user = data;
    } catch {
      return res.status(400).json({ message: "Token is invalid." });
    }

    return req;
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
