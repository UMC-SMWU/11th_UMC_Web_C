import { Link } from "@tanstack/react-router";
import { useQueries, useQuery } from "@tanstack/react-query";
import { isHTTPError } from "ky";
import { useState } from "react";
import { getMe } from "../../api/members/me";
import { movieQueries } from "../../api/movies/movie-queries";
import MovieGrid from "../../components/movies/movie-grid";
import { MovieImage } from "../../components/movies/movie-image";
import { Pagination } from "../../components/movies/pagination";
import { useFavoritesQuery } from "../../hooks/use-favorite-queries";
import { useMyRatingsQuery } from "../../hooks/use-my-ratings-query";
import { useAuthStore } from "../../stores/auth-store";
import { useProfileStore } from "../../stores/profile-store";
import { formatReleaseDate } from "../../utils/movies/format-movie";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

const FAVORITES_PER_PAGE = 10;

const SERVER_ERROR_MESSAGE =
  "서버에 연결하지 못했어요. 백엔드 서버가 켜져 있는지 확인해 주세요.";

function BasicInfo() {
  const profileImageUrl = useProfileStore((state) => state.profileImageUrl);
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const nickname = !accessToken
    ? "로그인이 필요해요."
    : meQuery.isPending
      ? "불러오는 중..."
      : meQuery.isError
        ? "정보를 불러오지 못했어요."
        : meQuery.data.nickname;
  const email = meQuery.data?.email ?? "-";

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
  // 서버가 최근에 등록한 순서로 내려줘요.
  const favoritesQuery = useFavoritesQuery();
  const [page, setPage] = useState(1);

  const movieIds = (favoritesQuery.data ?? []).map(
    (favorite) => favorite.movieId,
  );
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

      {favoritesQuery.isPending ? (
        <p className="py-10 text-center text-[#969DA8]">
          즐겨찾기 목록을 불러오는 중이에요.
        </p>
      ) : favoritesQuery.isError ? (
        <p className="py-10 text-center text-[#969DA8]">
          즐겨찾기 목록을 불러오지 못했어요.
        </p>
      ) : movieIds.length === 0 ? (
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
  // 토큰에서 꺼낸 memberId로 내 평점을 불러와요. 영화 상세의 내 평점과 같은 query예요.
  const myRatingsQuery = useMyRatingsQuery();
  const ratings = myRatingsQuery.data ?? [];

  // 평점마다 영화 정보를 불러와요. 영화 상세 화면과 캐시를 함께 써요.
  const movieDetailQueries = useQueries({
    queries: ratings.map((rating) => movieQueries.detail(rating.movieId)),
  });
  const items = ratings.map((rating, index) => ({
    rating,
    movie: movieDetailQueries[index]?.data ?? null,
  }));

  const isLoading = myRatingsQuery.isPending;
  const errorMessage = myRatingsQuery.isError
    ? getRatingsErrorMessage(myRatingsQuery.error)
    : null;

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
