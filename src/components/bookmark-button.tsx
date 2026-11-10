import { useBookmarkStore } from "../stores/bookmark-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  className?: string;
}

export function BookmarkButton({ movieId, className }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  return (
    <button
      type="button"
      aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
      className={cn(
        "absolute top-[10px] right-[9.8px] flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-[8px] border-none p-0",
        isBookmarked ? "bg-[#2563EB]" : "bg-[#17191E]",
        className,
      )}
      onClick={() => toggleBookmark(movieId)}
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
