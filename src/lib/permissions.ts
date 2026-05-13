export type UserRole = "admin" | "manager" | "member" | "viewer";

/** manager 이상만 등록/수정 가능 (UI 버튼 표시 여부) */
export function canWrite(role: string): boolean {
  return role === "admin" || role === "manager";
}

/** admin 전용 (설정, 사용자 관리) */
export function canAdmin(role: string): boolean {
  return role === "admin";
}

/** admin | manager */
export function isManager(role: string): boolean {
  return role === "admin" || role === "manager";
}

/** 열람 전용 여부 */
export function isReadOnly(role: string): boolean {
  return role === "viewer" || role === "member";
}

export function canView(role: string): boolean {
  return ["admin", "manager", "member", "viewer"].includes(role);
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin:   "관리자",
  manager: "매니저",
  member:  "일반 사용자",
  viewer:  "열람 전용",
};

export const ROLE_COLORS: Record<UserRole, { color: string; bg: string }> = {
  admin:   { color: "#E03131", bg: "#FFF0F0" },
  manager: { color: "#3B5BDB", bg: "#EEF2FF" },
  member:  { color: "#2F9E44", bg: "#F0FBF4" },
  viewer:  { color: "#999",    bg: "#F5F5F5" },
};
