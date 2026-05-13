"use client";

import { useState } from "react";
import SettingsCorpClient from "./SettingsCorpClient";
import SettingsBranchClient, { type Branch } from "./SettingsBranchClient";
import SettingsClient from "./SettingsClient";
import UsersClientView from "./UsersClientView";
import type { Company } from "@/lib/company";

type UserRow = {
  id: string;
  full_name: string;
  role: string;
  department: string | null;
};

type TabKey = "corp" | "branches" | "standards" | "users";

const TAB_LABELS: { key: TabKey; label: string }[] = [
  { key: "corp",      label: "기업 기본정보" },
  { key: "branches",  label: "추가사업장" },
  { key: "standards", label: "표준 설정" },
  { key: "users",     label: "사용자 관리" },
];

export default function SettingsTabsClient({
  company, branches, users, myId, isAdmin,
}: {
  company: Company | null;
  branches: Branch[];
  users: UserRow[];
  myId: string;
  isAdmin: boolean;
}) {
  const [tab, setTab] = useState<TabKey>("corp");

  const visibleTabs = isAdmin
    ? TAB_LABELS
    : TAB_LABELS.filter(t => t.key !== "users");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 52px)" }}>
      {/* 탭 헤더 */}
      <div style={{
        display: "flex", gap: 0,
        borderBottom: "1px solid #E5E5E5",
        background: "#fff", padding: "0 24px", flexShrink: 0,
      }}>
        {visibleTabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "12px 18px", fontSize: 13, fontWeight: tab === t.key ? 600 : 400,
              color: tab === t.key ? "#3B5BDB" : "#888",
              background: "transparent", border: "none",
              borderBottom: tab === t.key ? "2px solid #3B5BDB" : "2px solid transparent",
              cursor: "pointer", marginBottom: -1,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {tab === "corp" && <SettingsCorpClient company={company} />}
        {tab === "branches" && (
          <SettingsBranchClient companyId={company?.id ?? null} initialBranches={branches} />
        )}
        {tab === "standards" && <SettingsClient company={company} />}
        {tab === "users" && isAdmin && <UsersClientView users={users} myId={myId} />}
      </div>
    </div>
  );
}
