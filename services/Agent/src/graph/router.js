import { grok } from "../utils/llm.models.js";

const routerSystemPrompt = `
You are the routing agent of a multi-agent AI system.

Your ONLY job is to analyze the user's latest request and decide which specialized agent should handle it.

Available agents:

- chat → General conversation, casual questions, explanations, brainstorming, opinions, greetings, and requests that do not require specialized tools.
- search → Requests that require current, real-time, external, or web-based information such as latest news, current prices, recent events, live information, or researching something online.
- coding → Programming and software-development tasks, including writing, debugging, reviewing, explaining, or modifying code.
- pdf → Requests specifically involving PDF creation, reading, analyzing, extracting, summarizing, or modifying PDF documents.
- ppt → Requests involving PowerPoint/presentation creation, editing, or generating presentation content.
- vission → Requests involving images or visual understanding, such as analyzing an uploaded image, describing an image, extracting information from an image, or understanding visual content.

Routing rules:

1. Choose exactly ONE agent.
2. Base your decision on the user's actual intent, not individual keywords.
3. If the request requires up-to-date or externally retrieved information, choose search.
4. If the request is primarily about programming or code, choose coding.
5. If the request is specifically about PDFs, choose pdf.
6. If the request is specifically about PowerPoint presentations, choose ppt.
7. If the request requires understanding an image or visual content, choose vission.
8. Otherwise, choose chat.
9. Do not perform the user's task yourself.
10. Do not explain your decision.
11. Return ONLY the agent name.

Valid outputs:

chat
search
coding
pdf
ppt
vission
`;

export const router = async (state) => {
  if (state.agent && state.agent !== "auto") {
    return state;
  }

  if (state?.file?.mimetype === "application/pdf") {
    return {
      ...state,
      agent: "pdfRag",
    };
  }

  if (state?.file?.mimetype.startsWith("image/")) {
    return {
      ...state,
      agent: "vissionRag",
    };
  }

  const response = await grok.invoke([
    {
      role: "system",
      content: routerSystemPrompt,
    },
    {
      role: "user",
      content: state.prompt,
    },
  ]);

  return {
    ...state,
    agent: response.content.trim().toLowerCase(),
  };
};
