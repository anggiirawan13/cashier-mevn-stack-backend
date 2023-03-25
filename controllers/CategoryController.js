import category from "../models/Category.js";

const index = async (_, res) => {
    try {
        const categories = await category.find({ status: "active" });

        if (!categories) {
            throw {
                code: 500,
                message: "GET_CATEGORIES_FAILED",
            };
        }

        return res.status(200).json({
            status: true,
            total: categories.length,
            categories,
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

        const newCategory = new category({
            title: req.body.title,
        });

        const Category = await newCategory.save();

        if (!Category) {
            throw {
                code: 500,
                message: "STORE_CATEGORY_FAILED",
            };
        }

        return res.status(200).json({
            status: true,
            message: "STORE_CATEGORY_SUCCESS",
            category: Category,
        });
    } catch (err) {
        return res.status(err.code).json({
            status: false,
            message: err.message,
        });
    }
};

export { index, store };
