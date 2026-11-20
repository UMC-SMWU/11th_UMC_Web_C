import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";

export function Header() {
    const accessToken = useAuthStore((state) => state.accessToken);
    const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
    });
    return (
        <header className="flex items-center gap-8 border-b border-gray-200 px-6 py-3">
            <div className="flex items-center gap-2">
                <img src="/icons/movie.svg" alt="UMCine" className="h-6 w-6" />
                <span className="text-lg font-bold">UMCine</span>
            </div>

            <nav className="flex gap-6">
                <Link to="/" className="text-sm text-gray-800 no-underline">
                    영화
                </Link>
                <Link to="/search" className="text-sm text-gray-800 no-underline">
                    검색
                </Link>
                <Link
                    to="/my"
                    className="text-sm text-gray-800 no-underline"
                    activeProps={{ className: "!underline" }}
                >
                    내 정보
                </Link>
            </nav>

            <div className="ml-auto flex items-center gap-3">
                <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white">
                    <img src="/icons/search.svg" alt="검색" className="h-4 w-4" />
                </button>
                {!accessToken ? (
                    <Link
                        to="/login"
                        className="flex h-8 items-center rounded-lg bg-[#4f63e8] px-3.5 text-xs font-bold !text-white no-underline"
                    >
                        로그인
                    </Link>
                ) : meQuery.isLoading ? (
                    <span className="h-8 w-20 animate-pulse rounded-lg bg-gray-200" />
                ) : null}
            </div>
        </header>
    );
}