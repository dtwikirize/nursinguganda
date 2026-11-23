import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Trash2 } from "lucide-react";
import { formatUgxApprox, formatUsd, useApp } from "../context/AppContext";

export default function CartPage() {
  const { cart, cartTotalUsd, removeFromCart } = useApp();
  const navigate = useNavigate();

  return (
    <main className="nu-section">
      <div className="nu-container">
        <h1 style={{ fontFamily: "var(--nu-font-serif)", marginBottom: 8 }}>Shopping Cart</h1>
        <p style={{ color: "var(--nu-ink-muted)", marginBottom: 28 }}>
          {cart.length} {cart.length === 1 ? "item" : "items"} in Cart
        </p>

        {cart.length === 0 ? (
          <div style={{ border: "1px solid var(--nu-border)", padding: 48, textAlign: "center" }}>
            <ShoppingBag size={40} color="#6a6f73" style={{ margin: "0 auto 12px" }} />
            <h3>Your cart is empty</h3>
            <p style={{ color: "var(--nu-ink-muted)", marginBottom: 20 }}>
              Explore nursing courses or UNMEB mock exam packs to get started.
            </p>
            <Link to="/courses" className="nu-btn nu-btn-primary nu-btn-lg">
              Keep shopping
            </Link>
          </div>
        ) : (
          <div className="nu-cl-grid">
            <div style={{ display: "grid", gap: 14 }}>
              {cart.map((item) => (
                <div
                  key={item.slug}
                  style={{
                    display: "flex",
                    gap: 16,
                    padding: 16,
                    border: "1px solid var(--nu-border)",
                    background: "#fff",
                    alignItems: "center"
                  }}
                >
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    style={{ width: 120, height: 68, objectFit: "cover", border: "1px solid var(--nu-border-light)" }}
                  />
                  <div style={{ flex: 1 }}>
                    <strong style={{ display: "block" }}>{item.title}</strong>
                    <small style={{ color: "var(--nu-ink-muted)" }}>
                      {item.programmeLabel} · {item.lessonCount} lessons
                    </small>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <strong style={{ display: "block", color: "var(--nu-purple)" }}>
                      {formatUsd(item.priceUsd)}
                    </strong>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.slug)}
                      style={{ background: "transparent", border: 0, color: "var(--nu-danger)", fontSize: "0.82rem", marginTop: 4, display: "inline-flex", alignItems: "center", gap: 4 }}
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <aside style={{ border: "1px solid var(--nu-border)", padding: 24, background: "#fff" }}>
              <div style={{ color: "var(--nu-ink-muted)", fontWeight: 700, fontSize: "0.9rem" }}>Total:</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, margin: "4px 0" }}>
                {formatUsd(cartTotalUsd)}
              </div>
              <div style={{ fontSize: "0.84rem", color: "var(--nu-ink-muted)", marginBottom: 18 }}>
                {formatUgxApprox(cartTotalUsd)} · Instant unlock via PayPal
              </div>
              <button
                type="button"
                className="nu-btn nu-btn-primary nu-btn-lg"
                style={{ width: "100%" }}
                onClick={() => navigate("/checkout")}
              >
                Proceed to PayPal Checkout
              </button>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
