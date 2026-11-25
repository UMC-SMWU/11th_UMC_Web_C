import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth-store";

// (auth) 폴더는 주소에 나타나지 않는 Route Group이에요.
// 이 레이아웃 아래의 페이지는 로그인한 사용자만 볼 수 있어요.
export const Route = createFileRoute("/(auth)")({
  beforeLoad: () => {
    if (!useAuthStore.getState().accessToken) {
      throw redirect({ to: "/login" });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  return <Outlet />;
}
