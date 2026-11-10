import { Link } from "@tanstack/react-router";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { formatReleaseDate } from "../../utils/movies/format-movie";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { BookmarkButton } from "../bookmark-button";
import { MovieImage } from "./movie-image";

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="flex flex-col">
      <div className="relative">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <MovieImage
            src={getTmdbPosterUrl(movie.poster_path)}
            alt={movie.title}
            className="aspect-[241.6/274] w-full rounded-[10px]"
          />
        </Link>
        <BookmarkButton movieId={movie.id} />
      </div>
      <h3 className="mt-3 text-[14px] font-extrabold leading-none text-[#17191E]">
        {movie.title}
      </h3>
      <p className="mt-1 text-[12px] font-normal leading-none text-[#969DA8]">
        {formatReleaseDate(movie.release_date)}
      </p>
    </div>
  );
}
