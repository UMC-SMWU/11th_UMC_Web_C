import { useState } from "react";

const DEFAULT_FORM = {
    nickname: "gs0428",
    email: "gwangsoo@cinemalab.kr",
};

const LABEL_CLASS = "mb-1.5 block text-xs font-bold !text-black";
const INPUT_CLASS =
    "h-11 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-sm !text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#4f63e8]";

    export function MyEditPage() {
    const [form, setForm] = useState(DEFAULT_FORM);

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    return (
        <div className="flex-1 bg-gray-50">
        <form
            onSubmit={handleSubmit}
            noValidate
            className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-[1126px] flex-col px-8 py-8 text-left"
        >
            <div className="flex items-start justify-between">
            <div>
                <h1 className="!m-0 !text-[28px] font-bold !leading-tight !text-black">
                내 정보 수정
                </h1>
                <p className="mt-1 text-xs !text-gray-500">
                닉네임과 프로필 이미지를 변경할 수 있어요.
                </p>
            </div>
            <button
                type="submit"
                className="h-9 rounded-lg bg-[#4f63e8] px-4 text-xs font-bold !text-white"
            >
                변경사항 저장
            </button>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-8">
            <div className="flex flex-col items-center">
                <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 text-gray-800">
                    <svg
                    className="h-8 w-8"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" />
                    </svg>
                </div>
                <button
                    type="button"
                    aria-label="프로필 이미지 변경"
                    className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-black !text-white"
                >
                    <svg
                    className="h-3 w-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
                    </svg>
                </button>
                </div>
                <p className="mt-3 text-xs font-bold !text-black">프로필 이미지</p>
                <p className="mt-0.5 text-[11px] !text-gray-400">
                선택 사항 · 최대 5MB
                </p>
            </div>

            <div>
                <div className="mb-4">
                <label htmlFor="nickname" className={LABEL_CLASS}>
                    닉네임
                </label>
                <div className="relative">
                    <input
                    id="nickname"
                    type="text"
                    className={`${INPUT_CLASS} pr-20`}
                    value={form.nickname}
                    onChange={(e) =>
                        setForm((prev) => ({ ...prev, nickname: e.target.value }))
                    }
                    />
                    <button
                    type="button"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold !text-[#4f63e8]"
                    >
                    중복 확인
                    </button>
                </div>
                </div>

                <div>
                <label htmlFor="email" className={LABEL_CLASS}>
                    이메일
                </label>
                <input
                    id="email"
                    type="email"
                    readOnly
                    className={INPUT_CLASS}
                    value={form.email}
                />
                </div>
            </div>
            </div>

            <div className="mt-auto flex items-center justify-between rounded-lg border border-red-300 bg-red-50 px-5 py-4">
            <div>
                <p className="text-sm font-bold !text-red-600">회원 탈퇴</p>
                <p className="mt-0.5 text-xs !text-red-500">
                탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.
                </p>
            </div>
            <button
                type="button"
                className="h-9 rounded-lg border border-red-300 bg-white px-4 text-xs font-bold !text-red-600"
            >
                회원 탈퇴
            </button>
            </div>
        </form>
        </div>
    );
}