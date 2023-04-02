import UserModels from "../Users/models.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { isEmailExist } from "../../lib/isEmailExist.js";

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

const register = async (req, res) => {
    try {
        if (!req.body.email) {
            throw {
                code: 428,
                message: "EMAIL_IS_REQUIRED",
            };
        }

        const emailExist = await isEmailExist(req.body.email);
        if (emailExist) {
            throw {
                code: 409,
                message: "EMAIL_IS_EXIST",
            };
        }

        if (!req.body.fullname) {
            throw {
                code: 428,
                message: "FULLNAME_IS_REQUIRED",
            };
        }

        if (!req.body.password) {
            throw {
                code: 428,
                message: "PASSWORD_IS_REQUIRED",
            };
        }

        if (req.body.password !== req.body.retype_password) {
            throw {
                code: 428,
                message: "PASSWORD_NOT_MATCH",
            };
        }

        let passSalt = await bcrypt.genSalt(10);
        let passHash = await bcrypt.hash(req.body.password, passSalt);

        const newUser = new UserModels({
            fullname: req.body.fullname.toUpperCase(),
            email: req.body.email,
            password: passHash,
        });

        const resultUser = await newUser.save();

        if (!resultUser) {
            throw {
                code: 500,
                message: "USER_REGISTER_FAILED",
            };
        }

        return res.status(200).json({
            status: true,
            message: "USER_REGISTER_SUCCESS",
            user: resultUser,
        });
    } catch (err) {
        if (!err.code) {
            err.code = 500;
        }

        return res.status(err.code).json({
            status: false,
            message: err.message,
        });
    }
};

const login = async (req, res) => {
    try {
        if (!req.body.email) {
            throw {
                code: 428,
                message: "EMAIL_IS_REQUIRED",
            };
        }

        if (!req.body.password) {
            throw {
                code: 428,
                message: "PASSWORD_IS_REQUIRED",
            };
        }

        const resultUser = await UserModels.findOne({ email: req.body.email });

        if (!resultUser) {
            throw {
                code: 403,
                message: "EMAIL_NOT_FOUND",
            };
        }

        const passwordIsMatch = bcrypt.compareSync(
            req.body.password,
            resultUser.password
        );

        if (!passwordIsMatch) {
            throw {
                code: 403,
                message: "WRONG_PASSWORD",
            };
        }

        const payload = { id: resultUser._id, role: resultUser.role };
        const accessToken = await generateAccessToken(payload);
        const refreshToken = await generateRefreshToken(payload);

        return res.status(200).json({
            status: true,
            message: "LOGIN_SUCCESS",
            access_token: accessToken,
            refresh_token: refreshToken,
            fullname: resultUser.fullname,
        });
    } catch (err) {
        if (!err.code) {
            err.code = 500;
        }

        return res.status(err.code).json({
            status: false,
            message: err.message,
        });
    }
};

const refreshToken = async (req, res) => {
    try {
        if (!req.body.refreshToken) {
            throw {
                code: 428,
                message: "REFRESH_TOKEN_IS_REQUIRED",
            };
        }

        const verify = jsonwebtoken.verify(
            req.body.refreshToken,
            env.JWT_REFRESH_TOKEN_SECRET
        );

        const payload = { id: verify.id, role: verify.role };
        const accessToken = await generateAccessToken(payload);
        const refreshToken = await generateRefreshToken(payload);

        return res.status(200).json({
            status: true,
            message: "REFRESH_TOKEN_SUCCESS",
            access_token: accessToken,
            refresh_token: refreshToken,
        });
    } catch (err) {
        if (!err.code) {
            err.code = 500
        }

        if (err.message === 'jwt expired') {
            err.message = 'REFRESH_TOKEN_EXPIRED'
        } else {
            err.message = 'REFRESH_TOKEN_INVALID'
        }

        return res.status(err.code).json({
            status: false,
            message: err.message,
        });
    }
};

export { register, login, refreshToken };
