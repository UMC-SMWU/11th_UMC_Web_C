import { Link } from "@tanstack/react-router";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
    movie: TmdbMovieListItem;
}

export default function MovieCard({ movie }: MovieCardProps) {
    const posterUrl = getTmdbPosterUrl(movie.poster_path);

    return (
        <div className="flex w-full flex-col gap-2">
            <div className="relative w-full">
                <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                    className="block"
                >
                    {posterUrl ? (
                        <img
                            src={posterUrl}
                            alt={movie.title}
                            className="block aspect-[2/3] w-full rounded-xl object-cover"
                        />
                    ) : (
                        <div className="flex aspect-[2/3] w-full items-center justify-center rounded-xl bg-gray-200 text-sm text-gray-500">
                            이미지 없음
                        </div>
                    )}
                </Link>
                <div className="absolute right-2 top-2 rounded-lg bg-black px-2 py-1 text-xs [&_button]:text-white">
                    <BookmarkButton movieId={movie.id} />
                </div>
            </div>
            <Link
                to="/movies/$movieId"
                params={{ movieId: String(movie.id) }}
                className="block"
            >
                <p className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-left text-sm font-semibold text-black">
                    {movie.title}
                </p>
            </Link>
            <p className="m-0 text-left text-xs text-gray-400">
                {movie.release_date}
            </p>
        </div>
    );
}