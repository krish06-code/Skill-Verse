import { apiRequest } from "@/lib/api";
import type { Skill, SkillType } from "@/lib/types";

export const skillService = {
  getSkills(): Promise<Skill[]> {
    return apiRequest<Skill[]>("/skills");
  },

  addUserSkill(userId: string, skillName: string, type: SkillType): Promise<{ ok: boolean }> {
    return apiRequest<{ ok: boolean }>(`/users/${userId}/skills`, {
      method: "POST",
      body: { skillName, type },
    });
  },
};
