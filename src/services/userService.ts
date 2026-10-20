import { API_BASE_URL, ApiError, apiRequest, getToken } from "@/lib/api";
import type { User } from "@/lib/types";

export const userService = {
  getUser(id: string): Promise<User> {
    return apiRequest<User>(`/users/${id}`);
  },

  updateUser(id: string, data: Partial<User>): Promise<User> {
    return apiRequest<User>(`/users/${id}`, { method: "PUT", body: data });
  },

  async uploadPhoto(id: string, file: File): Promise<User> {
    const body = new FormData();
    body.append("file", file);
    const token = getToken();
    let res: Response;
    try {
      res = await fetch(`${API_BASE_URL}/users/${id}/photo`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body,
      });
    } catch {
      throw new ApiError(
        "Cannot reach the server. Make sure the Skill Verse backend is running.",
        0,
      );
    }
    if (!res.ok) {
      let message = `Upload failed (${res.status})`;
      try {
        const data = (await res.json()) as { message?: string };
        if (data?.message) message = data.message;
      } catch {
        // no JSON body
      }
      throw new ApiError(message, res.status);
    }
    return (await res.json()) as User;
  },

  listStudents(): Promise<User[]> {
    return apiRequest<User[]>("/users");
  },
};
