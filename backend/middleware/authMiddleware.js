import jwt from "jsonwebtoken";
import { CognitoJwtVerifier } from "aws-jwt-verify";

/**
 * Dynamically verifies both Access and ID tokens from AWS Cognito.
 * Safely handles malformed, missing, and expired tokens.
 */

export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization header missing or malformed" });
    }

    const token = authHeader.split(" ")[1];

    // Decode first to identify token type (id or access)
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || !decoded.payload) {
      return res.status(400).json({ message: "Invalid token format" });
    }

    const tokenUse = decoded.payload.token_use;
    if (!["id", "access"].includes(tokenUse)) {
      return res.status(400).json({ message: "Unsupported token type" });
    }

    // Create a verifier based on the token type
    const verifier = CognitoJwtVerifier.create({
      userPoolId: process.env.COGNITO_USER_POOL_ID,
      clientId: process.env.COGNITO_CLIENT_ID,
      tokenUse, // can be "access" or "id"
    });

    // Verify token signature and claims
    const payload = await verifier.verify(token);

    // Attach verified user payload to request object
    req.user = payload;

    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(403).json({ message: "Unauthorized or invalid token" });
  }
};
