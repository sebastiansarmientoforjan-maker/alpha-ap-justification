# 🚀 Docker PDF Compiler - Deploy Guide

## ✅ Archivos Creados

```
services/pdf-compiler/
├── Dockerfile              ✅ Image con LaTeX + Node.js
├── package.json            ✅ Dependencies
├── server.js               ✅ Express API con seguridad
├── .env.example            ✅ Config template
├── .dockerignore           ✅ Build optimization
└── README.md               ✅ Documentation

lib/pdf/
└── cloud-generator.ts      ✅ Client para Next.js
```

---

## 🎯 OPCIÓN 1: Deploy en Railway (Recomendada)

### Paso 1: Instalar Railway CLI (2 min)

```bash
# Windows/macOS/Linux
npm install -g railway

# Verificar instalación
railway --version
```

### Paso 2: Login (1 min)

```bash
railway login

# Se abrirá browser para autenticación
# Autoriza la app
```

### Paso 3: Deploy (5 min)

```bash
# Navegar al directorio del compiler
cd services/pdf-compiler

# Inicializar proyecto Railway
railway init

# Selecciona "Create new project"
# Nombre: "alpha-pdf-compiler"

# Generar API key segura
API_KEY=$(openssl rand -base64 32)
echo "Tu API Key: $API_KEY"
# GUARDA ESTA KEY - la necesitarás después

# Configurar variables de entorno
railway variables set PDF_COMPILER_API_KEY="$API_KEY"
railway variables set ALLOWED_ORIGINS="http://localhost:3000"

# Deploy!
railway up

# Railway detecta Dockerfile automáticamente
# Build time: ~3-5 minutos
```

### Paso 4: Obtener URL (1 min)

```bash
# Railway asigna un dominio público
railway domain

# Ejemplo output:
# https://alpha-pdf-compiler-production.railway.app
```

### Paso 5: Test (1 min)

```bash
# Health check
curl https://alpha-pdf-compiler-production.railway.app/health

# Deberías ver:
# {"status":"healthy","service":"alpha-pdf-compiler",...}
```

---

## 🎯 OPCIÓN 2: Deploy en Render (Alternativa)

### Paso 1: Crear cuenta en Render.com

Visita: https://render.com

### Paso 2: New Web Service

1. Click "New +" → "Web Service"
2. Connect tu repositorio GitHub
3. Selecciona el directorio: `services/pdf-compiler`

### Paso 3: Configuración

```
Name: alpha-pdf-compiler
Environment: Docker
Region: Oregon (US West)
Branch: main
Root Directory: services/pdf-compiler

Instance Type: Free
```

### Paso 4: Environment Variables

```
PDF_COMPILER_API_KEY = [genera con: openssl rand -base64 32]
ALLOWED_ORIGINS = http://localhost:3000
```

### Paso 5: Create Web Service

Build time: ~5-7 minutos

---

## ⚙️ CONFIGURAR EN NEXT.JS

### Paso 1: Agregar variables a .env.local

```bash
# En la raíz de alpha-ap-justification
# Agrega estas líneas a .env.local:

PDF_COMPILER_URL=https://alpha-pdf-compiler-production.railway.app
PDF_COMPILER_API_KEY=tu_api_key_aqui
```

### Paso 2: Test desde Next.js

Crea archivo de test:

```typescript
// test-pdf-cloud.ts

import { testPDFCompilation } from "./lib/pdf/cloud-generator";
import fs from "fs";

async function test() {
  console.log("Testing cloud PDF compilation...");

  const pdfBuffer = await testPDFCompilation();

  fs.writeFileSync("test-output.pdf", pdfBuffer);
  console.log("✅ PDF saved to test-output.pdf");
}

test();
```

Ejecuta:

```bash
npx ts-node test-pdf-cloud.ts

# Deberías ver:
# Testing cloud PDF compilation...
# ✅ PDF saved to test-output.pdf

# Abre test-output.pdf para verificar
```

---

## 🧪 TESTING COMPLETO

### Test 1: Health Check

```bash
curl https://your-service.railway.app/health
```

### Test 2: Simple LaTeX

```bash
curl -X POST https://your-service.railway.app/compile \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "latexContent": "\\documentclass{article}\\begin{document}Hello World\\end{document}"
  }' \
  --output test.pdf

# Abre test.pdf
```

### Test 3: Math Content

```bash
curl -X POST https://your-service.railway.app/compile \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "latexContent": "\\documentclass{article}\\usepackage{amsmath}\\begin{document}Consider $f(x) = x^2$.\\end{document}"
  }' \
  --output math-test.pdf
```

### Test 4: Desde Next.js

```bash
# Con servidor corriendo (npm run dev)
curl -X POST http://localhost:3000/api/test-pdf \
  -H "Content-Type: application/json" \
  -d '{}'

# Crea endpoint de prueba primero:
```

```typescript
// app/api/test-pdf/route.ts

import { NextResponse } from "next/server";
import { testPDFCompilation } from "@/lib/pdf/cloud-generator";

export async function POST() {
  try {
    const pdfBuffer = await testPDFCompilation();

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=test.pdf"
      }
    });
  } catch (error) {
    return NextResponse.json({
      error: error.message
    }, { status: 500 });
  }
}
```

---

## 📊 MONITORING

### Ver Logs (Railway)

```bash
railway logs

# O en dashboard:
# https://railway.app/project/your-project-id/service/alpha-pdf-compiler
```

### Ver Métricas

```bash
railway status

# Muestra:
# - CPU usage
# - Memory usage
# - Request count
# - Uptime
```

### Configurar Alerts (opcional)

En Railway dashboard:
1. Project Settings → Notifications
2. Agregar webhook para Telegram/Discord
3. Alerts en: deployment fails, high CPU, etc.

---

## 💰 COSTO

### Railway Free Tier
- ✅ 500 horas/mes gratis
- ✅ $5 de crédito mensual
- ✅ Suficiente para ~1000 PDFs/mes

### Railway Pro (si necesitas más)
- $5/mes base
- $0.000231/min de uso
- ~$10-15/mes para uso moderado

### Render Free Tier
- ✅ 750 horas/mes gratis
- ⚠️ Se duerme después de 15 min inactividad (tarda 30s en despertar)

---

## 🔒 SEGURIDAD

### API Key Rotation

```bash
# Generar nueva key
NEW_KEY=$(openssl rand -base64 32)

# Actualizar en Railway
railway variables set PDF_COMPILER_API_KEY="$NEW_KEY"

# Actualizar en Next.js .env.local
# PDF_COMPILER_API_KEY=new_key_here

# Restart services
railway restart
```

### Rate Limiting

Configurado en `server.js`:
- 100 requests / 15 minutos
- Por IP address
- Ajustable si necesitas más

### CORS

Por defecto permite `*`. Para producción:

```bash
railway variables set ALLOWED_ORIGINS="https://your-app.vercel.app,https://your-domain.com"
```

---

## 🐛 TROUBLESHOOTING

### Error: "Unauthorized"

Verifica API keys:

```bash
# En Railway
railway variables get PDF_COMPILER_API_KEY

# En Next.js
echo $PDF_COMPILER_API_KEY

# Deben ser idénticas
```

### Error: "LaTeX compilation failed"

Revisa logs:

```bash
railway logs --tail 100

# Busca error de LaTeX
# Común: missing package, syntax error
```

### Build Fails

```bash
# Ver logs de build
railway logs --deployment

# Común: Dockerfile syntax, missing packages
```

### Service No Responde

```bash
# Check status
railway status

# Restart
railway restart

# Si persiste, redeploy
railway up --detach
```

---

## ✅ CHECKLIST COMPLETO

### Deployment
- [ ] Railway CLI instalado
- [ ] Logged in to Railway
- [ ] Project created
- [ ] API key generated y guardada
- [ ] Variables de entorno configuradas
- [ ] Deployed con `railway up`
- [ ] Domain obtenido
- [ ] Health check funciona

### Integration
- [ ] `PDF_COMPILER_URL` en .env.local
- [ ] `PDF_COMPILER_API_KEY` en .env.local
- [ ] `cloud-generator.ts` implementado
- [ ] Test endpoint creado
- [ ] Test PDF generado correctamente

### Testing
- [ ] Health check responde
- [ ] Simple LaTeX compila
- [ ] Math content compila
- [ ] Desde Next.js funciona
- [ ] Rate limiting funciona
- [ ] Auth rechaza requests sin key

---

## 🚀 SIGUIENTE PASO

Una vez deployed y tested:

**Actualizar `generate-frq` endpoint:**

```typescript
// app/api/admin/generate-frq/route.ts

import { generateFRQPDFCloud } from "@/lib/pdf/cloud-generator";

// Reemplazar local PDF generation con cloud:
const pdfBuffer = await generateFRQPDFCloud(frqData);

// Guardar temporalmente
const tempPath = `/tmp/frq-${frqId}.pdf`;
await fs.writeFile(tempPath, pdfBuffer);

// Enviar a Telegram
await sendFRQPDFToTelegram(tempPath, data);
```

---

**TIEMPO TOTAL ESTIMADO:** 15-20 minutos

**¿Listo para deploy?** 🚀
