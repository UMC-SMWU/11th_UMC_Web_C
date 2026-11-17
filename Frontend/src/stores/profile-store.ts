import { create } from "zustand";

interface Profile {
  nickname: string;
  email: string;
  profileImageUrl: string | null;
}

interface ProfileStore extends Profile {
  updateProfile: (
    profile: Pick<Profile, "nickname" | "profileImageUrl">,
  ) => void;
}

// 내 정보 조회와 수정 API를 연결하기 전까지 화면끼리 값을 주고받는 임시 store예요.
// 시드 데이터의 회원(memberId = 1)으로 시작하고, 새로고침하면 처음 값으로 돌아가요.
export const useProfileStore = create<ProfileStore>((set) => ({
  nickname: "수현",
  email: "noco@umc.com",
  profileImageUrl: null,
  updateProfile: (profile) => set(profile),
}));
