import product from "./models.js";
import category from "../Categories/models.js";
import mongoose from "mongoose";

const index = async (_, res) => {
    try {
        const products = await product.find({ status: "active" });

        if (!products) {
            throw {
                code: 500,
                message: "GET_PRODUCTS_FAILED",
            };
        }

        return res.status(200).json({
            status: true,
            total: products.length,
            products,
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
                message: "CATEGORYID_IS_REQUIRED",
            };
        }

        const productExist = await product.findOne({ title: req.body.title });
        if (productExist) {
            throw {
                code: 428,
                message: "PRODUCT_IS_EXIST",
            };
        }

        if (!mongoose.Types.ObjectId.isValid(req.body.categoryId)) {
            throw {
                code: 500,
                message: "CATEGORYID_INVALID",
            };
        }

        const categoryExist = await category.findOne({
            _id: req.body.categoryId,
        });
        if (!categoryExist) {
            throw {
                code: 428,
                message: "CATEGORYID_NOT_EXIST",
            };
        }

        const newProduct = new product({
            title: req.body.title,
            thumbnail: req.body.thumbnail,
            price: req.body.price,
            categoryId: req.body.categoryId,
        });

        const Product = await newProduct.save();

        if (!Product) {
            throw {
                code: 500,
                message: "STORE_PRODUCT_FAILED",
            };
        }

        return res.status(200).json({
            status: true,
            message: "STORE_PRODUCT_SUCCESS",
            product: Product,
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

export { index, store };
