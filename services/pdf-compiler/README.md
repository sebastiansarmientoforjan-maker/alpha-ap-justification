# Alpha PDF Compiler Service

Secure LaTeX PDF compilation service for Alpha AP Justification system.

## Features

- ✅ Secure API key authentication
- ✅ Rate limiting (100 requests per 15min)
- ✅ Automatic file cleanup
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Complete LaTeX environment

## Local Development

### Prerequisites
- Docker installed
- Node.js 20+ (optional, for local testing)

### Build and Run with Docker

```bash
# Build image
docker build -t alpha-pdf-compiler .

# Run container
docker run -p 3001:3001 \
  -e PDF_COMPILER_API_KEY=test-key \
  alpha-pdf-compiler
```

### Test Locally

```bash
# Install dependencies
npm install

# Start server (requires pdflatex installed locally)
PDF_COMPILER_API_KEY=test-key npm start
```

## Deploy to Railway

### Step 1: Install Railway CLI

```bash
npm install -g railway
```

### Step 2: Login

```bash
railway login
```

### Step 3: Create Project

```bash
railway init
```

### Step 4: Set Environment Variables

```bash
# Generate secure API key
API_KEY=$(openssl rand -base64 32)

# Set in Railway
railway variables set PDF_COMPILER_API_KEY=$API_KEY
railway variables set ALLOWED_ORIGINS=https://your-app.vercel.app
```

### Step 5: Deploy

```bash
railway up
```

Railway will:
1. Detect Dockerfile
2. Build image
3. Deploy service
4. Provide public URL

### Step 6: Get Service URL

```bash
railway domain
```

Example: `https://alpha-pdf-compiler-production.railway.app`

## API Usage

### Health Check

```bash
curl https://your-service.railway.app/health
```

Response:
```json
{
  "status": "healthy",
  "service": "alpha-pdf-compiler",
  "version": "1.0.0",
  "timestamp": "2026-03-11T..."
}
```

### Compile PDF

```bash
curl -X POST https://your-service.railway.app/compile \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "latexContent": "\\documentclass{article}\\begin{document}Hello World\\end{document}"
  }' \
  --output test.pdf
```

## Security Features

### API Key Authentication
All compile requests require `Authorization: Bearer <API_KEY>` header.

### Rate Limiting
- 100 requests per 15 minutes per IP
- Returns 429 if exceeded

### CORS
- Configurable allowed origins
- Credentials support

### Helmet
- Security headers enabled
- XSS protection
- Content Security Policy

### File Cleanup
- All temporary files deleted after compilation
- No persistent storage
- FERPA compliant

## Integration with Next.js

```typescript
// lib/pdf/cloud-generator.ts

export async function compilePDFCloud(latexContent: string): Promise<Buffer> {
  const response = await fetch(process.env.PDF_COMPILER_URL + '/compile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.PDF_COMPILER_API_KEY}`
    },
    body: JSON.stringify({ latexContent })
  });

  if (!response.ok) {
    throw new Error('PDF compilation failed');
  }

  const pdfBuffer = await response.arrayBuffer();
  return Buffer.from(pdfBuffer);
}
```

## Monitoring

### Check Logs

```bash
railway logs
```

### View Metrics

```bash
railway status
```

## Troubleshooting

### Compilation Fails

Check LaTeX syntax. Common issues:
- Missing packages (all standard packages included)
- Syntax errors in LaTeX
- Timeout (30s limit per pass)

### 401 Unauthorized

Verify API key matches in both services:
```bash
# Check Railway
railway variables get PDF_COMPILER_API_KEY

# Should match your .env.local
echo $PDF_COMPILER_API_KEY
```

### 429 Rate Limited

Wait 15 minutes or adjust rate limit in server.js.

## Cost

**Railway Free Tier:**
- 500 hours/month (free)
- $5/month after

**Average usage:**
- 1 PDF compilation ≈ 10 seconds
- 100 PDFs/day ≈ 17 minutes/day
- Monthly: ~8 hours (well within free tier)

## Support

Questions? Check main project documentation at `../../PLAN_MAESTRO_FASES.md`
