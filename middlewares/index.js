import express from "express";
import handleHacking from "./hacking.js";
import jwtAuth from "./jwtAuth.js";
import roleAuth from "./roleAuth.js";

const app = express();

app.use(handleHacking);
app.use(jwtAuth);
app.use(roleAuth);

export default app;
