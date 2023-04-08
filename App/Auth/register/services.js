import UserModels from "../../Users/models.js";
import bcrypt from "bcrypt";
import { isEmailExist } from "../../../lib/isEmailExist.js";

const register = async (req, res) => {
    try {
        if (req.body.email) {
            throw {
                code: 428,
                message: "EMAIL_IS_REQUIRED",
            };
        }

        const emailExist = await isEmailExist(String(req.body.email));
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

        if (String(req.body.password) !== String(req.body.retype_password)) {
            throw {
                code: 428,
                message: "PASSWORD_NOT_MATCH",
            };
        }

        let passSalt = await bcrypt.genSalt(10);
        let passHash = await bcrypt.hash(String(req.body.password), String(passSalt));

        const dateNow = new Date().getTime();
        const newUser = new UserModels({
            fullname: String(req.body.fullname).toUpperCase(),
            email: String(req.body.email),
            password: String(passHash),
            created_at: dateNow,
            updated_at: dateNow,
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

export default register;
