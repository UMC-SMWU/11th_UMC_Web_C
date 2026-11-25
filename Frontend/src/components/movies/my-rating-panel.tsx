import { Link } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import type { MemberRating } from "@/api/members/models";
import { useMyRatingsQuery } from "@/hooks/use-my-ratings-query";
import {
  useCreateRatingMutation,
  useDeleteRatingMutation,
  useUpdateRatingMutation,
} from "@/hooks/use-rating-mutations";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/utils/cn";

interface MyRatingFormProps {
  movieId: number;
  myRating: MemberRating | null;
}

function MyRatingForm({ movieId, myRating }: MyRatingFormProps) {
  // 이미 남긴 평점이 있으면 그 값으로 시작해요.
  const [score, setScore] = useState(myRating?.score ?? 0);
  const [comment, setComment] = useState(myRating?.comment ?? "");

  const createRatingMutation = useCreateRatingMutation();
  const updateRatingMutation = useUpdateRatingMutation();
  const deleteRatingMutation = useDeleteRatingMutation();
  const isPending =
    createRatingMutation.isPending ||
    updateRatingMutation.isPending ||
    deleteRatingMutation.isPending;

  const trimmedComment = comment.trim();
  const isChanged =
    !myRating ||
    score !== myRating.score ||
    trimmedComment !== (myRating.comment ?? "");
  const canSubmit = score > 0 && isChanged && !isPending;

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;

    const body = { score, comment: trimmedComment || null };

    if (myRating) {
      updateRatingMutation.mutate({ ratingId: myRating.ratingId, ...body });
    } else {
      createRatingMutation.mutate({ movieId, ...body });
    }
  };

  const handleDelete = () => {
    if (!myRating || isPending) return;
    if (!window.confirm("이 영화에 남긴 평점을 삭제할까요?")) return;

    deleteRatingMutation.mutate(myRating.ratingId);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            aria-label={`${star}점`}
            aria-pressed={star <= score}
            onClick={() => setScore(star)}
            className={cn(
              "flex h-[38px] w-[38px] items-center justify-center rounded-lg border bg-white px-1.5 py-px",
              star <= score ? "border-[#2563EB]" : "border-[#E5E7EB]",
            )}
          >
            <img
              src={
                star <= score
                  ? "/icons/movie-icons/star.svg"
                  : "/icons/movie-icons/star-outline.svg"
              }
              alt=""
              className="h-6 w-6"
            />
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        maxLength={500}
        onChange={(e) => setComment(e.target.value)}
        placeholder="영화를 보고 느낀 점을 남겨보세요."
        className="h-[102px] w-full resize-none rounded-lg border border-[#E5E7EB] bg-white pt-4 pr-3 pb-[18px] pl-3 text-[13px] leading-[19.5px] placeholder:text-[#969DA8]"
      />

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!canSubmit}
          className="h-[42px] flex-1 rounded-lg bg-[#17191E] px-4 text-[14px] leading-none font-extrabold text-white disabled:opacity-40"
        >
          {createRatingMutation.isPending || updateRatingMutation.isPending
            ? "저장 중"
            : myRating
              ? "평점 수정"
              : "평점 저장"}
        </button>
        {myRating && (
          <button
            type="button"
            disabled={isPending}
            onClick={handleDelete}
            className="h-[42px] rounded-lg border border-[#DC2626] bg-white px-4 text-[14px] leading-none font-extrabold text-[#DC2626] disabled:opacity-40"
          >
            {deleteRatingMutation.isPending ? "삭제 중" : "삭제"}
          </button>
        )}
      </div>
    </form>
  );
}

interface MyRatingPanelProps {
  movieId: number;
}

export function MyRatingPanel({ movieId }: MyRatingPanelProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const myRatingsQuery = useMyRatingsQuery();

  // 이 영화에 대한 내 평점만 주는 API가 없어서, 내 평점 목록에서 찾아요.
  const myRating =
    myRatingsQuery.data?.find((rating) => rating.movieId === movieId) ?? null;

  return (
    <aside className="box-content flex w-[329px] shrink-0 flex-col gap-3 border-l border-[#E5E7EB] pl-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-[21px] leading-none font-bold tracking-[-0.63px]">
          내 평점
        </h2>
        <p className="text-[14px] leading-6 text-[#969DA8]">
          별점은 필수, 후기는 선택이에요.
        </p>
      </div>

      {!accessToken ? (
        <div className="flex flex-col gap-3">
          <p className="text-[13px] text-[#606774]">
            로그인하면 평점을 남길 수 있어요.
          </p>
          <Link
            to="/login"
            className="flex h-[42px] items-center justify-center rounded-lg bg-[#17191E] text-[14px] font-extrabold text-white"
          >
            로그인하러 가기
          </Link>
        </div>
      ) : myRatingsQuery.isPending ? (
        <p className="text-[13px] text-[#969DA8]">내 평점을 불러오는 중이에요.</p>
      ) : myRatingsQuery.isError ? (
        <p className="text-[13px] text-[#969DA8]">
          내 평점을 불러오지 못했어요.
        </p>
      ) : (
        // 평점을 새로 만들거나 삭제하면 key가 바뀌어 폼이 새 값으로 다시 시작돼요.
        <MyRatingForm
          key={myRating?.ratingId ?? "new"}
          movieId={movieId}
          myRating={myRating}
        />
      )}
    </aside>
  );
}
