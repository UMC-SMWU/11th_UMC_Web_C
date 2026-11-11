import { Link } from "@tanstack/react-router";

const MY_INFO = {
    nickname: "gs0428",
    email: "gwangsoo@cinemalab.kr",
};

const FAVORITES = [
    { id: 1, title: "스파이더맨: 브랜드 뉴 데이", releaseDate: "2026.07.29" },
    { id: 2, title: "오디세이", releaseDate: "2026.08.05" },
    { id: 3, title: "미니언즈 & 몬스터즈", releaseDate: "2026.07.15" },
    ];

    const SECTION_TITLE_CLASS = "!mb-4 !text-sm !font-bold !text-black";

    export function MyPage() {
    return (
        <div className="flex-1 bg-gray-50">
        <div className="mx-auto w-full max-w-[1126px] px-8 py-8 text-left">
            <div className="flex items-center justify-between border-b border-gray-200 pb-5">
            <h1 className="!m-0 !text-[28px] font-bold !leading-tight !text-black">
                내 정보
            </h1>
            <Link
                to="/my/edit"
                className="flex h-9 items-center rounded-lg bg-[#4f63e8] px-4 text-xs font-bold !text-white no-underline"
                >
                정보 수정
            </Link>
            </div>

            <section className="border-b border-gray-200 py-6">
            <h2 className={SECTION_TITLE_CLASS}>기본 정보</h2>
            <div className="flex items-center gap-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-gray-800">
                <svg
                    className="h-7 w-7"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" />
                </svg>
                </div>
                <div className="grid flex-1 grid-cols-2 gap-6">
                <div>
                    <p className="mb-1 text-[11px] !text-gray-400">닉네임</p>
                    <p className="text-sm font-bold !text-black">
                    {MY_INFO.nickname}
                    </p>
                </div>
                <div>
                    <p className="mb-1 text-[11px] !text-gray-400">이메일</p>
                    <p className="text-sm font-bold !text-black">{MY_INFO.email}</p>
                </div>
                </div>
            </div>
            </section>

            <section className="py-6">
            <h2 className={SECTION_TITLE_CLASS}>내 즐겨찾기</h2>
            <div className="grid w-full grid-cols-5 gap-6">
                {FAVORITES.map((movie) => (
                <div key={movie.id} className="flex w-full flex-col gap-2">
                    <div className="flex aspect-[2/3] w-full items-center justify-center rounded-xl bg-gray-200 text-sm text-gray-500">
                    이미지 없음
                    </div>
                    <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold !text-black">
                    {movie.title}
                    </p>
                    <p className="text-xs !text-gray-400">{movie.releaseDate}</p>
                </div>
                ))}
            </div>

            <div className="mt-8 flex items-center justify-center gap-2">
                <button
                type="button"
                disabled
                className="px-3 py-2 text-gray-300"
                >
                ‹
                </button>
                <button
                type="button"
                className="h-9 w-9 rounded-lg bg-black text-sm !text-white"
                >
                1
                </button>
                <button
                type="button"
                disabled
                className="px-3 py-2 text-gray-300"
                >
                ›
                </button>
            </div>
            </section>
        </div>
        </div>
    );
}