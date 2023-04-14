import express from "express";
import categories from "../apps/categories/endpoints.js";
import products from "../apps/products/endpoints.js";
import auth from "../apps/auth/endpoints.js";
import users from "../apps/users/endpoints.js";
import middleware from "../middlewares/index.js";

let router = express.Router();

router.use(middleware);

router.use("/auth", auth);
router.use("/users", users);
router.use("/products", products);
router.use("/categories", categories);

export default router;
