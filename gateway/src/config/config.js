import dotenv from "dotenv";

dotenv.config();

if (!process.env.PORT) {
  throw new Error("PORT is not defined");
}

if (!process.env.AUTH_SERVER_URL) {
  throw new Error("AUTH_SERVER_URL is not defined");
}

if (!process.env.CHAT_SERVER_URL) {
  throw new Error("CHAT_SERVER_URL is not defined");
}

if (!process.env.AGENT_SERVER_URL) {
  throw new Error("AGENT_SERVER_URL is not defined");
}

export const { PORT, AUTH_SERVER_URL, CHAT_SERVER_URL, AGENT_SERVER_URL } = process.env;
