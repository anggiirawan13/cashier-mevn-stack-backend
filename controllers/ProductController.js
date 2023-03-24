import product from '../models/Product.js';
import category from '../models/Category.js';
import mongoose from 'mongoose';

const index = async (_, res) => {
    try {
        const products = await product.find({status: 'active'});
    
        if (!products) {
            throw {
                code: 500,
                message: "Get products failed",
            }
        }

        return res.status(200).json({
            status: true,
            total: products.length,
            products,
        })
    } catch (err) {
        return res.status(err.code).json({
            status: false,
            message: err.message,
        })
    }
}

const store = async (req, res) => {
    try {
        if (!req.body.title) {
            throw {
                code: 428,
                message: "Title is required!",
            }
        }
        
        if (!req.body.thumbnail) {
            throw {
                code: 428,
                message: "Thumbnail is required!",
            }
        }

        if (!req.body.price) {
            throw {
                code: 428,
                message: "Price is required!",
            }
        }

        if (!req.body.categoryId) {
            throw {
                code: 428,
                message: "Category ID is required!",
            }
        }

        const productExist = await product.findOne({title: req.body.title});
        if (productExist) {throw {
                code: 428,
                message: "Product is exist!",
            }
        }

        if (!mongoose.Types.ObjectId.isValid(req.body.categoryId)) {
            throw {
                code: 500,
                message: "CategoryId invalid!",
            }
        }

        const categoryExist = await category.findOne({_id: req.body.categoryId});
        if (!categoryExist) {
            throw {
                code: 428,
                message: "Category is not exist!",
            }
        }

        const title = req.body.title;
        const thumbnail = req.body.thumbnail;
        const price = req.body.price;
        const categoryId = req.body.categoryId;

        const newProduct = new product({
            title,
            thumbnail,
            price,
            categoryId,
        })

        const Product = await newProduct.save();

        if (!Product) {
            throw {
                code: 500,
                message: "Store product failed!",
            }
        }

        return res.status(200).json({
            status: true,
            product: Product,
        })
    } catch (err) {
        if (!err.code) {
            err.code = 500;
        }

        return res.status(err.code).json({
            status: false,
            message: err.message,
        })
    }
}

export {index, store};