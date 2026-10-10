#!/usr/bin/env node
/**
 * scripts/watch-artatix.mjs
 * Real-time watcher script that monitors Artatix and notifies you immediately
 * via Windows Desktop Alert + Terminal Bell whenever ticket status/stock changes.
 * 
 * Usage:
 *   npm run watch:artatix
 *   node scripts/watch-artatix.mjs
 */

import https from 'node:https';
import { exec } from 'node:child_process';

const API_URL = 'https://api.artatix.co.id/api/v1/customer/ticket/swear_in_continental?isTicketExclusive=0&isMerch=0';
const CHECK_INTERVAL_MS = 30000; // Check every 30s in developer background

function fetchArtatix() {
  return new Promise((resolve, reject) => {
    https.get(API_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Origin': 'https://artatix.co.id',
        'Referer': 'https://artatix.co.id/'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, json: JSON.parse(data) });
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function notifyWindows(title, message) {
  // Beep terminal
  process.stdout.write('\x07');
  
  // Windows Popup Alert (auto close in 15 seconds)
  const escapedMsg = message.replace(/'/g, "''");
  const escapedTitle = title.replace(/'/g, "''");
  const psCmd = `powershell -Command "(New-Object -ComObject Wscript.Shell).Popup('${escapedMsg}', 15, '${escapedTitle}', 64)"`;
  exec(psCmd, () => {});
}

let lastSnapshot = null;

async function checkOnce() {
  const timeStr = new Date().toLocaleTimeString('id-ID');
  try {
    const { status, json } = await fetchArtatix();
    if (status !== 200 || !json.data) {
      console.log(`[${timeStr}] ⚠️ Respon Artatix status: ${status}`);
      return;
    }

    const currentTickets = json.data;
    const currentSnapshot = JSON.stringify(currentTickets.map(t => ({
      id: t.id,
      name: t.name,
      price: t.price,
      stock: t.stock,
      status: t.status
    })));

    if (lastSnapshot === null) {
      // First run snapshot
      lastSnapshot = currentSnapshot;
      console.log(`[${timeStr}] 🟢 Watcher aktif. Memantau ${currentTickets.length} tiket di Artatix.`);
      currentTickets.forEach(t => {
        console.log(`   - ${t.name}: Stok ${t.stock} | Status: ${t.status}`);
      });
      console.log('   (Menunggu perubahan... Tekan Ctrl+C untuk berhenti)\n');
      return;
    }

    if (currentSnapshot !== lastSnapshot) {
      console.log(`\n🚨🚨🚨 [${timeStr}] PERUBAHAN TERDETEKSI DI ARTATIX! 🚨🚨🚨`);
      
      const prevList = JSON.parse(lastSnapshot);
      const changes = [];

      currentTickets.forEach(cur => {
        const prev = prevList.find(p => p.id === cur.id);
        if (!prev) {
          changes.push(`Tiket Baru Dirilis: ${cur.name} (Harga: ${cur.price}, Stok: ${cur.stock})`);
        } else if (prev.status !== cur.status || prev.stock !== cur.stock) {
          changes.push(`${cur.name}: Status berubah (${prev.status} -> ${cur.status}), Stok (${prev.stock} -> ${cur.stock})`);
        }
      });

      console.table(currentTickets.map(t => ({
        Nama: t.name,
        Harga: t.price,
        Stok: t.stock,
        Status: t.status
      })));

      const alertText = changes.length > 0 ? changes.join('\n') : 'Data tiket di Artatix telah diperbarui!';
      console.log(`📢 Detail: ${alertText}\n`);

      notifyWindows('Artatix Event Update!', alertText);

      lastSnapshot = currentSnapshot;
    } else {
      process.stdout.write(`\r[${timeStr}] ⏳ Artatix standby... (tidak ada perubahan data)`);
    }
  } catch (err) {
    console.log(`[${timeStr}] ❌ Gagal terhubung ke Artatix: ${err.message}`);
  }
}

console.log('========================================================');
console.log('👁️  ARTATIX REAL-TIME DESKTOP WATCHER');
console.log('   Event: swear_in_continental');
console.log('   Notifikasi: Windows Popup + Terminal Bell saat update');
console.log('========================================================\n');

checkOnce();
setInterval(checkOnce, CHECK_INTERVAL_MS);
