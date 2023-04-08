import { generateAccessToken, generateRefreshToken } from "../../../lib/generateToken.js";
import UserModels from "../../Users/models.js";
import bcrypt from "bcrypt";

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


        const resultUser = await UserModels.findOne({ email: String(req.body.email) });

        if (!resultUser) {
            throw {
                code: 403,
                message: "EMAIL_NOT_FOUND",
            };
        }

        const passwordIsMatch = bcrypt.compareSync(
            String(req.body.password),
            String(resultUser.password)
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

export default login;
