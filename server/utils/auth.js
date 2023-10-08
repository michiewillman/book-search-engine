const jwt = require("jsonwebtoken");
require("dotenv").config();
// Adds a layer of protection to the token
const secret = process.env.REACT_APP_TOKEN_SECRET;
// Token duration before it expires
const expiration = "2h";

module.exports = {
  // Authentication
  authMiddleware: function ({ req }) {
    // Send token information through these routes
    let token = req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    if (!token) {
      return req;
    }

    // Verification of token
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log("Invalid token");
    }

    return req;
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
