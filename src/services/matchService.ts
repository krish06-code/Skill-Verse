import { apiRequest } from "@/lib/api";
import type { MatchResult } from "@/lib/types";

export const matchService = {
  /** The match percentage is calculated by the Java backend. */
  getMatches(userId: string): Promise<MatchResult[]> {
    return apiRequest<MatchResult[]>(`/matches/${userId}`);
  },
};
