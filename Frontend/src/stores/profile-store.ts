import { create } from "zustand";

interface ProfileStore {
  profileImageUrl: string | null;
  setProfileImageUrl: (profileImageUrl: string | null) => void;
}

// 서버에 프로필 이미지 API가 없어서 이미지만 브라우저에서 임시로 보관해요.
// 닉네임과 이메일은 GET /members/me에서 가져와요. 새로고침하면 이미지는 사라져요.
export const useProfileStore = create<ProfileStore>((set) => ({
  profileImageUrl: null,
  setProfileImageUrl: (profileImageUrl) => set({ profileImageUrl }),
}));
