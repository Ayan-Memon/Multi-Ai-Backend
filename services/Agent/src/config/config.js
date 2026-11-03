import dotenv from "dotenv";

dotenv.config();

if (!process.env.PORT) {
  throw new Error("PORT is not defined");
}

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is not defined");
}

if (!process.env.CHAT_SERVICE) {
  throw new Error("CHAT_SERVICE is not defined");
}

if (!process.env.TAVILY_API_KEY) {
  throw new Error("TAVILY_API_KEY is not defined");
}

if (!process.env.OPENROUTER_API_KEY) {
  throw new Error("OPENROUTER_API_KEY is not defined");
}

if (!process.env.IMAGEKIT_PRIVATE_KEY) {
  throw new Error("IMAGEKIT_PRIVATE_KEY is not defined");
}

if (!process.env.IMAGEKIT_PUBLIC_KEY) {
  throw new Error("IMAGEKIT_PUBLIC_KEY is not defined");
}

if (!process.env.IMAGEKIT_URL_ENDPOINT) {
  throw new Error("IMAGEKIT_URL_ENDPOINT is not defined");
}

if (!process.env.QDRANT_API_KEY) {
  throw new Error("QDRANT_API_KEY is not defined");
}

if (!process.env.QDRANT_URL) {
  throw new Error("QDRANT_URL is not defined");
}

export const {
  PORT,
  GROQ_API_KEY,
  CHAT_SERVICE,
  IMAGEKIT_PRIVATE_KEY,
  IMAGEKIT_PUBLIC_KEY,
  IMAGEKIT_URL_ENDPOINT,
  TAVILY_API_KEY,
  OPENROUTER_API_KEY,
  QDRANT_API_KEY,
  QDRANT_URL,
} = process.env;
