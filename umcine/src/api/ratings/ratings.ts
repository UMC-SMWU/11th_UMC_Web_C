import { apiClient } from "../api-client";
import { authApi } from "../auth-api";

export interface Rating {
    ratingId: number;
    movieId: number;
    score: number;
    comment: string | null;
    createdAt: string;
    updatedAt: string;
}

interface RatingApiResponse {
    isSuccess: boolean;
    code: string;
    message: string;
    result: Rating;
}

export interface CreateRatingRequest {
    movieId: number;
    score: number;
    comment: string | null;
}

export interface UpdateRatingRequest {
    ratingId: number;
    score: number;
    comment: string | null;
}

export function getMemberRatings(memberId: number) {
    return apiClient.get(`members/${memberId}/ratings`).json<Rating[]>();
}

export function createRating(body: CreateRatingRequest) {
    return authApi.post("ratings", { json: body }).json<RatingApiResponse>();
}

export function updateRating({ ratingId, score, comment }: UpdateRatingRequest) {
    return authApi
        .patch(`ratings/${ratingId}`, { json: { score, comment } })
        .json<RatingApiResponse>();
}

export function deleteRating(ratingId: number) {
    return authApi.delete(`ratings/${ratingId}`).json();
}