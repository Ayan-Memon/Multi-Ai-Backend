import express from "express";
import { PORT } from "./src/config/config.js";
import connectDB from "./src/config/db.js";
import { errorMiddleware } from "../../common/middlewares/error.middleware.js";

const app = express();
app.use(express.json());

const port = PORT || 5002;

// chat router import

import ChatRouter from "./src/routes/chat.route.js";
import { serviceAuth } from "../../common/middlewares/serviceAuth.middleware.js";
import { asyncHandler } from "../../common/utils/asyncHandler.utility.js";
app.use("/", serviceAuth, asyncHandler(ChatRouter));

connectDB();

app.listen(port, () => {
  console.log(`Chat Service running on port ${port}`);
});

app.use(errorMiddleware);
