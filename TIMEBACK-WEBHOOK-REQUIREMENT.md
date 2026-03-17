# TimeBack API Integration Requirement
## AP Math Justification Training Platform

**Date:** March 12, 2026
**Requesting Team:** Alpha School - AP Math Program
**Contact:** Sebastian

---

## 📋 Executive Summary

We need a way to **automatically detect when a student completes a quiz/assessment in TimeBack** so we can trigger our FRQ (Free Response Question) generation workflow.

**Current State:** We have API access to TimeBack (OneRoster + QTI APIs)
**Desired State:** Real-time or near-real-time notification when assessments are completed
**Use Case:** Auto-generate personalized FRQs based on student quiz performance

---

## 🎯 What We Need

### **Option 1: Webhook (Preferred)** ✅

We need TimeBack to **POST to our endpoint** whenever a student completes an assessment.

#### Our Endpoint:
```
POST https://alpha-ap-justification.vercel.app/api/webhooks/timeback
Authorization: Bearer <our-webhook-secret>
Content-Type: application/json
```

#### Expected Payload:
```json
{
  "event": "assessment.completed",
  "timestamp": "2026-03-12T14:30:00Z",
  "student": {
    "sourcedId": "ananya-001",
    "givenName": "Ananya",
    "familyName": "Kakarlapudi",
    "email": "ananya.k@alpha.school"
  },
  "assessment": {
    "sourcedId": "assessment-123",
    "title": "AP Calculus AB - Mean Value Theorem Quiz",
    "type": "Quiz",  // or "Exam", "Test"
    "course": {
      "sourcedId": "course-456",
      "title": "AP Calculus AB"
    }
  },
  "result": {
    "sourcedId": "result-789",
    "score": 0.85,  // 85%
    "scoreStatus": "fully graded",
    "date": "2026-03-12T14:30:00Z",
    "comment": "Strong performance on derivatives"
  }
}
```

#### When to Trigger:
- ✅ Student submits assessment
- ✅ Assessment is fully graded (scoreStatus = "fully graded")
- ✅ Score is available (not null)
- ❌ Don't trigger for practice/ungraded activities

#### Security:
- We'll provide you with a `WEBHOOK_SECRET` to include in `Authorization: Bearer <secret>` header
- We'll verify the signature on our end

---

### **Option 2: Polling (Fallback)**

If webhooks are not available, we can poll your API periodically.

#### Our Approach:
```bash
# Every 10 minutes via Vercel Cron
GET https://api.alpha-1edtech.ai/ims/oneroster/gradebook/v1p2/assessmentResults/
Authorization: Bearer <oauth-token>
filter=dateLastModified>'2026-03-12T14:20:00' AND scoreStatus='fully graded'
limit=100
```

#### Questions for Polling:
1. **What's the recommended polling interval?** (We're thinking 5-10 min)
2. **Rate limits?** How many requests per minute are allowed?
3. **Does `dateLastModified` update when results are graded?**
4. **Can we filter by specific student IDs?** (We only need ~10 students)

---

### **Option 3: Custom Event Stream**

If you have a proprietary event system (WebSockets, Server-Sent Events, message queue), we can consume that.

---

## 🔍 Detailed Use Case

### Student Quiz Completion Workflow:

```
1. Student (Ananya) completes "MVT Quiz" in TimeBack
   ↓
2. Quiz is auto-graded → Score: 85%
   ↓
3. TimeBack POSTs to our webhook:
   {
     "event": "assessment.completed",
     "student": { "sourcedId": "ananya-001" },
     "assessment": { "title": "MVT Quiz" },
     "result": { "score": 0.85 }
   }
   ↓
4. Our system receives webhook → Validates signature
   ↓
5. Check if score >= 80% → YES
   ↓
6. Auto-generate FRQ using Claude AI
   ↓
7. Notify Sebastian via Telegram
   ↓
8. Sebastian reviews/approves FRQ
   ↓
9. FRQ assigned to student
   ↓
10. Student downloads FRQ, completes it, uploads work
```

### Why Real-Time Matters:
- **Immediate feedback loop**: Student completes quiz → FRQ available within minutes
- **Reduced manual work**: Currently Sebastian manually triggers FRQs
- **Better learning experience**: Strike while the content is fresh in student's mind

---

## 📊 Scope

### Students:
- **Cohort Size:** 10 students (AP Calculus AB/BC, AP Statistics)
- **Student IDs:** `ananya-001`, `elle-001`, `sloka-001`, etc.

### Assessments:
- **Types:** Quizzes, Exams (not practice activities)
- **Courses:** AP Calculus AB, AP Calculus BC, AP Statistics
- **Frequency:** ~2-3 quizzes per student per week
- **Expected Volume:** ~20-30 webhook calls per week

### Performance:
- **Latency Tolerance:** 1-5 minutes delay is acceptable
- **Reliability:** 99% delivery (we can handle retry logic)
- **Payload Size:** <10KB per webhook

---

## 🔐 Security & Authentication

### TimeBack → Our Webhook:
```
Authorization: Bearer <WEBHOOK_SECRET>
X-TimeBack-Signature: sha256=<hmac-signature>  // Optional but recommended
```

We'll provide you with:
- **Webhook URL:** `https://alpha-ap-justification.vercel.app/api/webhooks/timeback`
- **Secret:** (will share securely via 1Password/encrypted channel)

### Our System → TimeBack API:
```
Authorization: Bearer <oauth-token>
```

We already have:
- **Client ID:** (provided by your team)
- **Client Secret:** (provided by your team)
- **Token endpoint:** `https://prod-beyond-timeback-api-2-idp.auth.us-east-1.amazoncognito.com/oauth2/token`

---

## 🛠️ Technical Requirements

### From TimeBack:
1. **Webhook endpoint configuration** in your admin panel (or via API)
2. **Event types** we should subscribe to: `assessment.completed`, `result.graded`
3. **Retry policy** if our endpoint is down (3 retries with exponential backoff?)
4. **Documentation** on payload schema and event lifecycle

### From Us:
1. **Endpoint implementation** ready to receive webhooks
2. **Signature verification** for security
3. **Idempotency handling** (in case of duplicate deliveries)
4. **Status endpoint** for webhook health checks: `GET /api/webhooks/timeback/health`

---

## 📝 Alternative Solutions (if webhooks not possible)

### 1. **Scheduled Polling (Our Implementation)**
```typescript
// Vercel Cron Job: */10 * * * * (every 10 minutes)
async function checkNewAssessments() {
  const lastCheck = await getLastCheckTimestamp(); // e.g., "2026-03-12T14:20:00Z"
  const now = new Date().toISOString();

  const results = await fetch(
    `${TIMEBACK_API}/assessmentResults/?filter=dateLastModified>'${lastCheck}' AND scoreStatus='fully graded'`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  for (const result of results) {
    if (result.score >= 0.8 && isAPMathStudent(result.student)) {
      await triggerFRQGeneration(result);
    }
  }

  await updateLastCheckTimestamp(now);
}
```

**Questions:**
- Is this approach acceptable? (Performance, rate limits, etc.)
- Any recommendations for optimization?

---

### 2. **Manual Trigger (Current Workaround)**
Sebastian manually clicks "Generate FRQ" in admin dashboard when he sees quiz completion.

**Problems:**
- Manual work
- Delays (hours/days)
- Can't scale beyond 10 students

---

## 🎯 Success Criteria

### MVP (Minimum Viable Product):
- ✅ Receive notification within **5 minutes** of quiz completion
- ✅ Payload includes: `student.sourcedId`, `assessment.title`, `result.score`
- ✅ Works for our 10-student cohort
- ✅ 95% reliability (manual fallback for failures)

### Ideal Solution:
- ✅ Real-time webhook (<30 seconds)
- ✅ Rich payload with course context, question breakdown
- ✅ Retry logic built-in
- ✅ Webhook delivery logs/monitoring

---

## 📞 Next Steps

1. **TimeBack Team:** Review this document and provide feedback
2. **Discussion:** Schedule call to clarify technical details?
3. **Decision:** Webhook, polling, or custom solution?
4. **Timeline:** When can this be implemented?
5. **Testing:** Staging environment for testing before production?

---

## 🔗 References

- **OneRoster API Spec:** [Local file: oneroster-api.json]
- **QTI API Spec:** [Local file: qti-api.json]
- **Our Current Integration:** Using OAuth2 client credentials flow
- **Base URLs:**
  - OneRoster: `https://api.alpha-1edtech.ai`
  - QTI: `https://qti.alpha-1edtech.ai/api`

---

## 📧 Contact

**Name:** Sebastian
**Project:** Alpha School - AP Math Justification Training
**Questions?** Email or Slack (prefer async communication for technical details)

---

**Thank you for your support!** 🙏

This integration will enable our students to get personalized, AI-generated practice problems immediately after completing quizzes, creating a seamless learning experience.
