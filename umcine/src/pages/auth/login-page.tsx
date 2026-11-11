import { useState } from "react";
import { Link } from "@tanstack/react-router";

const DEFAULT_FORM = {
    email: "",
    password: "",
    };

    type DefaultFormKey = keyof typeof DEFAULT_FORM;

    const LABEL_CLASS = "mb-1.5 block text-xs font-bold !text-black";
    const INPUT_CLASS =
    "h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3.5 text-sm !text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#4f63e8]";
    const ICON_CLASS =
    "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400";

    export function LoginPage() {
    const [form, setForm] = useState(DEFAULT_FORM);

    const handleChangeField = (key: DefaultFormKey, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    return (
        <div className="flex min-h-[calc(100vh-64px)] justify-center bg-gray-50 px-4 pt-32">
        <form
            onSubmit={handleSubmit}
            noValidate
            className="w-full max-w-[420px] self-start text-left"
        >
            <h1 className="mb-5 !text-[28px] font-bold !leading-tight !text-black">
            로그인
            </h1>

            <div className="mb-4">
            <label htmlFor="email" className={LABEL_CLASS}>
                이메일
            </label>
            <div className="relative">
                <svg
                className={ICON_CLASS}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
                </svg>
                <input
                id="email"
                type="email"
                placeholder="name@example.com"
                className={INPUT_CLASS}
                value={form.email}
                onChange={(e) => handleChangeField("email", e.target.value)}
                />
            </div>
            </div>

            <div className="mb-5">
            <label htmlFor="password" className={LABEL_CLASS}>
                비밀번호
            </label>
            <div className="relative">
                <svg
                className={ICON_CLASS}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                >
                <rect x="4" y="11" width="16" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
                <input
                id="password"
                type="password"
                placeholder="비밀번호"
                className={INPUT_CLASS}
                value={form.password}
                onChange={(e) => handleChangeField("password", e.target.value)}
                />
            </div>
            </div>

            <button
            type="submit"
            className="h-11 w-full rounded-lg bg-[#4f63e8] text-sm font-bold !text-white"
            >
            로그인
            </button>

            <p className="mt-4 text-center text-xs !text-gray-500">
            처음이신가요?{" "}
            <Link to="/signup" className="font-bold !text-[#4f63e8] no-underline">
                회원가입
            </Link>
            </p>
        </form>
        </div>
    );
}