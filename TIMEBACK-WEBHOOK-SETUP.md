# TimeBack Webhook Setup Guide

## 🎯 Overview

El webhook de TimeBack permite que nuestro sistema reciba notificaciones automáticas cuando un estudiante completa un assessment (quiz/exam), triggereando la generación automática de FRQs.

---

## 📁 Files Created

### 1. **Webhook Endpoint**
`/app/api/webhooks/timeback/route.ts`
- Recibe POST requests de TimeBack
- Valida authorization + signature
- Verifica criterios (cohort, score, status)
- Genera FRQ con Claude
- Notifica via Telegram

### 2. **Types**
`/lib/types/timeback.ts`
- TimeBackWebhookPayload
- WebhookValidationResult
- AssessmentTriggerResult

### 3. **Test Script**
`/scripts/test-timeback-webhook.js`
- Suite de tests completa
- 6 escenarios de prueba
- Health check

### 4. **Documentation**
`/TIMEBACK-WEBHOOK-REQUIREMENT.md`
- Documento para enviar al equipo de TimeBack
- Especifica exactamente qué necesitamos

---

## 🔧 Configuration

### 1. **Environment Variables**

Agrega a tu `.env.local`:

```bash
# TimeBack Webhook
TIMEBACK_WEBHOOK_SECRET=your-secure-random-secret-here
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # Change to production URL when deployed
```

**Generate secure secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. **Share with TimeBack Team**

Envía `TIMEBACK-WEBHOOK-REQUIREMENT.md` al equipo de TimeBack con:

**Webhook URL (Production):**
```
POST https://alpha-ap-justification.vercel.app/api/webhooks/timeback
```

**Authorization Header:**
```
Authorization: Bearer <TIMEBACK_WEBHOOK_SECRET>
```

**Optional Signature Header:**
```
X-TimeBack-Signature: sha256=<hmac-sha256-hex>
```

---

## 🧪 Testing Locally

### 1. **Start Development Server**
```bash
npm run dev
```

### 2. **Run Test Suite**
```bash
node scripts/test-timeback-webhook.js
```

### 3. **Expected Output**
```
🧪 TimeBack Webhook Test Suite
Target: http://localhost:3000/api/webhooks/timeback
Secret configured: true

============================================================
🏥 Testing Health Check
============================================================

📥 Response (200 OK):
{
  "status": "healthy",
  "service": "TimeBack Webhook Endpoint",
  "configuration": {
    "secretConfigured": true,
    "cohortSize": 7,
    "scoreThreshold": "80%"
  }
}

✅ Health check PASSED

============================================================
📝 Testing: Valid Quiz Completion (85% - should trigger)
============================================================

📤 Sending payload:
{
  "event": "assessment.completed",
  "student": {
    "sourcedId": "ananya-001",
    "givenName": "Ananya",
    "familyName": "Kakarlapudi"
  },
  "assessment": {
    "title": "AP Calculus AB - Mean Value Theorem Quiz"
  },
  "result": {
    "score": 0.85,
    "scoreStatus": "fully graded"
  }
}

📥 Response (200 OK):
{
  "received": true,
  "triggered": true,
  "reason": "All criteria met",
  "frqId": "frq-assign-auto-123",
  "processingTime": 2847
}

✅ Test PASSED
```

---

## 🔍 How It Works

### Flow Diagram:

```
TimeBack                          Our System
   │                                  │
   │  Student completes quiz          │
   │  Score: 85% (>= 80%)            │
   │                                  │
   │  POST /api/webhooks/timeback    │
   ├─────────────────────────────────>│
   │  Authorization: Bearer <secret>  │
   │  {                               │
   │    "student": "ananya-001",      │
   │    "score": 0.85                 │
   │  }                               │
   │                                  │
   │                           ✓ Validate auth
   │                           ✓ Validate signature
   │                           ✓ Check cohort (AP Math)
   │                           ✓ Check score (>= 80%)
   │                           ✓ Check status (fully graded)
   │                                  │
   │                           🤖 Generate FRQ with Claude
   │                           📱 Send Telegram notification
   │                                  │
   │  200 OK                          │
   │<─────────────────────────────────┤
   │  { "triggered": true }           │
   │                                  │
```

### Trigger Criteria:

✅ **Student must be in AP Math cohort:**
- ananya-001
- emily-001
- alex-001
- sloka-001
- elle-001
- maddie-001
- sloane-001

✅ **Assessment type:** Quiz, Exam, or Test (not practice)

✅ **Score threshold:** >= 80%

✅ **Score status:** "fully graded"

❌ **Will NOT trigger if:**
- Student not in cohort
- Score < 80%
- Status is "partially graded" or "not submitted"
- Assessment type is practice/drill

---

## 📊 Response Format

### Success (Triggered):
```json
{
  "received": true,
  "triggered": true,
  "reason": "All criteria met",
  "frqId": "frq-assign-auto-123",
  "studentId": "ananya-001",
  "assessmentTitle": "AP Calculus AB - MVT Quiz",
  "score": 0.85,
  "processingTime": 2847
}
```

### Success (Not Triggered):
```json
{
  "received": true,
  "triggered": false,
  "reason": "Score 75% below threshold 80%",
  "processingTime": 124
}
```

### Error:
```json
{
  "error": "Unauthorized",
  "details": "Invalid webhook secret"
}
```

---

## 🔐 Security

### 1. **Authorization Header (Required)**
```
Authorization: Bearer <TIMEBACK_WEBHOOK_SECRET>
```

Valida que el request viene de TimeBack.

### 2. **HMAC Signature (Optional but Recommended)**
```
X-TimeBack-Signature: sha256=<hex-digest>
```

**Calculation:**
```javascript
const signature = crypto
  .createHmac('sha256', WEBHOOK_SECRET)
  .update(JSON.stringify(payload))
  .digest('hex');
```

Valida que el payload no fue modificado en tránsito.

### 3. **Idempotency**
El endpoint maneja duplicate deliveries verificando:
- Si el FRQ ya fue generado para ese `result.sourcedId`
- Retorna FRQ existente sin regenerar

---

## 🚀 Deployment

### Vercel Deployment:

1. **Add environment variables in Vercel dashboard:**
   ```
   TIMEBACK_WEBHOOK_SECRET=<production-secret>
   NEXT_PUBLIC_BASE_URL=https://alpha-ap-justification.vercel.app
   ```

2. **Share production URL with TimeBack:**
   ```
   https://alpha-ap-justification.vercel.app/api/webhooks/timeback
   ```

3. **Test with production endpoint:**
   ```bash
   # Update test script
   const WEBHOOK_URL = 'https://alpha-ap-justification.vercel.app/api/webhooks/timeback';

   # Run tests
   node scripts/test-timeback-webhook.js
   ```

---

## 📝 Logging

### Console Logs:

```
[TimeBack Webhook] Received webhook call
[TimeBack Webhook] Valid payload received:
  Event: assessment.completed
  Student: Ananya Kakarlapudi (ananya-001)
  Assessment: AP Calculus AB - Mean Value Theorem Quiz
  Score: 85%
[TimeBack Webhook] ✅ Triggering FRQ generation: All criteria met
[TimeBack Webhook] Generating general FRQ for topic: Mean Value Theorem Quiz
[TimeBack Webhook] FRQ generated: frq-assign-auto-123
[TimeBack Webhook] Telegram notification sent
[TimeBack Webhook] ✅ Complete in 2847ms
```

### Error Logs:

```
[TimeBack Webhook] Missing or invalid Authorization header
[TimeBack Webhook] Invalid signature
[TimeBack Webhook] Invalid payload: Missing student.sourcedId
[TimeBack Webhook] ⏭️  Skipping FRQ generation: Score 75% below threshold 80%
```

---

## 🐛 Troubleshooting

### Issue: "Unauthorized" error
**Solution:** Check `TIMEBACK_WEBHOOK_SECRET` matches in both systems

### Issue: "Invalid signature" error
**Solution:** Verify HMAC calculation algorithm and secret

### Issue: Webhook received but not triggering
**Solution:** Check logs for trigger criteria:
- Is student in AP_MATH_COHORT?
- Is score >= 80%?
- Is scoreStatus = "fully graded"?

### Issue: Claude generation fails
**Solution:** Check AWS Bedrock credentials:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`

### Issue: Telegram notification fails
**Solution:** Check:
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- Bot has access to chat

---

## 📞 Support

**Next Steps:**
1. ✅ Endpoint built and tested locally
2. ⏳ Send `TIMEBACK-WEBHOOK-REQUIREMENT.md` to TimeBack team
3. ⏳ Wait for TimeBack to configure webhook on their end
4. ⏳ Test with real TimeBack webhooks
5. ⏳ Deploy to production (Vercel)

**Questions?** Review `TIMEBACK-WEBHOOK-REQUIREMENT.md` or check logs.
