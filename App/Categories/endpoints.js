import express from "express";
import { index, store } from "./services";

var router = express.Router();

router.get("/", index);
router.post("/", store);

export default router;
