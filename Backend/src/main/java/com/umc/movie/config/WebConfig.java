package com.umc.movie.config;

import com.umc.movie.interceptor.AuthInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final AuthInterceptor authInterceptor;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173")     // 모든 API 경로에 대해
                .allowedMethods("GET", "POST", "PATCH", "DELETE", "OPTIONS")     // 이 출처에서 오는 요청만 허용
                .allowedHeaders("*");
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authInterceptor)
                .addPathPatterns("/**")              // 일단 모든 경로를 잠그고
                .excludePathPatterns(                // 로그인 없이 써야 하는 것만 열어 줌
                        "/auth/**",                  // 로그인
                        "/members",                  // 회원가입
                        "/members/nickname/**",      // 닉네임 중복 체크
                        "/members/email/**",         // 이메일 중복 체크
                        "/members/*/ratings",        // 유저별 평점 조회 (공개)
                        "/error"                     // 스프링 내부 오류 경로
                );
    }
}