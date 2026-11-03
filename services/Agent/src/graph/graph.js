import { END, START, StateGraph } from "@langchain/langgraph";
import { agentState } from "./state.js";
import { router } from "./router.js";
import { chatAgent } from "./agents/chat.agent.js";
import { searchAgent } from "./agents/search.agent.js";
import { codingAgent } from "./agents/coding.agent.js";
import { pdfAgent } from "./agents/pdf.agent.js";
import { pptAgent } from "./agents/ppt.agent.js";
import { vissionAgent } from "./agents/vission.agent.js";
import { pdfRag } from "./agents/pdfRag.agent.js";
import { vissionRag } from "./agents/vissionRag.agent.js";

// router func
const routerHandler = (state) => {
  switch (state.agent) {
    case "chat":
      return "chatAgent";
    case "search":
      return "searchAgent";
    case "coding":
      return "codingAgent";
    case "pdf":
      return "pdfAgent";
    case "pdfRag":
      return "pdfRagAgent";
    case "ppt":
      return "pptAgent";
    case "vission":
      return "vissionAgent";
    case "vissionRag":
      return "vissionRagAgent";
    default:
      return "router";
  }
};

const workflow = new StateGraph(agentState);

workflow.addNode("router", router);
workflow.addNode("chatAgent", chatAgent);
workflow.addNode("searchAgent", searchAgent);
workflow.addNode("codingAgent", codingAgent);
workflow.addNode("pdfAgent", pdfAgent);
workflow.addNode("pdfRagAgent", pdfRag);
workflow.addNode("pptAgent", pptAgent);
workflow.addNode("vissionAgent", vissionAgent);
workflow.addNode("vissionRagAgent", vissionRag);

workflow.addEdge(START, "router");
workflow.addConditionalEdges("router", routerHandler, {
  chatAgent: "chatAgent",
  searchAgent: "searchAgent",
  codingAgent: "codingAgent",
  pdfAgent: "pdfAgent",
  pdfRagAgent: "pdfRagAgent",
  pptAgent: "pptAgent",
  vissionAgent: "vissionAgent",
  vissionRagAgent: "vissionRagAgent",
});
workflow.addEdge("searchAgent", "chatAgent");
workflow.addEdge("chatAgent", END);
workflow.addEdge("codingAgent", END);
workflow.addEdge("pdfAgent", END);
workflow.addEdge("pdfRagAgent", END);
workflow.addEdge("pptAgent", END);
workflow.addEdge("vissionAgent", END);
workflow.addEdge("vissionRagAgent", END);

export const graph = workflow.compile();
