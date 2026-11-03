import { errorHandler } from "../../../../common/utils/errorHandler.utility.js";
import { auth } from "../config/firebase.js";
import userModel from "../models/user.model.js";
import crypto from "node:crypto";
import redis from "../../../../common/config/redis.js";

export const login = async (req, res, next) => {
  const { idToken } = req.body;

  if (!idToken) {
    return next(new errorHandler("Firebase Id token required", 400));
  }

  const decodedToken = await auth.verifyIdToken(idToken);

  if (!decodedToken) {
    return next(new errorHandler("Invalid firebase uid", 400));
  }

  const firebaseUid = decodedToken.uid;
  const email = decodedToken.email;
  const name = decodedToken.name;
  const picture = decodedToken.picture;

  let user = await userModel.findOne({
    firebaseUid,
  });

  if (!user) {
    user = await userModel.findOneAndUpdate(
      { firebaseUid },
      {
        firebaseUid,
        email,
        name,
        avatar: picture,
      },
      {
        new: true,
        upsert: true,
      },
    );
  }

  const sessionId = await crypto.randomUUID();

  await redis.set(
    `session:${sessionId}`,
    JSON.stringify(user),
    "EX",
    60 * 60 * 24 * 7,
  );

  res.cookie("session", sessionId, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  res.status(201).json({
    success: true,
    message: "Login successful",
    user,
  });
};
