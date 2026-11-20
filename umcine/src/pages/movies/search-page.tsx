import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchMovies } from "../../api/movies/search-movies";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function SearchPage() {
    const { query } = useSearch({ from: "/search" });
    const navigate = useNavigate({ from: "/search" });
    const [searchText, setSearchText] = useState(query ?? "");

    const normalizedQuery = query?.trim() ?? "";

    const searchQuery = useQuery({
        queryKey: ["movies", "search", { query: normalizedQuery }],
        queryFn: () => searchMovies({ query: normalizedQuery }),
        enabled: normalizedQuery.length > 0,
    });

    const searchResults = searchQuery.data?.results ?? [];
    const totalPages = searchQuery.data?.total_pages ?? 0;

    useEffect(() => {
        setSearchText(query ?? "");
    }, [query]);

    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const nextQuery = searchText.trim();
        navigate({
            search: nextQuery ? { query: nextQuery } : {},
        });
    }

    return (
        <main className="mx-auto w-full max-w-6xl px-6 py-10 text-left text-black">
            <h1 className="text-4xl font-bold">영화 검색</h1>

            <form
                onSubmit={handleSubmit}
                className="mt-8 flex items-center gap-3 rounded-xl bg-white p-2 shadow-sm"
            >
                <svg
                    className="ml-3 h-5 w-5 shrink-0 text-gray-700"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                </svg>
                <input
                    aria-label="검색어"
                    className="h-10 flex-1 bg-transparent outline-none"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                />
                {searchText && (
                    <button
                        type="button"
                        aria-label="검색어 지우기"
                        className="px-2 text-gray-500"
                        onClick={() => setSearchText("")}
                    >
                        ✕
                    </button>
                )}
                <button
                    type="submit"
                    className="h-10 rounded-lg bg-black px-5 font-semibold text-white"
                >
                    {normalizedQuery ? "다시 검색" : "검색"}
                </button>
            </form>

            {!normalizedQuery ? (
                <p className="mt-8 text-gray-500">검색어를 입력해 주세요.</p>
            ) : searchQuery.isLoading ? (
                <p className="mt-8 text-gray-500">검색 결과를 불러오는 중이에요.</p>
            ) : searchQuery.isError ? (
                <p className="mt-8 text-gray-500">{searchQuery.error.message}</p>
            ) : searchQuery.isSuccess && searchResults.length === 0 ? (
                <p className="mt-8 text-gray-500">검색 결과가 없어요.</p>
            ) : (
                <>
                    <div className="mt-8 flex items-end justify-between border-b border-gray-200 pb-3">
                        <h2 className="text-xl font-bold">‘{query}’ 검색 결과</h2>
                        <p className="text-sm text-gray-400">
                            영화 {searchResults.length}편 · {totalPages}페이지
                        </p>
                    </div>

                    <ul className="mt-6 grid grid-cols-2 gap-x-12 gap-y-8">
                        {searchResults.map((movie) => {
                            const posterUrl = getTmdbPosterUrl(movie.poster_path);

                            return (
                                <li key={movie.id} className="flex gap-5 text-left">
                                    {posterUrl ? (
                                        <img
                                            src={posterUrl}
                                            alt={`${movie.title} 포스터`}
                                            className="h-52 w-36 shrink-0 rounded-xl object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-52 w-36 shrink-0 items-center justify-center rounded-xl bg-gray-200 text-sm text-gray-500">
                                            이미지 없음
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <h3 className="text-xl font-bold">{movie.title}</h3>
                                        <p className="mt-1 text-sm text-gray-400">
                                            {movie.original_title} {movie.release_date}
                                        </p>
                                        <p className="mt-3 line-clamp-3 text-sm text-gray-600">
                                            {movie.overview}
                                        </p>
                                        <Link
                                            to="/movies/$movieId"
                                            params={{ movieId: String(movie.id) }}
                                            className="mt-3 inline-block text-sm font-semibold text-blue-600"
                                        >
                                            상세 보기 →
                                        </Link>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </>
            )}
        </main>
    );
}