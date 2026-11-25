import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isHTTPError } from "ky";
import { addFavorite } from "../api/favorites/add-favorite";
import { removeFavorite } from "../api/favorites/remove-favorite";

export function useAddFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addFavorite,
    // 즐겨찾기 목록과 상세의 즐겨찾기 여부를 모두 다시 조회해요.
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
    onError: (error) => {
      // 이미 즐겨찾기한 영화(409)라면 화면만 최신 상태로 맞추면 돼요.
      if (isHTTPError(error) && error.response.status === 409) return;
      alert("즐겨찾기 등록에 실패했어요. 다시 시도해 주세요.");
    },
  });
}

export function useRemoveFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFavorite,
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
    onError: (error) => {
      // 이미 해제된 즐겨찾기(404)라면 화면만 최신 상태로 맞추면 돼요.
      if (isHTTPError(error) && error.response.status === 404) return;
      alert("즐겨찾기 해제에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
