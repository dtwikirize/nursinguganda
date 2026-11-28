import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Layers,
  ShoppingCart,
  Sparkles,
  X
} from "lucide-react";
import { formatUgxApprox, formatUsd, useApp } from "../context/AppContext";
import { UNMEB_PASS_ITEM, getAllAccessCartItem, getProgrammeBundleItem } from "../utils/offers";

const DISMISS_KEY = "nu_popup_dismissed_at";
const DISMISS_WINDOW_MS = 24 * 60 * 60 * 1000;

/** One dismissal silences the spotlight everywhere for 24 hours. */
function dismissedToday() {
  try {
    const at = Number(localStorage.getItem(DISMISS_KEY) || 0);
    return at > 0 && Date.now() - at < DISMISS_WINDOW_MS;
  } catch {
    return false;
  }
}

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
    if (path.startsWith("/cart")) return "cart";
    if (path.startsWith("/learn/")) return "learn";
    if (path.startsWith("/course/")) return "course";
    if (path.startsWith("/nclex-rn")) return "nclex";
    if (
      path.startsWith("/global-nursing") ||
      path.startsWith("/nursing-uk") ||
      path.startsWith("/nursing-usa") ||
      path.startsWith("/nursing-canada") ||
      path.startsWith("/nursing-australia")
    ) {
      return "global";
    }
    if (path.startsWith("/ebooks")) return "books";
    if (path.startsWith("/mock-exams") || path.startsWith("/quizzes")) return "exams";
    if (path.startsWith("/topics") || path.startsWith("/dictionary") || path.startsWith("/clinical-tools") || path.startsWith("/templates")) {
      return "topics";
    }
    return "home";
  }, [path]);

  // Smart rotating spotlight modes: "nclex" | "books" | "offer" | "exams"
  const availableModes = useMemo(() => {
    const list = [];
    if (zone === "cart") return ["offer"];
    if (zone === "learn" || zone === "course") {
      if (!hasAllAccess) list.push("offer");
      list.push("nclex", "books");
      return list;
    }
    if (zone === "global") return ["nclex", "books", ...(!hasAllAccess ? ["offer"] : [])];
    if (zone === "books") return ["books", "nclex", ...(!hasAllAccess ? ["offer"] : [])];
    if (zone === "topics") return ["books", "nclex", ...(!hasAllAccess ? ["offer"] : [])];
    if (zone === "exams") return [...(!hasAllAccess ? ["offer"] : []), "nclex", "books"];
    if (zone === "nclex") return ["nclex", "books"];
    // Home page rotates across NCLEX-RN, New Books, and All-Access
    return ["nclex", "books", ...(!hasAllAccess ? ["offer"] : [])];
  }, [zone, hasAllAccess]);

  const [modeIdx, setModeIdx] = useState(0);
  const activeMode = availableModes[modeIdx % availableModes.length] || "nclex";

  const activeCourse = useMemo(() => {
    const courses = catalog?.courses || [];
    if (path.startsWith("/learn/") || path.startsWith("/course/")) {
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

  useEffect(() => {
    setModeIdx(0);
    setOpen(false);
    if (isHiddenRoute) return;
    // Never interrupt an active checkout.
    if (zone === "cart") return;
    if (dismissedToday()) return;

    // Engagement-based rather than a short timer. The popup used to cover the
    // hero 4.8s after load, before most visitors had finished reading it.
    // It now waits for a reader who is actually engaged — half a screen of
    // scrolling, or exit intent — with a long timer only as a last resort.
    let fired = false;
    const show = () => {
      if (fired) return;
      fired = true;
      setOpen(true);
    };
    const onScroll = () => {
      const seen = window.scrollY + window.innerHeight;
      if (seen > document.documentElement.scrollHeight * 0.5) show();
    };
    const onExitIntent = (e) => {
      if (e.clientY <= 0) show();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    document.addEventListener("mouseout", onExitIntent);
    const fallback = setTimeout(show, 20000);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll, { capture: true });
      document.removeEventListener("mouseout", onExitIntent);
      clearTimeout(fallback);
    };
  }, [zone, path, isHiddenRoute]);

  const handleClose = () => {
    setOpen(false);
    try {
      // One dismissal silences the popup everywhere for 24 hours. It was
      // previously keyed per zone, so a visitor moving between sections was
      // interrupted again on each one despite having closed it each time.
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {}
  };

  if (isHiddenRoute) return null;
  if (zone === "cart" && cart.length === 0) return null;

  const allAccessItem = getAllAccessCartItem(catalog?.courses || []);

  const buyNow = (item) => {
    if (!item) return;
    addToCart(item);
    setOpen(false);
    navigate("/checkout");
  };

  // Build popup card content by activeMode
  let badgeIcon = <Sparkles size={14} />;
  let fabText = "NCLEX-RN · New Books";
  let kicker = "INTERNATIONAL LICENSING TRACK";
  let headline = "NCLEX-RN Complete 16-Unit Academy ($99)";
  let body = "Prepare for US, Canadian & Australian licensure with NGN 6-step Clinical Judgment lessons, High-Yield Pharmacology, and 4 adaptive CAT exams.";
  let priceMeta = "$99.00 — complete 16-unit academy";
  let primaryLabel = "Open NCLEX-RN Academy";
  let primaryAction = () => { setOpen(false); navigate("/nclex-rn"); };
  let secondaryLabel = "Try CAT Mock Exams";
  let secondaryAction = () => { setOpen(false); navigate("/nclex-rn/exams"); };

  if (activeMode === "books") {
    badgeIcon = <BookOpen size={14} />;
    fabText = "New · 87 Full Books";
    kicker = "NEW · 79 COMPLETE TEXTBOOKS ADDED";
    headline = "Read Full-Book Pharmacology & Clinical Guides";
    body = "Explore 87 free nursing & medical books featuring organized whole-book chapters, sticky side Table of Contents, and instant PDF exports.";
    priceMeta = "100% Free Open Study Access · All 87 Books";
    primaryLabel = "Open Instant Clinical Pharmacology";
    primaryAction = () => { setOpen(false); navigate("/ebooks/book-instant-clinical-pharmacology"); };
    secondaryLabel = "Browse 87 Free Books";
    secondaryAction = () => { setOpen(false); navigate("/ebooks"); };
  } else if (activeMode === "offer") {
    badgeIcon = <Layers size={14} />;
    fabText = "Full platform access";
    kicker = "FULL PLATFORM ALL-ACCESS";
    headline = "Units from $2.49, or unlock everything";
    body = "Paid units start at $2.49 each. The Full Platform All-Access Pass covers all 85 courses and 109+ mock papers in one purchase.";
    priceMeta = `${formatUsd(allAccessItem.priceUsd)} — $${allAccessItem.separatelyUsd.toFixed(2)} if bought separately · ${formatUgxApprox(allAccessItem.priceUsd)}`;
    primaryLabel = `Full All-Access · ${formatUsd(allAccessItem.priceUsd)}`;
    primaryAction = () => buyNow(allAccessItem);
    secondaryLabel = "Browse All Courses";
    secondaryAction = () => { setOpen(false); navigate("/courses"); };

    if (zone === "learn" && activeCourse) {
      const unitEnrolled = isEnrolled(activeCourse.slug, activeCourse.isFree);
      if (!activeCourse.isFree && !unitEnrolled) {
        kicker = "STUDY PREVIEW";
        headline = `Unlock Full ${activeCourse.title}`;
        body = `Get all ${activeCourse.lessonCount} clinical topics, quizzes & the certificate for this unit, or unlock every course sitewide.`;
        priceMeta = `${formatUsd(activeCourse.priceUsd)} (${formatUgxApprox(activeCourse.priceUsd)})`;
        primaryLabel = `Unlock Unit · ${formatUsd(activeCourse.priceUsd)}`;
        primaryAction = () => buyNow(activeCourse);
        secondaryLabel = `All-Access (85 Units) · ${formatUsd(allAccessItem.priceUsd)}`;
        secondaryAction = () => buyNow(allAccessItem);
      }
    } else if (zone === "course" && activeCourse) {
      const unitEnrolled = isEnrolled(activeCourse.slug, activeCourse.isFree);
      if (!activeCourse.isFree && !unitEnrolled) {
        kicker = "SINGLE UNIT OR FULL ACCESS";
        headline = "Choose a single unit or everything";
        body = `Enroll in ${activeCourse.title} for ${formatUsd(activeCourse.priceUsd)}, or unlock ALL 85 courses + 109 past papers.`;
        primaryLabel = `Full All-Access · ${formatUsd(allAccessItem.priceUsd)}`;
        primaryAction = () => buyNow(allAccessItem);
        secondaryLabel = activeProgBundle
          ? `${activeCourse.programmeLabel} Bundle · ${formatUsd(activeProgBundle.priceUsd)}`
          : `Single Unit · ${formatUsd(activeCourse.priceUsd)}`;
        secondaryAction = () => buyNow(activeProgBundle || activeCourse);
      }
    } else if (zone === "exams") {
      kicker = "UNMEB EXAM PREP";
      headline = "Unlock All 109+ Past Papers & Full Courses";
      body = "Practice timed UNMEB & UHPAB mock exams with complete marking guides, or unlock every study course & exam bank together.";
      priceMeta = !hasExamPass
        ? `${formatUsd(UNMEB_PASS_ITEM.priceUsd)} (${formatUgxApprox(UNMEB_PASS_ITEM.priceUsd)})`
        : `${formatUsd(allAccessItem.priceUsd)} (${formatUgxApprox(allAccessItem.priceUsd)})`;
      primaryLabel = !hasExamPass
        ? `Unlock Past Papers · ${formatUsd(UNMEB_PASS_ITEM.priceUsd)}`
        : `Full All-Access · ${formatUsd(allAccessItem.priceUsd)}`;
      primaryAction = () => buyNow(!hasExamPass ? UNMEB_PASS_ITEM : allAccessItem);
      secondaryLabel = `All 85 Courses + Papers · ${formatUsd(allAccessItem.priceUsd)}`;
      secondaryAction = () => buyNow(allAccessItem);
    } else if (zone === "cart") {
      kicker = "COMPLETE ACCESS UPGRADE";
      headline = `Switch to All-Access for ${formatUsd(allAccessItem.priceUsd)}`;
      body = `Your cart totals ${formatUsd(cartTotalUsd)}. Upgrade to unlock all 85 nursing courses plus 109+ UNMEB mock papers.`;
      primaryLabel = `Upgrade to All-Access · ${formatUsd(allAccessItem.priceUsd)}`;
      primaryAction = () => buyNow(allAccessItem);
      secondaryLabel = "Continue With Cart";
      secondaryAction = handleClose;
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        className="nu-offer-fab nu-no-print"
        onClick={() => setOpen(true)}
        aria-label="Open NCLEX-RN, New Books & Offers spotlight"
      >
        {badgeIcon} {fabText}
      </button>
    );
  }

  return (
    <aside className="nu-offer-popup nu-no-print" role="dialog" aria-label="Featured Nursing Spotlight">
      <button type="button" className="nu-offer-close" onClick={handleClose} aria-label="Close spotlight popup">
        <X size={16} />
      </button>

      {availableModes.length > 1 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10, paddingRight: 22 }}>
          {availableModes.map((m, idx) => (
            <button
              key={m}
              type="button"
              onClick={() => setModeIdx(idx)}
              style={{
                border: "1px solid",
                borderColor: activeMode === m ? "var(--nu-purple)" : "#e2e8f0",
                background: activeMode === m ? "#f5f3ff" : "#ffffff",
                color: activeMode === m ? "var(--nu-purple)" : "#475569",
                fontSize: "0.68rem",
                fontWeight: 700,
                padding: "3px 9px",
                borderRadius: 999,
                cursor: "pointer"
              }}
            >
              {m === "nclex" ? "NCLEX-RN ($99)" : m === "books" ? "New 87 Books" : "All-Access Pass"}
            </button>
          ))}
        </div>
      )}

      <div className="nu-offer-kicker">{kicker}</div>
      <h3 className="nu-offer-title">{headline}</h3>
      <p className="nu-offer-body">{body}</p>
      <div className="nu-offer-price-meta">
        {activeMode === "nclex" ? <GraduationCap size={14} color="#7c3aed" /> : <CheckCircle2 size={14} color="#7c3aed" />}
        <span><strong>{priceMeta}</strong></span>
      </div>
      <div className="nu-offer-actions">
        <button type="button" className="nu-btn nu-btn-primary nu-offer-cta-main" onClick={primaryAction}>
          {activeMode === "offer" && <ShoppingCart size={15} />} {primaryLabel}
        </button>
        <button type="button" className="nu-btn nu-btn-outline nu-offer-cta-alt" onClick={secondaryAction}>
          {secondaryLabel} <ArrowRight size={14} />
        </button>
      </div>
    </aside>
  );
}
