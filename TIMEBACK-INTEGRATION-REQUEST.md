# TimeBack Integration Requirements

**Project:** Alpha AP Math Justification Training
**Contact:** Sebastian
**Date:** 2026-03-16

---

## Overview

We're building a 4-week justification training course for 10 AP Math students at Alpha High School. The app needs to integrate with TimeBack for:

1. **Student roster sync** (OneRoster)
2. **Grade posting** (Gradebook)
3. **FRQ auto-generation** (Webhook + QTI)

---

## 1. OAuth2 Credentials Required

We need API access to consume TimeBack's OneRoster and QTI APIs.

### Staging Environment
- **Client ID**: [pending from TimeBack]
- **Client Secret**: [pending from TimeBack]
- **Token Endpoint**: `https://prod-beyond-timeback-api-2-idp.auth.us-east-1.amazoncognito.com/oauth2/token`
- **Grant Type**: `client_credentials`

### Required Scopes
```
rostering.readonly    → Read users, classes, enrollments
gradebook.write       → Post assessment results
qti.write            → Create items and tests
```

### Production Environment
*(Same structure, will request after staging validation)*

---

## 2. Webhook Configuration

### Webhook Endpoint (Our Side)
- **URL**: `https://alpha-ap-justification.vercel.app/api/webhooks/timeback`
- **Method**: POST
- **Event Type**: `assessment.completed`
- **Security**: Bearer token (we'll provide `TIMEBACK_WEBHOOK_SECRET`)

### Expected Payload
```json
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
```

### Trigger Criteria
- ✅ Student is in AP Math cohort (7 students)
- ✅ Assessment type: Quiz, Exam, or Test (not practice)
- ✅ Score >= 80%
- ✅ Status: "fully graded"

### Webhook Security
**Authorization Header:**
```
Authorization: Bearer <TIMEBACK_WEBHOOK_SECRET>
```

**Optional HMAC Signature:**
```
X-TimeBack-Signature: sha256=<hmac-sha256-hex>
```

**Our Secret (to share with TimeBack team):**
```
[Will be generated and shared securely]
```

---

## 3. OneRoster API Usage

### Endpoints We'll Call

#### Read Operations
```
GET /ims/oneroster/rostering/v1p2/users/{sourcedId}
GET /ims/oneroster/rostering/v1p2/users?filter=role='student'
GET /ims/oneroster/rostering/v1p2/classes/{sourcedId}
GET /ims/oneroster/rostering/v1p2/classes/{sourcedId}/students
GET /ims/oneroster/rostering/v1p2/enrollments?filter=class.sourcedId='{classId}'
```

#### Write Operations (Gradebook)
```
POST /ims/oneroster/gradebook/v1p2/assessmentLineItems
POST /ims/oneroster/gradebook/v1p2/assessmentResults
```

### Data We Need Access To
- **Users**: AP Math students (sourcedId, givenName, familyName, email)
- **Classes**: AP Calculus AB/BC, AP Statistics sections
- **Enrollments**: Which students are in which classes
- **Gradebook**: Post CERC session scores + FRQ results

---

## 4. QTI API Usage

### Endpoints We'll Call
```
POST /api/assessment-items      → Create FRQ questions
POST /api/assessment-tests      → Create FRQ tests
POST /api/validate              → Validate QTI XML
GET  /api/assessment-items      → Search existing items
```

### Use Cases
1. **Auto-generate FRQs** when student completes quiz (via webhook)
2. **Create CERC practice problems** programmatically
3. **Validate XML** before submission

---

## 5. Testing Requirements

### Staging Environment Access
We need a **non-production environment** for testing:

- **3-5 test student accounts** (with realistic data)
- **1-2 test classes** (AP Calculus AB/BC)
- **Test gradebook** (can post/delete results without affecting real students)

### Test Scenarios
1. ✅ Fetch student roster via OneRoster
2. ✅ Post a sample grade to gradebook
3. ✅ Create a QTI assessment item
4. ✅ Receive webhook payload (assessment.completed)
5. ✅ End-to-end: Webhook → FRQ generation → Grade posting

---

## 6. Data Mapping

### Our Student Roster (AP Math Cohort)
| TimeBack sourcedId | Name | Course |
|--------------------|------|--------|
| ananya-001 | Ananya Kakarlapudi | AP Calc BC |
| emily-001 | Emily Smith | Precalculus |
| alex-001 | Alex Mathew | AP Calc BC |
| sloka-001 | Sloka Vudumu | AP Calc AB |
| elle-001 | Elle Liemandt | AP Calc BC |
| maddie-001 | Maddie Price | AP Calc AB |
| sloane-001 | Sloane Price | AP Calc AB |

**Question:** Are these the correct `sourcedId` values in TimeBack?

---

## 7. Production Timeline

### Phase 1: Development (Current)
- ✅ Webhook endpoint built and tested locally
- ✅ Adapter stub with correct API shapes
- ⏳ Waiting for OAuth2 credentials

### Phase 2: Integration Testing (After credentials)
- Implement adapter with real API calls
- Test in staging environment
- Fix any data mapping issues
- Validate webhook flow

### Phase 3: Production Deployment
- Production OAuth2 credentials
- Deploy to Vercel
- Configure webhook in production
- Monitor first real events

**Estimated Timeline:** 1-2 weeks after receiving credentials

---

## 8. Security Considerations

### Our Side
- ✅ OAuth2 tokens stored securely (environment variables)
- ✅ Webhook signature validation
- ✅ HTTPS only
- ✅ Rate limiting on webhook endpoint
- ✅ Logging (no sensitive data in logs)

### TimeBack Side (Requesting)
- Webhook retries on failure (exponential backoff)
- Webhook signature generation (HMAC-SHA256)
- IP allowlisting (optional)

---

## 9. Support Contacts

### Our Team
- **Technical Lead:** Sebastian
- **Project:** Alpha AP Math Justification Training
- **Email:** [Your email]

### Questions for TimeBack Team
1. What are the correct `sourcedId` values for our 7 students?
2. Which class/course IDs should we use for testing?
3. What is the webhook retry policy?
4. Are there rate limits on OneRoster/QTI APIs?
5. What is the expected response time for credential provisioning?

---

## 10. Documentation References

Attached documentation:
- `docs/api/oneroster-api.json` - OneRoster 1.2 OpenAPI spec
- `docs/api/qti-api.json` - QTI 3.0 OpenAPI spec
- `docs/api/qti-walkthrough.md` - Test creation guide
- `TIMEBACK-WEBHOOK-SETUP.md` - Webhook implementation details

---

## Next Steps

1. **TimeBack Team:** Review this document
2. **TimeBack Team:** Provision staging OAuth2 credentials
3. **TimeBack Team:** Configure webhook (we'll provide secret)
4. **Our Team:** Implement adapter with credentials
5. **Both Teams:** Integration testing in staging
6. **Both Teams:** Production deployment

---

**Ready to integrate!** 🚀
