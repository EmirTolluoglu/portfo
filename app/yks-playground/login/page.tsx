"use client";

import { useState } from "react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const res = await fetch("/api/yks-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      window.location.href = "/yks-playground";
    } else {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#eef1e9",
        fontFamily: "monospace",
      }}
    >
      <form
        onSubmit={submit}
        style={{
          background: "#fff",
          border: "1px solid #d7ddcb",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          width: 280,
        }}
      >
        <input
          type="password"
          autoFocus
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 10, border: "1px solid #d7ddcb", fontFamily: "inherit" }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 10,
            background: "#1f2a1e",
            color: "#eef1e9",
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Giriş
        </button>
        {error && <span style={{ color: "#a13d2b", fontSize: 12 }}>Yanlış şifre.</span>}
      </form>
    </div>
  );
}