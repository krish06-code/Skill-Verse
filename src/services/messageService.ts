import { apiRequest } from "@/lib/api";
import type { Message } from "@/lib/types";

export const messageService = {
  getMessages(userId: string): Promise<Message[]> {
    return apiRequest<Message[]>(`/messages/${userId}`);
  },

  sendMessage(senderId: string, receiverId: string, message: string): Promise<Message> {
    return apiRequest<Message>("/messages", {
      method: "POST",
      body: { senderId, receiverId, message },
    });
  },
};
