import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getMe } from "@/api/members/me";
import { useAuthStore } from "@/stores/auth-store";

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
          <Link
            to="/me"
            className="text-[14px] text-[#333]"
            activeProps={{ className: "font-bold underline" }}
          >
            내 정보
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
        {!accessToken ? (
          <Link
            to="/login"
            className="cursor-pointer rounded-[6px] bg-[#2563EB] px-4 py-2 text-[14px] text-white"
          >
            로그인
          </Link>
        ) : meQuery.isLoading ? (
          <span className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
        ) : (
          <Link
            to="/me"
            className="cursor-pointer rounded-[6px] bg-[#2563EB] px-4 py-2 text-[14px] text-white"
          >
            마이페이지
          </Link>
        )}
      </div>
    </header>
  );
}
