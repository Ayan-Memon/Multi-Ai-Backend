import fs from "fs/promises";
import { gemini } from "../../utils/llm.models.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const imageAnalyzerSystemPrompt = `You are an AI image analysis assistant. Carefully analyze the provided image and answer the user's request based only on visible information. Identify objects, people, text, scenes, colors, layout, and other relevant details when needed. Do not make unsupported assumptions or invent information. If something is unclear or cannot be determined from the image, say so. Give clear, accurate, and concise answers, and provide more detail when the user asks for it.`;

export const vissionRag = async (state) => {
  try {
    const imageBuffer = await fs.readFile(state.file.path);
    const base64Image = imageBuffer.toString("base64");

    const messages = [
      new SystemMessage(imageAnalyzerSystemPrompt),
      new HumanMessage({
        content: [
          {
            type: "text",
            text: state.prompt || "Analyze this image",
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${state.file.mimetype};base64,${base64Image}`,
            },
          },
        ],
      }),
    ];

    const res = await gemini.invoke(messages);

    return { ...state, aiResponse: res.content };
  } catch (error) {
    console.log("vission_rag_agent_error:", error);
    return { ...state, aiResponse: "Failed to analyze image" };
  } finally {
    await fs.unlink(state.file.path);
  }
};
