import express from "express";
import { register } from "../controllers/AuthController.js";

var router = express.Router();

router.post("/register", register);

export default router;
