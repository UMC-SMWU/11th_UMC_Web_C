import { Link } from "@tanstack/react-router";
import { useQueries } from "@tanstack/react-query";
import { isHTTPError } from "ky";
import { useEffect, useState } from "react";
import { getMemberRatings } from "../../api/members/get-member-ratings";
import type { MemberRating } from "../../api/members/models";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { movieQueries } from "../../api/movies/movie-queries";
import MovieGrid from "../../components/movies/movie-grid";
import { MovieImage } from "../../components/movies/movie-image";
import { Pagination } from "../../components/movies/pagination";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { useProfileStore } from "../../stores/profile-store";
import { formatReleaseDate } from "../../utils/movies/format-movie";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

// 로그인 기능 전까지는 시드 데이터의 회원으로 고정해요.
const CURRENT_MEMBER_ID = 1;

const FAVORITES_PER_PAGE = 10;

const SERVER_ERROR_MESSAGE =
  "서버에 연결하지 못했어요. 백엔드 서버가 켜져 있는지 확인해 주세요.";

function BasicInfo() {
  const { nickname, email, profileImageUrl } = useProfileStore();

  return (
    <section className="border-t border-[#E5E7EB] pt-5">
      <h3 className="text-[16px] leading-none font-bold">기본 정보</h3>
      <div className="mt-5 flex items-center gap-8 border-b border-[#E5E7EB] pb-5">
        <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E5E7EB]">
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt="프로필 이미지"
              className="h-full w-full object-cover"
            />
          ) : (
            <img src="/icons/movie-icons/person.svg" alt="" className="h-9 w-9" />
          )}
        </div>
        <dl className="grid flex-1 grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <dt className="text-[11px] leading-none text-[#969DA8]">닉네임</dt>
            <dd className="text-[15px] leading-none font-bold">
              {nickname}
            </dd>
          </div>
          <div className="flex flex-col gap-1.5">
            <dt className="text-[11px] leading-none text-[#969DA8]">이메일</dt>
            <dd className="text-[15px] leading-none font-bold">
              {email}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

function MyFavorites() {
  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );
  const [page, setPage] = useState(1);

  // 최근에 즐겨찾기한 영화가 먼저 보이도록 뒤집어요.
  const movieIds = [...bookmarkedMovieIds].reverse();
  const totalPages = Math.max(
    1,
    Math.ceil(movieIds.length / FAVORITES_PER_PAGE),
  );
  // 즐겨찾기를 해제해 페이지 수가 줄어도 빈 페이지에 머물지 않게 해요.
  const currentPage = Math.min(page, totalPages);
  const pageMovieIds = movieIds.slice(
    (currentPage - 1) * FAVORITES_PER_PAGE,
    currentPage * FAVORITES_PER_PAGE,
  );

  // 상세 화면과 같은 query를 사용해 캐시를 함께 써요.
  const detailQueries = useQueries({
    queries: pageMovieIds.map((movieId) => movieQueries.detail(movieId)),
  });
  const isLoading = detailQueries.some((query) => query.isPending);
  const isError = detailQueries.some((query) => query.isError);
  const movies = detailQueries.flatMap((query) =>
    query.data ? [query.data] : [],
  );

  return (
    <section>
      <h3 className="mb-5 text-[16px] leading-none font-bold">내 즐겨찾기</h3>

      {movieIds.length === 0 ? (
        <p className="py-10 text-center text-[#969DA8]">
          아직 즐겨찾기한 영화가 없어요.
        </p>
      ) : isLoading ? (
        <p className="py-10 text-center text-[#969DA8]">
          즐겨찾기 목록을 불러오는 중이에요.
        </p>
      ) : isError && movies.length === 0 ? (
        <p className="py-10 text-center text-[#969DA8]">
          즐겨찾기 목록을 불러오지 못했어요.
        </p>
      ) : (
        <>
          <MovieGrid movies={movies} />
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </section>
  );
}

interface RatingWithMovie {
  rating: MemberRating;
  movie: TmdbMovieDetail | null;
}

function getRatingsErrorMessage(error: unknown) {
  if (isHTTPError(error) && error.response.status === 404) {
    return "존재하지 않는 회원이에요.";
  }
  if (isHTTPError(error)) {
    return "평점 목록을 불러오지 못했어요.";
  }
  return SERVER_ERROR_MESSAGE;
}

function MyRatings() {
  const [items, setItems] = useState<RatingWithMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadRatings() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const ratings = await getMemberRatings(CURRENT_MEMBER_ID);
        const movieResults = await Promise.allSettled(
          ratings.map((rating) => getMovieDetail(rating.movieId)),
        );

        if (!ignore) {
          setItems(
            ratings.map((rating, index) => {
              const result = movieResults[index];
              return {
                rating,
                movie: result.status === "fulfilled" ? result.value : null,
              };
            }),
          );
        }
      } catch (error) {
        if (!ignore) setErrorMessage(getRatingsErrorMessage(error));
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadRatings();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="flex flex-col gap-4 rounded-[12px] border border-[#E5E7EB] bg-white p-6">
      <h3 className="text-[18px] leading-none font-bold">내 평점</h3>

      {isLoading ? (
        <p className="py-10 text-center text-[#969DA8]">
          평점 목록을 불러오는 중이에요.
        </p>
      ) : errorMessage ? (
        <p className="py-10 text-center text-[#969DA8]">{errorMessage}</p>
      ) : items.length === 0 ? (
        <p className="py-10 text-center text-[#969DA8]">
          아직 남긴 평점이 없어요.
        </p>
      ) : (
        <ul className="flex flex-col">
          {items.map(({ rating, movie }) => (
            <li
              key={rating.ratingId}
              className="flex gap-4 border-b border-[#E5E7EB] py-4 last:border-b-0"
            >
              <Link
                to="/movies/$movieId"
                params={{ movieId: String(rating.movieId) }}
                className="shrink-0"
              >
                <MovieImage
                  src={getTmdbPosterUrl(movie?.poster_path ?? null)}
                  alt={movie ? `${movie.title} 포스터` : "영화 포스터"}
                  className="h-[120px] w-[80px] rounded-[8px]"
                />
              </Link>
              <div className="flex flex-col gap-2">
                <Link
                  to="/movies/$movieId"
                  params={{ movieId: String(rating.movieId) }}
                  className="text-[16px] leading-none font-bold"
                >
                  {movie ? movie.title : `영화 #${rating.movieId}`}
                </Link>
                <div
                  className="flex gap-0.5"
                  aria-label={`${rating.score}점 / 5점`}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <img
                      key={star}
                      src={
                        star <= rating.score
                          ? "/icons/movie-icons/star.svg"
                          : "/icons/movie-icons/star-outline.svg"
                      }
                      alt=""
                      className="h-4 w-4"
                    />
                  ))}
                </div>
                {rating.comment && (
                  <p className="text-[14px] leading-6 text-[#606774]">
                    {rating.comment}
                  </p>
                )}
                <p className="text-[12px] leading-none text-[#969DA8]">
                  {formatReleaseDate(rating.createdAt.slice(0, 10))}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function MyPage() {
  return (
    <main className="mx-auto flex max-w-[1440px] flex-col gap-8 px-20 py-8">
      <div className="flex items-center justify-between">
        <h2 className="h-[44px] text-[38px] leading-[44px] font-bold tracking-[-1.71px] text-[#17191E]">
          내 정보
        </h2>
        <Link
          to="/me/edit"
          className="flex h-[34px] items-center rounded-[6px] bg-[#2563EB] px-4 text-[12px] font-extrabold text-white"
        >
          정보 수정
        </Link>
      </div>

      <BasicInfo />
      <MyFavorites />
      <MyRatings />
    </main>
  );
}
