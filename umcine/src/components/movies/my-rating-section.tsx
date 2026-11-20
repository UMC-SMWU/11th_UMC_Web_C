import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
    createRating,
    deleteRating,
    getMemberRatings,
    updateRating,
    type Rating,
} from "../../api/ratings/ratings";
import { useAuthStore } from "../../stores/auth-store";
import { getMemberIdFromToken } from "../../utils/auth/get-member-id-from-token";

interface RatingFormProps {
    movieId: number;
    memberId: number | undefined;
    myRating: Rating | undefined;
}

function RatingForm({ movieId, memberId, myRating }: RatingFormProps) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const accessToken = useAuthStore((state) => state.accessToken);

    const [score, setScore] = useState(myRating?.score ?? 0);
    const [comment, setComment] = useState(myRating?.comment ?? "");

    const ratingsKey = ["ratings", "member", memberId];

    const createMutation = useMutation({
        mutationFn: createRating,
        onSuccess: (response) => {
            queryClient.setQueryData<Rating[]>(ratingsKey, (old = []) => [
                response.result,
                ...old,
            ]);
            alert("평점을 등록했어요.");
        },
        onError: () => {
            alert("평점 등록에 실패했어요. 다시 시도해 주세요.");
        },
    });

    const updateMutation = useMutation({
        mutationFn: updateRating,
        onSuccess: (response) => {
            queryClient.setQueryData<Rating[]>(ratingsKey, (old = []) =>
                old.map((rating) =>
                    rating.ratingId === response.result.ratingId ? response.result : rating,
                ),
            );
            alert("평점을 수정했어요.");
        },
        onError: () => {
            alert("평점 수정에 실패했어요. 다시 시도해 주세요.");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteRating,
        onSuccess: (_response, ratingId) => {
            queryClient.setQueryData<Rating[]>(ratingsKey, (old = []) =>
                old.filter((rating) => rating.ratingId !== ratingId),
            );
            alert("평점을 삭제했어요.");
        },
        onError: () => {
            alert("평점 삭제에 실패했어요. 다시 시도해 주세요.");
        },
    });

    const isBusy =
        createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;
    const canSubmit = score >= 1;

    const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!accessToken) {
            navigate({ to: "/login" });
            return;
        }
        if (!canSubmit || isBusy) return;

        const trimmedComment = comment.trim();
        const body = { score, comment: trimmedComment === "" ? null : trimmedComment };

        if (myRating) {
            updateMutation.mutate({ ratingId: myRating.ratingId, ...body });
        } else {
            createMutation.mutate({ movieId, ...body });
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div className="mt-3 flex gap-1.5">
                {[1, 2, 3, 4, 5].map((value) => (
                    <button
                        key={value}
                        type="button"
                        aria-label={`${value}점`}
                        aria-pressed={score >= value}
                        onClick={() => setScore(value)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white"
                    >
                        <img
                            src={score >= value ? "/icons/star.svg" : "/icons/star-outline.svg"}
                            alt=""
                            className="h-4 w-4"
                        />
                    </button>
                ))}
            </div>

            <textarea
                value={comment}
                maxLength={500}
                onChange={(event) => setComment(event.target.value)}
                placeholder="영화를 보고 느낀 점을 남겨보세요."
                className="mt-3 h-28 w-full resize-none rounded-lg border border-gray-200 bg-white p-3 text-xs !text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#4f63e8]"
            />

            <button
                type="submit"
                disabled={!canSubmit || isBusy}
                className="mt-3 h-10 w-full rounded-lg bg-gray-900 text-xs font-bold !text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
                {myRating ? "평점 수정" : "평점 저장"}
            </button>

            {myRating && (
                <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => deleteMutation.mutate(myRating.ratingId)}
                    className="mt-2 w-full text-xs !text-gray-400 underline disabled:opacity-50"
                >
                    평점 삭제
                </button>
            )}
        </form>
    );
}

export function MyRatingSection({ movieId }: { movieId: number }) {
    const accessToken = useAuthStore((state) => state.accessToken);
    const memberId = getMemberIdFromToken(accessToken) ?? undefined;

    const ratingsQuery = useQuery({
        queryKey: ["ratings", "member", memberId],
        queryFn: () => getMemberRatings(memberId as number),
        enabled: memberId !== undefined,
    });

    const myRating = ratingsQuery.data?.find((rating) => rating.movieId === movieId);
    const isLoading = memberId !== undefined && ratingsQuery.isLoading;

    return (
        <section>
            <h2 className="!m-0 !text-base !font-bold !text-black">내 평점</h2>
            <p className="!mt-1 text-[11px] !text-gray-400">
                별점은 필수, 후기는 선택사항이에요.
            </p>

            {isLoading ? (
                <p className="!mt-3 text-xs">평점을 불러오는 중이에요.</p>
            ) : (
                <RatingForm
                    key={myRating?.ratingId ?? "new"}
                    movieId={movieId}
                    memberId={memberId}
                    myRating={myRating}
                />
            )}
        </section>
    );
}