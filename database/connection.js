import mongoose from "mongoose";
import dotenv from "dotenv";

const ENV = dotenv.config().parsed;

const connection = () => {
  mongoose.connect(
    `${ENV.MONGODB_URI}${ENV.MONGODB_HOST}:${ENV.MONGODB_PORT}`,
    {
      // auth: {authsource: ENV.MONGODB_AUTH_SOURCE}, // for mongodb with password
      dbName: ENV.MONGODB_DB_NAME,
    }
  );

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function () {
    console.log("Connected to MongoDB!");
  });

  return ENV;
};

export default connection;
