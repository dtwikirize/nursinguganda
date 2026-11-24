import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  FileText,
  Layers,
  ShieldCheck,
  ShoppingBag,
  Trash2
} from "lucide-react";
import { formatUgxApprox, formatUsd, useApp } from "../context/AppContext";
import { UNMEB_PASS_ITEM, getAllAccessCartItem } from "../utils/offers";

export default function CartPage() {
  const { catalog, cart, cartTotalUsd, removeFromCart, clearCart, addToCart, enrollments } = useApp();
  const navigate = useNavigate();

  const allAccessItem = getAllAccessCartItem(catalog?.courses || []);
  const hasAllAccess =
    cart.some((i) => i.slug === "all-access-pass") ||
    enrollments.includes("all-access-pass");

  const originalTotalUsd = cart.reduce(
    (sum, item) => sum + Number(item.compareAtUsd && item.compareAtUsd > item.priceUsd ? item.compareAtUsd : item.priceUsd || 0),
    0
  );
  const savingsUsd = Math.max(0, Number((originalTotalUsd - cartTotalUsd).toFixed(2)));
  const hasPass =
    cart.some((i) => i.slug === "unmeb-mock-pass") ||
    enrollments.includes("unmeb-mock-pass") ||
    enrollments.length >= 1;

  return (
    <main className="nu-section" style={{ background: "#f8fafc", minHeight: "65vh" }}>
      <div className="nu-container">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 12,
            marginBottom: 24
          }}
        >
          <div>
            <span className="nu-badge nu-badge-free" style={{ marginBottom: 8 }}>
              Instant PayPal Access &middot; Lifetime Revision
            </span>
            <h1 style={{ fontFamily: "var(--nu-font-serif)", margin: "0 0 6px" }}>Shopping Cart</h1>
            <p style={{ color: "var(--nu-ink-muted)", margin: 0 }}>
              {cart.length} {cart.length === 1 ? "study unit" : "study units"} in your cart
            </p>
          </div>

          {cart.length > 0 && (
            <button
              type="button"
              className="nu-btn nu-btn-outline"
              style={{ height: 36, fontSize: "0.82rem" }}
              onClick={clearCart}
            >
              <Trash2 size={14} /> Clear Cart
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div
            style={{
              border: "1px solid var(--nu-border)",
              borderRadius: 12,
              background: "#ffffff",
              padding: "48px 24px",
              textAlign: "center",
              maxWidth: 720,
              margin: "0 auto"
            }}
          >
            <ShoppingBag size={42} color="#a137f2" style={{ margin: "0 auto 12px" }} />
            <h2 style={{ margin: "0 0 8px" }}>Your study cart is empty</h2>
            <p style={{ color: "var(--nu-ink-muted)", maxWidth: 480, margin: "0 auto 22px" }}>
              Browse 83 Certificate, Diploma &amp; BScN nursing units or unlock all 109 UHPAB / UNMEB past papers with Dark Navy PDF solutions.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/courses" className="nu-btn nu-btn-primary nu-btn-lg">
                Browse 83 Courses
              </Link>
              <Link to="/mock-exams" className="nu-btn nu-btn-outline nu-btn-lg">
                <FileText size={16} /> 109 UNMEB Past Papers
              </Link>
              <Link to="/ebooks" className="nu-btn nu-btn-outline nu-btn-lg">
                Free Study eBooks
              </Link>
            </div>
          </div>
        ) : (
          <div className="nu-cl-grid" style={{ alignItems: "start" }}>
            <div style={{ display: "grid", gap: 14 }}>
              {cart.map((item) => {
                const detailHref = item.type === "bundle" ? "/mock-exams" : `/course/${item.slug}`;
                const hasDiscount = Number(item.compareAtUsd || 0) > Number(item.priceUsd || 0);
                const pctOff = hasDiscount
                  ? Math.round(((item.compareAtUsd - item.priceUsd) / item.compareAtUsd) * 100)
                  : 0;
                const thumbSrc = item.thumbnail
                  ? item.thumbnail.startsWith("/")
                    ? item.thumbnail
                    : `/${item.thumbnail}`
                  : "/assets/images/udemy/cat-research.webp";

                return (
                  <article
                    key={item.slug}
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 16,
                      padding: 18,
                      border: "1px solid var(--nu-border)",
                      borderRadius: 10,
                      background: "#ffffff",
                      alignItems: "center",
                      boxShadow: "0 1px 4px rgba(15, 23, 42, 0.04)"
                    }}
                  >
                    <Link to={detailHref} style={{ flexShrink: 0 }}>
                      <img
                        src={thumbSrc}
                        alt={item.title}
                        width="132"
                        height="76"
                        style={{
                          width: 132,
                          height: 76,
                          objectFit: "cover",
                          borderRadius: 6,
                          border: "1px solid var(--nu-border-light)",
                          display: "block"
                        }}
                      />
                    </Link>

                    <div style={{ flex: "1 1 240px", minWidth: 0 }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 4 }}>
                        {item.code && (
                          <span className="nu-badge nu-badge-free" style={{ fontSize: "0.7rem" }}>
                            {item.code}
                          </span>
                        )}
                        {pctOff > 0 && (
                          <span className="nu-badge nu-badge-bestseller" style={{ fontSize: "0.7rem" }}>
                            Save {pctOff}%
                          </span>
                        )}
                      </div>
                      <Link to={detailHref} style={{ fontWeight: 700, fontSize: "1.02rem", color: "var(--nu-ink)", display: "block" }}>
                        {item.title}
                      </Link>
                      <small style={{ color: "var(--nu-ink-muted)", display: "block", marginTop: 3 }}>
                        {item.programmeLabel} · {item.lessonCount} {item.type === "bundle" ? "papers" : "lessons"} · Quiz &amp; Certificate Track
                      </small>
                    </div>

                    <div style={{ textAlign: "right", minWidth: 112 }}>
                      <strong style={{ display: "block", fontSize: "1.14rem", color: "var(--nu-purple)" }}>
                        {formatUsd(item.priceUsd)}
                      </strong>
                      {hasDiscount && (
                        <small style={{ display: "block", textDecoration: "line-through", color: "#94a3b8" }}>
                          {formatUsd(item.compareAtUsd)}
                        </small>
                      )}
                      <small style={{ display: "block", fontSize: "0.74rem", color: "var(--nu-ink-muted)" }}>
                        {formatUgxApprox(item.priceUsd)}
                      </small>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.slug)}
                        style={{
                          background: "transparent",
                          border: 0,
                          color: "var(--nu-danger)",
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          marginTop: 6,
                          padding: 0,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4
                        }}
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </article>
                );
              })}

              {/* Full Platform All-Access Pass Option */}
              {!hasAllAccess && (
                <div
                  style={{
                    border: "1.5px solid #0f172a",
                    borderRadius: 10,
                    padding: 18,
                    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                    color: "#ffffff",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 14
                  }}
                >
                  <div style={{ flex: "1 1 280px" }}>
                    <div style={{ fontSize: "0.73rem", fontWeight: 800, color: "#c084fc", textTransform: "uppercase", marginBottom: 4 }}>
                      <Layers size={13} style={{ display: "inline", marginRight: 5 }} /> Full Site Access · Save 75%
                    </div>
                    <strong style={{ display: "block", fontSize: "1rem", marginBottom: 4 }}>
                      {allAccessItem.title}
                    </strong>
                    <small style={{ color: "#cbd5e1" }}>
                      Unlock every paid unit across all 6 programmes + 109+ UNMEB past papers for{" "}
                      <strong style={{ color: "#ffffff" }}>{formatUsd(allAccessItem.priceUsd)}</strong>{" "}
                      <s style={{ color: "#94a3b8" }}>${allAccessItem.compareAtUsd.toFixed(2)}</s>
                    </small>
                  </div>
                  <button
                    type="button"
                    className="nu-btn nu-btn-primary"
                    onClick={() => addToCart(allAccessItem)}
                  >
                    Unlock Everything ({formatUsd(allAccessItem.priceUsd)})
                  </button>
                </div>
              )}

              {/* Smart Past Papers Bundle Upsell (when not in cart/enrolled yet) */}
              {!hasPass && (
                <div
                  style={{
                    border: "1.5px dashed #a137f2",
                    borderRadius: 10,
                    padding: 18,
                    background: "linear-gradient(135deg, #faf5ff 0%, #ffffff 100%)",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 14
                  }}
                >
                  <div style={{ flex: "1 1 280px" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#0f172a", textTransform: "uppercase", marginBottom: 4 }}>
                      Recommended Exam Add-On
                    </div>
                    <strong style={{ display: "block", fontSize: "0.98rem" }}>
                      {UNMEB_PASS_ITEM.title}
                    </strong>
                    <small style={{ color: "var(--nu-ink-muted)" }}>
                      Note: Enrolling in any single full course automatically unlocks the Mock Exam archive too! Or add the standalone Past Paper Pass for {formatUsd(UNMEB_PASS_ITEM.priceUsd)}.
                    </small>
                  </div>
                  <button
                    type="button"
                    className="nu-btn nu-btn-outline"
                    style={{ borderColor: "#a137f2", color: "#6d28d9", fontWeight: 700 }}
                    onClick={() => addToCart(UNMEB_PASS_ITEM)}
                  >
                    + Add Pass ({formatUsd(UNMEB_PASS_ITEM.priceUsd)})
                  </button>
                </div>
              )}
            </div>

            <aside
              style={{
                border: "1px solid var(--nu-border)",
                borderRadius: 12,
                padding: 24,
                background: "#ffffff",
                position: "sticky",
                top: 88,
                boxShadow: "0 4px 16px rgba(15, 23, 42, 0.05)"
              }}
            >
              <div style={{ color: "var(--nu-ink-muted)", fontWeight: 700, fontSize: "0.88rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Order Summary
              </div>
              <div style={{ fontSize: "2.1rem", fontWeight: 800, margin: "6px 0 2px", color: "var(--nu-ink)" }}>
                {formatUsd(cartTotalUsd)}
              </div>
              <div style={{ fontSize: "0.86rem", color: "var(--nu-ink-muted)", marginBottom: 14 }}>
                {formatUgxApprox(cartTotalUsd)} &middot; One-time payment
              </div>

              {savingsUsd > 0 && (
                <div
                  style={{
                    padding: "8px 12px",
                    borderRadius: 6,
                    background: "#ecfdf5",
                    color: "#065f46",
                    fontSize: "0.84rem",
                    fontWeight: 700,
                    marginBottom: 16
                  }}
                >
                  You save {formatUsd(savingsUsd)} off standard course prices!
                </div>
              )}

              <button
                type="button"
                className="nu-btn nu-btn-primary nu-btn-lg"
                style={{ width: "100%", marginBottom: 10 }}
                onClick={() => navigate("/checkout")}
              >
                Proceed to PayPal Checkout <ArrowRight size={17} />
              </button>

              <Link
                to="/courses"
                className="nu-btn nu-btn-outline"
                style={{ width: "100%", marginBottom: 18, fontSize: "0.86rem" }}
              >
                Keep Shopping Courses
              </Link>

              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  paddingTop: 14,
                  borderTop: "1px solid var(--nu-border-light)",
                  display: "grid",
                  gap: 8,
                  fontSize: "0.82rem",
                  color: "#475569"
                }}
              >
                <li style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <CheckCircle2 size={15} color="#15803d" /> Instant course &amp; PDF access upon checkout
                </li>
                <li style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Award size={15} color="#a137f2" /> Includes 30-Q final evaluation &amp; PDF certificate
                </li>
                <li style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <ShieldCheck size={15} color="#0f2942" /> Server-verified PayPal &amp; webhook protection
                </li>
              </ul>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
