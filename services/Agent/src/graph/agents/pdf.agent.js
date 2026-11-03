import { generatePdf } from "../../services/pdf/generatePdf.js";
import { uploadFile } from "../../services/uploadToImageKit.js";
import { grok } from "../../utils/llm.models.js";

const pdfPrompt = `Return ONLY valid JSON. 
Do NOT return markdown, explanations, or extra text. 

Generate structured content for a professional PDF based on the user's request. 

Use this exact structure: 
{ 
"title": "", 
"subtitle": "", 
"sections": [ 
{ 
  "heading": "", 
  "points": [] 
} 
] 
} 

Rules: 
- "title":": main document title 
- "subtitle":": short description or context 
- "sections":": logical sections of the document 
- Each section must have a clear "heading" 
- "points" must contain concise, useful content as strings 
- Keep the structure relevant to the user's request 
- Do not add any fields outside this schema 
- Return valid JSON only.`;

export const pdfAgent = async (state) => {
  try {
    const res = await grok.invoke([
      {
        role: "system",
        content: pdfPrompt,
      },
      {
        role: "user",
        content: state.prompt,
      },
    ]);

    const data = JSON.parse(res.content);

    const pdfBuffer = await generatePdf(data);

    const fileName = `Nexora-${data.title}-${Date.now()}.pdf`;

    const pdf = await uploadFile(pdfBuffer, fileName, "pdfs");

    return { ...state, aiResponse: `[${data.title}](${pdf.url})` };
  } catch (error) {
    console.log("pdf_agent_error :", error);

    return { ...state, aiResponse: "Failed to generate PDF" };
  }
};
