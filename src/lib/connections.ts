import type { Connection } from "@/lib/types";

export type ConnectionState = "none" | "pending" | "connected";

/** Works out how the current user relates to another student. */
export function connectionStateFor(
  connections: Connection[],
  currentUserId: string,
  otherUserId: string,
): ConnectionState {
  const relevant = connections.filter(
    (c) =>
      (c.senderId === currentUserId && c.receiverId === otherUserId) ||
      (c.receiverId === currentUserId && c.senderId === otherUserId),
  );
  if (relevant.some((c) => c.status === "ACCEPTED")) return "connected";
  if (relevant.some((c) => c.status === "PENDING")) return "pending";
  return "none";
}
