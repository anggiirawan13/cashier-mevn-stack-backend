import express from "express";
import cors from "cors";
import connection from "./database/connection.js";
import indexRouter from "./routes/index.js";
import UserModels from "./apps/users/models.js";
import bcrypt from 'bcrypt'

let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    cors({
        origin: "http://localhost:8000",
    })
);

app.use("/", indexRouter);

// connect to mongodb
const env = connection();

app.listen(env.SERVER_PORT, () => {
    console.log(`Server is running on port ${env.SERVER_PORT}`);
});

const init = async () => {
    let users = await UserModels.count()
    if (users < 1) {
        let passSalt = await bcrypt.genSalt(10);
        let passHash = await bcrypt.hash(env.INIT_PASSWORD_ADMIN, passSalt);
        let initUser = new UserModels({
            fullname: env.INIT_FULLNAME_ADMIN,
            email: env.INIT_EMAIL_ADMIN,
            role: 'admin',
            status: 'active',
            password: passHash
        });
        initUser.save();
    }
}

init();

export default app;