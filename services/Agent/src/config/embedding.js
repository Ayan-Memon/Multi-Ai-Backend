import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

export const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "gemini-embedding-001",
});

// import { OllamaEmbeddings } from "@langchain/ollama";

// export const embeddings = new OllamaEmbeddings({
//   model: "nomic-embed-text", 
//   baseUrl: "http://localhost:11434",
// });