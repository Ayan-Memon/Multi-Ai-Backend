import { CHAT_SERVICE } from "../config/config.js";
import axios from "axios";
import { errorHandler } from "../../../../common/utils/errorHandler.utility.js";
import { graph } from "../graph/graph.js";
import { addMessage } from "../utils/memory.js";
import { compressImage } from "../services/images/compressImage.js";
import { uploadFile } from "../services/uploadToImageKit.js";
import fs from "fs";
export const agent = async (req, res, next) => {
  try {
    const { prompt, conversationId, agent = "auto" } = req.body;

    const file = req.file;
    let uploaded;

    if (file && file.mimetype === "application/pdf") {
      const collectionName = `${Date.now()}-${file.originalname}-pdf`;
      uploaded = await uploadFile(
        fs.readFileSync(file.path),
        collectionName,
        "pdfs",
      );
    }

    if (file && file.mimetype.startsWith("image/")) {
      const buffer = await compressImage(file.path);
      const collectionName = `${Date.now()}-${file.originalname}-image`;
      uploaded = await uploadFile(buffer, collectionName, "images");
    }

    if (!prompt) {
      return next(new errorHandler("All the fields are required", 400));
    }

    const message = await axios.post(
      `${CHAT_SERVICE}/send-message`,
      { conversationId, content: prompt, file: uploaded?.url ?? "" },
      { headers: { "x-user": JSON.stringify(req.user) } },
    );

    const state = await graph.invoke({
      prompt,
      conversationId: message.data.conversationId,
      agent,
      user: req.user,
      file,
    });

    if (!state) {
      return next(new errorHandler("Agent creation failed", 400));
    }

    const aiMsg = await axios.post(
      `${CHAT_SERVICE}/send-message`,
      {
        conversationId: message.data.conversationId,
        content: state.aiResponse,
        role: "assistant",
        images: state.searchResultImages || [],
        artifacts: state.artifacts || [],
      },
      { headers: { "x-user": JSON.stringify(req.user) } },
    );

    await addMessage(message.data.conversationId, message.data.message);
    await addMessage(aiMsg.data.conversationId, aiMsg.data.message);

    res.status(200).json({
      success: true,
      message: "Agent Created Successful",
      data: {
        userMsg: {
          content: message.data.message.content,
          role: message.data.message.role,
          _id: message.data.message._id,
        },
        aiMsg: aiMsg.data.message,
        conversationId: aiMsg.data.conversationId,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
