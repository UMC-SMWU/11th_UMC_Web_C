import { authApi } from "../auth-api";

interface FavoriteStatusResponse {
    isSuccess: boolean;
    code: string;
    message: string;
    result: { isFavorite: boolean };
}

export async function getFavoriteStatus(movieId: number): Promise<boolean> {
    const response = await authApi
        .get(`favorites/${movieId}`)
        .json<FavoriteStatusResponse>();
    return response.result.isFavorite;
}

export function addFavorite(movieId: number) {
    return authApi.post("favorites", { json: { movieId } }).json();
}

export function removeFavorite(movieId: number) {
    return authApi.delete(`favorites/${movieId}`).json();
}