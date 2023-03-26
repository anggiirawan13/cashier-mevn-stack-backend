import mongoose from "mongoose";
import dotenv from "dotenv";

const env = dotenv.config().parsed;

const connection = () => {
    mongoose.connect(
        `${env.MONGODB_URI}${env.MONGODB_HOST}:${env.MONGODB_PORT}`,
        {
            // auth: {authsource: env.MONGODB_AUTH_SOURCE}, // for mongodb with password
            dbName: env.MONGODB_DB_NAME,
        }
    );

    const db = mongoose.connection;

    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function () {
        console.log("Connected to MongoDB!");
    });

    return env;
};

export default connection;
