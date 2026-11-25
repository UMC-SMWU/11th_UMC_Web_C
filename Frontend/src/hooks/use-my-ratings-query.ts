import { useQuery } from "@tanstack/react-query";
import { getMemberRatings } from "../api/members/get-member-ratings";
import { useCurrentMemberId } from "./use-current-member-id";

// 로그인한 회원이 남긴 평점 목록 (마이페이지, 영화 상세의 내 평점)
export function useMyRatingsQuery() {
  const memberId = useCurrentMemberId();

  return useQuery({
    queryKey: ["ratings", "member", memberId],
    queryFn: () => getMemberRatings(memberId!),
    enabled: memberId !== null,
  });
}
