import mongoose from "mongoose";
import { MONGO_URI } from "./config.js";

import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

export default async function connectDB() {
  try {
    await mongoose.connect(`${MONGO_URI}?retryWrites=true&w=majority`);
    console.log("Database connected");
  } catch (error) {
    console.log(error);
  }
}
