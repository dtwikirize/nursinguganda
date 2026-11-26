import React from "react";

/**
 * AdSense-safe content ad slot.
 * Only rendered on high-value, long-form free educational pages
 * (Free eBooks, Dictionary, Instrument Atlas, Free Lesson Previews).
 * Never mounted on Checkout, Cart, Login, 404, or Paid Course Player routes.
 */
export default function AdSlot({ slot = "in-article", label = "Sponsored Educational Partner" }) {
  return (
    <div className="nu-ad-slot" data-ad-slot={slot} aria-label="Advertisement">
      <div style={{ fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", fontSize: "0.7rem" }}>
        {label}
      </div>
      <div style={{ marginTop: 4 }}>
        Google AdSense responsive display slot (`{slot}`) | keeps core nursing study notes &amp; eBooks 100% free.
      </div>
    </div>
  );
}
