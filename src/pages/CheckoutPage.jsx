import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, ShieldCheck } from "lucide-react";
import PayPalCheckoutButton from "../components/PayPalCheckoutButton";
import { formatUgxApprox, formatUsd, useApp } from "../context/AppContext";

export default function CheckoutPage() {
  const { user, cart, cartTotalUsd, completePayPalPurchase } = useApp();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleSuccess = async (payload) => {
    setProcessing(true);
    setError("");
    const res = await completePayPalPurchase(payload);
    setProcessing(false);
    if (!res.ok) {
      setError(res.error || "Payment verification failed. Contact support@nursinguganda.com.");
      return;
    }
    navigate("/my-learning?purchased=1");
  };

  if (cart.length === 0) {
    return (
      <main className="nu-section">
        <div className="nu-container" style={{ maxWidth: 640, textAlign: "center" }}>
          <h1>Nothing to check out</h1>
          <p style={{ color: "var(--nu-ink-muted)" }}>Add a course or mock exam pass to your cart first.</p>
          <Link to="/courses" className="nu-btn nu-btn-primary">Browse Courses</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="nu-section">
      <div className="nu-container">
        <h1 style={{ fontFamily: "var(--nu-font-serif)", marginBottom: 24 }}>Secure PayPal Checkout</h1>

        <div className="nu-cl-grid">
          <div style={{ display: "grid", gap: 20 }}>
            {!user ? (
              <div style={{ border: "1px solid var(--nu-border)", padding: 24, background: "var(--nu-bg-subtle)" }}>
                <h2 style={{ marginTop: 0 }}>1. Sign in or create your student account</h2>
                <p style={{ color: "var(--nu-ink-muted)" }}>
                  Your PayPal enrollment is saved to your Nursing Uganda account so you can study on any phone or laptop.
                </p>
                <Link to="/login?redirect=/checkout" className="nu-btn nu-btn-primary">
                  Sign in / Create Account to Pay
                </Link>
              </div>
            ) : (
              <div style={{ border: "1px solid var(--nu-border)", padding: 24, background: "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <Lock size={17} color="#a435f0" />
                  <strong>Pay securely with PayPal or Debit/Credit Card</strong>
                </div>
                <p style={{ fontSize: "0.88rem", color: "var(--nu-ink-muted)", marginBottom: 18 }}>
                  Enrolling account: <strong>{user.name}</strong> ({user.email})
                </p>

                {error && (
                  <div style={{ padding: 12, background: "var(--nu-danger-bg)", color: "var(--nu-danger)", marginBottom: 14 }}>
                    {error}
                  </div>
                )}

                {processing ? (
                  <p>Verifying payment with Hostinger server...</p>
                ) : (
                  <PayPalCheckoutButton
                    totalUsd={cartTotalUsd}
                    items={cart}
                    onSuccess={handleSuccess}
                    onError={setError}
                  />
                )}
              </div>
            )}

            <div style={{ border: "1px solid var(--nu-border)", padding: 20 }}>
              <h3 style={{ marginTop: 0 }}>Order Items ({cart.length})</h3>
              <div style={{ display: "grid", gap: 10 }}>
                {cart.map((item) => (
                  <div key={item.slug} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.92rem", borderBottom: "1px solid var(--nu-border-light)", paddingBottom: 8 }}>
                    <span>{item.title}</span>
                    <strong>{formatUsd(item.priceUsd)}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside style={{ border: "1px solid var(--nu-border)", padding: 24, background: "var(--nu-bg-subtle)" }}>
            <h3 style={{ marginTop: 0 }}>Summary</h3>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span>Subtotal:</span>
              <strong>{formatUsd(cartTotalUsd)}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: 800, paddingTop: 12, borderTop: "1px solid var(--nu-border)" }}>
              <span>Total:</span>
              <span>{formatUsd(cartTotalUsd)}</span>
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--nu-ink-muted)", marginTop: 6 }}>
              {formatUgxApprox(cartTotalUsd)}
            </div>
            <div style={{ marginTop: 18, fontSize: "0.82rem", color: "var(--nu-ink-muted)", display: "flex", gap: 8 }}>
              <ShieldCheck size={18} color="#15803d" style={{ flexShrink: 0 }} />
              <span>Every paid purchase is verified server-side and immediately unlocks lifetime unit access + UNMEB mock papers.</span>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
