// JWT의 payload(가운데 부분)를 디코딩해 sub에 담긴 memberId를 꺼내요.
// 서명은 검증하지 않으므로 화면에 쓸 회원 ID를 알아내는 용도로만 사용해요.
// 실제 권한 확인은 서버가 토큰의 서명을 검증해서 해요.
export function getMemberIdFromToken(accessToken: string | null) {
  if (!accessToken) return null;

  try {
    const payload = accessToken.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const { sub } = JSON.parse(atob(padded)) as { sub?: string };
    const memberId = Number(sub);

    return Number.isInteger(memberId) && memberId > 0 ? memberId : null;
  } catch {
    return null;
  }
}
