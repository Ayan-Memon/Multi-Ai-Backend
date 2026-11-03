import redis from "../../../common/config/redis.js";
import { errorHandler } from "../../../common/utils/errorHandler.utility.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const sessionId = req.cookies?.session;
    if (!sessionId) {
      return next(new errorHandler("unauthorized", 400));
    }
    const session = await redis.get(`session:${sessionId}`);

    if (!session) {
      return next(new errorHandler("unauthorized", 400));
    }

    req.user = JSON.parse(session);
    next();
  } catch (error) {
    return next(new errorHandler("unauthorized", 400));
  }
};
