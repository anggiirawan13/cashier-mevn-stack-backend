import CategoryModels from "../models.js";

const store = async (req, res) => {
    try {
        if (!req.body.title) {
            throw {
                code: 428,
                message: "TITLE_IS_REQUIRED",
            };
        }

        const dateNow = new Date().getTime();
        const newCategory = new CategoryModels({
            title: String(req.body.title),
            created_at: dateNow,
            updated_at: dateNow,
        });

        const resultCategory = await newCategory.save();

        if (!resultCategory) {
            throw {
                code: 500,
                message: "STORE_CATEGORY_FAILED",
            };
        }

        return res.status(200).json({
            status: true,
            message: "STORE_CATEGORY_SUCCESS",
            category: resultCategory,
        });
    } catch (err) {
        return res.status(err.code).json({
            status: false,
            message: err.message,
        });
    }
};

export default store;
