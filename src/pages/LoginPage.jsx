import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ShieldCheck, MailCheck } from "lucide-react";
import { useApp } from "../context/AppContext";
import nuLogo from "../../assets/images/brand/nursing-uganda-logo-light.svg";

export default function LoginPage() {
  const { catalog, user, login, register, googleLogin, verifyEmail, resendVerification } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [mode, setMode] = useState(
    searchParams.get("verify") === "1"
      ? "verify"
      : searchParams.get("mode") === "signup"
        ? "signup"
        : "signin"
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [programme, setProgramme] = useState("certificate-in-nursing");
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const [googleClientId, setGoogleClientId] = useState("");
  const [googleReady, setGoogleReady] = useState(false);
  const googleBtnRef = useRef(null);

  const redirectTo = searchParams.get("redirect") || "/my-learning";

  useEffect(() => {
    let active = true;
    fetch("/api/config")
      .then((r) => r.json())
      .then((cfg) => {
        if (!active) return;
        if (cfg?.googleClientId) {
          setGoogleClientId(cfg.googleClientId);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!googleClientId || mode === "verify") return undefined;

    const initGoogle = () => {
      if (!window.google?.accounts?.id || !googleBtnRef.current) return;
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          if (!response?.credential) return;
          setError("");
          setLoading(true);
          const res = await googleLogin(response.credential);
          setLoading(false);
          if (!res.ok) {
            setError(res.error || "Google Sign-In failed.");
            return;
          }
          navigate(redirectTo);
        }
      });
      googleBtnRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: "outline",
        size: "large",
        width: 382,
        text: mode === "signup" ? "signup_with" : "continue_with",
        shape: "rectangular"
      });
      setGoogleReady(true);
    };

    if (window.google?.accounts?.id) {
      initGoogle();
      return undefined;
    }

    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      existingScript.addEventListener("load", initGoogle);
      return () => existingScript.removeEventListener("load", initGoogle);
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initGoogle;
    document.head.appendChild(script);
    return undefined;
  }, [googleClientId, mode, googleLogin, navigate, redirectTo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);

    if (mode === "verify") {
      const res = await verifyEmail(otpCode);
      setLoading(false);
      if (!res.ok) {
        setError(res.error || "Invalid verification code.");
        return;
      }
      navigate(redirectTo);
      return;
    }

    const res =
      mode === "signup"
        ? await register({ name, email, password, programme })
        : await login({ email, password });

    setLoading(false);
    if (!res.ok) {
      setError(res.error || "Authentication failed.");
      return;
    }

    if (mode === "signup" && res.user && !res.user.emailVerified) {
      setMode("verify");
      setNotice(
        res.verificationEmailSent
          ? `We sent a 6-digit verification code to ${res.user.email}.`
          : `Account created for ${res.user.email}. Enter your 6-digit verification code once SMTP is enabled, or continue to your dashboard.`
      );
      return;
    }

    navigate(redirectTo);
  };

  const handleResend = async () => {
    setError("");
    setNotice("");
    setLoading(true);
    const res = await resendVerification();
    setLoading(false);
    if (!res.ok) {
      setError(res.error || "Could not resend code.");
      return;
    }
    setNotice(
      res.verificationEmailSent
        ? "A fresh 6-digit verification code has been sent to your email."
        : "Verification code regenerated (configure SMTP_HOST / SMTP_USER / SMTP_PASS in Hostinger to deliver emails)."
    );
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--nu-bg-subtle)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "32px 16px" }}>
      <div className="nu-container" style={{ maxWidth: 440, width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <Link to="/" aria-label="Nursing Uganda Home" style={{ display: "inline-block" }}>
            <img src={nuLogo} alt="Nursing Uganda" style={{ height: 40, width: "auto", display: "block" }} />
          </Link>
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: "0.85rem", fontWeight: 600, color: "var(--nu-ink-muted)" }}>
            <ArrowLeft size={15} /> Back to home
          </Link>
        </div>
        <div style={{ border: "1px solid var(--nu-border)", padding: 28, background: "#fff", borderRadius: 6, boxShadow: "var(--nu-shadow-sm)" }}>
          <h1 style={{ fontFamily: "var(--nu-font-serif)", fontSize: "1.55rem", margin: "0 0 6px" }}>
            {mode === "verify"
              ? "Verify your email address"
              : mode === "signup"
                ? "Create your free student account"
                : "Log in to Nursing Uganda"}
          </h1>
          <p style={{ color: "var(--nu-ink-muted)", fontSize: "0.9rem", margin: "0 0 18px" }}>
            {mode === "verify"
              ? "Enter the 6-digit security code sent to your email to confirm account ownership."
              : "Save progress, download eBooks, and access unlocked PayPal courses across devices."}
          </p>

          {error && (
            <div style={{ padding: 10, background: "var(--nu-danger-bg)", color: "var(--nu-danger)", marginBottom: 14, fontSize: "0.88rem", borderRadius: 4 }}>
              {error}
            </div>
          )}

          {notice && (
            <div style={{ padding: 10, background: "var(--nu-teal-bg)", color: "var(--nu-teal-ink)", marginBottom: 14, fontSize: "0.88rem", borderRadius: 4 }}>
              {notice}
            </div>
          )}

          {mode !== "verify" && (
            <>
              {googleClientId ? (
                <div ref={googleBtnRef} style={{ minHeight: 44, display: "flex", justifyContent: "center", marginBottom: 14 }} />
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    setNotice("To enable 1-click Google Login, add GOOGLE_CLIENT_ID to Hostinger Environment Variables.")
                  }
                  style={{
                    width: "100%",
                    height: 44,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    background: "#fff",
                    border: "1px solid var(--nu-ink)",
                    fontWeight: 600,
                    fontSize: "0.92rem",
                    cursor: "pointer",
                    marginBottom: 14
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z" />
                    <path fill="#FBBC05" d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z" />
                  </svg>
                  {mode === "signup" ? "Sign up with Google" : "Continue with Google"}
                </button>
              )}

              {googleClientId && !googleReady && (
                <div style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--nu-ink-muted)", marginBottom: 10 }}>
                  Loading Google Sign-In...
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "4px 0 16px", color: "var(--nu-ink-muted)", fontSize: "0.8rem" }}>
                <span style={{ flex: 1, height: 1, background: "var(--nu-border-light)" }} />
                <span>or with email</span>
                <span style={{ flex: 1, height: 1, background: "var(--nu-border-light)" }} />
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
            {mode === "verify" ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", color: "var(--nu-ink-muted)" }}>
                  <MailCheck size={16} color="var(--nu-purple)" />
                  <span>Account: <strong>{user?.email || email}</strong></span>
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  placeholder="6-digit verification code"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                  style={{ height: 46, padding: "0 12px", border: "1px solid var(--nu-ink)", fontSize: "1.1rem", letterSpacing: "0.25em", textAlign: "center", fontWeight: 700 }}
                />
                <button type="submit" disabled={loading || otpCode.length !== 6} className="nu-btn nu-btn-primary nu-btn-lg">
                  {loading ? "Verifying..." : "Verify Email"}
                </button>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginTop: 4 }}>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={loading}
                    style={{ background: "transparent", border: 0, color: "var(--nu-purple)", fontWeight: 600, cursor: "pointer", padding: 0 }}
                  >
                    Resend code
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(redirectTo)}
                    style={{ background: "transparent", border: 0, color: "var(--nu-ink-muted)", cursor: "pointer", padding: 0 }}
                  >
                    Continue to dashboard →
                  </button>
                </div>
              </>
            ) : (
              <>
                {mode === "signup" && (
                  <>
                    <input
                      type="text"
                      placeholder="Full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      minLength={2}
                      maxLength={120}
                      autoComplete="name"
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
                  autoComplete="email"
                  style={{ height: 44, padding: "0 12px", border: "1px solid var(--nu-ink)" }}
                />
                <input
                  type="password"
                  placeholder={mode === "signup" ? "Password (8+ chars, letter & number)" : "Password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={mode === "signup" ? 8 : 6}
                  maxLength={128}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  style={{ height: 44, padding: "0 12px", border: "1px solid var(--nu-ink)" }}
                />

                <button type="submit" disabled={loading} className="nu-btn nu-btn-primary nu-btn-lg">
                  {loading ? "Please wait..." : mode === "signup" ? "Sign up" : "Log in"}
                </button>
              </>
            )}
          </form>

          {mode !== "verify" && (
            <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--nu-border-light)", textAlign: "center", fontSize: "0.9rem" }}>
              {mode === "signup" ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => { setMode("signin"); setError(""); setNotice(""); }}
                    style={{ background: "transparent", border: 0, color: "var(--nu-purple)", fontWeight: 700, textDecoration: "underline", cursor: "pointer" }}
                  >
                    Log in
                  </button>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => { setMode("signup"); setError(""); setNotice(""); }}
                    style={{ background: "transparent", border: 0, color: "var(--nu-purple)", fontWeight: 700, textDecoration: "underline", cursor: "pointer" }}
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          )}

          <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: "0.75rem", color: "var(--nu-ink-muted)" }}>
            <ShieldCheck size={14} color="#065F46" />
            <span>Protected by brute-force lockout, SQL parameterization &amp; email alerts</span>
          </div>
        </div>
      </div>
    </main>
  );
}
