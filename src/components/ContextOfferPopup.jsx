import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Layers, ShoppingCart, X } from "lucide-react";
import { formatUgxApprox, formatUsd, useApp } from "../context/AppContext";
import { UNMEB_PASS_ITEM, getAllAccessCartItem, getProgrammeBundleItem } from "../utils/offers";

export default function ContextOfferPopup() {
  const location = useLocation();
  const navigate = useNavigate();
  const { catalog, cart, cartTotalUsd, enrollments, isEnrolled, addToCart, user } = useApp();

  const path = location.pathname || "/";
  const isHiddenRoute =
    path === "/login" ||
    path.startsWith("/checkout") ||
    path.startsWith("/nodadmin");

  const hasAllAccess =
    Boolean(user?.isAdmin) ||
    enrollments.includes("all-access-pass") ||
    cart.some((x) => x.slug === "all-access-pass");

  const hasExamPass =
    hasAllAccess ||
    enrollments.includes("unmeb-mock-pass") ||
    enrollments.length >= 1;

  const zone = useMemo(() => {
    if (path.startsWith("/learn/")) return "learn";
    if (path.startsWith("/course/")) return "course";
    if (
      path.startsWith("/mock-exams") ||
      path.startsWith("/quizzes") ||
      path.startsWith("/ebooks") ||
      path.startsWith("/clinical-tools") ||
      path.startsWith("/templates") ||
      path.startsWith("/dictionary") ||
      path.startsWith("/instruments")
    ) {
      return "exams";
    }
    if (path.startsWith("/cart")) return "cart";
    return "browse";
  }, [path]);

  const activeCourse = useMemo(() => {
    const courses = catalog?.courses || [];
    if (path.startsWith("/learn/")) {
      const slug = path.split("/")[2] || "";
      return courses.find((c) => c.slug === slug) || null;
    }
    if (path.startsWith("/course/")) {
      const slug = path.split("/")[2] || "";
      return courses.find((c) => c.slug === slug) || null;
    }
    return null;
  }, [path, catalog]);

  const activeProgBundle = useMemo(() => {
    if (!activeCourse?.programmeId) return null;
    const prog = (catalog?.programmes || []).find((p) => p.id === activeCourse.programmeId);
    return getProgrammeBundleItem(prog, catalog?.courses || []);
  }, [activeCourse, catalog]);

  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setOpen(false);
    if (isHiddenRoute || hasAllAccess) return;
    if (zone === "cart" && cart.length === 0) return;

    let alreadyClosed = false;
    try {
      alreadyClosed = sessionStorage.getItem(`nu_offer_closed_${zone}`) === "1";
    } catch {}
    setDismissed(alreadyClosed);
    if (alreadyClosed) return;

    const delayMs = zone === "cart" ? 1800 : zone === "learn" || zone === "course" ? 4200 : 5200;
    const timer = setTimeout(() => setOpen(true), delayMs);
    return () => clearTimeout(timer);
  }, [zone, path, isHiddenRoute, hasAllAccess, cart.length]);

  const handleClose = () => {
    setOpen(false);
    setDismissed(true);
    try {
      sessionStorage.setItem(`nu_offer_closed_${zone}`, "1");
    } catch {}
  };

  if (isHiddenRoute || hasAllAccess) return null;
  if (zone === "cart" && cart.length === 0) return null;

  const allAccessItem = getAllAccessCartItem(catalog?.courses || []);

  const buyNow = (item) => {
    if (!item) return;
    addToCart(item);
    setOpen(false);
    navigate("/checkout");
  };

  let kicker = "50% STUDENT PRICE CUT LIVE";
  let headline = "Courses From $2.49 — Or Unlock Everything";
  let body = "Every individual paid course is cut by 50% today. Or get the Full Platform All-Access Pass covering all 83 courses and 109+ UNMEB past papers.";
  let primaryLabel = `Full All-Access · ${formatUsd(allAccessItem.priceUsd)}`;
  let primaryCompare = `$${allAccessItem.compareAtUsd.toFixed(2)}`;
  let primaryAction = () => buyNow(allAccessItem);
  let secondaryLabel = "Browse 50% Off Courses";
  let secondaryAction = () => {
    setOpen(false);
    navigate("/courses");
  };

  if (zone === "learn" && activeCourse) {
    const unitEnrolled = isEnrolled(activeCourse.slug, activeCourse.isFree);
    if (!activeCourse.isFree && !unitEnrolled) {
      kicker = "STUDY PREVIEW · 50% OFF TODAY";
      headline = `Unlock Full ${activeCourse.title}`;
      body = `Get all ${activeCourse.lessonCount} clinical topics, quizzes & certificate at 50% OFF — or unlock every course sitewide.`;
      primaryLabel = `Unlock Unit · ${formatUsd(activeCourse.priceUsd)}`;
      primaryCompare = activeCourse.compareAtUsd > activeCourse.priceUsd ? `$${Number(activeCourse.compareAtUsd).toFixed(2)}` : "";
      primaryAction = () => buyNow(activeCourse);
      secondaryLabel = `All-Access (83 Units) · ${formatUsd(allAccessItem.priceUsd)}`;
      secondaryAction = () => buyNow(allAccessItem);
    } else {
      kicker = "FULL REVISION UNLOCK";
      headline = "Unlock All 83 Courses & 109 Past Papers";
      body = "Step up to unlimited access across Certificate, Diploma & BScN units plus downloadable exam prep & certificates.";
      primaryLabel = `Get All-Access · ${formatUsd(allAccessItem.priceUsd)}`;
      primaryCompare = `$${allAccessItem.compareAtUsd.toFixed(2)}`;
      primaryAction = () => buyNow(allAccessItem);
      secondaryLabel = hasExamPass ? "Browse More Units" : `Past Papers Pass · ${formatUsd(UNMEB_PASS_ITEM.priceUsd)}`;
      secondaryAction = hasExamPass
        ? () => { setOpen(false); navigate("/courses"); }
        : () => buyNow(UNMEB_PASS_ITEM);
    }
  } else if (zone === "course" && activeCourse) {
    const unitEnrolled = isEnrolled(activeCourse.slug, activeCourse.isFree);
    if (!activeCourse.isFree && !unitEnrolled) {
      kicker = "50% UNIT CUT OR FULL ACCESS";
      headline = `Choose Single Unit (50% Off) or Everything`;
      body = `Enroll in ${activeCourse.title} for ${formatUsd(activeCourse.priceUsd)} (was $${Number(activeCourse.compareAtUsd || activeCourse.priceUsd * 2).toFixed(2)}), or unlock ALL 83 courses + 109 past papers.`;
      primaryLabel = `Full All-Access · ${formatUsd(allAccessItem.priceUsd)}`;
      primaryCompare = `$${allAccessItem.compareAtUsd.toFixed(2)}`;
      primaryAction = () => buyNow(allAccessItem);
      secondaryLabel = activeProgBundle
        ? `${activeCourse.programmeLabel} Bundle · ${formatUsd(activeProgBundle.priceUsd)}`
        : `Single Unit · ${formatUsd(activeCourse.priceUsd)}`;
      secondaryAction = () => buyNow(activeProgBundle || activeCourse);
    }
  } else if (zone === "exams") {
    kicker = "UNMEB EXAM PREP · 50% OFF";
    headline = "Unlock All 109+ Past Papers & Full Courses";
    body = "Practice timed UNMEB & UHPAB mock exams with complete marking guides, or unlock every study course & exam bank together.";
    primaryLabel = !hasExamPass
      ? `Unlock Past Papers · ${formatUsd(UNMEB_PASS_ITEM.priceUsd)}`
      : `Full All-Access · ${formatUsd(allAccessItem.priceUsd)}`;
    primaryCompare = !hasExamPass ? `$${UNMEB_PASS_ITEM.compareAtUsd.toFixed(2)}` : `$${allAccessItem.compareAtUsd.toFixed(2)}`;
    primaryAction = () => buyNow(!hasExamPass ? UNMEB_PASS_ITEM : allAccessItem);
    secondaryLabel = `All 83 Courses + Papers · ${formatUsd(allAccessItem.priceUsd)}`;
    secondaryAction = () => buyNow(allAccessItem);
  } else if (zone === "cart") {
    kicker = "COMPLETE ACCESS UPGRADE";
    headline = `Switch to All-Access for ${formatUsd(allAccessItem.priceUsd)}`;
    body = `Your cart totals ${formatUsd(cartTotalUsd)}. Upgrade to unlock all 83 nursing courses across every programme plus 109+ UNMEB papers.`;
    primaryLabel = `Upgrade to All-Access · ${formatUsd(allAccessItem.priceUsd)}`;
    primaryCompare = `$${allAccessItem.compareAtUsd.toFixed(2)}`;
    primaryAction = () => buyNow(allAccessItem);
    secondaryLabel = "Continue With Cart";
    secondaryAction = handleClose;
  }

  if (!open) {
    return (
      <button
        type="button"
        className="nu-offer-fab nu-no-print"
        onClick={() => setOpen(true)}
        aria-label="View current 50% off course & all-access offers"
      >
        <Layers size={14} /> 50% OFF · Full Access
      </button>
    );
  }

  return (
    <aside className="nu-offer-popup nu-no-print" role="dialog" aria-label="Course & All-Access Offer">
      <button type="button" className="nu-offer-close" onClick={handleClose} aria-label="Close offer">
        <X size={16} />
      </button>
      <div className="nu-offer-kicker">{kicker}</div>
      <h3 className="nu-offer-title">{headline}</h3>
      <p className="nu-offer-body">{body}</p>
      <div className="nu-offer-price-meta">
        <CheckCircle2 size={14} color="#7c3aed" />
        <span>
          <strong>{primaryLabel}</strong>
          {primaryCompare && <s style={{ marginLeft: 6, color: "#64748b" }}>{primaryCompare}</s>}
          <span style={{ marginLeft: 6, color: "#64748b" }}>({formatUgxApprox(zone === "exams" && !hasExamPass ? UNMEB_PASS_ITEM.priceUsd : zone === "learn" && activeCourse && !activeCourse.isFree && !isEnrolled(activeCourse.slug, activeCourse.isFree) ? activeCourse.priceUsd : allAccessItem.priceUsd)})</span>
        </span>
      </div>
      <div className="nu-offer-actions">
        <button type="button" className="nu-btn nu-btn-primary nu-offer-cta-main" onClick={primaryAction}>
          <ShoppingCart size={15} /> {primaryLabel}
        </button>
        <button type="button" className="nu-btn nu-btn-outline nu-offer-cta-alt" onClick={secondaryAction}>
          {secondaryLabel} <ArrowRight size={14} />
        </button>
      </div>
    </aside>
  );
}
