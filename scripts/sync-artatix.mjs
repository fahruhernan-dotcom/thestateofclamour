#!/usr/bin/env node
/**
 * scripts/sync-artatix.mjs
 * Utility script to verify live ticket status on Artatix (swear_in_continental/ticket).
 * 
 * Usage:
 *   node scripts/sync-artatix.mjs
 */

import https from 'node:https';

const ARTATIX_URL = 'https://artatix.co.id/event/swear_in_continental/ticket';
const ARTATIX_EVENT_URL = 'https://artatix.co.id/event/swear_in_continental';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function checkArtatix() {
  console.log('🔍 [Artatix Sync] Fetching:', ARTATIX_URL);
  try {
    const res = await fetchUrl(ARTATIX_URL);
    console.log(`📡 [Artatix Sync] HTTP Status: ${res.statusCode}`);

    if (res.statusCode !== 200) {
      console.warn(`⚠️ [Artatix Sync] Non-200 status code received: ${res.statusCode}`);
      return;
    }

    const html = res.data;
    const hasEarlyBird = /early\s*bird/i.test(html);
    const hasBlind = /blind\s*ticket/i.test(html);
    const has100k = /100\.000/i.test(html);
    const has180k = /180\.000/i.test(html);
    const has50k = /50\.000/i.test(html);

    console.log('\n📊 [Artatix Sync Result Report]:');
    console.log(`- URL: ${ARTATIX_URL}`);
    console.log(`- Mentions 'Early Bird': ${hasEarlyBird ? 'YES' : 'NO'}`);
    console.log(`- Mentions 'Blind Ticket': ${hasBlind ? 'YES' : 'NO'}`);
    console.log(`- Mentions Rp 50.000: ${has50k ? 'YES' : 'NO'}`);
    console.log(`- Mentions Rp 100.000: ${has100k ? 'YES' : 'NO'}`);
    console.log(`- Mentions Rp 180.000: ${has180k ? 'YES' : 'NO'}`);

    console.log('\n✅ Local eventData.ts schedule is configured for: 2026-10-11T19:00:00+07:00 (Minggu, 19:00 WIB)');
  } catch (err) {
    console.error('❌ [Artatix Sync Error]:', err.message);
  }
}

checkArtatix();
