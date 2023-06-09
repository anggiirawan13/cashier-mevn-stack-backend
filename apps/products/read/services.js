import ProductModels from "../models.js";

const index = async (req, res) => {
  try {
    let search = { status: "active" };

    if (req.query.search) search.title = { $regex: `^${req.query.search}`, $options: "i" };

    let options = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
      populate: "category_id",
    };

    const resultProducts = await ProductModels.paginate(search, options);
    if (!resultProducts) throw { code: 500, message: "GET_PRODUCTS_FAILED" };

    return res.status(200).json({
      status: true,
      total: resultProducts.length,
      products: resultProducts,
    });
  } catch (err) {
    if (!err.code) err.code = 500;

    return res.status(err.code).json({
      status: false,
      message: err.message,
    });
  }
};

const details = async (req, res) => {
  try {
    if (!req.params.id) throw { code: 428, message: "PARAMS_ID_IS_REQUIRED" };

    const resultProduct = await ProductModels.findById(req.params.id).populate(
      "category_id"
    );

    if (!resultProduct) throw { code: 404, message: "PRODUCT_NOT_FOUND" };

    return res.status(200).json({
      status: true,
      total: resultProduct.length,
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

export { index, details };
