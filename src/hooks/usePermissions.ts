"use client";

import { canWrite, canAdmin, isManager, isReadOnly, type UserRole } from "@/lib/permissions";

/**
 * 서버 컴포넌트에서 props로 받은 role을 기반으로 권한을 판단하는 훅.
 * 별도의 fetch 없이 이미 전달된 role string만 사용한다.
 */
export function usePermissions(role: string | null | undefined) {
  const r = role ?? "viewer";
  return {
    role:        r as UserRole,
    canWrite:    canWrite(r),
    canAdmin:    canAdmin(r),
    isManager:   isManager(r),
    isReadOnly:  isReadOnly(r),
  };
}
