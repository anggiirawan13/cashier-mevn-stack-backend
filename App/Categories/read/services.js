import CategoryModels from "../models.js";

const index = async (req, res) => {
    try {
        let search = {
            status: 'active'
        }

        if (req.query.search) {
            search.title = { $regex: `^${req.query.search}`, $options: 'i' }
        }

        let options = {
            page: req.query.page || 1,
            limit: req.query.limit || 10,
        }

        const resultCategories = await CategoryModels.paginate(search, options);

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
        if (!err.code) {
            err.code = 500
        }

        return res.status(err.code).json({
            status: false,
            message: err.message,
        });
    }
};

const details = async (req, res) => {
    try {
        if (!req.params.id) {
            throw {
                code: 428,
                message: 'PARAMS_ID_IS_REQUIRED',
            }
        }

        const resultCategory = await CategoryModels.findById(req.params.id);

        if (!resultCategory) {
            throw {
                code: 404,
                message: 'CATEGORY_NOT_FOUND',
            }
        }

        return res.status(200).json({
            status: true,
            total: resultCategory.length,
            category: resultCategory
        })
    } catch (err) {
        if (!err.code) {
            err.code = 500;
        }
        
        return res.status(err.code).json({
            status: false,
            message: err.message,
        });
    }
}

export { index, details };