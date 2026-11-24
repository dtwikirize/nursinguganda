import React, { Suspense, lazy, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import RouteSeo from "./components/RouteSeo";
import HomePage from "./pages/HomePage";

// Code-split secondary routes to minimize unused JS on initial landing load
const AdminPage = lazy(() => import("./pages/AdminPage"));
const BrandKitPage = lazy(() => import("./pages/BrandKitPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const ClinicalToolsPage = lazy(() => import("./pages/ClinicalToolsPage"));
const CourseDetailPage = lazy(() => import("./pages/CourseDetailPage"));
const CoursePlayerPage = lazy(() => import("./pages/CoursePlayerPage"));
const CoursesCatalogPage = lazy(() => import("./pages/CoursesCatalogPage"));
const DictionaryPage = lazy(() => import("./pages/DictionaryPage"));
const EbookReaderPage = lazy(() => import("./pages/EbookReaderPage"));
const EbooksPage = lazy(() => import("./pages/EbooksPage"));
const FreeQuizzesPage = lazy(() => import("./pages/FreeQuizzesPage"));
const GlobalNursingPage = lazy(() => import("./pages/GlobalNursingPage"));
const InstrumentsPage = lazy(() => import("./pages/InstrumentsPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const MockExamsPage = lazy(() => import("./pages/MockExamsPage"));
const MyLearningPage = lazy(() => import("./pages/MyLearningPage"));
const TrustPage = lazy(() => import("./pages/TrustPage"));

function PageLoader() {
  return (
    <main className="nu-section">
      <div className="nu-container" style={{ minHeight: "50vh", display: "flex", alignItems: "center", color: "var(--nu-ink-muted)" }}>
        Loading Nursing Uganda study module...
      </div>
    </main>
  );
}

export default function App() {
  const location = useLocation();
  const isPlayer = location.pathname.startsWith("/learn/");
  const isAuthPage = location.pathname === "/login";
  const hideChrome = isPlayer || isAuthPage;

  useEffect(() => {
    if (location.pathname.startsWith("/nodadmin")) return;
    const sendTrack = () => {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: location.pathname,
          referrer: document.referrer || ""
        })
      }).catch(() => {});
    };
    const timer = setTimeout(sendTrack, 700);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <RouteSeo />
      {!hideChrome && <Navbar />}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesCatalogPage />} />
          <Route path="/course/:slug" element={<CourseDetailPage />} />
          <Route path="/learn/:courseSlug" element={<CoursePlayerPage />} />
          <Route path="/learn/:courseSlug/:lessonSlug" element={<CoursePlayerPage />} />

          <Route path="/ebooks" element={<EbooksPage />} />
          <Route path="/ebooks/:slug" element={<EbookReaderPage />} />

          <Route path="/mock-exams" element={<MockExamsPage />} />
          <Route path="/quizzes" element={<FreeQuizzesPage />} />
          <Route path="/dictionary" element={<DictionaryPage />} />
          <Route path="/instruments" element={<InstrumentsPage />} />
          <Route path="/clinical-tools" element={<ClinicalToolsPage />} />
          <Route path="/templates" element={<ClinicalToolsPage initialTabOverride="templates" />} />
          <Route path="/global-nursing" element={<GlobalNursingPage />} />
          <Route path="/global-nursing/:countrySlug" element={<GlobalNursingPage />} />

          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/my-learning" element={<MyLearningPage />} />
          <Route path="/nodadmin" element={<AdminPage />} />

          <Route path="/about" element={<TrustPage pageKey="about" />} />
          <Route path="/brand-kit" element={<BrandKitPage />} />
          <Route path="/editorial-policy" element={<TrustPage pageKey="editorial-policy" />} />
          <Route path="/privacy-policy" element={<TrustPage pageKey="privacy-policy" />} />
          <Route path="/terms" element={<TrustPage pageKey="terms" />} />
          <Route path="/contact" element={<TrustPage pageKey="contact" />} />

          <Route
            path="*"
            element={
              <main className="nu-section">
                <div className="nu-container" style={{ maxWidth: 640, padding: "48px 16px" }}>
                  <h1>404 — Page Not Found</h1>
                  <p style={{ color: "var(--nu-ink-muted)", marginBottom: 20 }}>
                    The study unit or resource you requested does not exist or has moved.
                  </p>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <a href="/" className="nu-btn nu-btn-primary">Return Home</a>
                    <a href="/courses" className="nu-btn nu-btn-outline">Browse 95 Courses</a>
                  </div>
                </div>
              </main>
            }
          />
        </Routes>
      </Suspense>
      {!hideChrome && <Footer />}
    </>
  );
}
