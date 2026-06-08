import React, { useState } from 'react';
import PaymentForm from './PaymentForm';

export default function PaymentModal({ isOpen, onClose, amount = 200, title = 'Upgrade to Agent' }) {
  const [paymentStep, setPaymentStep] = useState('form'); // 'form' or 'success'
  const [transactionData, setTransactionData] = useState(null);

  const handlePaymentSuccess = (data) => {
    setTransactionData(data);
    setPaymentStep('success');

    // Auto-close after 3 seconds
    setTimeout(() => {
      onClose();
      setPaymentStep('form');
    }, 3000);
  };

  const handleClose = () => {
    if (paymentStep === 'form') {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header with Close Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button
            onClick={handleClose}
            disabled={paymentStep === 'form'}
            className="text-gray-400 hover:text-white disabled:opacity-50 transition"
          >
            ✕
          </button>
        </div>

        {/* Payment Form Step */}
        {paymentStep === 'form' && (
          <PaymentForm
            amount={amount}
            description={`Complete your ${title.toLowerCase()} for $${amount.toFixed(2)}`}
            onSuccess={handlePaymentSuccess}
            onCancel={handleClose}
          />
        )}

        {/* Success Step */}
        {paymentStep === 'success' && transactionData && (
          <div className="text-center py-8">
            {/* Success Checkmark */}
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto">
                <span className="text-4xl text-green-400">✓</span>
              </div>
            </div>

            {/* Success Message */}
            <h3 className="text-2xl font-bold text-white mb-2">Payment Successful! 🎉</h3>
            <p className="text-gray-400 mb-6">
              Thank you for your payment. You are now verified as an agent!
            </p>

            {/* Transaction Details */}
            <div className="bg-slate-800 rounded-lg p-4 mb-6 text-left">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Transaction ID:</span>
                  <span className="text-white font-mono">{transactionData.transaction_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-amber-500 font-bold">${transactionData.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-green-400">✓ Completed</span>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 mb-6">
              <p className="text-blue-300 text-sm">
                📧 A confirmation email has been sent to your registered email address.
              </p>
            </div>

            {/* Note */}
            <p className="text-gray-500 text-xs">
              ⏱️ This modal will close automatically in a moment...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
