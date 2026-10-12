# 🤖 Panduan Integrasi AI Agent ke Supabase (The State of Clamour)

Dokumen ini memandu bagaimana AI Agent eksternal Anda dapat membaca dan memperbarui ketersediaan meja di Supabase menggunakan **Public Anon Key**.

---

## 🔑 Konfigurasi Dasar AI
Cukup berikan 2 informasi ini ke sistem / prompt AI Anda:
1. **SUPABASE_URL**: https://<project-ref>.supabase.co
2. **SUPABASE_ANON_KEY**: <anon-key>

Header standar untuk setiap request HTTP:
- apikey: <SUPABASE_ANON_KEY>
- Authorization: Bearer <SUPABASE_ANON_KEY>
- Content-Type: application/json

---

## 1. 🔍 Mengecek Ketersediaan Meja (GET)

### Cek Seluruh Meja di Hari 1:
GET https://<project-ref>.supabase.co/rest/v1/table_reservations?day=eq.day-1&select=table_code,name,category,is_reserved,status

### Cek Spesifik Meja Tertentu (Contoh: Meja T-1 pada Hari 1):
GET https://<project-ref>.supabase.co/rest/v1/table_reservations?table_code=eq.T-1&day=eq.day-1&select=*

---

## 2. ⚡ Mengubah Ketersediaan Meja (1 Kolom Saja!)

Untuk memesan atau membatalkan meja, AI Anda cukup melakukan **PATCH** ke endpoint REST API dengan mengubah kolom is_reserved.

### A. Memesan Meja (Set Reservasi -> TRUE):
PATCH https://<project-ref>.supabase.co/rest/v1/table_reservations?table_code=eq.T-1&day=eq.day-1
Prefer: return=representation

Body JSON:
{
  " is_reserved\: true,
 \reserved_by\: \John Doe\,
 \notes\: \Dipesan via AI Assistant WhatsApp\
}

> **Catatan**: Kolom status akan otomatis menjadi 'reserved' dan table_reservation_logs akan otomatis mencatat riwayat perubahan tanpa perlu query tambahan!

### B. Membatalkan Reservasi (Set Tersedia Kembali -> FALSE):
PATCH https://<project-ref>.supabase.co/rest/v1/table_reservations?table_code=eq.T-1&day=eq.day-1
Prefer: return=representation

Body JSON:
{
 \is_reserved\: false,
 \reserved_by\: null,
 \notes\: \Dibatalkan oleh pelanggan\
}

---

## 3. 🎯 Menggunakan Helper RPC (Alternatif Paling Bersih untuk AI)

Jika AI Anda mendukung RPC Supabase:
POST https://<project-ref>.supabase.co/rest/v1/rpc/set_table_reservation

Body JSON:
{
 \p_table_code\: \ST-6\,
 \p_day\: \day-1\,
 \p_is_reserved\: true,
 \p_reserved_by\: \Tamu VIP\,
 \p_notes\: \Booking meja Photo Booth via AI Agent\
}

---

## 4. 📜 Melihat Riwayat Audit Log
GET https://<project-ref>.supabase.co/rest/v1/table_reservation_logs?order=created_at.desc&limit=20

---

## 5. 🏷️ Daftar Kode Meja Resmi Lantai 1 (Untuk Prompt AI)
- Top Entrance: ST-1, ST-2, ST-3
- Luxury Sofas: SOFA 1, SOFA 2, SOFA 3, SOFA 4
- Center Booths: T-1, T-2, T-3, T-4, T-5, T-6
- Bar-Side Booths: T-7, T-8, T-9, T-10
- Outdoor Courtyard: ST-7, ST-8, ST-9, ST-10, ST-11
- Lower West Wing: ST-12, ST-13, ST-14, ST-15
- Smoking Room Booths: T-11, T-12
- Smoking Room High Tables: ST-16, ST-17, ST-18, ST-19, ST-20, ST-21, ST-22
- Photo Booth Corner: ST-4, ST-5, ST-6
