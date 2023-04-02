import express from "express";
import jwtAuth from "../../middlewares/jwtAuth.js";
import roleAuth from "../../middlewares/roleAuth.js";
import { index, details } from "./read/services.js";
import store from "./store/services.js";
import update from "./update/services.js";
import destroy from "./destroy/services.js";

let router = express.Router();

router.get("/", [jwtAuth(), roleAuth(['admin', 'cashier'])], index);
router.get("/:id", [jwtAuth(), roleAuth(['admin'])], details);
router.post("/", [jwtAuth(), roleAuth(['admin'])], store);
router.put("/:id", [jwtAuth(), roleAuth(['admin'])], update);
router.delete("/:id", [jwtAuth(), roleAuth(['admin'])], destroy);

export default router;
