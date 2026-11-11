import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
    getTmdbBackdropUrl,
    getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";

function formatRuntime(runtime: number | null) {
    if (runtime === null) return "상영 시간 정보가 없어요.";
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`;
}

export function MovieDetailPage() {
    const { movieId: movieIdParam } = useParams({ from: "/movies/$movieId" });
    const movieId = Number(movieIdParam);
    const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

    const movieDetailQuery = useQuery({
        queryKey: ["movies", "detail", movieId],
        queryFn: () => getMovieDetail(movieId),
        enabled: isValidMovieId,
        staleTime: 30 * 1000,
    });

    if (!isValidMovieId) {
        return <main className="p-12 text-black">올바르지 않은 영화 번호예요.</main>;
    }

    if (movieDetailQuery.isPending) {
        return <main className="p-12 text-black">영화 정보를 불러오는 중이에요.</main>;
    }

    if (movieDetailQuery.isError) {
        return (
            <main className="p-12 text-black">
                {getMovieDetailErrorMessage(movieDetailQuery.error)}
            </main>
        );
    }

    const movie = movieDetailQuery.data;
    const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
    const posterUrl = getTmdbPosterUrl(movie.poster_path);

    return (
        <main className="min-h-screen bg-slate-50 text-left text-black">
            <div className="relative h-[400px] w-full bg-gray-300">
                {backdropUrl ? (
                    <img
                        src={backdropUrl}
                        alt=""
                        aria-hidden="true"
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                        이미지 없음
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute inset-x-0 top-0 mx-auto max-w-6xl px-6 pt-6">
                    <Link to="/" className="text-sm text-white no-underline">
                        ‹ 영화 목록
                    </Link>
                </div>

                <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-6 pb-6 text-white">
                    <h1 className="text-5xl font-bold">{movie.title}</h1>
                    <p className="mt-2 text-sm">{movie.original_title}</p>
                    <p className="mt-1 flex gap-3 text-sm font-semibold">
                        <span>{movie.release_date.replaceAll("-", ".")}</span>
                        <span>{movie.genres.map((genre) => genre.name).join(" · ")}</span>
                        <span>{formatRuntime(movie.runtime)}</span>
                    </p>
                </div>
            </div>

            <div className="mx-auto flex max-w-6xl gap-8 px-6 py-8">
                {posterUrl ? (
                    <img
                        src={posterUrl}
                        alt={`${movie.title} 포스터`}
                        className="w-56 shrink-0 self-start rounded-xl shadow-lg"
                    />
                ) : (
                    <div className="flex aspect-[2/3] w-56 shrink-0 items-center justify-center rounded-xl bg-gray-200 text-sm text-gray-500">
                        이미지 없음
                    </div>
                )}

                <div className="min-w-0 flex-1">
                    {movie.tagline && (
                        <h2 className="text-xl font-bold !text-black">{movie.tagline}</h2>
                    )}
                    <p className="mt-3 leading-7 text-gray-600">{movie.overview}</p>
                </div>
            </div>
        </main>
    );
}