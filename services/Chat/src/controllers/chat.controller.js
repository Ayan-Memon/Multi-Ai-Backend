import mongoose from "mongoose";
import { errorHandler } from "../../../../common/utils/errorHandler.utility.js";
import { conversationModel } from "../models/conversation.model.js";
import { messageModel } from "../models/message.model.js";

export const CreateConversation = async (req, res, next) => {
  const conversation = await conversationModel.create({
    userId: req.user._id,
  });

  if (!conversation) {
    return next(new errorHandler("conversation creation failed", 400));
  }

  res.status(201).json({
    success: true,
    message: "Conversation Created Successful",
    conversation,
  });
};

export const UpdateConversation = async (req, res, next) => {
  const { title } = req.body;
  const { id: conversationId } = req.params;

  if (!conversationId || !title) {
    return next(new errorHandler("All the fields are required", 400));
  }

  const conversation = await conversationModel.findOneAndUpdate(
    { _id: conversationId, userId: req.user._id },
    { title },
  );

  if (!conversation) {
    return next(new errorHandler("conversation update failed", 400));
  }

  res.status(200).json({
    success: true,
    message: "Conversation Created Successful",
    conversation,
  });
};

export const SaveMessage = async (req, res, next) => {
  let {
    conversationId,
    content,
    role = "user",
    images = [],
    artifacts = [],
    file = null,
  } = req.body;
  let conversation, message;

  if (!content) {
    return next(new errorHandler("All the fields are required", 400));
  }

  if (conversationId) {
    message = await messageModel.create({
      conversationId,
      content,
      role,
      images,
      artifacts,
      file,
    });

    if (!message) {
      return next(new errorHandler("Message creation failed"));
    }
  } else {
    conversation = await conversationModel.create({
      userId: req.user._id,
      title: content.length > 50 ? content.slice(0, 50).trim() : content.trim(),
    });

    conversationId = conversation._id;

    message = await messageModel.create({
      conversationId: conversation._id,
      content,
      role,
      images,
      artifacts,
      file,
    });

    if (!message) {
      return next(new errorHandler("Message creation failed"));
    }
  }

  res.status(200).json({
    success: true,
    message,
    conversationId,
  });
};

export const GetMessages = async (req, res, next) => {
  const { id: conversationId } = req.params;
  const { limit } = req.query;

  if (!conversationId) {
    return next(new errorHandler("Conversation ID is required", 400));
  }

  const conversation = await conversationModel.findOne({
    _id: conversationId,
    userId: req.user._id,
  });

  if (!conversation) {
    return next(new errorHandler("Conversation not found", 404));
  }

  const pipeline = [
    {
      $match: {
        conversationId: new mongoose.Types.ObjectId(conversationId),
      },
    },
  ];

  if (limit) {
    pipeline.push({
      $limit: Number(limit),
    });
  }

  const messages = await messageModel.aggregate(pipeline);

  return res.status(200).json({
    success: true,
    message: "Messages fetched successfully",
    messages,
  });
};

export const GetConversations = async (req, res, next) => {
  const conversations = await conversationModel
    .find({
      userId: req.user._id,
    })
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    message: "conversations fetch successfully",
    conversations,
  });
};
