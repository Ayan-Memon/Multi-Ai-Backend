import express from "express";
import { PORT } from "./src/config/config.js";
import { agent } from "./src/controller/agent.controller.js";
import { serviceAuth } from "../../common/middlewares/serviceAuth.middleware.js";
import { errorMiddleware } from "../../common/middlewares/error.middleware.js";
import { upload } from "./src/config/multer.js";

const app = express();
app.use(express.json());

const port = PORT || 5003;

app.use(
  "/chat",
  serviceAuth,
  upload.single("file"),
  (req, res, next) => {
    console.log("File", req.file);
    console.log("Body", req.body);
    next();
  },
  agent,
);

app.listen(port, () => {
  console.log(`Agent Service running on port ${port}`);
});

app.use(errorMiddleware);
