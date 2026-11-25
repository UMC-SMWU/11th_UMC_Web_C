import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MovieGrid from "../../components/movies/movie-grid";
import { movieQueries } from "../../api/movies/movie-queries";
import { cn } from "../../utils/cn";

const MAX_PAGE = 500; // TMDB는 500페이지까지만 조회할 수 있어요.

export function MovieListPage() {
  const [page, setPage] = useState(1);

  const moviesQuery = useQuery(movieQueries.list(page));

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = Math.min(moviesQuery.data?.total_pages ?? 0, MAX_PAGE);

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0 });
  };

  const startPage = Math.max(1, page - 2);
  const endPage = Math.min(totalPages, startPage + 4);
  const pageNumbers = Array.from(
    { length: Math.max(0, endPage - startPage + 1) },
    (_, index) => startPage + index,
  );

  return (
    <main className="mx-auto max-w-[1440px] p-8">
      <h2 className="mb-6 h-[44px] text-[38px] leading-[44px] font-bold tracking-[-1.71px] whitespace-nowrap text-[#17191E]">
        영화 목록
      </h2>

      {moviesQuery.isPending ? (
        <p className="text-[#6B7280]">영화 목록을 불러오는 중이에요.</p>
      ) : moviesQuery.isError ? (
        <p className="text-red-500">영화 목록을 불러오지 못했어요.</p>
      ) : movies.length === 0 ? (
        <p className="text-[#6B7280]">조건에 맞는 영화가 없어요.</p>
      ) : (
        <>
          <MovieGrid movies={movies} />

          <nav className="mt-8 flex items-center justify-center gap-2">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
              className="h-8 w-8 text-[#17191E] disabled:text-[#D1D5DB]"
              aria-label="이전 페이지"
            >
              ‹
            </button>
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => handlePageChange(pageNumber)}
                className={cn(
                  "h-8 w-8 rounded-md text-[13px] font-bold",
                  pageNumber === page
                    ? "bg-[#17191E] text-white"
                    : "text-[#6B7280]",
                )}
              >
                {pageNumber}
              </button>
            ))}
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => handlePageChange(page + 1)}
              className="h-8 w-8 text-[#17191E] disabled:text-[#D1D5DB]"
              aria-label="다음 페이지"
            >
              ›
            </button>
          </nav>
        </>
      )}
    </main>
  );
}