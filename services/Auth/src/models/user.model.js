import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      unique: true,
    },
    name: String,
    email: {
      type: String,
      unique: true,
    },
    avatar: String,
  },
  { timestamps: true },
);

const userModel = mongoose.model("user", userSchema);

export default userModel;
