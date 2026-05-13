import { ChevronRight, Check } from "lucide-react";

export default function StepBar({ step }: { step: number }) {
  const steps = ["기본 정보", "내용 작성", "결재선 설정"];

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {steps.map((label, i) => {
        const idx = i + 1;
        const done = step > idx;
        const active = step === idx;
        return (
          <div key={label} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  background: done ? "#2F9E44" : active ? "#3B5BDB" : "#F0F0F0",
                  color: done || active ? "#fff" : "#bbb",
                }}
              >
                {done ? <Check size={11} /> : idx}
              </div>
              <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: done ? "#2F9E44" : active ? "#1a1a1a" : "#bbb" }}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && <ChevronRight size={14} color="#E5E5E5" style={{ margin: "0 10px" }} />}
          </div>
        );
      })}
    </div>
  );
}
