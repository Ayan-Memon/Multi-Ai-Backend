import axios from "axios";
import { grok } from "../../utils/llm.models.js";
import { uploadFile } from "../../services/uploadToImageKit.js";
import { compressImage } from "../../services/images/compressImage.js";

const imageModifierPrompt = `You are NEXORA's Image Prompt Modifier.

Transform the user's image prompt into a clear, detailed, and high-quality prompt for an AI image generator.

* Preserve the user's original intent and important details.
* Improve clarity, composition, lighting, camera angle, environment, style, and visual details when useful.
* Don't add unnecessary elements or change the user's idea.
* If the user asks to modify a prompt, only apply the requested changes.

Return ONLY the final improved image prompt. No explanations, labels, or Markdown.
`;

export const vissionAgent = async (state) => {
  try {
    const res = await grok.invoke([
      {
        role: "system",
        content: imageModifierPrompt,
      },
      {
        role: "user",
        content: state.prompt,
      },
    ]);

    const prompt = res.content.trim();

    const imageGenUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=flux`;

    const imageRes = await axios.get(imageGenUrl, {
      responseType: "arraybuffer",
    });

    const buffer = Buffer.from(imageRes.data);

    const compressedBuffer = await compressImage(buffer);

    const fileName = `Nexora-${Date.now()}.webp`;

    const image = await uploadFile(compressedBuffer, fileName, "images");

    return { ...state, aiResponse: `![Image](${image.url})` };
  } catch (error) {
    console.log("vission_agent_error:", error );

    return { ...state, aiResponse: "Image generation failed" };
  }
};
