import { apiRequest } from "@/lib/api";
import type { Connection, ConnectionStatus } from "@/lib/types";

export const connectionService = {
  getConnections(userId: string): Promise<Connection[]> {
    return apiRequest<Connection[]>(`/connections?userId=${userId}`);
  },

  sendRequest(senderId: string, receiverId: string): Promise<Connection> {
    return apiRequest<Connection>("/connections", {
      method: "POST",
      body: { senderId, receiverId },
    });
  },

  respond(id: string, status: ConnectionStatus): Promise<Connection> {
    return apiRequest<Connection>(`/connections/${id}`, { method: "PUT", body: { status } });
  },
};
