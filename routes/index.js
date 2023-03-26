import express from "express";
import categories from "../App/Categories/endpoints.js";
import products from "../App/Products/endpoints.js";
import auth from "../App/Auth/endpoints.js";

var router = express.Router();

router.use("/auth", auth);
router.use("/products", products);
router.use("/categories", categories);

export default router;
