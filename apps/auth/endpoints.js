import express from "express";
import register from "./register/services.js";
import login from "./login/services.js";
import refreshToken from "./refreshToken/services.js";

let router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);

export default router;
