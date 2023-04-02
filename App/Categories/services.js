import CategoryModels from "./models.js";

const index = async (_, res) => {
    try {
        const resultCategories = await CategoryModels.find({ status: "active" });

        if (!resultCategories) {
            throw {
                code: 500,
                message: "GET_CATEGORIES_FAILED",
            };
        }

        return res.status(200).json({
            status: true,
            total: resultCategories.length,
            categories: resultCategories,
        });
    } catch (err) {
        return res.status(err.code).json({
            status: false,
            message: err.message,
        });
    }
};

const store = async (req, res) => {
    try {
        if (!req.body.title) {
            throw {
                code: 428,
                message: "TITLE_IS_REQUIRED",
            };
        }

        const newCategory = new CategoryModels({
            title: req.body.title,
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

export { index, store };
