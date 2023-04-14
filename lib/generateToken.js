import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

const ENV = dotenv.config().parsed;

const generateAccessToken = async (payload) => {
  return jsonwebtoken.sign(payload, ENV.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: ENV.JWT_ACCESS_TOKEN_LIFE,
  });
};

const generateRefreshToken = async (payload) => {
  return jsonwebtoken.sign(payload, ENV.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: ENV.JWT_REFRESH_TOKEN_LIFE,
  });
};

export { generateAccessToken, generateRefreshToken };
