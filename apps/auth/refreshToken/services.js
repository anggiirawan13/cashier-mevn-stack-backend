import dotenv from "dotenv";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../lib/generateToken.js";

const ENV = dotenv.config().parsed;

const refreshToken = async (req, res) => {
  try {
    if (!req.body.refreshToken) throw { code: 428, message: "REFRESH_TOKEN_IS_REQUIRED" };

    const verify = jsonwebtoken.verify(
      String(req.body.refreshToken),
      String(ENV.JWT_REFRESH_TOKEN_SECRET)
    );

    const payload = { id: String(verify.id), role: String(verify.role) };
    const accessToken = await generateAccessToken(payload);
    const refreshToken = await generateRefreshToken(payload);

    return res.status(200).json({
      status: true,
      message: "REFRESH_TOKEN_SUCCESS",
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  } catch (err) {
    if (!err.code) err.code = 500;

    if (err.message === "jwt expired") err.message = "REFRESH_TOKEN_EXPIRED";
    else err.message = "REFRESH_TOKEN_INVALID";

    return res.status(err.code).json({
      status: false,
      message: err.message,
    });
  }
};

export default refreshToken;
