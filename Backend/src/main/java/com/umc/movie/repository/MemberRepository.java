package com.umc.movie.repository;

import com.umc.movie.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    boolean existsByNickname(String nickname);  // 닉네임 있으면 true
    boolean existsByEmail(String email);        // 이메일 있으면 true
    Optional<Member> findByEmail(String email);
    boolean existsByNicknameAndMemberIdNot(String nickname, Long memberId);
}