#!/usr/bin/env node
/**
 * scripts/sync-artatix.mjs
 * CLI Utility to query official Artatix API directly and report live ticket availability.
 * 
 * Usage:
 *   node scripts/sync-artatix.mjs
 */

import https from 'node:https';

const API_URL = 'https://api.artatix.co.id/api/v1/customer/ticket/swear_in_continental?isTicketExclusive=0&isMerch=0';

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
          reject(new Error(`Failed to parse JSON: ${data.slice(0, 100)}`));
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('🔍 [Artatix Live Monitor] Querying official API:');
  console.log(`   Endpoint: ${API_URL}\n`);

  try {
    const { status, json } = await fetchArtatix();
    if (status !== 200 || !json.data) {
      console.error(`❌ HTTP Status: ${status}`, json);
      return;
    }

    const tickets = json.data;
    console.log(`📡 [Status: 200 OK] — Found ${tickets.length} ticket(s) published on Artatix:\n`);

    console.table(tickets.map(t => ({
      ID: t.id,
      Nama: t.name,
      Kategori: t.category,
      Harga: `Rp ${Number(t.price).toLocaleString('id-ID')}`,
      Stok: t.stock,
      Status: t.status,
      'Sold Out?': (t.status?.toLowerCase().includes('sold') || t.stock <= 0) ? '🔴 YA (HABIS)' : '🟢 TIDAK (TERSEDIA)'
    })));

    console.log('\n💡 [Sinkronisasi Web]:');
    console.log('   - Web kita otomatis mem-poll API ini secara berkala (cron interval 45 detik).');
    console.log('   - Jika Artatix menyatakan tiket habis, tombol di web otomatis menjadi "CAPACITY REACHED".');
  } catch (err) {
    console.error('❌ [Artatix Sync Error]:', err.message);
  }
}

run();
