import { generatePpt } from "../../services/ppt/generatePpt.js";
import { uploadFile } from "../../services/uploadToImageKit.js";
import { grok } from "../../utils/llm.models.js";

const pptPrompt = `Return ONLY valid JSON.
Do NOT return markdown, explanations, or extra text.

Generate structured content for a professional PowerPoint presentation based on the user's request.

Use this exact structure:
{
  "title": "",
  "subtitle": "",
  "slides": [
    {
      "title": "",
      "point": []
    }
  ]
}

Rules:
- "title":": main presentation title
- "subtitle":": short description or context
- "slides":": ordered list of presentation slides
- Each slide must have a clear and relevant "title"
- "point" must contain concise, presentation-friendly content as strings
- Keep points short and easy to read on a slide
- Organize slides in a logical flow from introduction to conclusion
- Include only useful information relevant to the user's request
- Do not write paragraphs inside "point"
- Do not add any fields outside this schema
- Return valid JSON only.`;
export const pptAgent = async (state) => {
  try {
    const res = await grok.invoke([
      {
        role: "system",
        content: pptPrompt,
      },
      {
        role: "user",
        content: state.prompt,
      },
    ]);
    const data = JSON.parse(res.content);

    const pptBuffer = await generatePpt(data);

    const fileName = `Nexora-${data.title}-${Date.now()}.pptx`;

    const ppt = await uploadFile(pptBuffer, fileName, "ppts");

    return { ...state, aiResponse: `[${data.title}](${ppt.url})` };
  } catch (error) {
    console.log("ppt_agent_error:", error);
    return { ...state, aiResponse: "Failed to generate ppt" };
  }
};
