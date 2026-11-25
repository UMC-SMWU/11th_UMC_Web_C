import { useNavigate } from "@tanstack/react-router";
import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { checkNickname as checkNicknameDuplicate } from "@/api/members/check-nickname";
import { useProfileStore } from "@/stores/profile-store";

const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

export function MyInfoEditPage() {
  const navigate = useNavigate();
  const profile = useProfileStore();

  const [nickname, setNickname] = useState(profile.nickname);
  const [profileImageUrl, setProfileImageUrl] = useState(
    profile.profileImageUrl,
  );
  const [nicknameCheck, setNicknameCheck] = useState(DEFAULT_DUPLICATE_CHECK);

  const trimmedNickname = nickname.trim();
  const isNicknameValid =
    trimmedNickname.length >= 2 && trimmedNickname.length <= 12;
  const isNicknameChanged = trimmedNickname !== profile.nickname;
  const isImageChanged = profileImageUrl !== profile.profileImageUrl;
  const showNicknameError = nickname.length > 0 && !isNicknameValid;

  // 닉네임을 바꿨다면 중복 확인까지 통과해야 저장할 수 있어요.
  const canSave =
    (isNicknameChanged || isImageChanged) &&
    isNicknameValid &&
    (!isNicknameChanged || nicknameCheck.isAvailable);

  const handleChangeNickname = (value: string) => {
    if (nicknameCheck.isChecking) return;
    // 확인한 닉네임을 바꾸면 다시 중복 확인해야 함
    setNicknameCheck(DEFAULT_DUPLICATE_CHECK);
    setNickname(value);
  };

  const handleCheckNickname = async () => {
    if (!isNicknameValid || !isNicknameChanged || nicknameCheck.isChecking) {
      return;
    }

    setNicknameCheck({ isChecking: true, isAvailable: false });

    try {
      const response = await checkNicknameDuplicate(trimmedNickname);
      setNicknameCheck({ isChecking: false, isAvailable: response.available });
      alert(
        response.available
          ? "사용할 수 있는 닉네임이에요."
          : "이미 사용 중인 닉네임이에요.",
      );
    } catch {
      setNicknameCheck(DEFAULT_DUPLICATE_CHECK);
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    }
  };

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // 같은 파일을 다시 골라도 change 이벤트가 일어나도록 비워요.
    e.target.value = "";
    if (!file) return;

    if (file.size > MAX_PROFILE_IMAGE_SIZE) {
      alert("프로필 이미지는 5MB 이하로 선택해 주세요.");
      return;
    }

    // 선택한 이미지를 미리 볼 수 있도록 data URL로 읽어요.
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setProfileImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSave) return;

    // 내 정보 수정 API를 연결하기 전까지는 화면 store에만 반영해요.
    profile.updateProfile({ nickname: trimmedNickname, profileImageUrl });
    alert("변경사항을 저장했어요.");
    navigate({ to: "/me" });
  };

  const handleWithdraw = () => {
    // 회원 탈퇴 API는 이번 미션 범위가 아니라 확인 창까지만 보여줘요.
    window.confirm("정말 탈퇴할까요? 탈퇴하면 복구할 수 없어요.");
  };

  const inputClassName =
    "h-[46px] w-full rounded-[6px] border border-[#E5E7EB] bg-white px-3 text-[13px] text-[#17191E] outline-none focus:border-[#2563EB] disabled:bg-[#F7F8FA]";

  return (
    <main className="mx-auto max-w-[1440px] px-20 py-8">
      <form onSubmit={handleSubmit} noValidate>
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-3">
            <h2 className="text-[38px] leading-[44px] font-bold tracking-[-1.71px] text-[#17191E]">
              내 정보 수정
            </h2>
            <p className="text-[12px] leading-none text-[#606774]">
              닉네임과 프로필 이미지만 변경할 수 있어요.
            </p>
          </div>
          <button
            type="submit"
            disabled={!canSave}
            className="h-[40px] rounded-[6px] bg-[#2563EB] px-4 text-[12px] font-extrabold text-white disabled:opacity-40"
          >
            변경사항 저장
          </button>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-10">
          <div className="flex flex-col items-center gap-2 pt-6">
            <label
              htmlFor="profileImage"
              className="relative cursor-pointer"
              aria-label="프로필 이미지 변경"
            >
              <span className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#E5E7EB]">
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt="프로필 이미지 미리보기"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src="/icons/movie-icons/person.svg"
                    alt=""
                    className="h-10 w-10"
                  />
                )}
              </span>
              <span className="absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#F7F8FA] bg-white">
                <img
                  src="/icons/movie-icons/edit.svg"
                  alt=""
                  className="h-4 w-4"
                />
              </span>
            </label>
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={handleChangeImage}
              className="hidden"
            />
            <p className="mt-1 text-[12px] leading-none font-bold">
              프로필 이미지
            </p>
            <p className="text-[10px] leading-none text-[#969DA8]">
              선택 사항 · 최대 5MB
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="nickname"
                className="text-[12px] leading-none font-bold"
              >
                닉네임
              </label>
              <div className="relative">
                <input
                  id="nickname"
                  type="text"
                  value={nickname}
                  disabled={nicknameCheck.isChecking}
                  onChange={(e) => handleChangeNickname(e.target.value)}
                  className={`${inputClassName} pr-[80px]`}
                />
                <button
                  type="button"
                  disabled={
                    !isNicknameValid ||
                    !isNicknameChanged ||
                    nicknameCheck.isChecking
                  }
                  onClick={handleCheckNickname}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-[11px] font-extrabold whitespace-nowrap text-[#2563EB] disabled:text-[#969DA8]"
                >
                  {nicknameCheck.isChecking ? "확인 중" : "중복 확인"}
                </button>
              </div>
              {showNicknameError && (
                <p className="text-[11px] leading-none text-[#DC2626]">
                  닉네임은 2자 이상 12자 이하로 입력해 주세요.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-[12px] leading-none font-bold"
              >
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={profile.email}
                readOnly
                className={`${inputClassName} text-[#606774]`}
              />
            </div>
          </div>
        </div>
      </form>

      <section className="mt-[200px] flex items-center justify-between rounded-[8px] border border-[#F3A6A6] bg-[#FDECEC] px-5 py-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-[13px] leading-none font-bold text-[#DC2626]">
            회원 탈퇴
          </h3>
          <p className="text-[11px] leading-none text-[#DC2626]">
            탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수
            없습니다.
          </p>
        </div>
        <button
          type="button"
          onClick={handleWithdraw}
          className="h-[36px] rounded-[6px] border border-[#DC2626] bg-white px-4 text-[12px] font-bold text-[#DC2626]"
        >
          회원 탈퇴
        </button>
      </section>
    </main>
  );
}
