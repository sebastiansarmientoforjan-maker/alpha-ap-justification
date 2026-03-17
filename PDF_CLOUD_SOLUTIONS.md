# ☁️ Soluciones Cloud para PDF Generation

## 🎯 Problema

Si no estás en tu computadora, `pdflatex` (instalado localmente) no puede compilar PDFs.

**Necesitamos una solución en la nube.**

---

## ✅ SOLUCIÓN 1: Overleaf API (Recomendada) ⭐

Overleaf es el editor LaTeX online más popular. Tiene API para compilar documentos.

### Ventajas
- ✅ LaTeX completo en la nube
- ✅ Sin instalación local
- ✅ Funciona desde cualquier lugar
- ✅ Compila en 3-5 segundos
- ✅ Soporte completo de paquetes

### Implementación

```typescript
// lib/pdf/overleaf-generator.ts

interface OverleafConfig {
  apiKey: string;
  projectId?: string;
}

export async function generatePDFWithOverleaf(latexContent: string): Promise<Buffer> {
  const OVERLEAF_API = "https://www.overleaf.com/api/v2";

  // 1. Crear proyecto temporal
  const projectResponse = await fetch(`${OVERLEAF_API}/projects`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OVERLEAF_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: `FRQ-${Date.now()}`,
      template: "blank"
    })
  });

  const { projectId } = await projectResponse.json();

  // 2. Subir archivo .tex
  await fetch(`${OVERLEAF_API}/projects/${projectId}/files`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OVERLEAF_API_KEY}`,
      "Content-Type": "multipart/form-data"
    },
    body: new FormData({
      file: new Blob([latexContent], { type: "text/plain" }),
      filename: "main.tex"
    })
  });

  // 3. Compilar
  const compileResponse = await fetch(`${OVERLEAF_API}/projects/${projectId}/compile`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OVERLEAF_API_KEY}`
    }
  });

  const { pdfUrl } = await compileResponse.json();

  // 4. Descargar PDF
  const pdfResponse = await fetch(pdfUrl);
  const pdfBuffer = await pdfResponse.arrayBuffer();

  // 5. Eliminar proyecto temporal (cleanup)
  await fetch(`${OVERLEAF_API}/projects/${projectId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${process.env.OVERLEAF_API_KEY}`
    }
  });

  return Buffer.from(pdfBuffer);
}
```

### Configuración

```bash
# .env.local
OVERLEAF_API_KEY=your_overleaf_api_key

# Obtén API key en:
# https://www.overleaf.com/user/settings (Professional/Team plan)
```

### Costo
- **Free:** No tiene API
- **Collaborator ($15/mes):** API limitada
- **Professional ($30/mes):** API completa + 10GB
- **Enterprise:** API unlimited

---

## ✅ SOLUCIÓN 2: LaTeX.Online (Gratis) ⭐⭐⭐

Servicio gratuito específico para compilar LaTeX.

### Ventajas
- ✅ **100% GRATIS**
- ✅ Sin cuenta necesaria
- ✅ API pública
- ✅ Compila en 5-10 segundos

### Implementación

```typescript
// lib/pdf/latex-online-generator.ts

export async function generatePDFWithLatexOnline(latexContent: string): Promise<Buffer> {
  const formData = new FormData();

  // Agregar archivo .tex
  formData.append("file", new Blob([latexContent]), "document.tex");

  // Compilar con LaTeX.Online
  const response = await fetch("https://latexonline.cc/compile", {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    throw new Error("LaTeX compilation failed");
  }

  const pdfBuffer = await response.arrayBuffer();
  return Buffer.from(pdfBuffer);
}
```

**¡Así de simple! No requiere API key ni autenticación.**

### Limitaciones
- Rate limit: 10 compilaciones/minuto
- Archivos < 10MB
- No almacenamiento (PDF temporal)

**PERFECTA para nuestro caso.**

---

## ✅ SOLUCIÓN 3: Docker Container + Railway/Render

Deploya un contenedor con LaTeX en un servidor cloud.

### Ventajas
- ✅ Control total
- ✅ Sin dependencias externas
- ✅ Siempre disponible
- ✅ Gratis en Railway (500h/mes)

### Implementación

**Dockerfile:**
```dockerfile
FROM ubuntu:22.04

# Instalar LaTeX
RUN apt-get update && apt-get install -y \
    texlive-latex-base \
    texlive-latex-extra \
    texlive-fonts-recommended \
    && rm -rf /var/lib/apt/lists/*

# Instalar Node.js
RUN apt-get update && apt-get install -y nodejs npm

# App
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3001

CMD ["npm", "start"]
```

**API Server:**
```typescript
// services/pdf-compiler/server.ts
import express from "express";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";

const execAsync = promisify(exec);
const app = express();

app.post("/compile", async (req, res) => {
  const { latexContent, jobId } = req.body;

  try {
    // Escribir .tex
    await fs.writeFile(`/tmp/${jobId}.tex`, latexContent);

    // Compilar
    await execAsync(`pdflatex -output-directory=/tmp /tmp/${jobId}.tex`);

    // Leer PDF
    const pdfBuffer = await fs.readFile(`/tmp/${jobId}.pdf`);

    // Cleanup
    await fs.unlink(`/tmp/${jobId}.tex`);
    await fs.unlink(`/tmp/${jobId}.pdf`);

    res.contentType("application/pdf");
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ error: "Compilation failed" });
  }
});

app.listen(3001);
```

**Deploy en Railway:**
```bash
# Instalar Railway CLI
npm install -g railway

# Deploy
railway login
railway init
railway up

# Railway te da una URL:
# https://pdf-compiler.railway.app
```

**Usar desde Next.js:**
```typescript
export async function generatePDF(latexContent: string) {
  const response = await fetch("https://pdf-compiler.railway.app/compile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      latexContent,
      jobId: `frq-${Date.now()}`
    })
  });

  return await response.arrayBuffer();
}
```

### Costo
- **Railway:** Gratis (500h/mes), luego $5/mes
- **Render:** Gratis (750h/mes), luego $7/mes
- **Fly.io:** Gratis (3 apps), luego $1.94/mes

---

## ✅ SOLUCIÓN 4: AWS Lambda con LaTeX Layer

Para scale infinito.

### Ventajas
- ✅ Serverless (paga por uso)
- ✅ Escala automáticamente
- ✅ Muy económico
- ✅ Siempre disponible

### Implementación

**Lambda Function:**
```typescript
// lambda/compile-latex/index.ts
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";

const execAsync = promisify(exec);

export async function handler(event: any) {
  const { latexContent, jobId } = JSON.parse(event.body);

  try {
    // Escribir
    await fs.writeFile(`/tmp/${jobId}.tex`, latexContent);

    // Compilar (LaTeX está en Lambda Layer)
    await execAsync(`pdflatex -output-directory=/tmp /tmp/${jobId}.tex`);

    // Leer
    const pdfBuffer = await fs.readFile(`/tmp/${jobId}.pdf`);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/pdf" },
      body: pdfBuffer.toString("base64"),
      isBase64Encoded: true
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Compilation failed" })
    };
  }
}
```

**Lambda Layer con LaTeX:**
- Usa layer pre-construido: https://github.com/serverlesspub/latex-on-lambda
- O construye tu propio layer

### Costo
- **Free tier:** 1M requests/mes + 400,000 GB-seconds/mes
- **Después:** $0.20 por 1M requests
- **Para este caso:** ~$0.50/mes

---

## 🎯 COMPARACIÓN DE SOLUCIONES

| Solución | Costo | Setup | Velocidad | Recomendado |
|----------|-------|-------|-----------|-------------|
| **LaTeX.Online** | 🟢 Gratis | 🟢 5 min | 🟡 5-10s | ⭐⭐⭐ **MEJOR** |
| **Overleaf API** | 🟡 $30/mes | 🟢 10 min | 🟢 3-5s | ⭐⭐ Profesional |
| **Docker (Railway)** | 🟢 Gratis | 🟡 30 min | 🟢 3-5s | ⭐⭐ Control total |
| **AWS Lambda** | 🟢 ~$0.50/mes | 🔴 2 horas | 🟢 2-4s | ⭐ Scale infinito |
| **Local pdflatex** | 🟢 Gratis | 🟢 5 min | 🟢 2-3s | ❌ Solo local |

---

## 🚀 RECOMENDACIÓN: LaTeX.Online

**Por qué:**
- ✅ Gratis
- ✅ Setup en 5 minutos
- ✅ No requiere cuenta
- ✅ API pública
- ✅ Suficiente para 100 PDFs/día

**Implementación completa:**

```typescript
// lib/pdf/cloud-generator.ts

export async function generateFRQPDFCloud(data: FRQPDFData): Promise<Buffer> {
  // 1. Generar contenido LaTeX (igual que antes)
  const latexContent = generateLatexContent(data);

  // 2. Enviar a LaTeX.Online para compilar
  const formData = new FormData();
  formData.append("file", new Blob([latexContent]), "document.tex");

  const response = await fetch("https://latexonline.cc/compile", {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    throw new Error("PDF compilation failed");
  }

  // 3. Retornar PDF buffer
  const pdfBuffer = await response.arrayBuffer();
  return Buffer.from(pdfBuffer);
}
```

**Actualizar el endpoint:**

```typescript
// app/api/admin/generate-frq/route.ts

import { generateFRQPDFCloud } from "@/lib/pdf/cloud-generator";

// En lugar de:
const pdfPath = await generateFRQPDF(data); // Local

// Usar:
const pdfBuffer = await generateFRQPDFCloud(data); // Cloud

// Guardar temporalmente
const tempPath = `/tmp/frq-${frqId}.pdf`;
await fs.writeFile(tempPath, pdfBuffer);

// Enviar a Telegram
await sendFRQPDFToTelegram(tempPath, data);
```

---

## 📋 MIGRATION CHECKLIST

### Opción A: LaTeX.Online (5 minutos)
- [ ] Crear `lib/pdf/cloud-generator.ts`
- [ ] Copiar código de LaTeX.Online
- [ ] Actualizar `generate-frq/route.ts`
- [ ] Probar: genera FRQ → recibe PDF en Telegram
- [ ] ✅ Funciona desde cualquier lugar!

### Opción B: Docker + Railway (30 minutos)
- [ ] Crear `Dockerfile`
- [ ] Crear PDF compiler service
- [ ] Deploy en Railway
- [ ] Actualizar código para llamar a Railway URL
- [ ] Probar end-to-end

### Opción C: Overleaf (10 minutos + $30)
- [ ] Registrar cuenta Professional en Overleaf
- [ ] Obtener API key
- [ ] Implementar `overleaf-generator.ts`
- [ ] Agregar `OVERLEAF_API_KEY` a env
- [ ] Probar

---

## ✅ RESULTADO FINAL

Con **LaTeX.Online** (gratis):

```
Tú en cafetería con laptop
         ↓
POST /api/admin/generate-frq
         ↓
Claude genera contenido (15s)
         ↓
Sistema crea .tex
         ↓
☁️ LaTeX.Online compila PDF (5s)
         ↓
📱 Telegram te envía PDF
         ↓
✅ Recibes PDF en tu teléfono!
```

**Funciona desde:**
- ✅ Cualquier computadora
- ✅ Tu teléfono (via browser)
- ✅ Tablet
- ✅ Cualquier lugar con internet

**NO requiere:**
- ❌ LaTeX instalado localmente
- ❌ Tu computadora encendida
- ❌ Servidor propio

---

## 🎯 NEXT STEPS

**AHORA MISMO (5 minutos):**

1. Crea `lib/pdf/cloud-generator.ts`
2. Copia código de LaTeX.Online
3. Actualiza `generate-frq/route.ts`
4. Prueba desde tu teléfono
5. ✅ Funciona!

**DESPUÉS (opcional):**

Si necesitas más control o velocidad:
- Deploy Docker en Railway
- O usa Overleaf API

---

**¿Quieres que implemente la versión con LaTeX.Online ahora mismo?**

Es literalmente **5 minutos** y funciona desde cualquier lugar. 🚀
