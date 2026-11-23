import React, { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ClinicalToolsPage from "./pages/ClinicalToolsPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import CoursePlayerPage from "./pages/CoursePlayerPage";
import CoursesCatalogPage from "./pages/CoursesCatalogPage";
import DictionaryPage from "./pages/DictionaryPage";
import EbookReaderPage from "./pages/EbookReaderPage";
import EbooksPage from "./pages/EbooksPage";
import FreeQuizzesPage from "./pages/FreeQuizzesPage";
import HomePage from "./pages/HomePage";
import BrandKitPage from "./pages/BrandKitPage";
import InstrumentsPage from "./pages/InstrumentsPage";
import LoginPage from "./pages/LoginPage";
import MockExamsPage from "./pages/MockExamsPage";
import MyLearningPage from "./pages/MyLearningPage";
import TrustPage from "./pages/TrustPage";

export default function App() {
  const location = useLocation();
  const isPlayer = location.pathname.startsWith("/learn/");
  const isAuthPage = location.pathname === "/login";
  const hideChrome = isPlayer || isAuthPage;

  useEffect(() => {
    if (location.pathname.startsWith("/admin")) return;
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: location.pathname,
        referrer: document.referrer || ""
      })
    }).catch(() => {});
  }, [location.pathname]);

  return (
    <>
      {!hideChrome && <Navbar />}
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

        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/my-learning" element={<MyLearningPage />} />
        <Route path="/admin" element={<AdminPage />} />

        <Route path="/about" element={<TrustPage pageKey="about" />} />
        <Route path="/brand-kit" element={<BrandKitPage />} />
        <Route path="/editorial-policy" element={<TrustPage pageKey="editorial-policy" />} />
        <Route path="/privacy-policy" element={<TrustPage pageKey="privacy-policy" />} />
        <Route path="/terms" element={<TrustPage pageKey="terms" />} />
        <Route path="/contact" element={<TrustPage pageKey="contact" />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!hideChrome && <Footer />}
    </>
  );
}
