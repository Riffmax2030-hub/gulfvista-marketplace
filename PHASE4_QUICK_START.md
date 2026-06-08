# Phase 4: Quick Start Guide

## 🎯 Status
✅ **All infrastructure built and working with placeholder keys**
- Backend: Complete ✅
- Frontend: Complete ✅
- Database: Updated ✅
- Ready for real Stripe keys: YES ✅

---

## 📂 Files Created

### Backend
```
✅ backend/payments/__init__.py       - Module setup
✅ backend/payments/service.py        - Stripe service (500 lines)
✅ backend/payments/routes.py         - API endpoints (500 lines)
✅ backend/models.py                  - Updated with WebhookLog & Invoice
✅ backend/main.py                    - Added payment routes import
```

### Frontend
```
✅ frontend/components/PaymentForm.jsx        - Payment form
✅ frontend/components/PaymentModal.jsx       - Payment modal
✅ frontend/components/TransactionHistory.jsx - Transaction list
```

### Documentation
```
✅ PHASE4_STRIPE_SETUP.md              - Complete setup guide
✅ PHASE4_IMPLEMENTATION_SUMMARY.md    - Implementation details
✅ PHASE4_QUICK_START.md               - This file
```

---

## 🚀 Test It Now (Demo Mode)

### Backend
```bash
# Backend is already running from Phase 3
# Just verify it loads payment routes:
curl http://localhost:8000/api/docs
# Look for /api/v1/payments/ endpoints
```

### Frontend
```bash
# Frontend is already running from Phase 3
# Payment components are ready to use
# (Not integrated into dashboard yet)
```

---

## 🔑 When You Have Stripe Keys

### Step 1: Update Backend (2 minutes)
Edit `backend/.env`:
```env
STRIPE_SECRET_KEY=sk_test_YOUR_KEY
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET
```

### Step 2: Restart Backend
```bash
# Kill running backend (Ctrl+C)
# Restart: python -m uvicorn main:app --reload
```

### Step 3: Test Checkout
```bash
# Test create-checkout-session endpoint
curl -X POST http://localhost:8000/api/v1/payments/create-checkout-session \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount_cents": 20000,
    "transaction_type": "agent_registration",
    "success_url": "http://localhost:3000/success",
    "cancel_url": "http://localhost:3000/cancel"
  }'
```

### Step 4: Test Webhook (Optional)
```bash
# Install Stripe CLI
stripe login
stripe listen --forward-to localhost:8000/api/v1/webhooks/stripe
# Copy webhook secret to .env
# Restart backend
```

---

## 📱 API Endpoints Quick Reference

### Create Payment Session
```
POST /api/v1/payments/create-checkout-session
Auth: Required
Body: {amount_cents, transaction_type, success_url, cancel_url}
Returns: {session_id, checkout_url, transaction_id}
```

### Check Payment Status
```
GET /api/v1/payments/session/{session_id}
Auth: Required
Returns: {status, payment_status, amount, currency}
```

### Get Your Transactions
```
GET /api/v1/payments/transactions
Auth: Required
Query: skip=0, limit=10, status_filter=completed
Returns: {items, total, page, page_size}
```

### Webhook Endpoint
```
POST /api/v1/webhooks/stripe
Auth: Not required (Stripe verifies)
Headers: stripe-signature
Handles: checkout.session.completed, payment_intent.payment_failed, charge.refunded
```

---

## 🧪 Test Scenarios

### Scenario 1: Demo Payment (No Real Keys)
```
1. Run backend (currently working)
2. Call /create-checkout-session endpoint
3. Get mock response with session_id
4. Frontend shows success screen
5. Transaction saved to database
```

### Scenario 2: Real Payment (With Keys)
```
1. Add real Stripe keys to .env
2. Restart backend
3. Call /create-checkout-session endpoint
4. Get real Stripe session URL
5. User redirected to Stripe checkout
6. Complete payment with test card
7. Webhook received and processed
8. User status updated in database
```

---

## 💻 Dashboard Integration

To add payment modal to Dashboard:

```jsx
// In Dashboard.jsx
import PaymentModal from './components/PaymentModal';

// Add state
const [showPayment, setShowPayment] = useState(false);

// Add button (if not agent)
{!user.is_agent_verified && (
  <button onClick={() => setShowPayment(true)}>
    Upgrade to Agent - $200
  </button>
)}

// Add modal
<PaymentModal
  isOpen={showPayment}
  onClose={() => setShowPayment(false)}
  amount={200}
/>

// Add transaction history (if agent)
{user.is_agent_verified && (
  <TransactionHistory userId={user.id} />
)}
```

---

## 📊 Database Schema Added

### WebhookLog Table
```sql
- id (primary key)
- stripe_event_id (unique)
- event_type (e.g., 'checkout.session.completed')
- payload (JSON)
- processed (boolean)
- error_details (text)
- received_at (timestamp)
- processed_at (timestamp)
```

### Invoice Table
```sql
- id (primary key)
- transaction_id (foreign key)
- user_id (foreign key)
- invoice_number (unique)
- amount_cents
- currency
- description
- pdf_url
- issued_at (timestamp)
- created_at (timestamp)
```

### Updated Transaction
```sql
- [Existing fields] +
- idempotency_key (prevents duplicate charges)
- payment_metadata (JSON for additional info)
```

---

## 🔒 Security Features

✅ Webhook signature verification  
✅ Idempotency keys (prevent double-charging)  
✅ Amount verification (fraud prevention)  
✅ Admin-only refunds  
✅ Comprehensive error handling  
✅ Secure logging (no card data)  
✅ HTTPS-ready configuration  

---

## 📝 Configuration

### Current (Demo)
```python
stripe.api_key = "sk_test_placeholder_key"
STRIPE_WEBHOOK_SECRET = "whsec_placeholder_secret"
```

### With Real Keys
```python
stripe.api_key = "sk_test_abc123..."  # From Stripe dashboard
STRIPE_WEBHOOK_SECRET = "whsec_abc123..."  # From Stripe webhook setup
```

---

## ✨ Ready Features

Component Ready: ✅ PaymentForm  
Component Ready: ✅ PaymentModal  
Component Ready: ✅ TransactionHistory  
Endpoint Ready: ✅ /create-checkout-session  
Endpoint Ready: ✅ /session/{id}  
Endpoint Ready: ✅ /transactions  
Endpoint Ready: ✅ /webhooks/stripe  
Endpoint Ready: ✅ /refund/{id}  
Database Ready: ✅ WebhookLog  
Database Ready: ✅ Invoice  

---

## 🆘 Troubleshooting

**Q: Payments not processing?**  
A: Check if real Stripe keys are in .env (not placeholders)

**Q: Webhook not received?**  
A: Run: `stripe listen --forward-to localhost:8000/...`

**Q: Component errors?**  
A: Ensure all imports are correct in Dashboard.jsx

**Q: Database errors?**  
A: Run: `python -c "from database import init_db; init_db()"`

---

## 📚 Documentation

- **PHASE4_STRIPE_SETUP.md** - Complete setup guide with test cards
- **PHASE4_IMPLEMENTATION_SUMMARY.md** - Technical details
- **PHASE4_QUICK_START.md** - This file (quick reference)

---

## ⏱️ Timeline

**Right Now**: Demo mode works, test components ✅  
**When Ready**: Get Stripe keys (10 minutes to get credentials)  
**Integration**: 30 minutes to go live with real Stripe  
**Testing**: 1 hour to fully test payment flow  

---

## ✅ Checklist

- [ ] Review PHASE4_STRIPE_SETUP.md
- [ ] Create Stripe account (when ready)
- [ ] Get test API keys
- [ ] Update .env with keys
- [ ] Restart backend
- [ ] Test payment form
- [ ] Test webhook with Stripe CLI
- [ ] Test complete payment flow
- [ ] Deploy to production

---

## 🎉 Phase 4 Complete

All infrastructure is built and tested with placeholder keys.

Ready to integrate Stripe credentials whenever you're ready!

**Next: Phase 5 - Reelly API Integration**

---

**Built**: May 20, 2026  
**Status**: ✅ Ready for Stripe Credentials
