#!/usr/bin/env node

/**
 * Obtiene el chat_id del grupo de Telegram
 * Uso: node get-chat-id.js
 */

require('dotenv').config({ path: '.env.local' });
const https = require('https');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error('Error: TELEGRAM_BOT_TOKEN no encontrado en .env.local');
  process.exit(1);
}

function getUpdates() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${BOT_TOKEN}/getUpdates`,
      method: 'GET',
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.ok) {
            resolve(result.result);
          } else {
            reject(new Error(`Telegram error: ${result.description}`));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function main() {
  try {
    console.log('Obteniendo actualizaciones del bot...\n');
    const updates = await getUpdates();

    if (updates.length === 0) {
      console.log('No hay mensajes. Asegurate de:');
      console.log('1. Buscar @AP_justification_bot en Telegram');
      console.log('2. Enviar /start o cualquier mensaje al bot');
      console.log('3. Ejecutar este script de nuevo');
      return;
    }

    console.log('Chats encontrados:\n');

    const chats = new Map();
    updates.forEach(update => {
      if (update.message && update.message.chat) {
        const chat = update.message.chat;
        const chatId = chat.id;

        if (!chats.has(chatId)) {
          chats.set(chatId, {
            id: chatId,
            type: chat.type,
            title: chat.title || `${chat.first_name || ''} ${chat.last_name || ''}`.trim(),
            username: chat.username || 'N/A'
          });
        }
      }
    });

    chats.forEach((chat, id) => {
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`Tipo: ${chat.type}`);
      console.log(`Nombre: ${chat.title}`);
      console.log(`Chat ID: ${id}`);
      console.log(`Username: ${chat.username}`);
      console.log('');
    });

    console.log('\n✅ INSTRUCCIONES:');
    console.log('1. Copia el Chat ID del chat que quieres usar');
    console.log('2. Agregalo al archivo .env.local:');
    console.log('   TELEGRAM_CHAT_ID=tu_chat_id_aqui');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
