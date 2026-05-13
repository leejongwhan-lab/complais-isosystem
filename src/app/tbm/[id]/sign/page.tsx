"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type TBMRecord = {
  tbm_date: string;
  work_location: string;
  work_content: string;
  leader_name: string;
};

export default function TBMSignPage() {
  const params = useParams();
  const id = params.id as string;

  const [tbm, setTbm] = useState<TBMRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [signing, setSigning] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // Fetch TBM record on mount
  useEffect(() => {
    async function fetchTbm() {
      try {
        const { data } = await supabase
          .from("tbm_records")
          .select("tbm_date, work_location, work_content, leader_name")
          .eq("id", id)
          .single();
        if (data) setTbm(data as TBMRecord);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchTbm();
  }, [id]);

  // Set up canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctxRef.current = ctx;
  }, []);

  // Resize canvas to match display size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);
      ctx.strokeStyle = "#1a1a1a";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctxRef.current = ctx;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  function getPos(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }
    return {
      x: (e as React.MouseEvent<HTMLCanvasElement>).clientX - rect.left,
      y: (e as React.MouseEvent<HTMLCanvasElement>).clientY - rect.top,
    };
  }

  function onStart(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    e.preventDefault();
    const ctx = ctxRef.current;
    if (!ctx) return;
    setIsDrawing(true);
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function onMove(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    e.preventDefault();
    if (!isDrawing) return;
    const ctx = ctxRef.current;
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function onEnd(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    e.preventDefault();
    setIsDrawing(false);
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
  }

  async function handleSubmit() {
    if (!name.trim()) {
      setError("이름을 입력해주세요.");
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const signature = canvas.toDataURL("image/png");
    setSigning(true);
    setError(null);

    const { error: err } = await supabase.from("tbm_attendees").insert({
      tbm_id: id,
      name: name.trim(),
      signature,
    });

    // Try to increment count (ignore if RPC not available)
    try {
      await supabase.rpc("increment_tbm_count", { tbm_id: id });
    } catch {
      // RPC may not exist yet — ignore
    }

    setSigning(false);
    if (err) {
      setError(err.message);
      return;
    }
    setDone(true);
  }

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#F9FAFB",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div className="w-8 h-8 border-2 border-[#3B5BDB] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (done) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#F9FAFB",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        textAlign: "center",
      }}>
        <div style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: "#EBFBEE",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 36,
          marginBottom: 20,
        }}>
          ✓
        </div>
        <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 700, color: "#1a1a1a" }}>
          서명이 완료되었습니다!
        </h2>
        <p style={{ margin: 0, fontSize: 15, color: "#555" }}>{name}</p>
        <p style={{ margin: "8px 0 0", fontSize: 13, color: "#999" }}>안전하게 작업하세요.</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F9FAFB",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Top logo */}
      <div style={{
        padding: "16px 20px",
        borderBottom: "1px solid #E5E5E5",
        background: "#fff",
      }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#3B5BDB" }}>complAIs</span>
        <span style={{ fontSize: 13, fontWeight: 400, color: "#999", marginLeft: 4 }}>ISOSystem</span>
      </div>

      <div style={{ flex: 1, padding: "20px 16px", maxWidth: 480, margin: "0 auto", width: "100%" }}>

        {/* TBM Info Card */}
        {tbm && (
          <div style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            padding: "16px 20px",
            marginBottom: 20,
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#3B5BDB", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
              오늘의 TBM
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 12px", fontSize: 13 }}>
              <span style={{ color: "#999", fontWeight: 500 }}>날짜</span>
              <span style={{ color: "#1a1a1a" }}>{tbm.tbm_date}</span>
              <span style={{ color: "#999", fontWeight: 500 }}>장소</span>
              <span style={{ color: "#1a1a1a" }}>{tbm.work_location}</span>
              <span style={{ color: "#999", fontWeight: 500 }}>책임자</span>
              <span style={{ color: "#1a1a1a" }}>{tbm.leader_name}</span>
              <span style={{ color: "#999", fontWeight: 500 }}>작업내용</span>
              <span style={{ color: "#1a1a1a", lineHeight: 1.5 }}>{tbm.work_content}</span>
            </div>
          </div>
        )}

        {/* Name Input */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 6 }}>
            이름
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="이름을 입력하세요"
            style={{
              width: "100%",
              padding: "12px 14px",
              fontSize: 16,
              border: "1px solid #E5E5E5",
              borderRadius: 8,
              outline: "none",
              color: "#1a1a1a",
              background: "#fff",
              boxSizing: "border-box",
            }}
            className="focus:border-[#3B5BDB] transition-colors"
          />
        </div>

        {/* Signature Canvas */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#555" }}>서명</label>
            <button
              type="button"
              onClick={clearCanvas}
              style={{
                fontSize: 11,
                color: "#999",
                background: "transparent",
                border: "1px solid #E5E5E5",
                borderRadius: 4,
                padding: "3px 8px",
                cursor: "pointer",
              }}
            >
              지우기
            </button>
          </div>
          <div style={{ position: "relative" }}>
            <canvas
              ref={canvasRef}
              style={{
                width: "100%",
                height: 200,
                border: "2px solid #E5E5E5",
                borderRadius: 8,
                background: "#FAFAFA",
                touchAction: "none",
                display: "block",
              }}
              onMouseDown={onStart}
              onMouseMove={onMove}
              onMouseUp={onEnd}
              onMouseLeave={onEnd}
              onTouchStart={onStart}
              onTouchMove={onMove}
              onTouchEnd={onEnd}
            />
            {/* Placeholder text shown when not drawing — purely visual hint */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: 13,
                color: "#bbb",
                pointerEvents: "none",
                userSelect: "none",
              }}
              aria-hidden="true"
            >
              여기에 서명하세요
            </div>
          </div>
        </div>

        {error && (
          <p style={{ margin: "0 0 12px", fontSize: 13, color: "#E03131" }}>{error}</p>
        )}

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={signing}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 10,
            border: "none",
            background: signing ? "#93C5FD" : "#3B5BDB",
            color: "#fff",
            fontSize: 16,
            fontWeight: 700,
            cursor: signing ? "not-allowed" : "pointer",
          }}
          className={signing ? "" : "hover:opacity-90 transition-opacity"}
        >
          {signing ? "처리 중..." : "서명 완료"}
        </button>
      </div>
    </div>
  );
}
