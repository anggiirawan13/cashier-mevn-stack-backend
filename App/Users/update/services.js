import UserModels from '../models.js';
import bcrypt from "bcrypt";
import { isEmailExistWithUserID } from '../../../lib/isEmailExist.js';

const update = async (req, res) => {
    try {
        if (!req.params.id) {
            throw {
                code: 428,
                message: 'PARAMS_ID_IS_REQUIRED',
            }
        }

        if (!req.body.email) {
            throw {
                code: 428,
                message: "EMAIL_IS_REQUIRED",
            };
        }

        const emailExist = await isEmailExistWithUserID(req.params.id, req.body.email);
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

        if (req.body.password !== req.body.retype_password) {
            throw {
                code: 428,
                message: "PASSWORD_NOT_MATCH",
            };
        }

        let fields = {
            fullname: req.body.fullname,
            email: req.body.email,
            role: req.body.role,
            status: req.body.status,
            updated_at: new Date().getTime(),
        }

        if (req.body.password) {
            let passSalt = await bcrypt.genSalt(10);
            let passHash = await bcrypt.hash(req.body.password, passSalt);
            fields.password = passHash
        }

        const resultUser = await UserModels.findByIdAndUpdate(req.params.id, fields, { new: true });

        if (!resultUser) {
            throw {
                code: 500,
                message: "USER_UPDATE_FAILED",
            };
        }

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

export default update;