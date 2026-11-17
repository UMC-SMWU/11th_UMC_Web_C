import MovieCard from "./movie-card";
import type { TmdbMovie } from "../../api/movies/models";

interface MovieGridProps {
  movies: TmdbMovie[];
}

export default function MovieGrid({ movies }: MovieGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
