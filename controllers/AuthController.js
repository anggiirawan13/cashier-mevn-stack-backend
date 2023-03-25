import user from "../models/user.js";
import bcrypt from "bcrypt";

const register = async (req, res) => {
    try {
        if (!req.body.fullname) {
            throw {
                code: 428,
                message: "FULLNAME_IS_REQUIRED",
            };
        }

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

        if (req.body.password !== req.body.retype_password) {
            throw {
                code: 428,
                message: "PASSWORD_MUST_MATCH",
            };
        }

        const emailExist = await user.findOne({ email: req.body.email });

        if (emailExist) {
            throw {
                code: 409,
                message: "EMAIL_IS_EXIST",
            };
        }

        let passSalt = await bcrypt.genSalt(10);
        let passHash = await bcrypt.hash(req.body.password, passSalt);

        const newUser = new user({
            fullname: req.body.fullname,
            email: req.body.email,
            password: passHash,
            role: req.body.role,
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
                code: 409,
                message: "EMAIL_NOT_FOUND",
            };
        }

        const passwordIsMatch = bcrypt.compareSync(
            req.body.password,
            User.password
        );

        if (!passwordIsMatch) {
            throw {
                code: 428,
                message: "PASSWORD_IS_WRONG",
            };
        }

        return res.status(200).json({
            status: true,
            message: "LOGIN_SUCCESS",
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

export { register, login };
