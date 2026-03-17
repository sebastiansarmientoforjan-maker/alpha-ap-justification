# 🤖 Telegram Bot Setup Guide

## Paso 1: Crear Bot de Telegram

1. **Abre Telegram** y busca `@BotFather`

2. **Envía el comando:** `/newbot`

3. **Sigue las instrucciones:**
   - Nombre del bot: `AP Justification Notifications`
   - Username: `ap_justification_bot` (o el que prefieras, debe terminar en `_bot`)

4. **Guarda el Bot Token** que te da BotFather:
   ```
   123456789:ABCdefGHIjklMNOpqrsTUVwxyz
   ```

---

## Paso 2: Obtener tu Chat ID

### Opción A: Usar un bot de utilidad

1. Busca `@userinfobot` en Telegram
2. Envíale cualquier mensaje
3. Te responderá con tu **Chat ID** (número)
4. Guarda ese número

### Opción B: Método manual

1. Envía un mensaje a tu nuevo bot (el que creaste con BotFather)
2. Abre esta URL en tu navegador (reemplaza `YOUR_BOT_TOKEN`):
   ```
   https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
   ```
3. Busca `"chat":{"id":123456789` en el JSON
4. Ese número es tu Chat ID

---

## Paso 3: Configurar Variables de Entorno

Agrega estas líneas a `.env.local`:

```bash
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=987654321

# Base URL (para links en mensajes)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**⚠️ IMPORTANTE:**
- El `TELEGRAM_BOT_TOKEN` es el token que te dio BotFather
- El `TELEGRAM_CHAT_ID` es TU ID personal (el número que obtuviste en Paso 2)

---

## Paso 4: Configurar Webhook (Para botones interactivos)

El webhook permite que los botones inline funcionen. Hay dos opciones:

### Opción A: En producción (Vercel)

Después de deployar en Vercel:

1. Abre esta URL en tu navegador (reemplaza `YOUR_BOT_TOKEN` y `YOUR_DOMAIN`):
   ```
   https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook?url=https://YOUR_DOMAIN.vercel.app/api/telegram/webhook
   ```

2. Deberías ver:
   ```json
   {"ok":true,"result":true,"description":"Webhook was set"}
   ```

### Opción B: En local (usando ngrok)

Para desarrollo local:

1. **Instala ngrok:** https://ngrok.com/download

2. **Inicia tu servidor Next.js:**
   ```bash
   npm run dev
   ```

3. **En otra terminal, inicia ngrok:**
   ```bash
   ngrok http 3000
   ```

4. **Copia la URL pública** que te da ngrok (ej: `https://abc123.ngrok.io`)

5. **Configura el webhook:**
   ```bash
   curl "https://api.telegram.org/bot123456789:ABCdefGHIjklMNOpqrsTUVwxyz/setWebhook?url=https://abc123.ngrok.io/api/telegram/webhook"
   ```

6. Verifica que funcionó:
   ```bash
   curl "https://api.telegram.org/bot123456789:ABCdefGHIjklMNOpqrsTUVwxyz/getWebhookInfo"
   ```

**⚠️ Nota:** Cada vez que reinicies ngrok, deberás reconfigurar el webhook con la nueva URL.

---

## Paso 5: Actualizar API de Generación de FRQ

Actualiza `app/api/admin/generate-frq/route.ts` para usar Telegram:

```typescript
import { sendTelegramFRQNotification } from "@/lib/telegram/bot";

// ... dentro de la función POST, después de generar el FRQ:

// Step 7: Notify via Telegram
await sendTelegramFRQNotification({
  studentName,
  quizScore,
  frqType,
  weakTopics,
  frqId: frqWithMetadata.frq.id,
  frqStatement: frqWithMetadata.frq.statement,
  week1Problems: frqWithMetadata.week1Problems.map((p: any) => p.title),
});
```

---

## Paso 6: Probar la Conexión

Crea un endpoint de prueba:

`app/api/test-telegram/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { testTelegramConnection, sendTelegramMessage } from "@/lib/telegram/bot";

export async function GET() {
  // Test connection
  const connectionTest = await testTelegramConnection();

  if (!connectionTest.success) {
    return NextResponse.json({
      success: false,
      error: connectionTest.error,
    });
  }

  // Send test message
  const messageSent = await sendTelegramMessage(
    "✅ *Telegram Bot Connected!*\n\nYour AP Justification notification system is ready."
  );

  return NextResponse.json({
    success: messageSent,
    botInfo: connectionTest.botInfo,
  });
}
```

**Prueba:** Abre `http://localhost:3000/api/test-telegram` en tu navegador.

Deberías recibir un mensaje en Telegram.

---

## 📱 Ejemplo de Notificación

Cuando un FRQ es generado, recibirás este mensaje en Telegram:

```
🎓 NEW FRQ GENERATED - Requires Approval

👤 Student: Ananya Kakarlapudi
🔴 Quiz Score: 75% (Below 80%)
🎯 FRQ Type: SPECIFIC
📌 Weak Topics: derivatives, MVT

📝 Generated FRQ Preview:
```
Consider the function f(x) = x³ - 3x on [-2, 2]...
```

📋 Week 1 Problems:
1. MVT: Checking Differentiability
2. IVT: Condition Verification
3. FTC: Domain Restrictions

FRQ ID: `frq-abc123`
Generated: 3/10/2026, 7:45:23 PM
```

**Con 4 botones:**
- ✅ Approve & Assign
- ❌ Reject
- 🔄 Regenerate
- 👁️ View Full Details

---

## 🎮 Usando los Botones

### ✅ Approve & Assign
- Aprueba el FRQ
- Asigna al estudiante automáticamente
- Estudiante puede ver Week 1
- Recibes confirmación

### ❌ Reject
- Rechaza el FRQ
- No se asigna al estudiante
- Puedes regenerar después

### 🔄 Regenerate
- Claude genera un nuevo FRQ
- Mantiene los mismos parámetros (score, topics)
- Recibes nueva notificación

### 👁️ View Full Details
- Abre el admin panel en el navegador
- Muestra FRQ completo + problemas
- Permite edición manual

---

## 🔍 Troubleshooting

### No recibo mensajes

**1. Verifica el Bot Token:**
```bash
curl "https://api.telegram.org/bot123456789:ABCdefGHIjklMNOpqrsTUVwxyz/getMe"
```

**2. Verifica el Chat ID:**
```bash
# Envía un mensaje a tu bot, luego:
curl "https://api.telegram.org/bot123456789:ABCdefGHIjklMNOpqrsTUVwxyz/getUpdates"
```

**3. Revisa los logs del servidor:**
```bash
# Deberías ver:
✅ Telegram notification sent successfully
📱 Message ID: 123
```

### Los botones no funcionan

**1. Verifica el webhook:**
```bash
curl "https://api.telegram.org/botYOUR_TOKEN/getWebhookInfo"
```

**2. Asegúrate de que el webhook esté configurado:**
```json
{
  "ok": true,
  "result": {
    "url": "https://your-domain.com/api/telegram/webhook",
    "has_custom_certificate": false,
    "pending_update_count": 0
  }
}
```

**3. Revisa logs del webhook:**
- Cada clic en un botón debe aparecer en los logs
- Busca: `📱 Telegram callback from Sebastian: approve_frq:frq-abc123`

### Error "Forbidden: bot was blocked by the user"

**Solución:** Envía un mensaje a tu bot primero (cualquier mensaje). Luego el bot podrá enviarte mensajes.

---

## 🚀 Flujo Completo de Prueba

1. **Genera un FRQ manualmente:**
   ```bash
   curl -X POST http://localhost:3000/api/admin/generate-frq \
     -H "Content-Type: application/json" \
     -d '{
       "studentId": "test-123",
       "studentName": "Test Student",
       "quizScore": 75,
       "weakTopics": ["derivatives"],
       "course": "calculus-bc"
     }'
   ```

2. **Recibe notificación en Telegram** (debería llegar en ~3 segundos)

3. **Click en "✅ Approve & Assign"**

4. **Recibe confirmación:**
   ```
   ✅ FRQ APPROVED

   Student: Test Student
   FRQ ID: frq-abc123
   Time: 3/10/2026, 7:50:12 PM

   ✨ Student can now access Week 1 training!
   ```

5. **Verifica en el admin panel:** `/admin/frq-approvals`

---

## 📋 Checklist

- [ ] Crear bot con @BotFather
- [ ] Obtener Bot Token
- [ ] Obtener tu Chat ID
- [ ] Agregar variables a `.env.local`
- [ ] Probar conexión (`/api/test-telegram`)
- [ ] Configurar webhook (ngrok para local, Vercel URL para prod)
- [ ] Actualizar API de generación para usar Telegram
- [ ] Hacer prueba end-to-end
- [ ] Verificar que botones funcionen

---

## 📞 Contacto de Emergencia

Si algo no funciona:

1. **Verifica las variables de entorno** en `.env.local`
2. **Revisa los logs del servidor** (deberían aparecer los intentos)
3. **Prueba el endpoint de test:** `/api/test-telegram`
4. **Verifica que el bot no esté bloqueado** (envíale un mensaje primero)

---

**¡Listo! Tu sistema de notificaciones de Telegram está configurado.** 🎉

Cuando un estudiante complete un quiz en MathAcademy, Claude generará el FRQ automáticamente y te llegará una notificación a Telegram con botones para aprobar/rechazar directamente desde el chat.
