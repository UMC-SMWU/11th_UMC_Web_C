package com.umc.movie.repository;

import com.umc.movie.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    List<Rating> findByMember_MemberIdOrderByRatingIdDesc(Long memberId);

    // 이 회원이 이 영화에 이미 평점을 남겼는지
    boolean existsByMember_MemberIdAndMovieId(Long memberId, Long movieId);
}