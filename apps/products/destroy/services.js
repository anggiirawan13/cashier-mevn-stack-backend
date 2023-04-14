import ProductModels from "../models.js";

const destroy = async (req, res) => {
  try {
    if (!req.params.id) throw { code: 428, message: "PARAMS_ID_IS_REQUIRED" };

    const resultCategory = await ProductModels.findByIdAndDelete(req.params.id);
    if (!resultCategory) throw { code: 500, message: "PRODUCT_DELETE_FAILED" };

    return res.status(200).json({
      status: true,
      message: "PRODUCT_DELETE_SUCCESS",
      user: resultCategory,
    });
  } catch (err) {
    if (!err.code) err.code = 500;

    return res.status(err.code).json({
      status: false,
      message: err.message,
    });
  }
};

export default destroy;
