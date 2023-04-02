import express from "express";
import { index, store } from "./services.js";
import jwtAuth from "../../middlewares/jwtAuth.js";
import roleAuth from "../../middlewares/roleAuth.js";

var router = express.Router();

router.get("/", [jwtAuth(), roleAuth(['admin', 'cashier'])], index);
router.post("/", [jwtAuth(), roleAuth(['admin', 'cashier'])], store);

export default router;
