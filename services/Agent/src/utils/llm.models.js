import { ChatGroq } from "@langchain/groq";
import { TavilySearch } from "@langchain/tavily";
import { ChatOpenRouter } from "@langchain/openrouter";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";

dotenv.config();

export const grok = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0,
});

export const tavily = new TavilySearch({
  maxResults: 5,
  topic: "general",
  includeImages: true,
  // includeAnswer: false,
  // includeRawContent: false,
  // includeImageDescriptions: false,
  // searchDepth: "basic",
  // timeRange: "day",
  // includeDomains: [],
  // excludeDomains: [],
});

export const deepSeek = new ChatOpenRouter({
  model: "deepseek/deepseek-chat",
  temperature: 0,
  maxTokens: 2500,
});

export const gemini = new ChatGoogleGenerativeAI({
  model: "gemini-3.8-flash",
});
