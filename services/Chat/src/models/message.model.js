import mongoose from "mongoose";

const artifactsSchema = new mongoose.Schema(
  {
    id: Number,
    type: String,
    files: [
      {
        name: String,
        content: String,
      },
    ],
  },
  { _id: false },
);

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
    },
    content: String,
    images: [String],
    artifacts: [artifactsSchema],
    file: String,
  },
  { timestamps: true },
);

export const messageModel = mongoose.model("Message", messageSchema);
