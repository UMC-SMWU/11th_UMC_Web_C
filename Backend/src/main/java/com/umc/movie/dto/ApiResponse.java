package com.umc.movie.dto;

public record ApiResponse<T>(boolean isSuccess, String code, String message, T result) {

    // 201 성공
    public static <T> ApiResponse<T> created(String message, T result) {
        return new ApiResponse<>(true, "COMMON201", message, result);
    }

    // 200 성공
    public static <T> ApiResponse<T> ok(String message, T result) {
        return new ApiResponse<>(true, "COMMON200", message, result);
    }

    // 실패
    public static ApiResponse<Void> failure(String code, String message) {
        return new ApiResponse<>(false, code, message, null);
    }
}