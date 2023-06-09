import mongoose from "mongoose";
import ProductModels from "../models.js";
import CategoryModels from "../../categories/models.js";

const store = async (req, res) => {
  try {
    validateFieldsRequired(req.body);

    const productExist = await ProductModels.findOne({
      title: String(req.body.title),
    });
    if (productExist) throw { code: 428, message: "PRODUCT_IS_EXIST" };

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
    const newProduct = new ProductModels({
      title: String(req.body.title),
      thumbnail: String(req.body.thumbnail),
      price: String(req.body.price),
      category_id: String(req.body.categoryId),
      created_at: dateNow,
      updated_at: dateNow,
    });

    const resultProduct = await newProduct.save();
    if (!resultProduct) throw { code: 500, message: "STORE_PRODUCT_FAILED" };

    return res.status(200).json({
      status: true,
      message: "STORE_PRODUCT_SUCCESS",
      product: resultProduct,
    });
  } catch (err) {
    if (!err.code) err.code = 500;

    return res.status(err.code).json({
      status: false,
      message: err.message,
    });
  }
};

const validateFieldsRequired = (data) => {
  if (!data.title) throw { code: 428, message: "TITLE_IS_REQUIRED" };

  if (!data.thumbnail) throw { code: 428, message: "THUMBNAIL_IS_REQUIRED" };

  if (!data.price) throw { code: 428, message: "PRICE_IS_REQUIRED" };

  if (!data.categoryId) throw { code: 428, message: "CATEGORY_ID_IS_REQUIRED" };
};

export default store;
