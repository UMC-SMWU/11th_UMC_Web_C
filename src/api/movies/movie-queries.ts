import { queryOptions } from "@tanstack/react-query";
import { getMovieDetail } from "./get-movie-detail";
import { getMovies } from "./get-movies";
import { searchMovies } from "./search-movies";

export const movieQueries = {
  all: () => ["movies"] as const,

  list: (page: number) =>
    queryOptions({
      queryKey: [...movieQueries.all(), "list", { page }],
      queryFn: () => getMovies({ page }),
    }),

  search: (query: string) =>
    queryOptions({
      queryKey: [...movieQueries.all(), "search", { query }],
      queryFn: () => searchMovies({ query }),
      enabled: query.length > 0,
    }),

  detail: (movieId: number) =>
    queryOptions({
      queryKey: [...movieQueries.all(), "detail", movieId],
      queryFn: () => getMovieDetail(movieId),
      enabled: Number.isInteger(movieId) && movieId > 0,
      staleTime: 30 * 1000,
    }),
};
