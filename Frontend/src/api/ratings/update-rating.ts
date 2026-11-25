import { authApi } from "../auth-api";
import type { MemberRating } from "../members/models";

export interface UpdateRatingRequest {
  ratingId: number;
  score: number;
  comment: string | null;
}

interface UpdateRatingResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MemberRating;
}

export function updateRating({ ratingId, ...body }: UpdateRatingRequest) {
  return authApi
    .patch(`ratings/${ratingId}`, { json: body })
    .json<UpdateRatingResponse>();
}
