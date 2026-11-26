import React, { Component, Suspense, lazy, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import RouteSeo from "./components/RouteSeo";
import NursingLoader from "./components/NursingLoader";
import ContextOfferPopup from "./components/ContextOfferPopup";
import HomePage from "./pages/HomePage";

function lazyWithRetry(importer) {
  return lazy(async () => {
    try {
      return await importer();
    } catch (err) {
      const key = "nu.chunk_reload_at";
      let reloaded = false;
      try {
        const last = Number(sessionStorage.getItem(key) || 0);
        if (Date.now() - last > 15000) {
          sessionStorage.setItem(key, String(Date.now()));
          reloaded = true;
          window.location.reload();
        }
      } catch {
        reloaded = true;
        window.location.reload();
      }
      if (!reloaded) throw err;
      return new Promise(() => {});
    }
  });
}

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <main className="nu-section">
          <div className="nu-container" style={{ maxWidth: 560, padding: "48px 16px", textAlign: "center" }}>
            <h1 style={{ marginBottom: 10 }}>Page update ready</h1>
            <p style={{ color: "var(--nu-ink-muted)", marginBottom: 20 }}>
              A newer version of this page was just published or your connection dropped briefly.
            </p>
            <button type="button" className="nu-btn nu-btn-primary" onClick={() => window.location.reload()}>
              Reload Page Now
            </button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}

// Code-split secondary routes to minimize unused JS on initial landing load
const AdminPage = lazyWithRetry(() => import("./pages/AdminPage"));
const CartPage = lazyWithRetry(() => import("./pages/CartPage"));
const CheckoutPage = lazyWithRetry(() => import("./pages/CheckoutPage"));
const ClinicalToolsPage = lazyWithRetry(() => import("./pages/ClinicalToolsPage"));
const CountryStudyHubPage = lazyWithRetry(() => import("./pages/CountryStudyHubPage"));
const CountryTopicPage = lazyWithRetry(() => import("./pages/CountryTopicPage"));
const CourseDetailPage = lazyWithRetry(() => import("./pages/CourseDetailPage"));
const CoursePlayerPage = lazyWithRetry(() => import("./pages/CoursePlayerPage"));
const CoursesCatalogPage = lazyWithRetry(() => import("./pages/CoursesCatalogPage"));
const DictionaryPage = lazyWithRetry(() => import("./pages/DictionaryPage"));
const EbookReaderPage = lazyWithRetry(() => import("./pages/EbookReaderPage"));
const EbooksPage = lazyWithRetry(() => import("./pages/EbooksPage"));
const FreeQuizzesPage = lazyWithRetry(() => import("./pages/FreeQuizzesPage"));
const GlobalNursingPage = lazyWithRetry(() => import("./pages/GlobalNursingPage"));
const InstrumentsPage = lazyWithRetry(() => import("./pages/InstrumentsPage"));
const LoginPage = lazyWithRetry(() => import("./pages/LoginPage"));
const MedicalImagesPage = lazyWithRetry(() => import("./pages/MedicalImagesPage"));
const MockExamsPage = lazyWithRetry(() => import("./pages/MockExamsPage"));
const MyLearningPage = lazyWithRetry(() => import("./pages/MyLearningPage"));
const NclexRnAcademyPage = lazyWithRetry(() => import("./pages/NclexRnAcademyPage"));
const NclexRnExamsPage = lazyWithRetry(() => import("./pages/NclexRnExamsPage"));
const NclexRnPlayerPage = lazyWithRetry(() => import("./pages/NclexRnPlayerPage"));
const NurseTopicsPage = lazyWithRetry(() => import("./pages/NurseTopicsPage"));
const TrustPage = lazyWithRetry(() => import("./pages/TrustPage"));

function PageLoader() {
  return (
    <main className="nu-section">
      <div className="nu-container">
        <NursingLoader label="Preparing your clinical study notes..." />
      </div>
    </main>
  );
}

function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace(/^#/, "");
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    const scrollTopNow = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    scrollTopNow();
    const t = setTimeout(scrollTopNow, 75);
    return () => clearTimeout(t);
  }, [pathname, search, hash]);

  return null;
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
      <ScrollToTop />
      <RouteSeo />
      {!hideChrome && <Navbar />}
      <ContextOfferPopup />
      <AppErrorBoundary>
        <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesCatalogPage />} />
          <Route path="/topics" element={<NurseTopicsPage />} />
          <Route path="/course/:slug" element={<CourseDetailPage />} />
          <Route path="/learn/:courseSlug" element={<CoursePlayerPage />} />
          <Route path="/learn/:courseSlug/:lessonSlug" element={<CoursePlayerPage />} />

          <Route path="/ebooks" element={<EbooksPage />} />
          <Route path="/ebooks/:slug" element={<EbookReaderPage />} />

          <Route path="/mock-exams" element={<MockExamsPage />} />
          <Route path="/quizzes" element={<FreeQuizzesPage />} />
          <Route path="/dictionary" element={<DictionaryPage />} />
          <Route path="/medical-images" element={<MedicalImagesPage />} />
          <Route path="/instruments" element={<InstrumentsPage />} />
          <Route path="/clinical-tools" element={<ClinicalToolsPage />} />
          <Route path="/templates" element={<ClinicalToolsPage initialTabOverride="templates" />} />
          <Route path="/global-nursing" element={<GlobalNursingPage />} />
          <Route path="/global-nursing/:countrySlug" element={<CountryStudyHubPage />} />
          <Route path="/global-nursing/:countrySlug/topics/:topicSlug" element={<CountryTopicPage />} />
          <Route path="/nursing-uk" element={<CountryStudyHubPage forcedSlug="united-kingdom-nmc" />} />
          <Route path="/nursing-uk/topics/:topicSlug" element={<CountryTopicPage countryKey="uk" />} />
          <Route path="/nursing-usa" element={<CountryStudyHubPage forcedSlug="united-states-nclex" />} />
          <Route path="/nursing-usa/topics/:topicSlug" element={<CountryTopicPage countryKey="usa" />} />
          <Route path="/nursing-canada" element={<CountryStudyHubPage forcedSlug="canada-nnas-nclex" />} />
          <Route path="/nursing-canada/topics/:topicSlug" element={<CountryTopicPage countryKey="canada" />} />
          <Route path="/nursing-australia" element={<CountryStudyHubPage forcedSlug="australia-ahpra-nmba" />} />
          <Route path="/nursing-australia/topics/:topicSlug" element={<CountryTopicPage countryKey="australia" />} />
          <Route path="/nclex-rn" element={<NclexRnAcademyPage />} />
          <Route path="/nclex-rn/learn" element={<NclexRnPlayerPage />} />
          <Route path="/nclex-rn/unit/:unitSlug" element={<NclexRnPlayerPage />} />
          <Route path="/nclex-rn/exams" element={<NclexRnExamsPage />} />

          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/my-learning" element={<MyLearningPage />} />
          <Route path="/nodadmin" element={<AdminPage />} />

          <Route path="/about" element={<TrustPage pageKey="about" />} />
          <Route path="/editorial-policy" element={<TrustPage pageKey="editorial-policy" />} />
          <Route path="/privacy-policy" element={<TrustPage pageKey="privacy-policy" />} />
          <Route path="/terms" element={<TrustPage pageKey="terms" />} />
          <Route path="/contact" element={<TrustPage pageKey="contact" />} />

          <Route
            path="*"
            element={
              <main className="nu-section">
                <div className="nu-container" style={{ maxWidth: 640, padding: "48px 16px" }}>
                  <h1>404 | Page Not Found</h1>
                  <p style={{ color: "var(--nu-ink-muted)", marginBottom: 20 }}>
                    The study unit or resource you requested does not exist or has moved.
                  </p>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <a href="/" className="nu-btn nu-btn-primary">Return Home</a>
                    <a href="/courses" className="nu-btn nu-btn-outline">Browse 83 Courses</a>
                  </div>
                </div>
              </main>
            }
          />
        </Routes>
        </Suspense>
      </AppErrorBoundary>
      {!hideChrome && <Footer />}
    </>
  );
}
