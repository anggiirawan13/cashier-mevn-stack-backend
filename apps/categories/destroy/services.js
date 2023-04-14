import CategoryModels from "../models.js";

const destroy = async (req, res) => {
  try {
    if (!req.params.id) throw { code: 428, message: "PARAMS_ID_IS_REQUIRED" };

    const resultCategory = await CategoryModels.findByIdAndDelete(
      req.params.id
    );
    if (!resultCategory) throw { code: 500, message: "CATEGORY_DELETE_FAILED" };

    return res.status(200).json({
      status: true,
      message: "CATEGORY_DELETE_SUCCESS",
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
