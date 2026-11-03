import express from "express";
import proxy from "express-http-proxy";
import cors from "cors";
import {
  PORT,
  AUTH_SERVER_URL,
  CHAT_SERVER_URL,
  AGENT_SERVER_URL,
} from "./src/config/config.js";
import { errorMiddleware } from "../common/middlewares/error.middleware.js";
import { asyncHandler } from "../common/utils/asyncHandler.utility.js";
import cookieParser from "cookie-parser";
import { authMiddleware } from "./src/middlewares/auth.middleware.js";
import { getCurrentUser } from "./src/controllers/user.controller.js";
import { proxyWithHeader } from "./src/utils/proxyWithHeader.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(cookieParser());

const port = PORT || 5000;

app.get("/auth/me", authMiddleware, asyncHandler(getCurrentUser));
app.use("/auth", asyncHandler(proxy(AUTH_SERVER_URL)));
app.use(
  "/chat",
  authMiddleware,
 proxyWithHeader(CHAT_SERVER_URL),
);

app.use(
  "/agent",
  authMiddleware,
  asyncHandler(proxyWithHeader(AGENT_SERVER_URL)),
);

app.listen(port, () => {
  console.log(`Gateway running on port ${port}`);
});

app.use(errorMiddleware);
