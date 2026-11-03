import express from "express";
import { PORT } from "./src/config/config.js";
import connectDB from "./src/config/db.js";
import { login } from "./src/controllers/auth.controller.js";
import { errorMiddleware } from "../../common/middlewares/error.middleware.js";

const app = express();
app.use(express.json());

const port = PORT || 5001;

app.post("/login", login);

connectDB();

app.listen(port, () => {
  console.log(`Auth Service running on port ${port}`);
});

app.use(errorMiddleware);
