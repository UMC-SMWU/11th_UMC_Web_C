import { Link } from "@tanstack/react-router";

export function Header() {
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
                <button className="border-none bg-transparent">
                    <img src="/icons/search.svg" alt="검색" className="h-5 w-5" />
                </button>
                <button className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">
                    로그인
                </button>
            </div>
        </header>
    );
}