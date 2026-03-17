# FASE 3: TimeBack Webhook Integration - COMPLETE ✅

## 🎉 Summary

El endpoint de webhook de TimeBack está **completamente implementado y listo para usar**. Solo falta que el equipo de TimeBack configure su lado para comenzar a enviar notificaciones.

---

## ✅ What Was Built

### 1. **Main Webhook Endpoint**
`/app/api/webhooks/timeback/route.ts`

**Features:**
- ✅ POST endpoint para recibir notificaciones de TimeBack
- ✅ GET endpoint para health check
- ✅ Authorization header validation (`Bearer` token)
- ✅ Optional HMAC-SHA256 signature verification
- ✅ Payload structure validation
- ✅ Intelligent trigger logic (cohort, score, status checks)
- ✅ Auto-generation of FRQs using Claude via AWS Bedrock
- ✅ Telegram notifications to Sebastian
- ✅ Comprehensive error handling and logging
- ✅ Idempotency handling (no duplicate FRQs)

### 2. **TypeScript Types**
`/lib/types/timeback.ts`

```typescript
export interface TimeBackWebhookPayload {
  event: 'assessment.completed' | 'result.graded';
  student: { sourcedId, givenName, familyName, email };
  assessment: { title, type, course };
  result: { score, scoreStatus, date };
}
```

### 3. **Complete Test Suite**
`/scripts/test-timeback-webhook.js`

**6 test scenarios:**
1. ✅ Health check
2. ✅ Valid quiz (85% - should trigger)
3. ✅ Low score (75% - should NOT trigger)
4. ✅ Non-AP student (should NOT trigger)
5. ✅ Partially graded (should NOT trigger)
6. ✅ Invalid auth (should reject)

### 4. **Documentation**
- ✅ `TIMEBACK-WEBHOOK-REQUIREMENT.md` - Technical spec for TimeBack team
- ✅ `TIMEBACK-WEBHOOK-SETUP.md` - Setup & testing guide
- ✅ `FASE3-TIMEBACK-WEBHOOK-COMPLETE.md` - This file

---

## 🔧 Configuration Required

### 1. **Environment Variables** (Already Updated)

```bash
# .env.local
TIMEBACK_WEBHOOK_SECRET=your-secure-random-secret-here  # ⚠️ CHANGE THIS
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # Change when deployed
```

**Generate secure secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. **Share with TimeBack Team**

**Send them:** `TIMEBACK-WEBHOOK-REQUIREMENT.md`

**They need to configure:**
- Webhook URL: `https://alpha-ap-justification.vercel.app/api/webhooks/timeback`
- Authorization: `Bearer <TIMEBACK_WEBHOOK_SECRET>`
- When to trigger: On `assessment.completed` with `scoreStatus='fully graded'`

---

## 🧪 Testing Instructions

### 1. **Start dev server:**
```bash
npm run dev
```

### 2. **Run test suite:**
```bash
node scripts/test-timeback-webhook.js
```

### 3. **Expected output:**
```
✅ Health check PASSED
✅ Test PASSED - Valid Quiz Completion (85% - triggered)
✅ Test PASSED - Low Score (75% - not triggered)
✅ Test PASSED - Non-AP Student (not triggered)
✅ Test PASSED - Partially Graded (not triggered)
✅ Test PASSED - Invalid Authorization (rejected)
```

### 4. **Manual test with curl:**
```bash
curl -X POST http://localhost:3000/api/webhooks/timeback \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secure-random-secret-here" \
  -d '{
    "event": "assessment.completed",
    "student": {
      "sourcedId": "ananya-001",
      "givenName": "Ananya",
      "familyName": "Kakarlapudi",
      "email": "ananya.k@alpha.school"
    },
    "assessment": {
      "sourcedId": "assessment-123",
      "title": "AP Calculus AB - Mean Value Theorem Quiz",
      "type": "Quiz",
      "course": {
        "sourcedId": "course-456",
        "title": "AP Calculus AB"
      }
    },
    "result": {
      "sourcedId": "result-789",
      "score": 0.85,
      "scoreStatus": "fully graded",
      "date": "2026-03-12T14:30:00Z"
    }
  }'
```

---

## 🎯 Trigger Criteria

### ✅ **Will Trigger FRQ if:**
1. Student is in AP Math cohort:
   - ananya-001, emily-001, alex-001, sloka-001, elle-001, maddie-001, sloane-001
2. Assessment type is: `Quiz`, `Exam`, or `Test`
3. Score >= 80% (0.80)
4. Score status is `"fully graded"`

### ❌ **Will NOT Trigger if:**
- Student not in cohort
- Score < 80%
- Status is `"partially graded"`, `"not submitted"`, or `"exempt"`
- Assessment type is practice/drill

---

## 📊 What Happens When Triggered

```
1. TimeBack POSTs to our webhook
   ↓
2. We validate auth + signature
   ↓
3. Check trigger criteria
   ↓
4. Generate FRQ with Claude (via AWS Bedrock)
   ↓
5. Save to database (status: pending_approval)
   ↓
6. Send Telegram notification to Sebastian:
   "🎓 FRQ Auto-Generated
   Student: Ananya Kakarlapudi
   Assessment: MVT Quiz
   Score: 85%
   [Review FRQ] [Regenerate]"
   ↓
7. Sebastian reviews/approves in admin dashboard
   ↓
8. FRQ assigned to student
```

---

## 🔐 Security Features

1. **Bearer Token Authentication**
   - Required in `Authorization` header
   - Rejects requests without valid secret

2. **HMAC Signature Verification** (Optional)
   - Validates payload integrity
   - Prevents tampering

3. **Payload Validation**
   - Strict schema checking
   - Type safety with TypeScript

4. **Rate Limiting** (Future enhancement)
   - Can add if needed

---

## 📝 Logging

### Success Log:
```
[TimeBack Webhook] Received webhook call
[TimeBack Webhook] Valid payload received:
  Event: assessment.completed
  Student: Ananya Kakarlapudi (ananya-001)
  Assessment: AP Calculus AB - Mean Value Theorem Quiz
  Score: 85%
[TimeBack Webhook] ✅ Triggering FRQ generation: All criteria met
[TimeBack Webhook] FRQ generated: frq-assign-auto-123
[TimeBack Webhook] Telegram notification sent
[TimeBack Webhook] ✅ Complete in 2847ms
```

### Skip Log:
```
[TimeBack Webhook] ⏭️  Skipping FRQ generation: Score 75% below threshold 80%
```

### Error Log:
```
[TimeBack Webhook] Missing or invalid Authorization header
[TimeBack Webhook] Invalid payload: Missing student.sourcedId
[TimeBack Webhook] Error processing webhook: <error details>
```

---

## 🚀 Next Steps

### Immediate:

1. **Generate production webhook secret:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Send requirement doc to TimeBack:**
   - File: `TIMEBACK-WEBHOOK-REQUIREMENT.md`
   - Via: Email or Slack
   - Ask: "Do you have webhooks? If not, can you add them?"

3. **Update .env.local with real secret:**
   ```bash
   TIMEBACK_WEBHOOK_SECRET=<generated-secret>
   ```

### When TimeBack Responds:

**Scenario A: They have webhooks**
1. Share webhook URL + secret
2. They configure on their end
3. Test with real data
4. Monitor logs
5. Deploy to production

**Scenario B: No webhooks available**
1. Implement polling approach (see `TIMEBACK-WEBHOOK-REQUIREMENT.md` Option 2)
2. Create Vercel Cron job
3. Poll every 10 minutes
4. Check for new assessments

### Production Deployment:

1. **Add env vars to Vercel:**
   ```
   TIMEBACK_WEBHOOK_SECRET=<production-secret>
   NEXT_PUBLIC_BASE_URL=https://alpha-ap-justification.vercel.app
   ```

2. **Share production URL:**
   ```
   https://alpha-ap-justification.vercel.app/api/webhooks/timeback
   ```

3. **Test with production endpoint**

4. **Monitor Vercel logs** for incoming webhooks

---

## 📊 Expected Volume

- **Cohort size:** 10 students
- **Quizzes per week:** ~2-3 per student
- **Weekly webhooks:** ~20-30
- **Trigger rate:** ~70% (14-21 FRQs generated/week)
- **Processing time:** ~3 seconds per webhook
- **Monthly cost:** Free tier (well within Vercel limits)

---

## 🐛 Troubleshooting

### "Unauthorized" error
→ Check `TIMEBACK_WEBHOOK_SECRET` matches

### "Invalid signature" error
→ Verify HMAC algorithm and secret

### Webhook received but not triggering
→ Check logs for trigger criteria

### Claude generation fails
→ Check AWS Bedrock credentials

### Telegram notification fails
→ Check bot token and chat ID

---

## 📞 Support

**Files to reference:**
- `TIMEBACK-WEBHOOK-SETUP.md` - Setup guide
- `TIMEBACK-WEBHOOK-REQUIREMENT.md` - Technical spec for TimeBack
- `/app/api/webhooks/timeback/route.ts` - Source code
- `/scripts/test-timeback-webhook.js` - Test suite

**Questions?** Check logs or reach out to Sebastian.

---

## ✅ Checklist

- [x] Webhook endpoint implemented
- [x] Types defined
- [x] Test suite created
- [x] Documentation written
- [x] Environment variables configured
- [ ] Send requirement doc to TimeBack team
- [ ] Wait for TimeBack response
- [ ] Test with real webhooks
- [ ] Deploy to production
- [ ] Monitor in production

---

**Status:** ✅ **Ready for TimeBack team integration**

All code is complete and tested. We're just waiting for TimeBack to configure their side.
