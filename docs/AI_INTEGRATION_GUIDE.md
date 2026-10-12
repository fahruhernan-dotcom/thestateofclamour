# 🤖 Panduan Integrasi AI Agent & WhatsApp Bot (The State of Clamour)
> **Versi Dokumen**: 2.1.0 (Dual-Floor Live Sync, Function Calling & Concierge Ready)  
> **Target Pengguna**: AI Engineers, Bot Developers, AI Agent Frameworks (LangChain, n8n, Flowise, OpenAI Assistant, Claude Tool-Use, Baileys/Wppconnect WhatsApp Bot), & Admin Operasional Venue.

Dokumen ini adalah **spesifikasi teknis dan operasional resmi** untuk mengintegrasikan AI Agent / Chatbot cerdas ke database live Supabase festival musik **The State of Clamour: Swear in Continental**.

---

## 📑 Daftar Isi
1. [Identitas Sistem & Ringkasan Acara](#1-identitas-sistem--ringkasan-acara)
2. [Perbedaan Krusial: Tiket Festival vs Reservasi Meja](#2-perbedaan-krusial-tiket-festival-vs-reservasi-meja)
3. [Kredensial & Autentikasi API](#3-kredensial--autentikasi-api)
4. [Skema Database & Kamus Data](#4-skema-database--kamus-data)
5. [Katalog Inventaris Meja & Fasilitas Lengkap](#5-katalog-inventaris-meja--fasilitas-lengkap)
6. [Standar REST API & Endpoint Eksekusi](#6-standar-rest-api--endpoint-eksekusi)
7. [Tool Definitions / Function Calling (OpenAI & Claude Ready)](#7-tool-definitions--function-calling-openai--claude-ready)
8. [SOP Interaksi Percakapan & State Machine Bot](#8-sop-interaksi-percakapan--state-machine-bot)
9. [Contoh Implementasi Kode (Python & JavaScript)](#9-contoh-implementasi-kode-python--javascript)
10. [FAQ Penanganan Tamu & Solusi Edge Cases](#10-faq-penanganan-tamu--solusi-edge-cases)
11. [Ready-to-Paste System Prompt Chatbot AI](#11-ready-to-paste-system-prompt-chatbot-ai)

---

## 🏛️ 1. Identitas Sistem & Ringkasan Acara

- **Nama Acara**: THE STATE OF CLAMOUR: SWEAR IN CONTINENTAL
- **Lokasi Venue**: Mizu Commonroom (2 Lantai: Lantai 1 Ground & Lantai 2 VIP Mezzanine)
- **Jadwal & Lineup Tema**:
  - **Night 1 (Day 1)**: Jumat, 30 Oktober 2026 (*Swear in Continental · Hip-Hop & Alternative Energy*)
  - **Night 2 (Day 2)**: Sabtu, 31 Oktober 2026 (*The Under-Vault · Techno & Industrial Sub-Bass*)
- **Total Meja di Database**:
  - **Lantai 1**: 36 Meja Fisik (4 Luxury Sofa, 10 Center Booth, 22 Standing Cocktail)
  - **Lantai 2**: 37 Meja Fisik (2 VVIP Center Sofa, 11 VIP Sofa, 6 Balcony Table, 8 High Stool, 10 Center Table)
  - **Total**: **73 Meja Fisik** $\times$ **2 Hari** = **146 Baris Data Aktif** di tabel `table_reservations`.
- **Nomor Kontak WhatsApp Concierge Resmi**:
  - **Admin Day 1 (Night 1)**: `+62 822-4155-5540`
  - **Admin Day 2 (Night 2)**: `+62 813-9060-6188`

---

## 🎟️ 2. Perbedaan Krusial: Tiket Festival vs Reservasi Meja

AI Agent **WAJIB memahami** perbedaan antara Tiket Reguler dan Reservasi Meja agar tidak membingungkan calon hadirin:

| Aspek | Tiket Festival (Artatix) | Reservasi Meja / Sofa (Supabase) |
|---|---|---|
| **Platform** | Artatix Ticketing Gateway | Database Supabase Live (Website / Bot) |
| **Kategori** | Early Bird (Sold Out), Presale, General Admission | Luxury Sofa, Center Booth, Cocktail Table, High Stool |
| **Akses Masuk** | Tiket per orang (per pax) | **Sudah Termasuk Free Admission** sesuai kapasitas pax meja |
| **Benefit Tambahan** | Hanya tiket masuk konser | Area tempat duduk privat, alokasi F&B / Spirit bottles, Butler VIP, akses tanpa antre |
| **Konsep Bayar** | Tiket satuan per kepala | **Minimum Spend** (100% nilai belanja dapat ditukar F&B di venue) |

> 💡 **PENTING UNTUK AI**: Jika tamu bertanya *"Kalau saya booking Sofa 8 pax, apakah teman-teman saya harus beli tiket lagi di Artatix?"*, jawaban AI adalah: **"TIDAK PERLU."** Reservasi sofa/meja sudah mencakup tiket masuk gratis (Complimentary Entry Pass) untuk seluruh kapasitas tamu meja tersebut.

---

## 🔑 3. Kredensial & Autentikasi API

AI Agent mengakses database menggunakan **Supabase REST API** dengan `anon_key` (Public Client Key).

| Parameter | Nilai Konfigurasi | Keterangan |
|---|---|---|
| **SUPABASE_URL** | `https://renghkmardohijraltsr.supabase.co` | Base URL Project Supabase |
| **SUPABASE_ANON_KEY** | *(Gunakan `VITE_SUPABASE_ANON_KEY` dari `.env`)* | Public client key dengan otorisasi RLS |
| **REST API Base** | `https://renghkmardohijraltsr.supabase.co/rest/v1` | Root endpoint query tabel |

### Header HTTP Wajib pada Setiap Request:
```http
apikey: <SUPABASE_ANON_KEY>
Authorization: Bearer <SUPABASE_ANON_KEY>
Content-Type: application/json
```

---

## 🗄️ 4. Skema Database & Kamus Data

### Tabel Utama: `public.table_reservations`

| Kolom | Tipe Data | Keterangan & Karakteristik | Contoh Nilai |
|---|---|---|---|
| `id` | `UUID` | Primary Key unik setiap baris reservasi | `a1b2c3d4-e5f6-...` |
| `spot_id` | `TEXT` | **ID UNIK GLOBAL** (Format: `f{floor}-{kode}`) | `'f1-sofa-1'`, `'f2-vvip-1'`, `'f2-t-5'` |
| `table_code` | `TEXT` | Kode fisik meja pada denah venue | `'SOFA 1'`, `'T-5'`, `'ST-6'`, `'M1'` |
| `floor` | `INT` | Lantai venue (`1` = Ground, `2` = VIP Mezzanine) | `1`, `2` |
| `day` | `TEXT` | Hari acara (`'day-1'` = Jumat 30 Okt, `'day-2'` = Sabtu 31 Okt) | `'day-1'`, `'day-2'` |
| `name` | `TEXT` | Nama deskriptif meja | `'Main Hall Luxury Sofa 1'` |
| `category` | `TEXT` | Kategori spot | `'sofa'`, `'vvip'`, `'vip'`, `'booth'`, `'cocktail'`, `'high_stool'`, `'mezzanine'` |
| `is_reserved` | `BOOLEAN` | **KOLOM UTAMA STATUS**: `true` = Terisi, `false` = Tersedia | `false` |
| `status` | `TEXT` | String status sinkron otomatis via database trigger | `'available'` / `'reserved'` |
| `reserved_by` | `TEXT` | Nama pemesan & nomor kontak | `'Bpk. Reyhan Pratama (081234567890)'` |
| `notes` | `TEXT` | Catatan pesanan tamu / asal booking | `'Booking via WhatsApp AI Bot'` |
| `updated_at` | `TIMESTAMPTZ` | Waktu update terakhir | `2026-10-12T18:00:00Z` |

> ⚠️ **ATURAN WAJIB UNTUK AI AGENT**:  
> Kode meja seperti `T-1` sampai `T-10` **ada di Lantai 1 DAN ada di Lantai 2**.
> - **Gunakan selalu `spot_id`** (contoh: `f1-t-1` vs `f2-t-1`) saat melakukan query atau pemesanan agar tidak pernah salah lantai.
> - Jika menggunakan `table_code`, **WAJIB menyertakan `floor` dan `day`** secara bersamaan.

---

## 📋 5. Katalog Inventaris Meja & Fasilitas Lengkap

### Lantai 1 — Ground & Stages (Energi Tinggi, Dekat Panggung & Dance Floor)
| Kode Meja | Spot ID | Kategori | Kapasitas | Min Spend Day 1 | Min Spend Day 2 | Benefit & Inclusions |
|---|---|---|---|---|---|---|
| **SOFA 1 s/d SOFA 4** | `f1-sofa-1` s/d `f1-sofa-4` | Sofa | 8 – 10 Pax | Rp 4.500.000 | Rp 5.000.000 | VIP Admission 8-10 Pax, 2 Spirit Bottles + 6 Mixers, Dedicated Butler, Fruit Platter |
| **T-1 s/d T-10** | `f1-t-1` s/d `f1-t-10` | Booth | 4 – 6 Pax | Rp 2.500.000 | Rp 2.800.000 | Entry Admission 4-6 Pax, Center Pit View, 1 Spirit Starter + Mixer |
| **ST-1 s/d ST-22** | `f1-st-1` s/d `f1-st-22` | Cocktail | 2 – 4 Pax | Rp 1.500.000 | Rp 1.800.000 | Entry Admission 4 Pax, High Standing Cocktail Table, Beer Bucket Starter |

### Lantai 2 — VIP Mezzanine & Lounge (Eksklusif, Elevated 4m, View Panorama)
| Kode Meja | Spot ID | Kategori | Kapasitas | Min Spend Day 1 | Min Spend Day 2 | Benefit & Inclusions |
|---|---|---|---|---|---|---|
| **VVIP 1, VVIP 2** | `f2-vvip-1`, `f2-vvip-2` | VVIP | 10 – 12 Pax | Rp 5.500.000 | Rp 6.000.000 | VVIP Mezzanine Prime Balcony, Panoramic Center Stage View, Dedicated Butler, Champagne/Spirit Package |
| **VIP 1 s/d VIP 7** | `f2-vip-1` s/d `f2-vip-7` | VIP | 6 – 8 Pax | Rp 3.500.000 | Rp 4.000.000 | Front Lounge Sofa Row, Pemandangan langsung ke main floor, Spirit Starter Pack |
| **VIP 8 s/d VIP 11** | `f2-vip-8` s/d `f2-vip-11` | VIP | 6 – 8 Pax | Rp 3.500.000 | Rp 4.000.000 | Upper Lounge Sofa Row, Area lebih privat & intimate |
| **M1 s/d M6** | `f2-m-1` s/d `f2-m-6` | Mezzanine | 4 – 6 Pax | Rp 2.000.000 | Rp 2.250.000 | Mezzanine Curved Railing Table, View langsung ke stage |
| **T-1 s/d T-10** | `f2-t-1` s/d `f2-t-10` | Cocktail | 4 – 6 Pax | Rp 2.500.000 | Rp 2.800.000 | Stage Front & Center Cocktail Tables Lantai 2 |
| **TS-1 s/d TS-8** | `f2-ts-1` s/d `f2-ts-8` | High Stool | 2 – 4 Pax | Rp 1.500.000 | Rp 1.750.000 | Private Alcove & Balcony High Stools |

---

## 📡 6. Standar REST API & Endpoint Eksekusi

### A. Cek Ketersediaan Meja yang Kosong (GET)

#### 1. Cek semua meja kosong di Lantai 1 pada Day 1:
```http
GET https://renghkmardohijraltsr.supabase.co/rest/v1/table_reservations?floor=eq.1&day=eq.day-1&is_reserved=eq.false&select=spot_id,table_code,name,category,min_spend,capacity
apikey: <SUPABASE_ANON_KEY>
Authorization: Bearer <SUPABASE_ANON_KEY>
```

#### 2. Cek semua sofa/VVIP yang masih kosong di Lantai 2 pada Day 2:
```http
GET https://renghkmardohijraltsr.supabase.co/rest/v1/table_reservations?floor=eq.2&day=eq.day-2&category=in.(vvip,vip)&is_reserved=eq.false&select=spot_id,table_code,name,min_spend,capacity
apikey: <SUPABASE_ANON_KEY>
Authorization: Bearer <SUPABASE_ANON_KEY>
```

#### 3. Cek status meja spesifik (Contoh: VVIP 1 di Lantai 2 pada Day 1):
```http
GET https://renghkmardohijraltsr.supabase.co/rest/v1/table_reservations?spot_id=eq.f2-vvip-1&day=eq.day-1&select=*
apikey: <SUPABASE_ANON_KEY>
Authorization: Bearer <SUPABASE_ANON_KEY>
```

---

### B. Mengunci / Memesan Meja (PATCH)

Ketika tamu mengonfirmasi booking, kirim HTTP **PATCH**:

```http
PATCH https://renghkmardohijraltsr.supabase.co/rest/v1/table_reservations?spot_id=eq.f2-vvip-1&day=eq.day-1
apikey: <SUPABASE_ANON_KEY>
Authorization: Bearer <SUPABASE_ANON_KEY>
Prefer: return=representation
Content-Type: application/json

{
  "is_reserved": true,
  "reserved_by": "Bpk. Reyhan Pratama (081234567890)",
  "notes": "Booking confirmed via AI WhatsApp Bot"
}
```

**Hasil Otomatis di Sistem:**
1. Pin meja pada denah website seketika berubah warna menjadi **Merah (Terisi)** secara live.
2. Kolom `status` otomatis sinkron menjadi `'reserved'`.
3. Perubahan tercatat di tabel `table_reservation_logs`.

---

### C. Membatalkan Reservasi / Reset Meja Jadi Tersedia (PATCH)

```http
PATCH https://renghkmardohijraltsr.supabase.co/rest/v1/table_reservations?spot_id=eq.f2-vvip-1&day=eq.day-1
apikey: <SUPABASE_ANON_KEY>
Authorization: Bearer <SUPABASE_ANON_KEY>
Prefer: return=representation
Content-Type: application/json

{
  "is_reserved": false,
  "reserved_by": null,
  "notes": "Booking dibatalkan / dilepas oleh AI Agent"
}
```

---

### D. Menggunakan RPC Stored Procedure (`set_table_reservation`)

Alternatif pemanggilan lewat stored procedure database:

```http
POST https://renghkmardohijraltsr.supabase.co/rest/v1/rpc/set_table_reservation
apikey: <SUPABASE_ANON_KEY>
Authorization: Bearer <SUPABASE_ANON_KEY>
Content-Type: application/json

{
  "p_table_code": "VVIP 1",
  "p_floor": 2,
  "p_day": "day-1",
  "p_is_reserved": true,
  "p_reserved_by": "Bpk. Daniel Santoso (081987654321)",
  "p_notes": "Booking via RPC Concierge"
}
```

---

## 🛠️ 7. Tool Definitions / Function Calling (OpenAI & Claude Ready)

Daftarkan 2 fungsi berikut ke deklarasi tools agent AI Anda:

```json
[
  {
    "type": "function",
    "function": {
      "name": "check_table_availability",
      "description": "Mengecek ketersediaan meja atau sofa party di venue The State of Clamour berdasarkan hari acara, lantai, dan kategori.",
      "parameters": {
        "type": "object",
        "properties": {
          "day": {
            "type": "string",
            "enum": ["day-1", "day-2"],
            "description": "Hari acara: 'day-1' untuk Jumat 30 Okt (Night 1), 'day-2' untuk Sabtu 31 Okt (Night 2)"
          },
          "floor": {
            "type": "integer",
            "enum": [1, 2],
            "description": "Lantai venue: 1 untuk Ground & Stages, 2 untuk VIP Mezzanine & Balcony"
          },
          "category": {
            "type": "string",
            "enum": ["all", "sofa", "vvip", "vip", "booth", "cocktail", "high_stool", "mezzanine"],
            "description": "Kategori meja yang ingin dicek. Default 'all'."
          }
        },
        "required": ["day", "floor"]
      }
    }
  },
  {
    "type": "function",
    "function": {
      "name": "book_table",
      "description": "Mengunci pemesanan meja di Supabase setelah tamu memberikan nama dan kontak konfirmasi.",
      "parameters": {
        "type": "object",
        "properties": {
          "spot_id": {
            "type": "string",
            "description": "ID unik meja (contoh: 'f1-sofa-1', 'f2-vvip-1', 'f1-st-5', 'f2-t-3')"
          },
          "day": {
            "type": "string",
            "enum": ["day-1", "day-2"],
            "description": "Hari acara yang dipesan"
          },
          "customer_name": {
            "type": "string",
            "description": "Nama lengkap pemesan beserta nomor WhatsApp/telepon"
          },
          "notes": {
            "type": "string",
            "description": "Catatan khusus pesanan atau preferensi tamu"
          }
        },
        "required": ["spot_id", "day", "customer_name"]
      }
    }
  }
]
```

---

## 🤖 8. SOP Interaksi Percakapan & State Machine Bot

Agar pengalaman tamu terasa eksklusif dan konversi tinggi, AI Agent harus mengikuti 5 langkah alur percakapan ini:

```
[Tahap 1: Greeting & Kualifikasi]
       │
       ▼
  "Selamat datang di The State of Clamour Concierge! 
   Boleh kami tahu, kakak berencana hadir di:
   - Night 1 (Jumat, 30 Okt) atau Night 2 (Sabtu, 31 Okt)?
   Serta berapa jumlah rekan/pax yang ikut?"
       │
       ▼
[Tahap 2: Rekomendasi Meja Sesuai Kapasitas]
   • 8 – 12 Pax  ➜ Rekomendasikan VVIP Mezzanine / Luxury Sofa
   • 4 – 6 Pax   ➜ Rekomendasikan Center Booth / Mezzanine Balcony Table
   • 2 – 4 Pax   ➜ Rekomendasikan Standing Cocktail / High Stool
       │
       ▼
[Tahap 3: Cek Ketersediaan Live ke Supabase]
   Jalankan tool `check_table_availability`
   • Jika KOSONG: Informasikan kode meja, harga min spend, & benefit inclusions.
   • Jika SUDAH TERISI: Sarankan meja alternatif terdekat yang masih available.
       │
       ▼
[Tahap 4: Permintaan Data & Eksekusi Locking]
   Minta: Nama Lengkap & No WhatsApp aktif.
   Jalankan tool `book_table` untuk mengunci meja secara real-time.
       │
       ▼
[Tahap 5: Konfirmasi Booking & Handover ke Admin]
   Kirimkan format rekapitulasi booking dan tautan WhatsApp admin resmi.
```

### Format Rekapitulasi Akhir untuk Tamu:
```text
✨ RESERVASI BERHASIL DIKUNCI ✨
• Acara: The State of Clamour: Swear in Continental
• Jadwal: [Night 1 (30 Okt 2026) / Night 2 (31 Okt 2026)]
• Meja: [Nama Meja & Kode, misal: VVIP Royal Center Sofa 1 (f2-vvip-1)]
• Lokasi: [Lantai 1 Ground / Lantai 2 VIP Mezzanine]
• Kapasitas: [X] Pax (Free Entry Pass Included)
• Minimum Spend: [Rp X.XXX.XXX]
• Atas Nama: [Nama Tamu] ([No WA])

Langkah Selanjutnya:
Silakan klik tautan resmi Concierge berikut untuk konfirmasi pembayaran DP:
👉 https://wa.me/6282241555540?text=Halo%20Admin%20Day%201,%20saya%20sudah%20reservasi%20meja%20[KODE_MEJA]
```

---

## 💻 9. Contoh Implementasi Kode (Python & JavaScript)

### A. Python (`requests`)
```python
import requests

SUPABASE_URL = "https://renghkmardohijraltsr.supabase.co"
SUPABASE_KEY = "YOUR_SUPABASE_ANON_KEY"

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

def check_table_availability(day: str, floor: int, category: str = "all"):
    url = f"{SUPABASE_URL}/rest/v1/table_reservations"
    params = {
        "day": f"eq.{day}",
        "floor": f"eq.{floor}",
        "is_reserved": "eq.false",
        "select": "spot_id,table_code,name,category,capacity,min_spend"
    }
    if category != "all":
        params["category"] = f"eq.{category}"
        
    res = requests.get(url, headers=HEADERS, params=params)
    return res.json()

def book_table(spot_id: str, day: str, customer_name: str, notes: str = ""):
    url = f"{SUPABASE_URL}/rest/v1/table_reservations"
    params = {
        "spot_id": f"eq.{spot_id}",
        "day": f"eq.{day}"
    }
    payload = {
        "is_reserved": True,
        "reserved_by": customer_name,
        "notes": notes
    }
    res = requests.patch(url, headers=HEADERS, params=params, json=payload)
    return res.status_code in (200, 204)
```

### B. JavaScript / Node.js (`@supabase/supabase-js`)
```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://renghkmardohijraltsr.supabase.co',
  process.env.SUPABASE_ANON_KEY
);

// 1. Cek meja yang tersedia
export async function checkAvailableTables(day, floor, category = 'all') {
  let query = supabase
    .from('table_reservations')
    .select('spot_id, table_code, name, category, capacity, min_spend')
    .eq('day', day)
    .eq('floor', floor)
    .eq('is_reserved', false);

  if (category !== 'all') {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// 2. Kunci pemesanan meja
export async function bookTable(spotId, day, customerName, notes = '') {
  const { data, error } = await supabase
    .from('table_reservations')
    .update({
      is_reserved: true,
      reserved_by: customerName,
      notes: notes
    })
    .eq('spot_id', spotId)
    .eq('day', day);

  if (error) throw error;
  return { success: true, message: `Meja ${spotId} berhasil dipesan untuk ${customerName}` };
}
```

---

## ❓ 10. FAQ Penanganan Tamu & Solusi Edge Cases

### Q1: "Apa maksud Minimum Spend?"
**Jawaban AI**: *"Minimum spend adalah nominal pembelanjaan minimal di meja kakak. 100% dari nilai tersebut dapat digunakan untuk memesan makanan, minuman, mocktail, cocktail, maupun premium spirit bottles di bar venue."*

### Q2: "Apakah kami perlu beli tiket konser lagi jika sudah pesan meja?"
**Jawaban AI**: *"Tidak perlu, Kak! Seluruh reservasi meja sudah mencakup tiket masuk gratis (Complimentary Passes) sesuai kapasitas meja yang dipesan."*

### Q3: "Bisa tambah orang (extra pax) dari kapasitas meja?"
**Jawaban AI**: *"Kapasitas meja dirancang demi kenyamanan dan standar keselamatan venue. Untuk penambahan tamu, disarankan memesan Standing Cocktail Table tambahan terdekat, atau kakak bisa menghubungi Concierge Manager via WhatsApp untuk pengaturan khusus."*

### Q4: "Apa bedanya Lantai 1 dan Lantai 2?"
**Jawaban AI**: 
- **Lantai 1 (Ground)**: Berada tepat di sekeliling dance floor dan dekat panggung. Sangat cocok bagi hadirin yang ingin merasakan getaran dentuman musik maksimal dan crowd party aktif.
- **Lantai 2 (VIP Mezzanine)**: Elevasi 4 meter di atas main floor dengan pemandangan panggung panorama yang luas, area lounge lebih privat, serta pelayanan butler VIP.

---

## 🧠 11. Ready-to-Paste System Prompt Chatbot AI

Salin teks berikut langsung ke kolom **System Prompt** AI Chatbot Anda (OpenAI GPT, Claude, n8n, Flowise, atau bot WhatsApp):

```text
Kamu adalah Concierge Resmi "The State of Clamour: Swear in Continental", sebuah festival musik rave, hip-hop, dan techno spektakuler di Mizu Commonroom pada 30-31 Oktober 2026.

PERILAKU & GAYA BICARA:
- Bersikap ramah, berkelas, elegan, berwawasan musik malam, dan solutif.
- Gunakan sapaan hangat seperti "Kakak" atau "Bapak/Ibu".

PENGETAHUAN ACARA:
- Lokasi: Mizu Commonroom (Lantai 1 Ground & Lantai 2 VIP Mezzanine).
- Night 1 (Jumat, 30 Okt 2026): Swear in Continental (Hip-Hop & Alternative Energy). Admin WA: +62 822-4155-5540.
- Night 2 (Sabtu, 31 Okt 2026): The Under-Vault (Techno & Industrial Sub-Bass). Admin WA: +62 813-9060-6188.
- Tiket festival biasa dijual di Artatix (Early bird sudah Sold Out).
- Tamu yang memesan MEJA/SOFA TIDAK PERLU beli tiket lagi, karena sudah include akses masuk gratis sesuai kapasitas meja.
- Nilai Minimum Spend 100% dipotongkan untuk pemesanan botol/minuman/makanan di venue.

ATURAN EKSEKUSI DATABASE:
1. Sebelum merekomendasikan atau mengonfirmasi meja, SELALU jalankan tool `check_table_availability` untuk memastikan `is_reserved: false`.
2. JANGAN PERNAH menjanjikan meja yang sudah `is_reserved: true`. Berikan alternatif terdekat.
3. Selalu perhatikan lantai: kode meja seperti T-1 s/d T-10 ada di Lantai 1 DAN Lantai 2. Selalu gunakan `spot_id` (seperti 'f1-t-1' vs 'f2-t-1') agar tidak salah lantai.
4. Ketika tamu sepakat memesan, tanyakan Nama Lengkap dan Nomor WhatsApp, lalu panggil tool `book_table` untuk mengunci meja.
5. Setelah sukses, berikan rekapitulasi data pesanan beserta tautan WhatsApp admin hari tersebut untuk pembayaran DP.
```
