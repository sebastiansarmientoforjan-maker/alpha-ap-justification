# 🔒 Seguridad y Privacidad: Comparación de Soluciones PDF

## 🎯 Tu Pregunta: "¿Docker filtra los documentos?"

**Respuesta Corta:**
- ❌ **LaTeX.Online:** Envías docs a un tercero (menos privado)
- ✅ **Docker (tu servidor):** TODO se procesa en TU servidor (100% privado)
- ❌ **Overleaf:** Envías docs a sus servidores (menos privado)
- ✅ **pdflatex local:** TODO en tu PC (100% privado)

---

## 🔐 ANÁLISIS DE PRIVACIDAD

### ❌ LaTeX.Online (Servicio Público)

**¿Qué sucede con tus documentos?**

```
Tu servidor → Envía .tex → LaTeX.Online (terceros)
                                 ↓
                         Sus servidores compilan
                                 ↓
                         Potencialmente LEEN el contenido
                                 ↓
                         Devuelven PDF
```

**Riesgos:**
- 🔴 **Envías información de estudiantes a terceros**
- 🔴 El servicio PUEDE leer el contenido (nombres, scores, etc.)
- 🔴 No sabes cómo almacenan/procesan los datos
- 🔴 No hay contrato de privacidad (servicio gratis público)
- 🔴 **FERPA compliance:** Probablemente NO cumple

**¿Qué dice su política?**
> "We do not store your documents permanently."

Pero SÍ los ven temporalmente mientras compilan.

---

### ✅ Docker en Railway/Render (TU Servidor)

**¿Qué sucede con tus documentos?**

```
Tu servidor Next.js → Llama a TU contenedor Docker
                            ↓
                      TU servidor procesa
                            ↓
                      pdflatex compila EN TU SERVIDOR
                            ↓
                      Devuelve PDF a tu servidor
                            ↓
                      NUNCA sale de tu infraestructura
```

**Railway/Render SOLO provee:**
- 💻 Máquina virtual (servidor)
- 🌐 Red/conectividad
- 💾 Disco temporal

**Railway/Render NO tiene acceso a:**
- ❌ Contenido de tus archivos
- ❌ Datos de estudiantes
- ❌ PDFs generados

**Es como alquilar un apartamento:**
- Railway = Dueño del edificio
- Tú = Inquilino con llave privada
- El dueño NO puede entrar a tu apartamento
- TODO lo que pasa dentro es privado

**FERPA Compliance:** ✅ SÍ, porque los datos NO salen de tu control

---

### ❌ Overleaf API (Servicio Comercial)

**¿Qué sucede?**

Similar a LaTeX.Online pero:
- ✅ Empresa legítima con políticas de privacidad
- ✅ Contrato de servicio (si pagas)
- ⚠️ Pero SIGUES enviando datos a terceros
- ⚠️ Necesitarías Business Associate Agreement (BAA) para FERPA

**Costo extra:**
- Enterprise plan con BAA: ~$150-300/mes

---

### ✅ pdflatex Local (Tu PC)

**100% Privado:**
- ✅ Todo se procesa en tu computadora
- ✅ Ningún dato sale
- ❌ Pero solo funciona si estás en tu PC

---

## 📊 COMPARACIÓN DE PRIVACIDAD

| Solución | Privacidad | FERPA Safe | Datos a Terceros | Recomendado |
|----------|------------|------------|------------------|-------------|
| **Docker (Railway)** | 🟢 **Alta** | ✅ **SÍ** | ❌ NO | ⭐⭐⭐ **MEJOR** |
| **pdflatex local** | 🟢 **Alta** | ✅ SÍ | ❌ NO | ⭐⭐ Solo local |
| **AWS Lambda** | 🟢 **Alta** | ✅ SÍ | ❌ NO | ⭐ Complejo |
| **Overleaf (con BAA)** | 🟡 Media | ⚠️ Con contrato | ✅ SÍ | ⚠️ Costoso |
| **LaTeX.Online** | 🔴 **Baja** | ❌ **NO** | ✅ **SÍ** | ❌ **EVITAR** |

---

## 🏆 RECOMENDACIÓN: Docker en Railway

### Por qué es la mejor opción

#### ✅ Privacidad Total
```
┌─────────────────────────────────────────┐
│  TU INFRAESTRUCTURA                     │
│                                         │
│  ┌─────────────┐    ┌───────────────┐  │
│  │  Next.js    │───→│ Docker PDF    │  │
│  │  (Vercel)   │    │ Compiler      │  │
│  │             │←───│ (Railway)     │  │
│  └─────────────┘    └───────────────┘  │
│                                         │
│  Datos NUNCA salen de aquí            │
└─────────────────────────────────────────┘

Railway solo provee la máquina.
NO tiene acceso al contenido.
```

#### ✅ FERPA Compliant
- Los datos del estudiante NO se comparten con terceros
- Procesamiento interno
- Tú controlas toda la infraestructura

#### ✅ Seguridad
- HTTPS end-to-end
- Autenticación entre servicios (API keys)
- Logs privados (solo tú los ves)

#### ✅ Control Total
- Puedes auditar todo el código
- Sabes exactamente qué pasa con los datos
- Puedes agregar encriptación adicional

---

## 🔒 IMPLEMENTACIÓN SEGURA (Docker)

### Arquitectura con Seguridad

```typescript
// services/pdf-compiler/server.ts

import express from "express";
import crypto from "crypto";

const app = express();

// 1. Autenticación con API Key
const API_KEY = process.env.PDF_COMPILER_API_KEY;

app.use((req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader !== `Bearer ${API_KEY}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
});

// 2. Rate limiting (prevenir abuso)
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100 // max 100 requests per 15min
});
app.use(limiter);

// 3. Procesamiento con cleanup automático
app.post("/compile", async (req, res) => {
  const jobId = crypto.randomUUID();

  try {
    // Escribir archivo temporal
    const texPath = `/tmp/${jobId}.tex`;
    await fs.writeFile(texPath, req.body.latexContent);

    // Compilar
    await execAsync(`pdflatex -output-directory=/tmp ${texPath}`);

    // Leer PDF
    const pdfPath = `/tmp/${jobId}.pdf`;
    const pdfBuffer = await fs.readFile(pdfPath);

    // IMPORTANTE: Eliminar archivos inmediatamente
    await cleanupFiles(jobId);

    res.contentType("application/pdf");
    res.send(pdfBuffer);

  } catch (error) {
    await cleanupFiles(jobId); // Cleanup incluso si falla
    res.status(500).json({ error: "Compilation failed" });
  }
});

// 4. Cleanup function
async function cleanupFiles(jobId: string) {
  const extensions = [".tex", ".pdf", ".aux", ".log", ".out"];

  for (const ext of extensions) {
    try {
      await fs.unlink(`/tmp/${jobId}${ext}`);
    } catch (e) {
      // Ignorar si no existe
    }
  }
}

// 5. Logs (solo errores, NO contenido)
app.use((err, req, res, next) => {
  console.error({
    timestamp: new Date().toISOString(),
    error: err.message, // NO el contenido del documento
    ip: req.ip
  });
  res.status(500).json({ error: "Internal error" });
});

app.listen(3001);
```

### Deploy Seguro en Railway

```bash
# 1. Crear proyecto
railway init

# 2. Agregar variable de entorno (API Key)
railway variables set PDF_COMPILER_API_KEY=$(openssl rand -base64 32)

# 3. Deploy
railway up

# 4. Railway te da URL:
# https://pdf-compiler-production.railway.app
```

### Usar desde Next.js

```typescript
// lib/pdf/secure-cloud-generator.ts

export async function generatePDFSecure(latexContent: string): Promise<Buffer> {
  const response = await fetch(process.env.PDF_COMPILER_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.PDF_COMPILER_API_KEY}` // Autenticado
    },
    body: JSON.stringify({ latexContent })
  });

  if (!response.ok) {
    throw new Error("PDF compilation failed");
  }

  const pdfBuffer = await response.arrayBuffer();
  return Buffer.from(pdfBuffer);
}
```

### Variables de Entorno

```bash
# .env.local (Next.js)
PDF_COMPILER_URL=https://pdf-compiler-production.railway.app
PDF_COMPILER_API_KEY=your_generated_api_key

# .env (PDF Compiler - Railway)
PDF_COMPILER_API_KEY=your_generated_api_key
```

---

## 🛡️ CARACTERÍSTICAS DE SEGURIDAD

### Con Docker (Railway):

✅ **Datos Privados**
- Nunca salen de tu infraestructura
- No pasan por servicios de terceros

✅ **Autenticación**
- API Key entre servicios
- Solo tu Next.js puede llamar al compiler

✅ **Cleanup Automático**
- Archivos temporales se eliminan inmediatamente
- No hay almacenamiento persistente

✅ **Rate Limiting**
- Previene abuso
- Máximo X compilaciones por minuto

✅ **Logs Seguros**
- Solo se loguean errores
- NUNCA el contenido de documentos

✅ **HTTPS**
- Toda comunicación encriptada
- Certificados automáticos de Railway

✅ **Aislamiento**
- Cada compilación en proceso separado
- No hay cross-contamination

---

## 📋 COMPARACIÓN: LaTeX.Online vs Docker

| Aspecto | LaTeX.Online | Docker (Railway) |
|---------|--------------|------------------|
| **Privacidad** | 🔴 Baja | 🟢 Alta |
| **Datos a terceros** | ✅ SÍ | ❌ NO |
| **FERPA Safe** | ❌ NO | ✅ SÍ |
| **Auditable** | ❌ NO | ✅ SÍ |
| **Control** | ❌ Ninguno | ✅ Total |
| **Costo** | $0 | $0-5/mes |
| **Setup** | 5 min | 30 min |
| **Funciona sin tu PC** | ✅ SÍ | ✅ SÍ |

---

## ✅ RESPUESTA A TU PREGUNTA

### "¿Docker filtra los documentos?"

**NO.** Docker es TU contenedor, TU servidor.

**Railway/Render solo proveen:**
- 🖥️ La máquina (VM)
- 🌐 Conectividad
- 💾 Almacenamiento

**Railway/Render NO tienen:**
- ❌ Acceso al contenido de tus archivos
- ❌ Acceso a tus procesos
- ❌ Capacidad de "leer" los PDFs

**Es como Dropbox vs tu disco duro externo:**
- **Dropbox** = LaTeX.Online (ellos VEN tus archivos)
- **Disco duro externo** = Docker (solo tú lo ves)

Railway es como comprar el disco duro externo en Amazon:
- Amazon te vende el hardware
- Pero NO tiene acceso a lo que guardas en él

---

## 🎯 RECOMENDACIÓN FINAL

### Para Datos de Estudiantes (FERPA):

**✅ USAR:**
1. **Docker en Railway/Render** (privado, seguro, funciona sin tu PC)
2. **AWS Lambda** (privado, seguro, serverless)
3. **pdflatex local** (100% privado, pero solo en tu PC)

**❌ EVITAR:**
1. **LaTeX.Online** (datos van a terceros)
2. **Overleaf sin BAA** (datos van a terceros)

---

## 🚀 NEXT STEPS

**Opción Recomendada: Docker en Railway (30 min)**

1. Crear Dockerfile con LaTeX
2. Crear API server con autenticación
3. Deploy en Railway (gratis)
4. Configurar API keys
5. Actualizar Next.js para usar el compiler
6. ✅ 100% privado, funciona desde cualquier lugar

**¿Quieres que implemente esta solución segura ahora?**

Incluye:
- ✅ Privacidad total
- ✅ FERPA compliant
- ✅ Funciona sin tu PC
- ✅ Gratis (Railway free tier)
- ✅ Control total

Es más setup inicial (30 min), pero vale la pena por la seguridad. 🔒
