import { apiRequest } from "@/lib/api";
import type { Review } from "@/lib/types";

export const reviewService = {
  getReviews(userId: string): Promise<Review[]> {
    return apiRequest<Review[]>(`/reviews/${userId}`);
  },

  createReview(review: Omit<Review, "id">): Promise<Review> {
    return apiRequest<Review>("/reviews", { method: "POST", body: review });
  },
};
