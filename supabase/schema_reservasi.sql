-- =====================================================================================
-- THE STATE OF CLAMOR: SWEAR IN CONTINENTAL
-- SUPABASE SCHEMA RESERVASI MEJA & AUDIT LOG (FOKUS LANTAI 1)
-- =====================================================================================
-- Petunjuk:
-- Copy dan paste seluruh isi script ini ke SQL Editor di dashboard Supabase Anda,
-- lalu klik 'RUN'.
-- =====================================================================================

-- 1. TABEL UTAMA: table_reservations
CREATE TABLE IF NOT EXISTS public.table_reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    spot_id TEXT NOT NULL,                          -- ID unik spot (misal: 'f1-t-1', 'f1-st-6')
    table_code TEXT NOT NULL,                       -- Kode meja (misal: 'T-1', 'ST-6', 'SOFA 1')
    floor INTEGER NOT NULL DEFAULT 1,               -- Lantai (1 atau 2)
    day TEXT NOT NULL CHECK (day IN ('day-1', 'day-2')), -- Hari acara
    name TEXT NOT NULL,                             -- Nama meja (misal: 'Center Booth T-1')
    category TEXT NOT NULL DEFAULT 'booth',         -- Kategori (booth, sofa, cocktail, dll)
    is_reserved BOOLEAN NOT NULL DEFAULT false,     -- ⭐ 1 KOLOM UTAMA UNTUK CEK KETERSEDIAAN (true = booked, false = available)
    status TEXT NOT NULL DEFAULT 'available',       -- Status string ('available' / 'reserved') disinkronkan otomatis
    reserved_by TEXT,                               -- Nama pemesan / kontak (opsional)
    notes TEXT,                                     -- Catatan tambahan / reservasi AI (opsional)
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_table_reservations_spot_day UNIQUE (spot_id, day),
    CONSTRAINT uq_table_reservations_code_day UNIQUE (table_code, day)
);

-- Index untuk pencarian cepat oleh AI Agent & Frontend
CREATE INDEX IF NOT EXISTS idx_table_reservations_code_day ON public.table_reservations (table_code, day);
CREATE INDEX IF NOT EXISTS idx_table_reservations_spot_day ON public.table_reservations (spot_id, day);
CREATE INDEX IF NOT EXISTS idx_table_reservations_is_reserved ON public.table_reservations (is_reserved);

-- -------------------------------------------------------------------------------------
-- 2. TABEL AUDIT LOG: table_reservation_logs
-- -------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.table_reservation_logs (
    id BIGSERIAL PRIMARY KEY,
    reservation_id UUID REFERENCES public.table_reservations(id) ON DELETE SET NULL,
    table_code TEXT NOT NULL,
    spot_id TEXT NOT NULL,
    day TEXT NOT NULL,
    old_is_reserved BOOLEAN,
    new_is_reserved BOOLEAN,
    old_status TEXT,
    new_status TEXT,
    changed_by TEXT DEFAULT 'anon / AI Agent',      -- Pengubah status (misal: 'AI Agent', 'Admin Web', dll)
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_logs_table_code ON public.table_reservation_logs (table_code, day);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON public.table_reservation_logs (created_at DESC);

-- -------------------------------------------------------------------------------------
-- 3. TRIGGER AUTO-SYNC: is_reserved <-> status & updated_at
-- -------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_sync_table_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Jika is_reserved diubah menjadi true, otomatis status = 'reserved'
    -- Jika is_reserved diubah menjadi false, otomatis status = 'available'
    IF NEW.is_reserved = true THEN
        NEW.status := 'reserved';
    ELSE
        NEW.status := 'available';
    END IF;

    NEW.updated_at := now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_table_status ON public.table_reservations;
CREATE TRIGGER trg_sync_table_status
    BEFORE INSERT OR UPDATE ON public.table_reservations
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_sync_table_status();

-- -------------------------------------------------------------------------------------
-- 4. TRIGGER AUTO-LOG: Pencatatan otomatis ke table_reservation_logs setiap ada perubahan
-- -------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_log_reservation_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Hanya catat jika ada perubahan pada kolom is_reserved, status, atau reserved_by
    IF (OLD.is_reserved IS DISTINCT FROM NEW.is_reserved) OR 
       (OLD.status IS DISTINCT FROM NEW.status) OR 
       (OLD.reserved_by IS DISTINCT FROM NEW.reserved_by) THEN
       
        -- Ambil notes jika disertakan
        INSERT INTO public.table_reservation_logs (
            reservation_id,
            table_code,
            spot_id,
            day,
            old_is_reserved,
            new_is_reserved,
            old_status,
            new_status,
            changed_by,
            notes,
            created_at
        ) VALUES (
            NEW.id,
            NEW.table_code,
            NEW.spot_id,
            NEW.day,
            OLD.is_reserved,
            NEW.is_reserved,
            OLD.status,
            NEW.status,
            COALESCE(NEW.notes, 'Perubahan status reservasi'),
            NEW.notes,
            now()
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_log_reservation_change ON public.table_reservations;
CREATE TRIGGER trg_log_reservation_change
    AFTER UPDATE ON public.table_reservations
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_log_reservation_change();

-- -------------------------------------------------------------------------------------
-- 5. RPC FUNCTION UNTUK AI AGENT: set_table_reservation
-- -------------------------------------------------------------------------------------
-- Memudahkan AI mengubah status meja cukup dengan 1 panggilan fungsi
CREATE OR REPLACE FUNCTION public.set_table_reservation(
    p_table_code TEXT,
    p_day TEXT,
    p_is_reserved BOOLEAN,
    p_reserved_by TEXT DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_updated_row public.table_reservations%ROWTYPE;
BEGIN
    UPDATE public.table_reservations
    SET 
        is_reserved = p_is_reserved,
        reserved_by = COALESCE(p_reserved_by, reserved_by),
        notes = COALESCE(p_notes, notes)
    WHERE table_code = p_table_code AND day = p_day
    RETURNING * INTO v_updated_row;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'Meja ' || p_table_code || ' untuk ' || p_day || ' tidak ditemukan.'
        );
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Berhasil memperbarui status meja ' || p_table_code,
        'table_code', v_updated_row.table_code,
        'day', v_updated_row.day,
        'is_reserved', v_updated_row.is_reserved,
        'status', v_updated_row.status,
        'reserved_by', v_updated_row.reserved_by,
        'updated_at', v_updated_row.updated_at
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -------------------------------------------------------------------------------------
-- 6. KEAMANAN & AKSES (ROW LEVEL SECURITY & POLICIES)
-- -------------------------------------------------------------------------------------
ALTER TABLE public.table_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.table_reservation_logs ENABLE ROW LEVEL SECURITY;

-- Drop policy lama jika sudah ada agar idempoten
DROP POLICY IF EXISTS "Allow public read table_reservations" ON public.table_reservations;
DROP POLICY IF EXISTS "Allow anon update table_reservations" ON public.table_reservations;
DROP POLICY IF EXISTS "Allow public read table_reservation_logs" ON public.table_reservation_logs;

-- Izinkan public / anon untuk membaca ketersediaan meja
CREATE POLICY "Allow public read table_reservations"
    ON public.table_reservations FOR SELECT
    TO anon, authenticated
    USING (true);

-- Izinkan public / anon untuk mengupdate meja (agar AI Agent bisa update langsung dengan anon key)
CREATE POLICY "Allow anon update table_reservations"
    ON public.table_reservations FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Izinkan public / anon untuk membaca log riwayat
CREATE POLICY "Allow public read table_reservation_logs"
    ON public.table_reservation_logs FOR SELECT
    TO anon, authenticated
    USING (true);

-- Izinkan trigger / sistem menginsert ke table_reservation_logs
CREATE POLICY "Allow insert table_reservation_logs"
    ON public.table_reservation_logs FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Izinkan sequence usage untuk bigserial logs
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.table_reservation_logs TO anon, authenticated;

-- Izinkan eksekusi fungsi RPC untuk public/anon
GRANT EXECUTE ON FUNCTION public.set_table_reservation(TEXT, TEXT, BOOLEAN, TEXT, TEXT) TO anon, authenticated;

-- Aktifkan Supabase Realtime agar web frontend terupdate secara langsung via WebSocket
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'table_reservations'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.table_reservations;
    END IF;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

-- -------------------------------------------------------------------------------------
-- 7. SEEDING DATA RESMI LANTAI 1 (38 Meja x 2 Hari = 76 Baris)
-- -------------------------------------------------------------------------------------
-- Seluruh meja terdaftar dengan default is_reserved = false (Tersedia)
INSERT INTO public.table_reservations (spot_id, table_code, floor, day, name, category, is_reserved)
VALUES
    -- === DAY 1 (30 OKTOBER 2026) ===
    -- Entrance High Tables
    ('f1-st-1', 'ST-1', 1, 'day-1', 'Main Hall High Table ST-1', 'cocktail', false),
    ('f1-st-2', 'ST-2', 1, 'day-1', 'North High Table ST-2', 'cocktail', false),
    ('f1-st-3', 'ST-3', 1, 'day-1', 'North High Table ST-3', 'cocktail', false),
    -- Luxury Sofas
    ('f1-sofa-1', 'SOFA 1', 1, 'day-1', 'Main Hall Luxury Sofa 1', 'sofa', false),
    ('f1-sofa-2', 'SOFA 2', 1, 'day-1', 'Main Hall Luxury Sofa 2', 'sofa', false),
    ('f1-sofa-3', 'SOFA 3', 1, 'day-1', 'Main Hall Luxury Sofa 3', 'sofa', false),
    ('f1-sofa-4', 'SOFA 4', 1, 'day-1', 'Main Hall Luxury Sofa 4', 'sofa', false),
    -- Center Booths
    ('f1-t-1', 'T-1', 1, 'day-1', 'Center Booth T-1', 'booth', false),
    ('f1-t-2', 'T-2', 1, 'day-1', 'Center Booth T-2', 'booth', false),
    ('f1-t-3', 'T-3', 1, 'day-1', 'Center Booth T-3', 'booth', false),
    ('f1-t-4', 'T-4', 1, 'day-1', 'Center Booth T-4', 'booth', false),
    ('f1-t-5', 'T-5', 1, 'day-1', 'Center Booth T-5', 'booth', false),
    ('f1-t-6', 'T-6', 1, 'day-1', 'Center Booth T-6', 'booth', false),
    -- Bar-Side Booths
    ('f1-t-7', 'T-7', 1, 'day-1', 'Bar-Side Table T-7', 'booth', false),
    ('f1-t-8', 'T-8', 1, 'day-1', 'Bar-Side Table T-8', 'booth', false),
    ('f1-t-9', 'T-9', 1, 'day-1', 'Bar-Side Table T-9', 'booth', false),
    ('f1-t-10', 'T-10', 1, 'day-1', 'Bar-Side Table T-10', 'booth', false),
    -- Outdoor Courtyard
    ('f1-st-7', 'ST-7', 1, 'day-1', 'Outdoor Table ST-7', 'cocktail', false),
    ('f1-st-8', 'ST-8', 1, 'day-1', 'Outdoor Table ST-8', 'cocktail', false),
    ('f1-st-9', 'ST-9', 1, 'day-1', 'Outdoor Table ST-9', 'cocktail', false),
    ('f1-st-10', 'ST-10', 1, 'day-1', 'Outdoor Table ST-10', 'cocktail', false),
    ('f1-st-11', 'ST-11', 1, 'day-1', 'Outdoor Table ST-11', 'cocktail', false),
    -- Lower West Corner
    ('f1-st-12', 'ST-12', 1, 'day-1', 'West High Table ST-12', 'cocktail', false),
    ('f1-st-13', 'ST-13', 1, 'day-1', 'West High Table ST-13', 'cocktail', false),
    ('f1-st-14', 'ST-14', 1, 'day-1', 'Southwest Table ST-14', 'cocktail', false),
    ('f1-st-15', 'ST-15', 1, 'day-1', 'Southwest Table ST-15', 'cocktail', false),
    -- Smoking Room Booths
    ('f1-t-12', 'T-12', 1, 'day-1', 'Smoking Room Booth T-12', 'booth', false),
    ('f1-t-11', 'T-11', 1, 'day-1', 'Smoking Room Booth T-11', 'booth', false),
    -- Smoking Room High Tables
    ('f1-st-16', 'ST-16', 1, 'day-1', 'Smoking Room Table ST-16', 'cocktail', false),
    ('f1-st-17', 'ST-17', 1, 'day-1', 'Smoking Room Table ST-17', 'cocktail', false),
    ('f1-st-18', 'ST-18', 1, 'day-1', 'Smoking Room Table ST-18', 'cocktail', false),
    ('f1-st-19', 'ST-19', 1, 'day-1', 'Smoking Room Table ST-19', 'cocktail', false),
    ('f1-st-20', 'ST-20', 1, 'day-1', 'Smoking Room Table ST-20', 'cocktail', false),
    ('f1-st-21', 'ST-21', 1, 'day-1', 'Smoking Room Table ST-21', 'cocktail', false),
    ('f1-st-22', 'ST-22', 1, 'day-1', 'Smoking Room Table ST-22', 'cocktail', false),
    -- Photo Booth Corner
    ('f1-st-4', 'ST-4', 1, 'day-1', 'Photo Area Table ST-4', 'cocktail', false),
    ('f1-st-5', 'ST-5', 1, 'day-1', 'Photo Area Table ST-5', 'cocktail', false),
    ('f1-st-6', 'ST-6', 1, 'day-1', 'Photo Area Table ST-6', 'cocktail', false),

    -- === DAY 2 (31 OKTOBER 2026) ===
    -- Entrance High Tables
    ('f1-st-1', 'ST-1', 1, 'day-2', 'Main Hall High Table ST-1', 'cocktail', false),
    ('f1-st-2', 'ST-2', 1, 'day-2', 'North High Table ST-2', 'cocktail', false),
    ('f1-st-3', 'ST-3', 1, 'day-2', 'North High Table ST-3', 'cocktail', false),
    -- Luxury Sofas
    ('f1-sofa-1', 'SOFA 1', 1, 'day-2', 'Main Hall Luxury Sofa 1', 'sofa', false),
    ('f1-sofa-2', 'SOFA 2', 1, 'day-2', 'Main Hall Luxury Sofa 2', 'sofa', false),
    ('f1-sofa-3', 'SOFA 3', 1, 'day-2', 'Main Hall Luxury Sofa 3', 'sofa', false),
    ('f1-sofa-4', 'SOFA 4', 1, 'day-2', 'Main Hall Luxury Sofa 4', 'sofa', false),
    -- Center Booths
    ('f1-t-1', 'T-1', 1, 'day-2', 'Center Booth T-1', 'booth', false),
    ('f1-t-2', 'T-2', 1, 'day-2', 'Center Booth T-2', 'booth', false),
    ('f1-t-3', 'T-3', 1, 'day-2', 'Center Booth T-3', 'booth', false),
    ('f1-t-4', 'T-4', 1, 'day-2', 'Center Booth T-4', 'booth', false),
    ('f1-t-5', 'T-5', 1, 'day-2', 'Center Booth T-5', 'booth', false),
    ('f1-t-6', 'T-6', 1, 'day-2', 'Center Booth T-6', 'booth', false),
    -- Bar-Side Booths
    ('f1-t-7', 'T-7', 1, 'day-2', 'Bar-Side Table T-7', 'booth', false),
    ('f1-t-8', 'T-8', 1, 'day-2', 'Bar-Side Table T-8', 'booth', false),
    ('f1-t-9', 'T-9', 1, 'day-2', 'Bar-Side Table T-9', 'booth', false),
    ('f1-t-10', 'T-10', 1, 'day-2', 'Bar-Side Table T-10', 'booth', false),
    -- Outdoor Courtyard
    ('f1-st-7', 'ST-7', 1, 'day-2', 'Outdoor Table ST-7', 'cocktail', false),
    ('f1-st-8', 'ST-8', 1, 'day-2', 'Outdoor Table ST-8', 'cocktail', false),
    ('f1-st-9', 'ST-9', 1, 'day-2', 'Outdoor Table ST-9', 'cocktail', false),
    ('f1-st-10', 'ST-10', 1, 'day-2', 'Outdoor Table ST-10', 'cocktail', false),
    ('f1-st-11', 'ST-11', 1, 'day-2', 'Outdoor Table ST-11', 'cocktail', false),
    -- Lower West Corner
    ('f1-st-12', 'ST-12', 1, 'day-2', 'West High Table ST-12', 'cocktail', false),
    ('f1-st-13', 'ST-13', 1, 'day-2', 'West High Table ST-13', 'cocktail', false),
    ('f1-st-14', 'ST-14', 1, 'day-2', 'Southwest Table ST-14', 'cocktail', false),
    ('f1-st-15', 'ST-15', 1, 'day-2', 'Southwest Table ST-15', 'cocktail', false),
    -- Smoking Room Booths
    ('f1-t-12', 'T-12', 1, 'day-2', 'Smoking Room Booth T-12', 'booth', false),
    ('f1-t-11', 'T-11', 1, 'day-2', 'Smoking Room Booth T-11', 'booth', false),
    -- Smoking Room High Tables
    ('f1-st-16', 'ST-16', 1, 'day-2', 'Smoking Room Table ST-16', 'cocktail', false),
    ('f1-st-17', 'ST-17', 1, 'day-2', 'Smoking Room Table ST-17', 'cocktail', false),
    ('f1-st-18', 'ST-18', 1, 'day-2', 'Smoking Room Table ST-18', 'cocktail', false),
    ('f1-st-19', 'ST-19', 1, 'day-2', 'Smoking Room Table ST-19', 'cocktail', false),
    ('f1-st-20', 'ST-20', 1, 'day-2', 'Smoking Room Table ST-20', 'cocktail', false),
    ('f1-st-21', 'ST-21', 1, 'day-2', 'Smoking Room Table ST-21', 'cocktail', false),
    ('f1-st-22', 'ST-22', 1, 'day-2', 'Smoking Room Table ST-22', 'cocktail', false),
    -- Photo Booth Corner
    ('f1-st-4', 'ST-4', 1, 'day-2', 'Photo Area Table ST-4', 'cocktail', false),
    ('f1-st-5', 'ST-5', 1, 'day-2', 'Photo Area Table ST-5', 'cocktail', false),
    ('f1-st-6', 'ST-6', 1, 'day-2', 'Photo Area Table ST-6', 'cocktail', false)
ON CONFLICT (spot_id, day) DO UPDATE
SET 
    table_code = EXCLUDED.table_code,
    name = EXCLUDED.name,
    category = EXCLUDED.category;

-- Selesai! Schema dan data Lantai 1 siap digunakan.
