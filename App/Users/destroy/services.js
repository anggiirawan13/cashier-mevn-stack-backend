import UserModels from '../models.js';

const destroy = async (req, res) => {
    try {
        if (!req.params.id) {
            throw {
                code: 428,
                message: 'PARAMS_ID_IS_REQUIRED',
            }
        }

        const resultUser = await UserModels.findByIdAndDelete(req.params.id)

        if (!resultUser) {
            throw {
                code: 500,
                message: "USER_DELETE_FAILED",
            };
        }

        return res.status(200).json({
            status: true,
            message: "USER_DELETE_SUCCESS",
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

export default destroy;