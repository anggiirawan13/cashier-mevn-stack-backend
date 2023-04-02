import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

const env = dotenv.config().parsed;

const generateAccessToken = async (payload) => {
    return jsonwebtoken.sign(payload, env.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: env.JWT_ACCESS_TOKEN_LIFE,
    });
};

const generateRefreshToken = async (payload) => {
    return jsonwebtoken.sign(payload, env.JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: env.JWT_REFRESH_TOKEN_LIFE,
    });
};

export { generateAccessToken, generateRefreshToken }