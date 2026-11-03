import dotenv from "dotenv";

dotenv.config();

if (!process.env.PORT) {
  throw new Error("PORT is not defined");
}

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined");
}

export const { PORT, MONGO_URI } = process.env;
