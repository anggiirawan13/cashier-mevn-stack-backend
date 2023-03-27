import user from "./models.js";
import bcrypt from "bcrypt";
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

const isEmailExist = async (email) => {
    const User = await user.findOne({ email });

    if (!User) {
        return false;
    }

    return true;
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

        const newUser = new user({
            fullname: req.body.fullname,
            email: req.body.email,
            password: passHash,
        });

        const User = await newUser.save();

        if (!User) {
            throw {
                code: 500,
                message: "USER_REGISTER_FAILED",
            };
        }

        return res.status(200).json({
            status: true,
            message: "USER_REGISTER_SUCCESS",
            user: User,
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

        const User = await user.findOne({ email: req.body.email });

        if (!User) {
            throw {
                code: 403,
                message: "EMAIL_NOT_FOUND",
            };
        }

        const passwordIsMatch = bcrypt.compareSync(
            req.body.password,
            User.password
        );

        if (!passwordIsMatch) {
            throw {
                code: 403,
                message: "WRONG_PASSWORD",
            };
        }

        const payload = { id: User._id, role: User.role };
        const accessToken = await generateAccessToken(payload);
        const refreshToken = await generateRefreshToken(payload);

        return res.status(200).json({
            status: true,
            message: "LOGIN_SUCCESS",
            access_token: accessToken,
            refresh_token: refreshToken,
            fullname: User.fullname,
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

        const verify = await jsonwebtoken.verify(
            req.body.refreshToken,
            env.JWT_REFRESH_TOKEN_SECRET
        );

        if (!verify) {
            throw {
                code: 401,
                message: "REFRESH_TOKEN_INVALID",
            };
        }

        const payload = { id: verify.id, role: verify.role };
        const accessToken = await generateAccessToken(payload);
        const refreshToken = await generateRefreshToken(payload);

        return res.status(200).json({
            status: true,
            message: "REFRESH_TOKEN_SUCCESS",
            accessToken,
            refreshToken,
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

export { register, login, refreshToken };
