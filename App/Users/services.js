import mongoose from 'mongoose';
import user from './models.js';
import bcrypt from "bcrypt";
import { isEmailExist, isEmailExistWithUserID } from '../../lib/isEmailExist.js';

const index = async (req, res) => {
    try {
        let search = {
            fullname: { $regex: `^${req.query.search}`, $options: 'i' },
            status: 'active'
        }

        let options = {
            page: req.query.page || 1,
            limit: req.query.limit || 10,
        }

        const users = await user.paginate(search, options);

        if (!users) {
            throw {
                code: 404,
                message: 'USERS_NOT_FOUND',
            }
        }

        return res.status(200).json({
            status: true,
            total: users.length,
            users,
        })
    } catch (err) {
        return res.status(err.code).json({
            status: false,
            message: err.message,
        });
    }
}

const show = async (req, res) => {
    try {
        if (!req.params.id) {
            throw {
                code: 428,
                message: 'PARAMS_ID_IS_REQUIRED',
            }
        }

        const User = await user.findById(req.params.id);

        if (!User) {
            throw {
                code: 404,
                message: 'USER_NOT_FOUND',
            }
        }

        return res.status(200).json({
            status: true,
            total: User.length,
            user: User
        })
    } catch (err) {
        return res.status(err.code).json({
            status: false,
            message: err.message,
        });
    }
}

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

        const newUser = new user({
            fullname: req.body.fullname.toUpperCase(),
            email: req.body.email,
            password: passHash,
            role: req.body.role,
        });

        const User = await newUser.save();

        if (!User) {
            throw {
                code: 500,
                message: "USER_UPDATE_FAILED",
            };
        }

        return res.status(200).json({
            status: true,
            message: "USER_UPDATE_SUCCESS",
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
        }

        if (req.body.password) {
            let passSalt = await bcrypt.genSalt(10);
            let passHash = await bcrypt.hash(req.body.password, passSalt);
            fields.password = passHash
        }

        const User = await user.findByIdAndUpdate(req.params.id, fields, { new: true });

        if (!User) {
            throw {
                code: 500,
                message: "USER_UPDATE_FAILED",
            };
        }

        return res.status(200).json({
            status: true,
            message: "USER_UPDATE_SUCCESS",
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

const destroy = async (req, res) => {
    try {
        if (!req.params.id) {
            throw {
                code: 428,
                message: 'PARAMS_ID_IS_REQUIRED',
            }
        }

        const User = await user.findByIdAndDelete(req.params.id)

        if (!User) {
            throw {
                code: 500,
                message: "USER_DELETE_FAILED",
            };
        }

        return res.status(200).json({
            status: true,
            message: "USER_DELETE_SUCCESS",
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

export { index, show, store, update, destroy };