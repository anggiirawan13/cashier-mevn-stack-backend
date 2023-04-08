import express from "express";
import register from "./register/services.js";
import login from "./login/services.js";
import refreshToken from "./refreshToken/services.js";
import handleHacking from "../../middlewares/hacking.js";

let router = express.Router();

router.post("/register", handleHacking(),register);
router.post("/login", handleHacking(),login);
router.post("/refresh-token", handleHacking(),refreshToken);

export default router;
