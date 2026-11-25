import { useNavigate } from "@tanstack/react-router";
import { useFavoritesQuery } from "../hooks/use-favorite-queries";
import {
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} from "../hooks/use-favorite-mutations";
import { useAuthStore } from "../stores/auth-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  className?: string;
}

export function BookmarkButton({ movieId, className }: BookmarkButtonProps) {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);

  // 화면의 모든 카드가 같은 즐겨찾기 목록 query를 함께 사용해요.
  const favoritesQuery = useFavoritesQuery();
  const addFavoriteMutation = useAddFavoriteMutation();
  const removeFavoriteMutation = useRemoveFavoriteMutation();

  const isBookmarked =
    favoritesQuery.data?.some((favorite) => favorite.movieId === movieId) ??
    false;
  const isPending =
    addFavoriteMutation.isPending || removeFavoriteMutation.isPending;

  const handleClick = () => {
    if (!accessToken) {
      alert("로그인이 필요해요.");
      navigate({ to: "/login" });
      return;
    }
    if (isPending) return;

    if (isBookmarked) {
      removeFavoriteMutation.mutate(movieId);
    } else {
      addFavoriteMutation.mutate(movieId);
    }
  };

  return (
    <button
      type="button"
      aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
      disabled={isPending}
      className={cn(
        "absolute top-[10px] right-[9.8px] flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-[8px] border-none p-0 disabled:opacity-60",
        isBookmarked ? "bg-[#2563EB]" : "bg-[#17191E]",
        className,
      )}
      onClick={handleClick}
    >
      <img
        src={
          isBookmarked
            ? "/icons/movie-icons/bookmark.svg"
            : "/icons/movie-icons/bookmark-outline.svg"
        }
        alt=""
        className="h-[18px] w-[18px] brightness-0 invert"
      />
    </button>
  );
}
