import mongoose from "mongoose";
import ProductModels from "../models.js";
import CategoryModels from "../../Categories/models.js";

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

        if (!req.body.thumbnail) {
            throw {
                code: 428,
                message: "THUMBNAIL_IS_REQUIRED",
            };
        }

        if (!req.body.price) {
            throw {
                code: 428,
                message: "PRICE_IS_REQUIRED",
            };
        }

        if (!req.body.categoryId) {
            throw {
                code: 428,
                message: "CATEGORY_ID_IS_REQUIRED",
            };
        }

        if (!mongoose.Types.ObjectId.isValid(String(req.body.categoryId))) {
            throw {
                code: 500,
                message: "CATEGORY_ID_INVALID",
            };
        }

        const categoryExist = await CategoryModels.findOne({
            _id: String(req.body.categoryId),
        });
        if (!categoryExist) {
            throw {
                code: 428,
                message: "CATEGORY_ID_NOT_EXIST",
            };
        }

        const dateNow = new Date().getTime();
        let fields = {
            title: String(req.body.title),
            thumbnail: String(req.body.thumbnail),
            price: String(req.body.price),
            category_id: String(req.body.categoryId),
            updated_at: dateNow,
        }

        const resultCategory = await ProductModels.findByIdAndUpdate({_id: String(req.params.id)}, fields, { new: true });

        if (!resultCategory) {
            throw {
                code: 500,
                message: "PRODUCT_UPDATE_FAILED",
            };
        }

        return res.status(200).json({
            status: true,
            message: "PRODUCT_UPDATE_SUCCESS",
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