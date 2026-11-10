import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-[#eee] bg-white px-8 py-4">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <img
            src="/icons/movie-icons/movie.svg"
            alt="UMCine 로고"
            className="h-6 w-6"
          />
          <span className="text-[20px] font-bold text-black">UMCine</span>
        </div>
        <nav className="flex gap-5">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            className="text-[14px] text-[#333]"
            activeProps={{ className: "font-bold underline" }}
          >
            영화
          </Link>
          <Link
            to="/search"
            className="text-[14px] text-[#333]"
            activeProps={{ className: "font-bold underline" }}
          >
            검색
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <button className="flex cursor-pointer items-center">
          <img
            src="/icons/movie-icons/search.svg"
            alt="검색"
            className="h-5 w-5"
          />
        </button>
        <Link
          to="/me"
          className="cursor-pointer rounded-[6px] bg-[#2563EB] px-4 py-2 text-[14px] text-white"
        >
          마이페이지
        </Link>
      </div>
    </header>
  );
}
