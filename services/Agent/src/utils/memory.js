import axios from "axios";
import { CHAT_SERVICE } from "../config/config.js";
import redis from "../../../../common/config/redis.js";

export const getMemory = async (conversationId, user) => {
  const key = `conversation:${conversationId}`;

  const conversation = await redis.get(key);

  if (conversation) {
    return JSON.parse(conversation);
  }

  const messages = await getMessages(conversationId, user);

  console.log({memory :messages});

  await redis.set(key, JSON.stringify(messages), "EX", 24 * 60 * 60);

  return messages;
};

const getMessages = async (conversationId, user) => {
  try {
    const res = await axios.get(
      `${CHAT_SERVICE}/get-messages/${conversationId}?limit=20`,
      {
        headers: { "x-user": JSON.stringify(user) || user },
      },
    );
    return res.data.messages;
  } catch (error) {
    console.log(error);
  }
};

export const addMessage = async (conversationId, message) => {
  const key = `conversation:${conversationId}`;

  const conversation = await redis.get(key);

  const messages = conversation ? JSON.parse(conversation) : [];

  messages.push(message);

  if (messages.length > 20) {
    messages.shift();
  }

  await redis.set(key, JSON.stringify(messages), "EX", 24 * 60 * 60);
};
