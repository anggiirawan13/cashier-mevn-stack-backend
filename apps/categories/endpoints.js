import express from "express";
import store from "./store/services.js";
import { index, details } from "./read/services.js";
import update from "./update/services.js";
import destroy from "./destroy/services.js";

let router = express.Router();

router.post("/", store);
router.get("/", index);
router.get("/:id", details);
router.put("/:id", update);
router.delete("/:id", destroy);

export default router;
