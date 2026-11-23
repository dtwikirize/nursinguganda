import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function LoginPage() {
  const { catalog, login, register } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [mode, setMode] = useState(searchParams.get("mode") === "signup" ? "signup" : "signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [programme, setProgramme] = useState("certificate-in-nursing");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = searchParams.get("redirect") || "/my-learning";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res =
      mode === "signup"
        ? await register({ name, email, password, programme })
        : await login({ email, password });
    setLoading(false);
    if (!res.ok) {
      setError(res.error || "Authentication failed.");
      return;
    }
    navigate(redirectTo);
  };

  return (
    <main className="nu-section">
      <div className="nu-container" style={{ maxWidth: 440 }}>
        <div style={{ border: "1px solid var(--nu-border)", padding: 28, background: "#fff" }}>
          <h1 style={{ fontFamily: "var(--nu-font-serif)", fontSize: "1.6rem", margin: "0 0 6px" }}>
            {mode === "signup" ? "Create your free student account" : "Log in to Nursing Uganda"}
          </h1>
          <p style={{ color: "var(--nu-ink-muted)", fontSize: "0.9rem", margin: "0 0 20px" }}>
            Save progress, download eBooks, and access unlocked PayPal courses across devices.
          </p>

          {error && (
            <div style={{ padding: 10, background: "var(--nu-danger-bg)", color: "var(--nu-danger)", marginBottom: 14, fontSize: "0.88rem" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
            {mode === "signup" && (
              <>
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ height: 44, padding: "0 12px", border: "1px solid var(--nu-ink)" }}
                />
                <select
                  value={programme}
                  onChange={(e) => setProgramme(e.target.value)}
                  style={{ height: 44, padding: "0 12px", border: "1px solid var(--nu-ink)", background: "#fff" }}
                >
                  {(catalog?.programmes || []).map((p) => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </>
            )}

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ height: 44, padding: "0 12px", border: "1px solid var(--nu-ink)" }}
            />
            <input
              type="password"
              placeholder="Password (6+ characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{ height: 44, padding: "0 12px", border: "1px solid var(--nu-ink)" }}
            />

            <button type="submit" disabled={loading} className="nu-btn nu-btn-primary nu-btn-lg">
              {loading ? "Please wait..." : mode === "signup" ? "Sign up" : "Log in"}
            </button>
          </form>

          <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--nu-border-light)", textAlign: "center", fontSize: "0.9rem" }}>
            {mode === "signup" ? (
              <>
                Already have an account?{" "}
                <button type="button" onClick={() => setMode("signin")} style={{ background: "transparent", border: 0, color: "var(--nu-purple)", fontWeight: 700, textDecoration: "underline" }}>
                  Log in
                </button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}
                <button type="button" onClick={() => setMode("signup")} style={{ background: "transparent", border: 0, color: "var(--nu-purple)", fontWeight: 700, textDecoration: "underline" }}>
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
