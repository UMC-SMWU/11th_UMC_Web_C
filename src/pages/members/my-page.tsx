import { Link } from "@tanstack/react-router";
import { isHTTPError } from "ky";
import { useEffect, useState, type SubmitEvent } from "react";
import { checkEmail } from "../../api/members/check-email";
import { checkNickname } from "../../api/members/check-nickname";
import { getMemberRatings } from "../../api/members/get-member-ratings";
import type { AvailabilityResponse, MemberRating } from "../../api/members/models";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { MovieImage } from "../../components/movies/movie-image";
import { cn } from "../../utils/cn";
import { formatReleaseDate } from "../../utils/movies/format-movie";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

// 로그인 기능(7주차) 전까지는 시드 데이터의 회원으로 고정해요.
const CURRENT_MEMBER_ID = 1;

const SERVER_ERROR_MESSAGE =
  "서버에 연결하지 못했어요. 백엔드 서버가 켜져 있는지 확인해 주세요.";

type CheckStatus =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "done"; available: boolean }
  | { type: "error"; message: string };

interface AvailabilityCheckFormProps {
  label: string;
  inputType: "text" | "email";
  placeholder: string;
  availableMessage: string;
  unavailableMessage: string;
  check: (value: string) => Promise<AvailabilityResponse>;
}

function AvailabilityCheckForm({
  label,
  inputType,
  placeholder,
  availableMessage,
  unavailableMessage,
  check,
}: AvailabilityCheckFormProps) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<CheckStatus>({ type: "idle" });

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      setStatus({ type: "error", message: `${label}을 입력해 주세요.` });
      return;
    }

    setStatus({ type: "loading" });

    try {
      const response = await check(trimmedValue);
      setStatus({ type: "done", available: response.available });
    } catch (error) {
      setStatus({
        type: "error",
        message: isHTTPError(error)
          ? `${label}을 확인하지 못했어요. (${error.response.status})`
          : SERVER_ERROR_MESSAGE,
      });
    }
  }

  return (
    <section className="flex flex-col gap-3 rounded-[12px] border border-[#E5E7EB] bg-white p-6">
      <h3 className="text-[18px] leading-none font-bold">{label} 중복 확인</h3>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type={inputType}
          aria-label={label}
          placeholder={placeholder}
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setStatus({ type: "idle" });
          }}
          className="h-[42px] flex-1 rounded-lg border border-[#E5E7EB] px-3 text-[14px] outline-none placeholder:text-[#969DA8] focus:border-[#17191E]"
        />
        <button
          type="submit"
          disabled={status.type === "loading"}
          className="h-[42px] rounded-lg bg-[#17191E] px-4 text-[14px] leading-none font-extrabold whitespace-nowrap text-white disabled:opacity-50"
        >
          {status.type === "loading" ? "확인 중..." : "중복 확인"}
        </button>
      </form>
      <p
        role="status"
        className={cn(
          "min-h-5 text-[13px]",
          status.type === "done" && status.available && "text-[#2563EB]",
          status.type === "done" && !status.available && "text-[#DC2626]",
          status.type === "error" && "text-[#969DA8]",
        )}
      >
        {status.type === "done" &&
          (status.available ? availableMessage : unavailableMessage)}
        {status.type === "error" && status.message}
      </p>
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
    <main className="mx-auto flex max-w-[1440px] flex-col gap-6 p-8">
      <h2 className="h-[44px] text-[38px] leading-[44px] font-bold tracking-[-1.71px] text-[#17191E]">
        마이페이지
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <AvailabilityCheckForm
          label="닉네임"
          inputType="text"
          placeholder="예: 노코"
          availableMessage="사용 가능한 닉네임이에요."
          unavailableMessage="이미 사용 중인 닉네임이에요."
          check={checkNickname}
        />
        <AvailabilityCheckForm
          label="이메일"
          inputType="email"
          placeholder="예: noco@umc.com"
          availableMessage="사용 가능한 이메일이에요."
          unavailableMessage="이미 사용 중인 이메일이에요."
          check={checkEmail}
        />
      </div>

      <MyRatings />
    </main>
  );
}
