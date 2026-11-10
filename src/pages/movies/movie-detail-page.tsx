import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { movieQueries } from "../../api/movies/movie-queries";
import { MovieImage } from "../../components/movies/movie-image";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";
import {
  formatReleaseDate,
  formatRuntime,
} from "../../utils/movies/format-movie";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);
  const isValidMovieId = Number.isInteger(parsedMovieId) && parsedMovieId > 0;

  const movieDetailQuery = useQuery(movieQueries.detail(parsedMovieId));

  const movie = movieDetailQuery.data ?? null;
  const isLoading = movieDetailQuery.isPending;
  const errorMessage = movieDetailQuery.isError
    ? getMovieDetailErrorMessage(movieDetailQuery.error)
    : null;

  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(parsedMovieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  if (!isValidMovieId) {
    return (
      <main className="py-20 text-center text-[#969DA8]">
        올바르지 않은 영화 번호예요.
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="py-20 text-center text-[#969DA8]">
        영화 정보를 불러오는 중이에요.
      </main>
    );
  }

  if (errorMessage || !movie) {
    return (
      <main className="py-20 text-center text-[#969DA8]">
        {errorMessage ?? "영화 정보를 불러오지 못했어요."}
      </main>
    );
  }

  return (
    <main>
      <section className="relative h-[360px] overflow-hidden">
        <MovieImage
          src={getTmdbBackdropUrl(movie.backdrop_path)}
          alt=""
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />

        <div className="relative mx-auto flex h-full max-w-[1440px] flex-col justify-between px-20 pt-7 pb-8 text-white">
          <Link to="/" className="flex h-6 w-[76px] items-center gap-1">
            <img
              src="/icons/movie-icons/chevron-left.svg"
              alt=""
              className="h-4 w-4 brightness-0 invert"
            />
            <span className="text-[13px] leading-none font-bold">영화 목록</span>
          </Link>

          <div className="flex flex-col gap-2">
            <h1 className="text-[46px] leading-[49.68px] font-bold tracking-[-2.3px]">
              {movie.title}
            </h1>
            <p className="text-[14px] leading-none font-normal">
              {movie.original_title}
            </p>
            <p className="flex gap-2 text-[13px] leading-none font-bold">
              <span>{formatReleaseDate(movie.release_date)}</span>
              <span>{movie.genres.map((genre) => genre.name).join(" · ")}</span>
              <span>{formatRuntime(movie.runtime)}</span>
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-[1440px] gap-8 px-20 py-6">
        <MovieImage
          src={getTmdbPosterUrl(movie.poster_path)}
          alt={`${movie.title} 포스터`}
          className="h-[286px] w-[200px] shrink-0 rounded-[10px] shadow-lg"
        />

        <div className="flex flex-1 flex-col items-start gap-3">
          <h2 className="text-[21px] leading-none font-bold tracking-[-0.63px]">
            {movie.tagline}
          </h2>
          <p className="text-[14px] leading-6 font-normal">{movie.overview}</p>
          <button
            type="button"
            onClick={() => toggleBookmark(movie.id)}
            className={cn(
              "flex h-[42px] min-w-[107px] items-center justify-center gap-2 rounded-lg px-4 whitespace-nowrap text-white",
              isBookmarked ? "bg-[#17191E]" : "bg-[#2563EB]",
            )}
          >
            <img
              src={
                isBookmarked
                  ? "/icons/movie-icons/bookmark.svg"
                  : "/icons/movie-icons/bookmark-outline.svg"
              }
              alt=""
              className="h-4 w-4 brightness-0 invert"
            />
            <span className="text-[14px] leading-none font-extrabold">
              {isBookmarked ? "즐겨찾기 해제" : "즐겨찾기"}
            </span>
          </button>
        </div>

        <aside className="box-content flex w-[329px] shrink-0 flex-col gap-3 border-l border-[#E5E7EB] pl-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-[21px] leading-none font-bold tracking-[-0.63px]">
              내 평점
            </h2>
            <p className="text-[14px] leading-6 text-[#969DA8]">
              별점은 필수, 후기는 선택이에요.
            </p>
          </div>

          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                key={score}
                type="button"
                aria-label={`${score}점`}
                className="flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-[#E5E7EB] bg-white px-1.5 py-px"
              >
                <img
                  src="/icons/movie-icons/star.svg"
                  alt=""
                  className="h-6 w-6"
                />
              </button>
            ))}
          </div>

          <textarea
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            className="h-[102px] w-full resize-none rounded-lg border border-[#E5E7EB] bg-white pt-4 pr-3 pb-[18px] pl-3 text-[13px] leading-[19.5px] placeholder:text-[#969DA8]"
          />

          <button
            type="button"
            className="h-[42px] w-full rounded-lg bg-[#17191E] px-4 text-[14px] leading-none font-extrabold text-white"
          >
            평점 저장
          </button>
        </aside>
      </div>
    </main>
  );
}