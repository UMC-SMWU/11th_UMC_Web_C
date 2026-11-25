import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRating } from "../api/ratings/create-rating";
import { deleteRating } from "../api/ratings/delete-rating";
import { updateRating } from "../api/ratings/update-rating";

export function useCreateRatingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRating,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ratings"] });
      alert("평점을 저장했어요.");
    },
    onError: () => {
      alert("평점 저장에 실패했어요. 다시 시도해 주세요.");
    },
  });
}

export function useUpdateRatingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRating,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ratings"] });
      alert("평점을 수정했어요.");
    },
    onError: () => {
      alert("평점 수정에 실패했어요. 다시 시도해 주세요.");
    },
  });
}

export function useDeleteRatingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRating,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ratings"] });
      alert("평점을 삭제했어요.");
    },
    onError: () => {
      alert("평점 삭제에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
