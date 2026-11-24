import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Lock, MailCheck } from "lucide-react";
import { useApp } from "../context/AppContext";
import nuLogo from "../../assets/images/brand/nursing-uganda-logo-light.svg";
import loginPhoto from "../../assets/images/udemy/hero-banner.webp";

const LOGIN_SLIDES = [
  {
    tag: "UNMEB & MoH Aligned",
    title: "83 Study Units · 779 Clinical Topics",
    desc: "Structured Certificate, Diploma & BScN notes with verified clinical references."
  },
  {
    tag: "Exam Practice Bank",
    title: "109+ Past Papers & Marking Schemes",
    desc: "Timed Section A MCQs, Section B & C essay scenarios with direct PDF export."
  },
  {
    tag: "50% Student Cut Live",
    title: "Units From $2.49 or Full All-Access",
    desc: "Sync progress across devices and download QR-verified study certificates."
  }
];

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
  const [showPassword, setShowPassword] = useState(false);
  const [programme, setProgramme] = useState("certificate-in-nursing");
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const [googleClientId, setGoogleClientId] = useState("");
  const [googleReady, setGoogleReady] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);
  const googleBtnRef = useRef(null);
  const googleWrapRef = useRef(null);

  const redirectTo = searchParams.get("redirect") || "/my-learning";

  useEffect(() => {
    const id = setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % LOGIN_SLIDES.length);
    }, 3800);
    return () => clearInterval(id);
  }, []);

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

    const renderResponsiveGoogleButton = () => {
      if (!window.google?.accounts?.id || !googleBtnRef.current) return;
      const containerW = googleWrapRef.current?.clientWidth || 340;
      const btnWidth = Math.min(342, Math.max(220, containerW));

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          if (!response?.credential) return;
          setError("");
          setLoading(true);
          const res = await googleLogin(response.credential);
          setLoading(false);
          if (!res.ok) {
            setError(res.error || "Google Sign-In failed. Please try again.");
            return;
          }
          navigate(redirectTo);
        }
      });

      googleBtnRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: "outline",
        size: "large",
        width: btnWidth,
        text: mode === "signup" ? "signup_with" : "continue_with",
        shape: "rectangular",
        logo_alignment: "center"
      });
      setGoogleReady(true);
    };

    const handleResize = () => {
      if (window.google?.accounts?.id) {
        renderResponsiveGoogleButton();
      }
    };

    if (window.google?.accounts?.id) {
      renderResponsiveGoogleButton();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }

    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      existingScript.addEventListener("load", renderResponsiveGoogleButton);
      window.addEventListener("resize", handleResize);
      return () => {
        existingScript.removeEventListener("load", handleResize);
        window.removeEventListener("resize", handleResize);
      };
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = renderResponsiveGoogleButton;
    document.head.appendChild(script);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [googleClientId, mode, googleLogin, navigate, redirectTo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);
    try {
      if (mode === "verify") {
        const res = await verifyEmail({ code: otpCode.trim() });
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

      if (res.verificationRequired) {
        setMode("verify");
        setNotice(
          res.verificationEmailSent
            ? "Account created! We sent a 6-digit verification code to your email address."
            : "Account created! Enter your 6-digit verification code below or check your email."
        );
        return;
      }

      navigate(redirectTo);
    } catch {
      setLoading(false);
      setError("Network error while signing in.");
    }
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
        : "Verification code refreshed. Check your inbox shortly."
    );
  };

  return (
    <main className="nu-auth-page">
      <header className="nu-auth-header">
        <Link to="/" aria-label="Nursing Uganda Home" className="nu-auth-brand-link">
          <img src={nuLogo} alt="Nursing Uganda" className="nu-auth-logo" />
        </Link>
        <Link to="/" className="nu-auth-back-link">
          <ArrowLeft size={14} /> Back to Home
        </Link>
      </header>

      <div className="nu-auth-split">
        {/* Left Column: Editorial Headline + Minimal Auth Box */}
        <section className="nu-auth-form-col">
          <div className="nu-auth-editorial-head">
            <h1>
              {mode === "verify"
                ? "Verify your email"
                : mode === "signup"
                  ? "Start revising smarter"
                  : "Master what\u2019s next"}
            </h1>
            <p>
              {mode === "verify"
                ? "Enter the 6-digit code sent to your inbox to confirm your student account."
                : "Your clinical nursing & midwifery study partner"}
            </p>
          </div>

          <div className="nu-auth-card">
            {mode !== "verify" && (
              <div className="nu-auth-mode-tabs" role="tablist" aria-label="Authentication mode">
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === "signin"}
                  className={`nu-auth-mode-tab ${mode === "signin" ? "active" : ""}`}
                  onClick={() => { setMode("signin"); setError(""); setNotice(""); }}
                >
                  Log in
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === "signup"}
                  className={`nu-auth-mode-tab ${mode === "signup" ? "active" : ""}`}
                  onClick={() => { setMode("signup"); setError(""); setNotice(""); }}
                >
                  Create account
                </button>
              </div>
            )}

            {error && <div className="nu-auth-alert nu-auth-alert--err">{error}</div>}
            {notice && <div className="nu-auth-alert nu-auth-alert--ok">{notice}</div>}

            {mode !== "verify" && (
              <>
                <div ref={googleWrapRef} className="nu-auth-google-wrap">
                  {googleClientId ? (
                    <div ref={googleBtnRef} className="nu-auth-google-slot" />
                  ) : (
                    <button
                      type="button"
                      className="nu-auth-google-btn"
                      onClick={() =>
                        setNotice("Sign in or register directly with your student email address below.")
                      }
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z" />
                        <path fill="#FBBC05" d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z" />
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z" />
                      </svg>
                      <span>{mode === "signup" ? "Sign up with Google" : "Continue with Google"}</span>
                    </button>
                  )}
                </div>

                {googleClientId && !googleReady && (
                  <div className="nu-auth-google-loading">Preparing Google Sign-In...</div>
                )}

                <div className="nu-auth-divider">
                  <span />
                  <small>OR</small>
                  <span />
                </div>
              </>
            )}

            <form onSubmit={handleSubmit} className="nu-auth-form">
              {mode === "verify" ? (
                <>
                  <div className="nu-auth-verify-account">
                    <MailCheck size={17} color="#141413" />
                    <span>Account: <strong>{user?.email || email}</strong></span>
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="\d{6}"
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                    className="nu-auth-input nu-auth-otp-input"
                  />
                  <button type="submit" disabled={loading || otpCode.length !== 6} className="nu-auth-submit">
                    {loading ? "Verifying..." : "Verify email & continue"}
                  </button>
                  <div className="nu-auth-verify-links">
                    <button type="button" onClick={handleResend} disabled={loading} className="nu-auth-link-btn">
                      Resend verification code
                    </button>
                    <button type="button" onClick={() => navigate(redirectTo)} className="nu-auth-muted-btn">
                      Go to Dashboard →
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {mode === "signup" && (
                    <>
                      <input
                        type="text"
                        placeholder="Full name (e.g. Sarah Nakato)"
                        aria-label="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        minLength={2}
                        maxLength={120}
                        autoComplete="name"
                        className="nu-auth-input"
                      />
                      <select
                        value={programme}
                        onChange={(e) => setProgramme(e.target.value)}
                        aria-label="Study track or programme"
                        className="nu-auth-input"
                      >
                        {(catalog?.programmes || []).map((p) => (
                          <option key={p.id} value={p.id}>{p.label}</option>
                        ))}
                      </select>
                    </>
                  )}

                  <input
                    type="email"
                    placeholder="Enter your email"
                    aria-label="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="nu-auth-input"
                  />

                  <div className="nu-auth-pw-wrap">
                    <Lock size={15} className="nu-auth-pw-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder={mode === "signup" ? "Password (8+ letters & numbers)" : "Enter your password"}
                      aria-label="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={mode === "signup" ? 8 : 6}
                      maxLength={128}
                      autoComplete={mode === "signup" ? "new-password" : "current-password"}
                      className="nu-auth-input nu-auth-pw-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="nu-auth-pw-toggle"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  <button type="submit" disabled={loading} className="nu-auth-submit">
                    {loading
                      ? "Please wait..."
                      : mode === "signup"
                        ? "Create free account"
                        : "Continue with email"}
                  </button>
                </>
              )}
            </form>

            <p className="nu-auth-legal">
              By continuing, you acknowledge Nursing Uganda&apos;s{" "}
              <Link to="/terms">Terms</Link> &amp; <Link to="/privacy-policy">Privacy Policy</Link>.
            </p>
          </div>

          <Link to="/courses" className="nu-auth-bottom-pill">
            Browse 83 Nursing Courses
          </Link>
        </section>

        {/* Right Column: Site-Matched Navy/Purple Photo + Animated Clinical Overlay */}
        <aside className="nu-auth-visual-col" aria-hidden="true">
          <div className="nu-auth-photo-frame">
            <img
              src={loginPhoto}
              alt="Ugandan nurse in dark navy and purple scrubs studying with stethoscope and laptop"
              className="nu-auth-photo-img"
            />
            <div className="nu-auth-photo-scrim" />
            <div className="nu-auth-overlay-stack">
              <div key={slideIdx} className="nu-auth-overlay-card">
                <div className="nu-auth-overlay-pill">
                  <span className="nu-auth-pulse-dot" />
                  <span>{LOGIN_SLIDES[slideIdx].tag}</span>
                </div>
                <h3>{LOGIN_SLIDES[slideIdx].title}</h3>
                <p>{LOGIN_SLIDES[slideIdx].desc}</p>
                <div className="nu-auth-slide-dots">
                  {LOGIN_SLIDES.map((s, idx) => (
                    <span key={s.title} className={idx === slideIdx ? "active" : ""} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
