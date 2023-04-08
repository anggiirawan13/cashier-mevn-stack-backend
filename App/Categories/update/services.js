import CategoryModels from "../models.js";

const update = async (req, res) => {
    try {
        if (!req.params.id) {
            throw {
                code: 428,
                message: 'PARAMS_ID_IS_REQUIRED',
            }
        }

        if (!req.body.title) {
            throw {
                code: 428,
                message: "TITLE_IS_REQUIRED",
            };
        }

        let fields = {
            title: String(req.body.title),
            status: String(req.body.status),
            updated_at: new Date().getTime(),
        }

        const resultCategory = await CategoryModels.findByIdAndUpdate({_id: String(req.params.id)}, fields, { new: true });

        if (!resultCategory) {
            throw {
                code: 500,
                message: "CATEGORY_UPDATE_FAILED",
            };
        }

        return res.status(200).json({
            status: true,
            message: "CATEGORY_UPDATE_SUCCESS",
            category: resultCategory,
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