import { Link } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { useLoginMutation } from "@/hooks/use-login-mutation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEFAULT_FORM = {
  email: "",
  password: "",
};

type LoginFormKey = keyof typeof DEFAULT_FORM;

export function LoginPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const loginMutation = useLoginMutation();

  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const canSubmit = isEmailValid && form.password.length > 0;

  const handleChangeField = (key: LoginFormKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({
      email: form.email.trim(),
      password: form.password,
    });
  };

  const inputClassName =
    "h-[48px] w-full rounded-[6px] border border-[#E5E7EB] bg-white pr-3 pl-9 text-[13px] text-[#17191E] outline-none placeholder:text-[#969DA8] focus:border-[#2563EB]";
  const iconClassName =
    "pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 opacity-40";

  return (
    <main className="mx-auto w-full max-w-[464px] px-4 pt-[150px] pb-[120px]">
      <h1 className="text-[38px] leading-[44px] font-bold tracking-[-1.71px] text-[#17191E]">
        로그인
      </h1>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-5 flex flex-col gap-6"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-[12px] leading-none font-bold">
            이메일
          </label>
          <div className="relative">
            <img
              src="/icons/movie-icons/mail.svg"
              alt=""
              className={iconClassName}
            />
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => handleChangeField("email", e.target.value)}
              className={inputClassName}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="password"
            className="text-[12px] leading-none font-bold"
          >
            비밀번호
          </label>
          <div className="relative">
            <img
              src="/icons/movie-icons/lock.svg"
              alt=""
              className={iconClassName}
            />
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="비밀번호"
              value={form.password}
              onChange={(e) => handleChangeField("password", e.target.value)}
              className={inputClassName}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSubmit || loginMutation.isPending}
          className="h-[46px] w-full rounded-[6px] bg-[#2563EB] text-[13px] font-extrabold text-white disabled:opacity-40"
        >
          {loginMutation.isPending ? "로그인 중" : "로그인"}
        </button>
      </form>

      <p className="mt-4 text-center text-[12px] text-[#606774]">
        처음이신가요?{" "}
        <Link to="/signup" className="font-extrabold text-[#2563EB]">
          회원가입
        </Link>
      </p>
    </main>
  );
}
