# 🤖 Panduan Integrasi AI Agent & WhatsApp Bot (The State of Clamour)
> **Versi Dokumen**: 3.0.0 (Dual-Venue Day 1/2 Live Sync & Hermes Intake Protocol)  
> **Target Pengguna**: Hermes AI, Bot Developers, AI Agent Frameworks (LangChain, n8n, Flowise, OpenAI Assistant, Claude Tool-Use, Baileys/Wppconnect), & Tim Admin Reservasi.

Dokumen ini adalah **spesifikasi teknis, SOP operasional, dan panduan integrasi database Supabase** untuk AI Agent (Hermes / WhatsApp Concierge Bot) festival musik **The State of Clamour: Swear in Continental**.

---

## 📑 Daftar Isi
1. [Identitas Sistem & Ringkasan Acara](#1-identitas-sistem--ringkasan-acara)
2. [Konsep Krusial: Tiket Festival vs Booking Fee vs Min Charge](#2-konsep-krusial-tiket-festival-vs-booking-fee-vs-min-charge)
3. [Peran AI Hermes: Pengumpul Informasi & Protokol Wajib Bertanya](#3-peran-ai-hermes-pengumpul-informasi--protokol-wajib-bertanya)
4. [Kredensial & Konfigurasi .env](#4-kredensial--konfigurasi-env)
5. [Skema Database & Kamus Data](#5-skema-database--kamus-data)
6. [Katalog Resmi Inventaris Meja, Harga & Tiket Komplementer](#6-katalog-resmi-inventaris-meja-harga--tiket-komplementer)
7. [Rekening Resmi Transfer Bank BCA & Kontak Admin](#7-rekening-resmi-transfer-bank-bca--kontak-admin)
8. [Standar REST API & Endpoint Eksekusi Database](#8-standar-rest-api--endpoint-eksekusi-database)
9. [Tool Definitions / Function Calling untuk AI Agent](#9-tool-definitions--function-calling-untuk-ai-agent)
10. [Contoh Implementasi Kode (Node.js & Python)](#10-contoh-implementasi-kode-nodejs--python)
11. [SOP Percakapan & Ready-to-Paste System Prompt Hermes](#11-sop-percakapan--ready-to-paste-system-prompt-hermes)

---

## 🏛️ 1. Identitas Sistem & Ringkasan Acara

- **Nama Acara**: THE STATE OF CLAMOUR: SWEAR IN CONTINENTAL
- **Tanggal & Penamaan Hari**:
  - **Day 1**: Jumat, 30 Oktober 2026 (*Swear in Continental*)
  - **Day 2**: Sabtu, 31 Oktober 2026 (*The Under-Vault*)
- **Dua Venue Utama (Dual-Venue Concept)**:
  - **Lantai 1 — TETRA SOLO**: Area Main Stage, Hall, 360° Line-Array Sound System, Pit Festival & Energik.
  - **Lantai 2 — MIZU COMMONROOM**: Area VIP & VVIP Mezzanine Lounge, Private Bar, Elevated Stage View, Luxury Atmosphere.
  *(Seluruh pemegang tiket dan reservasi meja mendapatkan **akses bebas ke kedua venue** sepanjang malam).*
- **Total Meja di Database (`public.table_reservations`)**:
  - **Lantai 1 (Tetra Solo)**: 36 Meja Fisik (4 Sofa, 10 Table T1–T10, 2 Table T11–T12, 18 Small Table ST1–ST10 & ST13–ST20, 2 Small Table Smoking ST11–ST12)
  - **Lantai 2 (Mizu Commonroom)**: 37 Meja Fisik (2 VVIP Royal, 11 VIP Lounge, 6 Mezzanine Balcony M1–M6, 8 Table Sofa TS1–TS8, 10 Table T1–T10)
  - **Total**: **73 Meja Fisik** $\times$ **2 Hari** = **146 Baris Data** di database live.
- **Kontak Admin WhatsApp Resmi**:
  - **Admin Day 1**: `+62 881-0800-20231` (wa.me/62881080020231)
  - **Admin Day 2**: `+62 881-0800-20332` (wa.me/62881080020332)

---

## 🎟️ 2. Konsep Krusial: Tiket Festival vs Booking Fee vs Min Charge

AI Hermes **WAJIB memahami** aturan finansial dan operasional berikut agar informasi kepada tamu 100% akurat:

| Komponen | Penjelasan & Ketentuan | Sifat Finansial |
|---|---|---|
| **Tiket Masuk Reguler (Artatix)** | Tiket per orang untuk penonton festival reguler tanpa reservasi meja. | Dijual online via Artatix (Early Bird, Presale, GA). |
| **Booking Fee (BF)** | Biaya komitmen untuk **mengunci nomor meja** dari antrean publik. **SUDAH TERMASUK Tiket Komplementer (Complimentary Tickets)** sesuai kapasitas meja (2, 3, atau 4 tiket). | **Non-Refundable** dan **TIDAK MEMOTONG** Minimum Charge. Ditransfer ke BCA M. Ferdian Wahyu. |
| **Minimum Charge (Min. Spend)** | Nilai pembelanjaan minimal F&B / minuman botol di meja Anda. | Dipenuhi saat acara berlangsung melalui pesanan menu bar & food di lokasi. |

> 💡 **JAWABAN AI JIKA TAMU BERTANYA**:
> - *"Kalau saya pesan meja, teman saya harus beli tiket lagi di Artatix?"*  
>   👉 **"Tidak perlu, Kak! Setiap reservasi meja sudah otomatis mendapatkan tiket komplementer sesuai kuota kapasitas meja."**
> - *"Apakah Booking Fee memotong Minimum Charge?"*  
>   👉 **"Booking Fee tidak memotong Minimum Charge. Minimum Charge diselesaikan terpisah saat memesan F&B di lokasi acara."**
> - *"Bisa refund Booking Fee kalau batal?"*  
>   👉 **"Booking Fee bersifat non-refundable (tidak dapat dikembalikan) karena meja langsung dikunci eksklusif untuk rombongan Kakak."**

---

## 🎯 3. Peran AI Hermes: Pengumpul Informasi & Protokol Wajib Bertanya

AI Hermes bertindak sebagai **Lead Intake Qualifier & Information Collector (Pengumpul Informasi & Kualifikasi Reservasi)**.

### 🛑 Aturan Emas (The Golden Rule):
> **JIKA INFORMASI YANG DISUBMIT / DITANYAKAN OLEH TAMU BELUM LENGKAP ATAU KURANG JELAS, HERMES WAJIB BERTANYA KEMBALI KEPADA TAMU SECARA PROAKTIF.**  
> **HERMES DILARANG KERAS MENEBAK ATAU MEMBUAT ASUMSI SENDIRI.**

### 📋 Checklist 5 Data Wajib Sebelum Mengunci Meja:
1. **Hari Acara**: Day 1 (Jumat, 30 Okt) atau Day 2 (Sabtu, 31 Okt).
2. **Venue & Lantai**: Tetra Solo (Lantai 1) atau Mizu Commonroom (Lantai 2).
3. **Kapasitas Pax / Jenis Meja**: Berapa orang yang hadir (4 PAX, 6 PAX, 8 PAX, atau lebih).
4. **Nama Lengkap Pemesan**: Nama yang sah (bukan anonim / inisial).
5. **Nomor WhatsApp Aktif**: Untuk verifikasi admin dan pengiriman tiket.

---

### 🔍 Matriks Klarifikasi Otomatis (Inquiry Matrix):

| Pesan Awal dari Tamu | Kesalahan Asumsi (JANGAN LAKUKAN!) | Tindakan Wajib Hermes | Contoh Respons Klarifikasi Hermes |
|---|---|---|---|
| *"Halo mau booking meja dong"* | Langsung sebut sembarang meja | **WAJIB TANYA** hari acara dan jumlah orang | *"Halo! Tentu, kami siap bantu. Boleh tahu Kakak ingin hadir di **Day 1 (Jumat, 30 Okt)** atau **Day 2 (Sabtu, 31 Okt)**, dan ada berapa orang yang akan ikut?"* |
| *"Ada sofa kosong gak?"* | Langsung cek Lantai 1 Day 1 | **WAJIB TANYA** hari acara dan pilihan venue | *"Sofa kami tersedia di **Tetra Solo (Lantai 1)** dan **Mizu Commonroom (Lantai 2)**. Kakak berencana hadir di **Day 1** atau **Day 2**, dan lebih tertarik di venue yang mana?"* |
| *"Mau pesan meja T-1"* (Tanpa sebut lantai) | Langsung booking `f1-t-1` (Fatal! T-1 ada di Lt 1 dan Lt 2) | **WAJIB TANYA** lantai/venue dan hari | *"Meja T-1 ada di dua lokasi: **Tetra Solo (Lantai 1)** dan **Mizu Commonroom (Lantai 2)**. Kakak ingin di lantai berapa dan untuk **Day 1** atau **Day 2**?"* |
| Tamu pilih meja, belum beri nama | Langsung update database | **WAJIB MINTA** Nama Lengkap & No WhatsApp | *"Baik Kak, meja [Kode Meja] masih tersedia! Untuk mengunci spot ini di sistem, boleh kami minta **Nama Lengkap** dan **Nomor WhatsApp aktif** Kakak?"* |
| Tamu 12 orang ingin pesan 1 sofa (6 PAX) | Mengiyakan tanpa solusi | **WAJIB JELASKAN** kapasitas dan tawarkan kombinasi | *"Kapasitas Sofa kami adalah 6 PAX demi kenyamanan. Untuk rombongan 12 orang, kami sarankan mengambil 2 Sofa berdampingan atau 1 Sofa + Meja Cocktail terdekat. Apakah berkenan kami siapkan kombinasi tersebut?"* |

---

## 🔑 4. Kredensial & Konfigurasi .env

Hermes dapat membaca konfigurasi langsung dari file `.env`:

```env
# SUPABASE CONFIGURATION
VITE_SUPABASE_URL=https://renghkmardohijraltsr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlbmdoa21hcmRvaGlqcmFsdHNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3MzEwMDcsImV4cCI6MjEwNzMwNzAwN30.hZc8RPLK9zVEJ5HI7uwvh2M1foaZzzYLlXa0N-GPnlc
VITE_SUPABASE_TABLE_NAME=table_reservations
```

### HTTP Headers Wajib:
```http
apikey: <VITE_SUPABASE_ANON_KEY>
Authorization: Bearer <VITE_SUPABASE_ANON_KEY>
Content-Type: application/json
```

---

## 🗄️ 5. Skema Database & Kamus Data

Tabel: `public.table_reservations`

| Kolom | Tipe Data | Keterangan & Aturan | Contoh Nilai |
|---|---|---|---|
| `id` | `UUID` | Primary Key unik baris | `a1b2c3d4-e5f6-...` |
| `spot_id` | `TEXT` | **ID UNIK GLOBAL** (Format: `f{floor}-{kode}`) | `'f1-sofa-1'`, `'f2-vvip-1'`, `'f2-t-10'` |
| `table_code` | `TEXT` | Kode meja pada denah fisik | `'SOFA 1'`, `'T-10'`, `'VIP 2'`, `'M1'` |
| `floor` | `INT` | Lantai venue (`1` = Tetra Solo, `2` = Mizu Commonroom) | `1`, `2` |
| `day` | `TEXT` | Hari acara (`'day-1'` atau `'day-2'`) | `'day-1'`, `'day-2'` |
| `name` | `TEXT` | Nama deskriptif meja | `'VVIP Royal Center Sofa 1'` |
| `category` | `TEXT` | Kategori spot | `'sofa'`, `'vvip'`, `'vip'`, `'booth'`, `'cocktail'`, `'high_stool'`, `'mezzanine'` |
| `is_reserved` | `BOOLEAN` | **KOLOM STATUS UTAMA**: `true` = Terisi, `false` = Tersedia | `false` |
| `status` | `TEXT` | Status string ('available' / 'reserved') | `'available'`, `'reserved'` |
| `reserved_by` | `TEXT` | Nama pemesan & nomor kontak | `'Veronica Lidia (081234567890)'` |
| `notes` | `TEXT` | Catatan pesanan dari bot / admin | `'Reserved via Hermes AI'` |
| `updated_at` | `TIMESTAMPTZ` | Timestamp perubahan terakhir | `2026-10-13T00:47:00Z` |

> ⚠️ **PENTING**: Kode meja `T-1` sampai `T-10` terdapat di **Lantai 1 DAN Lantai 2**.  
> Selalu gunakan `spot_id` (misal: `f1-t-10` vs `f2-t-10`) atau kombinasi `table_code + floor + day` saat query!

---

## 📋 6. Katalog Resmi Inventaris Meja, Harga & Tiket Komplementer

*(Sesuai dokumen resmi `FAQ - SIC.pdf`)*

### A. Lantai 1 — TETRA SOLO (Hall Utama, Panggung Monumental)
| Kategori Meja | Kode Meja | Spot ID | Kapasitas | Min. Charge | Booking Fee | Tiket Komplementer |
|---|---|---|---|---|---|---|
| **Small Table** | ST-1 s/d ST-10, ST-13 s/d ST-22 | `f1-st-*` | 4 PAX | Rp 1.500.000 | Rp 200.000 | 2 Tiket Masuk |
| **Small Table Smoking** | ST-11, ST-12 | `f1-st-11`, `f1-st-12` | 4 PAX | Rp 2.500.000 | Rp 200.000 | 2 Tiket Masuk |
| **Table** | T-1 s/d T-10 | `f1-t-1` s/d `f1-t-10` | 4 PAX | Rp 2.000.000 | Rp 200.000 | 2 Tiket Masuk |
| **Table (Prime Pit)** | T-11, T-12 | `f1-t-11`, `f1-t-12` | 4 PAX | Rp 3.000.000 | Rp 200.000 | 2 Tiket Masuk |
| **Sofa** | SOFA 1 s/d SOFA 4 | `f1-sofa-1` s/d `f1-sofa-4` | 6 PAX | Rp 3.000.000 | Rp 300.000 | 3 Tiket Masuk |

### B. Lantai 2 — MIZU COMMONROOM (VIP Mezzanine Lounge)
| Kategori Meja | Kode Meja | Spot ID | Kapasitas | Min. Charge | Booking Fee | Tiket Komplementer |
|---|---|---|---|---|---|---|
| **VVIP Royal** | VVIP 1, VVIP 2 | `f2-vvip-1`, `f2-vvip-2` | 8 PAX | Rp 9.000.000 | Rp 500.000 | 4 Tiket Masuk |
| **VIP Lounge** | VIP 1 s/d VIP 11 | `f2-vip-1` s/d `f2-vip-11` | 6 PAX | Rp 6.000.000 | Rp 500.000 | 3 Tiket Masuk |
| **Mezzanine Balcony** | M1 s/d M6 | `f2-m-1` s/d `f2-m-6` | 6 PAX | Rp 5.500.000 | Rp 500.000 | 3 Tiket Masuk |
| **Table Sofa** | TS-1 s/d TS-8 | `f2-ts-1` s/d `f2-ts-8` | 4 PAX | Rp 4.000.000 | Rp 400.000 | 2 Tiket Masuk |
| **Table** | T-1 s/d T-10 | `f2-t-1` s/d `f2-t-10` | 4 PAX | Rp 2.500.000 | Rp 250.000 | 2 Tiket Masuk |

---

## 💳 7. Rekening Resmi Transfer Bank BCA & Kontak Admin

Untuk menghindari penipuan, Hermes **hanya boleh memberikan rekening berikut**:

1. **Rekening Transfer Booking Fee**:
   - Bank: **BCA**
   - Nomor Rekening: **`0374541630`**
   - Atas Nama: **M. Ferdian Wahyu**

2. **Rekening Transfer Down Payment**:
   - Bank: **BCA**
   - Nomor Rekening: **`0373791196`**
   - Atas Nama: **Bagus Dwi Setyawan**

3. **Kontak Konfirmasi WhatsApp Admin**:
   - **Admin Day 1**: `+62 881-0800-20231` (wa.me/62881080020231)
   - **Admin Day 2**: `+62 881-0800-20332` (wa.me/62881080020332)

---

## 📡 8. Standar REST API & Endpoint Eksekusi Database

### A. Cek Ketersediaan Meja yang Kosong (GET)
```http
GET https://renghkmardohijraltsr.supabase.co/rest/v1/table_reservations?floor=eq.2&day=eq.day-2&is_reserved=eq.false&select=spot_id,table_code,name,category
apikey: <VITE_SUPABASE_ANON_KEY>
Authorization: Bearer <VITE_SUPABASE_ANON_KEY>
```

### B. Mengunci Meja / Menandai Reserved (PATCH)
```http
PATCH https://renghkmardohijraltsr.supabase.co/rest/v1/table_reservations?spot_id=eq.f2-t-10&day=eq.day-2
apikey: <VITE_SUPABASE_ANON_KEY>
Authorization: Bearer <VITE_SUPABASE_ANON_KEY>
Prefer: return=representation
Content-Type: application/json

{
  "is_reserved": true,
  "status": "reserved",
  "reserved_by": "Veronica Lidia (081234567890)",
  "notes": "Reserved via Hermes AI"
}
```

### C. Membuka Kembali / Batal (PATCH)
```http
PATCH https://renghkmardohijraltsr.supabase.co/rest/v1/table_reservations?spot_id=eq.f2-t-10&day=eq.day-2
apikey: <VITE_SUPABASE_ANON_KEY>
Authorization: Bearer <VITE_SUPABASE_ANON_KEY>
Prefer: return=representation
Content-Type: application/json

{
  "is_reserved": false,
  "status": "available",
  "reserved_by": null,
  "notes": "Cancelled by admin"
}
```

---

## 🛠️ 9. Tool Definitions / Function Calling untuk AI Agent

Daftarkan 2 fungsi ini pada runtime Hermes:

```json
[
  {
    "name": "check_table_availability",
    "description": "Cek ketersediaan meja kosong di The State of Clamour berdasarkan hari acara dan lantai.",
    "parameters": {
      "type": "object",
      "properties": {
        "day": {
          "type": "string",
          "enum": ["day-1", "day-2"],
          "description": "Hari acara: 'day-1' (Jumat 30 Okt) atau 'day-2' (Sabtu 31 Okt)"
        },
        "floor": {
          "type": "integer",
          "enum": [1, 2],
          "description": "Lantai venue: 1 untuk Tetra Solo (Hall & Stages), 2 untuk Mizu Commonroom (VIP Mezzanine)"
        },
        "category": {
          "type": "string",
          "enum": ["all", "vvip", "vip", "sofa", "mezzanine", "high_stool", "cocktail", "booth"],
          "description": "Kategori meja yang ingin dicek (default 'all')"
        }
      },
      "required": ["day", "floor"]
    }
  },
  {
    "name": "book_table",
    "description": "Kunci meja di database Supabase setelah data tamu (nama & WhatsApp) terkumpul lengkap.",
    "parameters": {
      "type": "object",
      "properties": {
        "spot_id": {
          "type": "string",
          "description": "ID unik meja (misal: 'f2-vip-2', 'f2-t-10', 'f1-sofa-1')"
        },
        "day": {
          "type": "string",
          "enum": ["day-1", "day-2"],
          "description": "Hari acara yang dipesan"
        },
        "customer_name": {
          "type": "string",
          "description": "Nama lengkap pemesan beserta nomor WhatsApp"
        },
        "notes": {
          "type": "string",
          "description": "Catatan tambahan atau referensi booking"
        }
      },
      "required": ["spot_id", "day", "customer_name"]
    }
  }
]
```

---

## 💻 10. Contoh Implementasi Kode (Node.js & Python)

### A. Node.js (`@supabase/supabase-js`)
```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// 1. Cek meja yang masih tersedia
export async function checkAvailableTables(day, floor, category = 'all') {
  let query = supabase
    .from('table_reservations')
    .select('spot_id, table_code, name, category, floor, is_reserved')
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
export async function bookTable(spotId, day, customerName, notes = 'Reserved via Hermes AI') {
  const { data, error } = await supabase
    .from('table_reservations')
    .update({
      is_reserved: true,
      status: 'reserved',
      reserved_by: customerName,
      notes: notes,
      updated_at: new Date().toISOString()
    })
    .eq('spot_id', spotId)
    .eq('day', day)
    .select();

  if (error) throw error;
  return data[0];
}
```

### B. Python (`requests`)
```python
import os
import requests

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

def check_available_tables(day: str, floor: int, category: str = "all"):
    url = f"{SUPABASE_URL}/rest/v1/table_reservations"
    params = {
        "day": f"eq.{day}",
        "floor": f"eq.{floor}",
        "is_reserved": "eq.false",
        "select": "spot_id,table_code,name,category,floor"
    }
    if category != "all":
        params["category"] = f"eq.{category}"
    res = requests.get(url, headers=HEADERS, params=params)
    return res.json()

def book_table(spot_id: str, day: str, customer_name: str, notes: str = "Reserved via Hermes AI"):
    url = f"{SUPABASE_URL}/rest/v1/table_reservations"
    params = {
        "spot_id": f"eq.{spot_id}",
        "day": f"eq.{day}"
    }
    payload = {
        "is_reserved": True,
        "status": "reserved",
        "reserved_by": customer_name,
        "notes": notes
    }
    res = requests.patch(url, headers=HEADERS, params=params, json=payload)
    return res.status_code in (200, 204)
```

---

## 🤖 11. SOP Percakapan & Ready-to-Paste System Prompt Hermes

Salin instruksi ini langsung ke konfigurasi System Prompt Hermes AI:

```text
Kamu adalah Hermes, Concierge Resmi "The State of Clamour: Swear in Continental" (30-31 Oktober 2026).

PERAN UTAMA: PENGUMPUL INFORMASI & KUALIFIKASI RESERVASI MEJA
Tugas utamamu adalah mengumpulkan data reservasi tamu secara lengkap dan mengeksekusi penguncian meja di database Supabase.

ATURAN EMAS:
JIKA INFORMASI YANG DIBERIKAN OLEH TAMU KURANG LENGKAP ATAU KURANG JELAS, KAMU WAJIB BERTANYA KEMBALI KEPADA TAMU SECARA PROAKTIF. DILARANG MENEBAK ATAU MEMBUAT ASUMSI SENDIRI.

DATA WAJIB YANG HARUS DIKUMPULKAN LENGKAP:
1. Hari Acara: Day 1 (Jumat, 30 Okt) atau Day 2 (Sabtu, 31 Okt).
2. Lokasi Venue: Tetra Solo (Lantai 1 - Hall Utama) atau Mizu Commonroom (Lantai 2 - VIP Mezzanine).
3. Kapasitas Pax: Berapa orang yang hadir (4 PAX, 6 PAX, 8 PAX).
4. Identitas Pemesan: Nama Lengkap dan Nomor WhatsApp aktif.

PENGETAHUAN FINANSIAL & OPERASIONAL RESMI:
- Reservasi meja SUDAH TERMASUK Tiket Komplementer (Free Entry) sesuai kapasitas meja. Tamu tidak perlu beli tiket Artatix lagi.
- Booking Fee bertujuan mengunci meja dan bersifat Non-Refundable. Booking Fee TIDAK memotong Minimum Charge.
- Minimum Charge dipenuhi langsung di lokasi acara melalui order F&B/botol.
- Rekening Transfer Booking Fee: BCA 0374541630 a/n M. Ferdian Wahyu.
- Rekening Transfer Down Payment: BCA 0373791196 a/n Bagus Dwi Setyawan.
- Kontak Admin Day 1: +62 881-0800-20231 (wa.me/62881080020231).
- Kontak Admin Day 2: +62 881-0800-20332 (wa.me/62881080020332).

SOP EKSEKUSI DATABASE:
1. Sebelum merekomendasikan meja, pastikan hari acara dan kapasitas orang sudah jelas.
2. Panggil tool `check_table_availability` untuk memastikan meja berstatus `is_reserved: false`.
3. Gunakan selalu `spot_id` (misal: 'f2-t-10' untuk Mizu atau 'f1-t-10' untuk Tetra) agar tidak tertukar lantai.
4. Jika meja sudah terisi (`is_reserved: true`), tawarkan meja terdekat yang masih kosong.
5. Setelah nama lengkap dan nomor WhatsApp pemesan didapat, panggil tool `book_table`.
6. Berikan rekapitulasi data pesanan beserta detail transfer BCA dan tautan WhatsApp admin hari terkait.
```
