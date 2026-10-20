export type SkillType = "TEACH" | "LEARN";

export interface User {
  id: string;
  name: string;
  email: string;
  college: string;
  branch: string;
  year: string;
  bio: string;
  profileImage?: string;
  skillPoints: number;
  teachSkills: string[];
  learnSkills: string[];
  rating?: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface MatchResult {
  user: User;
  matchPercentage: number;
  /** Skills you want to learn that this student teaches. */
  theyCanTeachYou: string[];
  /** Skills you teach that this student wants to learn. */
  youCanTeachThem: string[];
  /** Skills you both want to learn. */
  sharedInterests: string[];
  twoWay: boolean;
}

export type ConnectionStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface Connection {
  id: string;
  senderId: string;
  receiverId: string;
  status: ConnectionStatus;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
}

export interface Review {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewedUserId: string;
  rating: number;
  comment: string;
}
