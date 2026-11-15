import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useRef, useState, type SubmitEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { movieQueries } from "../../api/movies/movie-queries";
import { BookmarkButton } from "../../components/bookmark-button";
import { MovieImage } from "../../components/movies/movie-image";
import { formatReleaseDate } from "../../utils/movies/format-movie";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | undefined>(undefined);

  const normalizedQuery = query?.trim() ?? "";

  const searchQuery = useQuery(movieQueries.search(normalizedQuery));

  const movies = searchQuery.data?.results ?? [];
  const totalResults = searchQuery.data?.total_results ?? 0;
  const isLoading = searchQuery.isLoading;
  const errorMessage = searchQuery.isError
    ? "검색 결과를 불러오지 못했어요."
    : null;

  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

  useEffect(() => {
    return () => window.clearTimeout(toastTimerRef.current);
  }, []);

  function showToast(message: string) {
    setToastMessage(message);
    window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToastMessage(null), 2500);
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();

    if (!nextQuery) {
      showToast("검색어를 입력해 주세요.");
      return;
    }

    navigate({
      search: { query: nextQuery },
    });
  }

  return (
    <main>
      {!normalizedQuery ? (
        <section className="flex h-[585px] flex-col items-center justify-center gap-9">
          <h1 className="text-center text-[46px] leading-[52.44px] font-bold tracking-[-2.3px]">
            어떤 영화를 찾고 있나요?
          </h1>

          <form
            onSubmit={handleSubmit}
            className="flex h-[74px] w-[790px] items-center gap-[14px] rounded-[12px] border-2 border-[#17191E] bg-white pr-[17px] pl-[21px] shadow-lg"
          >
            <img src="/icons/movie-icons/search.svg" alt="" className="h-6 w-6" />
            <input
              aria-label="검색어"
              placeholder="예: 스파이더맨"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              className="flex-1 text-[17px] leading-none font-normal outline-none placeholder:text-[#969DA8]"
            />
            <button
              type="submit"
              className="h-[42px] w-[59px] rounded-lg border border-[#17191E] bg-[#17191E] px-4 text-[14px] leading-none font-extrabold whitespace-nowrap text-white"
            >
              검색
            </button>
          </form>
        </section>
      ) : (
        <div className="mx-auto max-w-[1440px] px-20 pt-8">
          <h1 className="text-[38px] leading-[44px] font-bold tracking-[-1.71px]">
            영화 검색
          </h1>

          <form
            onSubmit={handleSubmit}
            className="mt-[17px] flex h-[54px] w-full items-center gap-[18px] rounded-[9px] border border-[#E5E7EB] bg-white pr-[10px] pl-[15px]"
          >
            <img src="/icons/movie-icons/search.svg" alt="" className="h-6 w-6" />
            <input
              aria-label="검색어"
              placeholder="예: 스파이더맨"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              className="flex-1 text-[14px] font-bold outline-none placeholder:font-normal placeholder:text-[#969DA8]"
            />
            <button
              type="button"
              aria-label="검색어 지우기"
              onClick={() => setSearchText("")}
            >
              <img src="/icons/movie-icons/close.svg" alt="" className="h-6 w-6" />
            </button>
            <button
              type="submit"
              className="h-[42px] w-[86px] rounded-lg border border-[#17191E] bg-[#17191E] px-4 text-[14px] leading-none font-extrabold whitespace-nowrap text-white"
            >
              다시 검색
            </button>
          </form>

          <div className="mt-2 flex h-[54px] items-center justify-between border-y border-[#E5E7EB]">
            <h2 className="text-[18px] leading-none font-bold">
              ‘{query}’ 검색 결과
            </h2>
            <p className="text-[12px] leading-none font-normal text-[#969DA8]">
              영화 {totalResults}편 · 1페이지
            </p>
          </div>

          {isLoading ? (
            <p className="flex h-[400px] items-center justify-center text-[#969DA8]">
              검색 결과를 불러오는 중이에요.
            </p>
          ) : errorMessage ? (
            <p className="flex h-[400px] items-center justify-center text-[#969DA8]">
              {errorMessage}
            </p>
          ) : movies.length === 0 ? (
            <p className="flex h-[400px] items-center justify-center text-[18px] leading-[24.3px] font-bold">
              검색 결과가 없어요.
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-x-10">
              {movies.map((movie) => (
                <li
                  key={movie.id}
                  className="flex gap-[18px] border-b border-[#E5E7EB] py-5"
                >
                  <div className="relative shrink-0">
                    <MovieImage
                      src={getTmdbPosterUrl(movie.poster_path)}
                      alt={`${movie.title} 포스터`}
                      className="h-[190px] w-[126px] rounded-[10px]"
                    />
                    <BookmarkButton
                      movieId={movie.id}
                      className="top-2 right-2 h-7 w-7"
                    />
                  </div>

                  <div className="flex w-[476px] flex-col items-start gap-2">
                    <h3 className="text-[18px] leading-[24.3px] font-bold">
                      {movie.title}
                    </h3>
                    <p className="flex gap-2 text-[12px] leading-none font-normal text-[#969DA8]">
                      <span>{movie.original_title}</span>
                      <span>{formatReleaseDate(movie.release_date)}</span>
                    </p>
                    <p className="text-[12.5px] leading-[20.25px] font-normal text-[#606774]">
                      {movie.overview}
                    </p>
                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                      className="flex h-4 w-[65px] items-center gap-1 text-[12px] leading-none font-extrabold whitespace-nowrap text-[#2563EB]"
                    >
                      상세 보기
                      <svg
                        viewBox="176 80 24 24"
                        className="h-4 w-4"
                        aria-hidden="true"
                      >
                        <path
                          d="M189.3 97.275C189.1 97.075 189.004 96.8334 189.012 96.55C189.021 96.2667 189.125 96.025 189.325 95.825L192.15 93H181C180.717 93 180.479 92.904 180.287 92.712C180.096 92.5207 180 92.2834 180 92C180 91.7167 180.096 91.479 180.287 91.287C180.479 91.0957 180.717 91 181 91H192.15L189.3 88.15C189.1 87.95 189 87.7124 189 87.437C189 87.1624 189.1 86.925 189.3 86.725C189.5 86.525 189.738 86.425 190.013 86.425C190.288 86.425 190.525 86.525 190.725 86.725L195.3 91.3C195.4 91.4 195.471 91.5084 195.513 91.625C195.554 91.7417 195.575 91.8667 195.575 92C195.575 92.1334 195.554 92.2584 195.513 92.375C195.471 92.4917 195.4 92.6 195.3 92.7L190.7 97.3C190.517 97.4834 190.288 97.575 190.013 97.575C189.738 97.575 189.5 97.475 189.3 97.275Z"
                          fill="currentColor"
                        />
                      </svg>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-10 left-1/2 -translate-x-1/2 rounded-lg bg-[#17191E] px-5 py-3 text-[14px] text-white shadow-lg"
        >
          {toastMessage}
        </div>
      )}
    </main>
  );
}