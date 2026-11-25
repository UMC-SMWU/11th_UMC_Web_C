import { authApi } from "../auth-api";
import type { MemberRating } from "../members/models";

export interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment: string | null;
}

interface CreateRatingResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MemberRating;
}

export function createRating(body: CreateRatingRequest) {
  return authApi.post("ratings", { json: body }).json<CreateRatingResponse>();
}
