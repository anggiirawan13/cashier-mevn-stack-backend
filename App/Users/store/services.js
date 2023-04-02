import { isEmailExist } from '../../../lib/isEmailExist.js';
import activity from '../../../lib/logActivity/logActivity.js'
import UserModels from '../models.js';
import bcrypt from "bcrypt";

const store = async (req, res) => {
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

        const dateNow = new Date().getTime();
        const newUser = new UserModels({
            fullname: req.body.fullname.toUpperCase(),
            email: req.body.email,
            password: passHash,
            role: req.body.role,
            created_at: dateNow,
            updated_at: dateNow,
        });

        const resultUser = await newUser.save();

        if (!resultUser) {
            throw {
                code: 500,
                message: "USER_UPDATE_FAILED",
            };
        }
        
        activity(req.jwt.id, 'User Management>Add', 'Add New User');

        return res.status(200).json({
            status: true,
            message: "USER_UPDATE_SUCCESS",
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

export default store;