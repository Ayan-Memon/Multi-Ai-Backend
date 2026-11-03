import { QdrantVectorStore } from "@langchain/qdrant";
import { embeddings } from "./embedding.js";
import { QDRANT_URL } from "./config.js";
export const vectorStore = async (docs, collectionName) => {
  return await QdrantVectorStore.fromDocuments(docs, embeddings, {
    qdrantUrl: QDRANT_URL,
    collectionName,
  });
};
