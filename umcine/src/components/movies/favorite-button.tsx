import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
    addFavorite,
    getFavoriteStatus,
    removeFavorite,
} from "../../api/favorites/favorites";
import { useAuthStore } from "../../stores/auth-store";

export function FavoriteButton({ movieId }: { movieId: number }) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const accessToken = useAuthStore((state) => state.accessToken);

    const statusQuery = useQuery({
        queryKey: ["favorites", movieId],
        queryFn: () => getFavoriteStatus(movieId),
        enabled: Boolean(accessToken),
    });
    const isFavorite = statusQuery.data ?? false;

    const addMutation = useMutation({
        mutationFn: addFavorite,
        onSuccess: () => {
            queryClient.setQueryData(["favorites", movieId], true);
            queryClient.invalidateQueries({ queryKey: ["favorites"], exact: true });
        },
        onError: () => {
            alert("즐겨찾기 등록에 실패했어요. 다시 시도해 주세요.");
        },
    });

    const removeMutation = useMutation({
        mutationFn: removeFavorite,
        onSuccess: () => {
            queryClient.setQueryData(["favorites", movieId], false);
            queryClient.invalidateQueries({ queryKey: ["favorites"], exact: true });
        },
        onError: () => {
            alert("즐겨찾기 해제에 실패했어요. 다시 시도해 주세요.");
        },
    });

    const isBusy =
        statusQuery.isLoading || addMutation.isPending || removeMutation.isPending;

    const handleClick = () => {
        if (!accessToken) {
            navigate({ to: "/login" });
            return;
        }
        if (isBusy) return;

        if (isFavorite) {
            removeMutation.mutate(movieId);
        } else {
            addMutation.mutate(movieId);
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={isBusy}
            className="mt-5 flex h-9 items-center gap-1.5 rounded-lg bg-[#4f63e8] px-4 text-xs font-bold !text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
            <img
                src={isFavorite ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
                alt=""
                className="h-3.5 w-3.5 brightness-0 invert"
            />
            {isFavorite ? "즐겨찾기 해제" : "즐겨찾기"}
        </button>
    );
}