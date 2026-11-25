import { useQuery } from "@tanstack/react-query";
import { getFavoriteStatus } from "../api/favorites/get-favorite-status";
import { getFavorites } from "../api/favorites/get-favorites";
import { useCurrentMemberId } from "./use-current-member-id";

// 내 즐겨찾기 목록 (마이페이지, 영화 카드의 북마크 버튼)
export function useFavoritesQuery() {
  const memberId = useCurrentMemberId();

  return useQuery({
    queryKey: ["favorites", "list", memberId],
    queryFn: getFavorites,
    enabled: memberId !== null,
  });
}

// 특정 영화의 즐겨찾기 여부 (영화 상세)
export function useFavoriteStatusQuery(movieId: number) {
  const memberId = useCurrentMemberId();

  return useQuery({
    queryKey: ["favorites", "status", memberId, movieId],
    queryFn: () => getFavoriteStatus(movieId),
    enabled: memberId !== null && Number.isInteger(movieId) && movieId > 0,
  });
}
