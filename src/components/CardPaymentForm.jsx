import React, { useState } from 'react';

export default function CardPaymentForm({ totalUsd, items, onSuccess, onError }) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    // Basic validation – real validation should be on backend
    const cleaned = cardNumber.replace(/\s+/g, '');
    if (!/^[0-9]{16}$/.test(cleaned)) {
      onError('Card number is invalid.');
      setProcessing(false);
      return;
    }
    // Simulate payment – replace with real API call
    try {
      const declined = Math.random() < 0.2; // 20% chance of decline for demo
      if (declined) {
        onError('Card declined. Please check the number, expiration date, or available funds.');
      } else {
        onSuccess({
          orderId: `CARD-${Date.now()}`,
          payerEmail: 'student@example.com',
          totalUsd,
          items,
        });
      }
    } catch (err) {
      onError(err?.message || 'Payment processing failed.');
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, maxWidth: 400, marginTop: 16 }}>
      <input
        type="text"
        placeholder="Card number"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
        style={{ padding: 8, border: '1px solid var(--nu-border)', borderRadius: 4 }}
        required
      />
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          placeholder="MM/YY"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
          style={{ flex: 1, padding: 8, border: '1px solid var(--nu-border)', borderRadius: 4 }}
          required
        />
        <input
          type="text"
          placeholder="CVC"
          value={cvc}
          onChange={(e) => setCvc(e.target.value)}
          style={{ width: 80, padding: 8, border: '1px solid var(--nu-border)', borderRadius: 4 }}
          required
        />
      </div>
      <button type="submit" className="nu-btn nu-btn-primary" disabled={processing} style={{ width: '100%' }}>
        {processing ? 'Processing…' : `Pay $${Number(totalUsd).toFixed(2)}`}
      </button>
    </form>
  );
}
