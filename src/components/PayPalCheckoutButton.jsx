import React, { useEffect, useRef, useState } from "react";
import { fetchRuntimeConfig, getPayPalConfig } from "../lib/api";

export default function PayPalCheckoutButton({ totalUsd, items, onSuccess, onError }) {
  const containerRef = useRef(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [sdkFailed, setSdkFailed] = useState(false);
  const initialCfg = getPayPalConfig();
  const [clientId, setClientId] = useState(initialCfg.clientId);
  const currency = initialCfg.currency;
  const isSandboxPlaceholder = !clientId || clientId === "sb";

  useEffect(() => {
    fetchRuntimeConfig().then((cfg) => {
      if (cfg?.paypalClientId && cfg.paypalClientId !== "sb") {
        setClientId(cfg.paypalClientId);
        setSdkFailed(false);
      }
    });
  }, []);

  useEffect(() => {
    if (isSandboxPlaceholder) {
      setSdkFailed(true);
      return;
    }

    const existing = document.getElementById("paypal-js-sdk");
    if (existing && window.paypal) {
      setSdkReady(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "paypal-js-sdk";
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=${encodeURIComponent(currency)}`;
    script.async = true;
    script.onload = () => setSdkReady(true);
    script.onerror = () => setSdkFailed(true);
    document.body.appendChild(script);
  }, [clientId, currency, isSandboxPlaceholder]);

  useEffect(() => {
    if (!sdkReady || !window.paypal || !containerRef.current) return;
    containerRef.current.innerHTML = "";

    window.paypal
      .Buttons({
        style: { layout: "vertical", color: "gold", shape: "rect", label: "paypal" },
        createOrder: (_data, actions) =>
          actions.order.create({
            purchase_units: [
              {
                description: `Nursing Uganda (${items.length} item${items.length === 1 ? "" : "s"})`,
                amount: { currency_code: currency, value: Number(totalUsd).toFixed(2) }
              }
            ]
          }),
        onApprove: async (data, actions) => {
          try {
            const details = await actions.order.capture();
            await onSuccess({
              orderId: data.orderID,
              payerEmail: details?.payer?.email_address || "",
              totalUsd,
              items
            });
          } catch (err) {
            onError?.(err?.message || "PayPal capture failed.");
          }
        },
        onError: (err) => {
          onError?.(err?.message || "PayPal checkout encountered an error.");
        }
      })
      .render(containerRef.current);
  }, [sdkReady, totalUsd, items, currency, onSuccess, onError]);

  if (sdkFailed || isSandboxPlaceholder) {
    return (
      <div style={{ display: "grid", gap: 10 }}>
        <div
          style={{
            padding: 12,
            background: "#fefce8",
            border: "1px solid #fde047",
            fontSize: "0.84rem",
            color: "#713f12"
          }}
        >
          <strong>PayPal Sandbox Mode:</strong> Add your live or sandbox <code>VITE_PAYPAL_CLIENT_ID</code> in <code>.env</code> (and <code>PAYPAL_CLIENT_ID</code> / <code>PAYPAL_SECRET</code> in Hostinger <code>api/config.php</code>) to render live PayPal buttons.
        </div>
        <button
          type="button"
          className="nu-btn nu-btn-primary nu-btn-lg"
          style={{ width: "100%" }}
          onClick={() =>
            onSuccess({
              orderId: `SANDBOX-${Date.now()}`,
              payerEmail: "sandbox-student@nursinguganda.com",
              totalUsd,
              items
            })
          }
        >
          Simulate PayPal Payment (${Number(totalUsd).toFixed(2)})
        </button>
      </div>
    );
  }

  return <div ref={containerRef} />;
}
