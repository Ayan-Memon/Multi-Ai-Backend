import fs from "fs";
import { PDFParse } from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { vectorStore } from "../../config/vectorDb.js";
import { gemini } from "../../utils/llm.models.js";

export const pdfRag = async (state) => {
  try {
    const buffer = fs.readFileSync(state.file.path);
    const pdf = await new PDFParse({
      data: buffer,
    });

    const result = await pdf.getText();
    const text = result.text;

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await splitter.createDocuments([text]);
    const collectionName = `${Date.now()}-pdf`;

    const store = await vectorStore(docs, collectionName);

    const relevantDocs = await store.similaritySearch(state.prompt, 5);

    const context = relevantDocs
      .map((doc) => doc.pageContent)
      .join(`\n\n---\n\n`);

    const res = await gemini.invoke(`
        You are NEXORA's PDF RAG Agent.
        
        USER PROMPT:
        ${state.prompt}
        
        PDF CONTEXT:
        ${context}
        
        Rules:
        - Answer primarily from the PDF context.
        - Do not invent information.
        - If the answer is not found in the context, say so clearly.
        - Combine relevant information from different parts of the context when needed.
        - Answer clearly and directly.
        - Use Markdown only when useful.
        `);

    return { ...state, aiResponse: res.content };
  } catch (error) {
    console.log("pdf_rag_agent_error :", error);
    return { ...state, aiResponse: "Failed to analyze PDF" };
  } finally {
    fs.unlinkSync(state.file.path);
  }
};
