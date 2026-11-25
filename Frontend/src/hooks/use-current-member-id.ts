import { useAuthStore } from "../stores/auth-store";
import { getMemberIdFromToken } from "../utils/get-member-id-from-token";

// 로그인하지 않았거나 토큰을 읽을 수 없으면 null을 돌려줘요.
export function useCurrentMemberId() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return getMemberIdFromToken(accessToken);
}
