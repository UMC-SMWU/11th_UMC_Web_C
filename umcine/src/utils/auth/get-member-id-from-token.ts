export function getMemberIdFromToken(token: string | null): number | null {
    if (!token) return null;

    try {
        const payload = token.split(".")[1];
        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
        const json = decodeURIComponent(
            atob(base64)
                .split("")
                .map((char) => "%" + char.charCodeAt(0).toString(16).padStart(2, "0"))
                .join(""),
        );
        const memberId = Number(JSON.parse(json).sub);
        return Number.isInteger(memberId) ? memberId : null;
    } catch {
        return null;
    }
}