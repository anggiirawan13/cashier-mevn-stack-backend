import express from "express";
import cors from "cors";
import connection from "./connection.js";
import indexRouter from "./routes/index.js";

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    cors({
        origin: "http://localhost:9999",
    })
);

app.use("/", indexRouter);

// connect to mongodb
const env = connection();

app.listen(env.APP_PORT, () => {
    console.log(`Server is running on port ${env.APP_PORT}`);
});
