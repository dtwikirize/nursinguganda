import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  enrollFreeCourse,
  fetchSession,
  loginUser,
  loginWithGoogle,
  logoutUser,
  registerUser,
  resendVerificationCode,
  submitCourseEvaluation,
  submitQuizAttempt,
  toggleLessonProgress,
  verifyEmailCode,
  verifyPayPalOrder
} from "../lib/api";

const AppContext = createContext(null);

const CART_KEY = "nu.cart.v1";
const NOTES_KEY = "nu.lessonNotes.v1";
const UGX_RATE = 3700;

export function formatUsd(amount) {
  if (!amount || Number(amount) === 0) return "Free";
  return `$${Number(amount).toFixed(2)}`;
}

export function formatUgxApprox(amountUsd) {
  if (!amountUsd || Number(amountUsd) === 0) return "Free access";
  const ugx = Math.round((Number(amountUsd) * UGX_RATE) / 500) * 500;
  return `~UGX ${ugx.toLocaleString("en-US")}`;
}

export function AppProvider({ children }) {
  const [catalog, setCatalog] = useState(null);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [progress, setProgress] = useState({});
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [lessonNotes, setLessonNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(NOTES_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    let active = true;
    Promise.all([
      fetch("/assets/data/catalog.json").then((r) => r.json()),
      fetchSession()
    ])
      .then(([catData, session]) => {
        if (!active) return;
        setCatalog(catData);
        if (session?.ok) {
          setUser(session.user || null);
          setEnrollments(session.enrollments || []);
          setProgress(session.progress || {});
          setQuizAttempts(session.quizAttempts || []);
          setCertificates(session.certificates || []);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setCatalogLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify(lessonNotes));
    } catch {}
  }, [lessonNotes]);

  const isEnrolled = (courseSlug, isFree = false, programmeId = "") => {
    if (user?.isAdmin) return true;
    if (isFree) return true;
    if (enrollments.includes("all-access-pass") || enrollments.includes(courseSlug)) return true;
    if (programmeId && (enrollments.includes(`bundle-${programmeId}`) || enrollments.includes(`full-${programmeId}`))) {
      return true;
    }
    return false;
  };

  const addToCart = (course) => {
    if (!course || course.isFree || isEnrolled(course.slug)) return;
    setCart((prev) => {
      if (prev.some((x) => x.slug === course.slug)) return prev;
      return [
        ...prev,
        {
          slug: course.slug,
          title: course.title,
          code: course.code,
          programmeLabel: course.programmeLabel,
          thumbnail: course.thumbnail,
          priceUsd: Number(course.priceUsd || 4.99),
          compareAtUsd: Number(course.compareAtUsd || 0),
          lessonCount: course.lessonCount,
          type: course.type || "course",
          courseSlugs: course.courseSlugs || [course.slug]
        }
      ];
    });
  };

  const removeFromCart = (slug) => {
    setCart((prev) => prev.filter((item) => item.slug !== slug));
  };

  const clearCart = () => setCart([]);

  const handleLogin = async (creds) => {
    const res = await loginUser(creds);
    if (res.ok) {
      setUser(res.user);
      if (res.enrollments) setEnrollments(res.enrollments);
      if (res.progress) setProgress(res.progress);
      if (res.quizAttempts) setQuizAttempts(res.quizAttempts);
      if (res.certificates) setCertificates(res.certificates);
    }
    return res;
  };

  const handleRegister = async (payload) => {
    const res = await registerUser(payload);
    if (res.ok) {
      setUser(res.user);
      setEnrollments(res.enrollments || []);
      setProgress(res.progress || {});
      setQuizAttempts(res.quizAttempts || []);
      setCertificates(res.certificates || []);
    }
    return res;
  };

  const handleGoogleLogin = async (credential) => {
    const res = await loginWithGoogle(credential);
    if (res.ok) {
      setUser(res.user);
      if (res.enrollments) setEnrollments(res.enrollments);
      if (res.progress) setProgress(res.progress);
      if (res.quizAttempts) setQuizAttempts(res.quizAttempts);
      if (res.certificates) setCertificates(res.certificates);
    }
    return res;
  };

  const handleVerifyEmail = async (code) => {
    const res = await verifyEmailCode(code);
    if (res.ok && res.user) {
      setUser(res.user);
    }
    return res;
  };

  const handleResendVerification = async () => {
    return resendVerificationCode();
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setEnrollments([]);
    setProgress({});
    setQuizAttempts([]);
    setCertificates([]);
  };

  const handleFreeEnroll = async (courseSlug) => {
    const res = await enrollFreeCourse(courseSlug);
    if (res.ok && res.enrollments) {
      setEnrollments(res.enrollments);
    }
    return res;
  };

  const handleCompletePayPal = async (payload) => {
    const res = await verifyPayPalOrder(payload);
    if (res.ok && res.enrollments) {
      setEnrollments(res.enrollments);
      clearCart();
    }
    return res;
  };

  const handleToggleLesson = async (courseSlug, lessonSlug, completed) => {
    const res = await toggleLessonProgress(courseSlug, lessonSlug, completed);
    if (res.ok && res.progress) {
      setProgress(res.progress);
    }
  };

  const saveLessonNote = (key, text) => {
    setLessonNotes((prev) => ({ ...prev, [key]: text }));
  };

  const handleSubmitQuiz = async (payload) => {
    const res = await submitQuizAttempt(payload);
    if (res?.ok && res.quizAttempts) {
      setQuizAttempts(res.quizAttempts);
    }
    return res;
  };

  const handleSubmitFinalEvaluation = async (payload) => {
    const res = await submitCourseEvaluation(payload);
    if (res?.ok) {
      if (res.quizAttempts) setQuizAttempts(res.quizAttempts);
      if (res.certificates) setCertificates(res.certificates);
    }
    return res;
  };

  const cartTotalUsd = useMemo(
    () => Number(cart.reduce((sum, item) => sum + Number(item.priceUsd || 0), 0).toFixed(2)),
    [cart]
  );

  const value = {
    catalog,
    catalogLoading,
    user,
    enrollments,
    progress,
    quizAttempts,
    certificates,
    cart,
    cartTotalUsd,
    lessonNotes,
    isEnrolled,
    addToCart,
    removeFromCart,
    clearCart,
    login: handleLogin,
    register: handleRegister,
    googleLogin: handleGoogleLogin,
    verifyEmail: handleVerifyEmail,
    resendVerification: handleResendVerification,
    logout: handleLogout,
    enrollFree: handleFreeEnroll,
    completePayPalPurchase: handleCompletePayPal,
    toggleLessonComplete: handleToggleLesson,
    saveLessonNote,
    submitQuizResult: handleSubmitQuiz,
    submitFinalEvaluation: handleSubmitFinalEvaluation
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
