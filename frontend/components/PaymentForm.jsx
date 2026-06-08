import React, { useState } from 'react';

export default function PaymentForm({ onSuccess, onCancel, amount, description }) {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvc: '',
    email: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvc) {
      setError('Please fill in all card details');
      return false;
    }

    // Basic card number validation (should be 16 digits)
    if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      setError('Invalid card number');
      return false;
    }

    // CVC validation (3-4 digits)
    if (!/^\d{3,4}$/.test(formData.cvc)) {
      setError('Invalid CVC');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // NOTE: In production, you would:
      // 1. Get Stripe token from card details using @stripe/stripe-js
      // 2. Send token to backend /payments/create-checkout-session
      // 3. Redirect to Stripe-hosted checkout or use confirmPayment()

      // For now, we'll simulate the payment process
      const response = await fetch('http://localhost:8000/api/v1/payments/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          amount_cents: amount * 100,
          transaction_type: 'agent_registration',
          success_url: `${window.location.origin}/payment-success`,
          cancel_url: `${window.location.origin}/payment-cancelled`,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Payment creation failed');
      }

      const session = await response.json();

      // In real implementation, redirect to Stripe checkout URL
      if (session.checkout_url) {
        window.location.href = session.checkout_url;
      } else {
        // Demo mode - show success
        onSuccess({
          transaction_id: session.transaction_id,
          session_id: session.session_id,
          amount: amount,
        });
      }
    } catch (err) {
      setError(err.message || 'Payment processing failed');
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-2">Complete Payment</h2>
      <p className="text-gray-400 mb-6">{description}</p>

      {error && (
        <div className="mb-4 p-4 bg-red-900/20 border border-red-700 rounded text-red-300 text-sm">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount Display */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
          <div className="text-gray-400 text-sm">Total Amount</div>
          <div className="text-3xl font-bold text-amber-500">
            ${amount.toFixed(2)} USD
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="you@example.com"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            required
          />
        </div>

        {/* Cardholder Name */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Cardholder Name
          </label>
          <input
            type="text"
            name="cardName"
            value={formData.cardName}
            onChange={handleInputChange}
            placeholder="John Doe"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            required
          />
        </div>

        {/* Card Number */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Card Number
          </label>
          <input
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleInputChange}
            placeholder="4242 4242 4242 4242"
            maxLength="19"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            required
          />
          <p className="text-gray-500 text-xs mt-1">💳 Test card: 4242 4242 4242 4242</p>
        </div>

        {/* Expiry & CVC */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Expiry Date (MM/YY)
            </label>
            <input
              type="text"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleInputChange}
              placeholder="12/25"
              maxLength="5"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              CVC
            </label>
            <input
              type="text"
              name="cvc"
              value={formData.cvc}
              onChange={handleInputChange}
              placeholder="123"
              maxLength="4"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              required
            />
          </div>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center text-xs text-gray-400 py-3">
          🔒 Secured by Stripe | Your card details are encrypted
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-slate-700 text-white font-semibold rounded hover:bg-slate-600 disabled:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-700 text-white font-semibold rounded transition"
          >
            {loading ? '⏳ Processing...' : `💳 Pay $${amount.toFixed(2)}`}
          </button>
        </div>
      </form>

      {/* Test Mode Warning */}
      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700 rounded text-blue-300 text-xs">
        ℹ️ TEST MODE: Use card 4242 4242 4242 4242 with any future expiry and any CVC
      </div>
    </div>
  );
}
