-- =====================================================================================
-- THE STATE OF CLAMOUR: SWEAR IN CONTINENTAL
-- SUPABASE MIGRATION & SEED DATA LANTAI 2 (VIP MEZZANINE & LOUNGE)
-- =====================================================================================
-- Petunjuk:
-- Copy dan paste script ini ke SQL Editor di Supabase Dashboard Anda, lalu klik "RUN".
-- =====================================================================================

-- 1. Perbarui Constraint Unik agar mendukung kode meja yang sama di lantai berbeda (misal T-1 di Lt 1 & Lt 2)
ALTER TABLE public.table_reservations DROP CONSTRAINT IF EXISTS uq_table_reservations_code_day;
ALTER TABLE public.table_reservations DROP CONSTRAINT IF EXISTS uq_table_reservations_code_floor_day;
ALTER TABLE public.table_reservations ADD CONSTRAINT uq_table_reservations_code_floor_day UNIQUE (table_code, floor, day);

-- 2. Perbarui RPC Function agar AI dapat menentukan lantai (default: floor = 1)
CREATE OR REPLACE FUNCTION public.set_table_reservation(
    p_table_code TEXT,
    p_day TEXT,
    p_is_reserved BOOLEAN,
    p_floor INTEGER DEFAULT 1,
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
    WHERE table_code = p_table_code AND floor = p_floor AND day = p_day
    RETURNING * INTO v_updated_row;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'Meja ' || p_table_code || ' (Lantai ' || p_floor || ') untuk ' || p_day || ' tidak ditemukan.'
        );
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Berhasil memperbarui status meja ' || p_table_code || ' (Lantai ' || p_floor || ')',
        'table_code', v_updated_row.table_code,
        'floor', v_updated_row.floor,
        'day', v_updated_row.day,
        'is_reserved', v_updated_row.is_reserved,
        'status', v_updated_row.status,
        'reserved_by', v_updated_row.reserved_by,
        'updated_at', v_updated_row.updated_at
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.set_table_reservation(TEXT, TEXT, BOOLEAN, INTEGER, TEXT, TEXT) TO anon, authenticated;

-- 3. INSERT SELURUH MEJA LANTAI 2 (37 Meja x 2 Hari = 74 Baris)
INSERT INTO public.table_reservations (spot_id, table_code, floor, day, name, category, is_reserved)
VALUES
    -- === DAY 1 (30 OKTOBER 2026) - LANTAI 2 ===
    -- VVIP Center Sofas
    ('f2-vvip-1', 'VVIP 1', 2, 'day-1', 'VVIP Royal Center Sofa 1', 'vvip', false),
    ('f2-vvip-2', 'VVIP 2', 2, 'day-1', 'VVIP Royal Center Sofa 2', 'vvip', false),
    -- VIP Sofas Row 2
    ('f2-vip-8', 'VIP 8', 2, 'day-1', 'VIP Upper Lounge Sofa 8', 'vip', false),
    ('f2-vip-9', 'VIP 9', 2, 'day-1', 'VIP Upper Lounge Sofa 9', 'vip', false),
    ('f2-vip-10', 'VIP 10', 2, 'day-1', 'VIP Upper Lounge Sofa 10', 'vip', false),
    ('f2-vip-11', 'VIP 11', 2, 'day-1', 'VIP Upper Lounge Sofa 11', 'vip', false),
    -- VIP Sofas Row 1 (Front View)
    ('f2-vip-1', 'VIP 1', 2, 'day-1', 'VIP Front Lounge Sofa 1', 'vip', false),
    ('f2-vip-2', 'VIP 2', 2, 'day-1', 'VIP Front Lounge Sofa 2', 'vip', false),
    ('f2-vip-3', 'VIP 3', 2, 'day-1', 'VIP Front Lounge Sofa 3', 'vip', false),
    ('f2-vip-4', 'VIP 4', 2, 'day-1', 'VIP Front Lounge Sofa 4', 'vip', false),
    ('f2-vip-5', 'VIP 5', 2, 'day-1', 'VIP Front Lounge Sofa 5', 'vip', false),
    ('f2-vip-6', 'VIP 6', 2, 'day-1', 'VIP Front Lounge Sofa 6', 'vip', false),
    ('f2-vip-7', 'VIP 7', 2, 'day-1', 'VIP Front Lounge Sofa 7', 'vip', false),
    -- Mezzanine Curved Balcony
    ('f2-m-1', 'M1', 2, 'day-1', 'Mezzanine Balcony Table M1', 'mezzanine', false),
    ('f2-m-2', 'M2', 2, 'day-1', 'Mezzanine Balcony Table M2', 'mezzanine', false),
    ('f2-m-3', 'M3', 2, 'day-1', 'Mezzanine Balcony Table M3', 'mezzanine', false),
    ('f2-m-4', 'M4', 2, 'day-1', 'Mezzanine Balcony Table M4', 'mezzanine', false),
    ('f2-m-5', 'M5', 2, 'day-1', 'Mezzanine Balcony Table M5', 'mezzanine', false),
    ('f2-m-6', 'M6', 2, 'day-1', 'Mezzanine Balcony Table M6', 'mezzanine', false),
    -- Private Alcoves
    ('f2-ts-1', 'TS-1', 2, 'day-1', 'Private Alcove TS-1', 'high_stool', false),
    ('f2-ts-2', 'TS-2', 2, 'day-1', 'Private Alcove TS-2', 'high_stool', false),
    ('f2-ts-3', 'TS-3', 2, 'day-1', 'Private Alcove TS-3', 'high_stool', false),
    -- Balcony High Stools
    ('f2-ts-4', 'TS-4', 2, 'day-1', 'High Stool TS-4', 'high_stool', false),
    ('f2-ts-5', 'TS-5', 2, 'day-1', 'High Stool TS-5', 'high_stool', false),
    ('f2-ts-6', 'TS-6', 2, 'day-1', 'High Stool TS-6', 'high_stool', false),
    ('f2-ts-7', 'TS-7', 2, 'day-1', 'High Stool TS-7', 'high_stool', false),
    ('f2-ts-8', 'TS-8', 2, 'day-1', 'High Stool TS-8', 'high_stool', false),
    -- Stage Front Cocktail Tables
    ('f2-t-1', 'T-1', 2, 'day-1', 'Stage Front Table T-1', 'cocktail', false),
    ('f2-t-2', 'T-2', 2, 'day-1', 'Stage Front Table T-2', 'cocktail', false),
    ('f2-t-3', 'T-3', 2, 'day-1', 'Stage Front Table T-3', 'cocktail', false),
    ('f2-t-4', 'T-4', 2, 'day-1', 'Stage Front Table T-4', 'cocktail', false),
    ('f2-t-8', 'T-8', 2, 'day-1', 'Center Cocktail Table T-8', 'cocktail', false),
    ('f2-t-9', 'T-9', 2, 'day-1', 'Center Cocktail Table T-9', 'cocktail', false),
    ('f2-t-7', 'T-7', 2, 'day-1', 'Center Cocktail Table T-7', 'cocktail', false),
    ('f2-t-10', 'T-10', 2, 'day-1', 'Center Cocktail Table T-10', 'cocktail', false),
    ('f2-t-6', 'T-6', 2, 'day-1', 'Center Cocktail Table T-6', 'cocktail', false),
    ('f2-t-5', 'T-5', 2, 'day-1', 'Center Cocktail Table T-5', 'cocktail', false),

    -- === DAY 2 (31 OKTOBER 2026) - LANTAI 2 ===
    -- VVIP Center Sofas
    ('f2-vvip-1', 'VVIP 1', 2, 'day-2', 'VVIP Royal Center Sofa 1', 'vvip', false),
    ('f2-vvip-2', 'VVIP 2', 2, 'day-2', 'VVIP Royal Center Sofa 2', 'vvip', false),
    -- VIP Sofas Row 2
    ('f2-vip-8', 'VIP 8', 2, 'day-2', 'VIP Upper Lounge Sofa 8', 'vip', false),
    ('f2-vip-9', 'VIP 9', 2, 'day-2', 'VIP Upper Lounge Sofa 9', 'vip', false),
    ('f2-vip-10', 'VIP 10', 2, 'day-2', 'VIP Upper Lounge Sofa 10', 'vip', false),
    ('f2-vip-11', 'VIP 11', 2, 'day-2', 'VIP Upper Lounge Sofa 11', 'vip', false),
    -- VIP Sofas Row 1 (Front View)
    ('f2-vip-1', 'VIP 1', 2, 'day-2', 'VIP Front Lounge Sofa 1', 'vip', false),
    ('f2-vip-2', 'VIP 2', 2, 'day-2', 'VIP Front Lounge Sofa 2', 'vip', false),
    ('f2-vip-3', 'VIP 3', 2, 'day-2', 'VIP Front Lounge Sofa 3', 'vip', false),
    ('f2-vip-4', 'VIP 4', 2, 'day-2', 'VIP Front Lounge Sofa 4', 'vip', false),
    ('f2-vip-5', 'VIP 5', 2, 'day-2', 'VIP Front Lounge Sofa 5', 'vip', false),
    ('f2-vip-6', 'VIP 6', 2, 'day-2', 'VIP Front Lounge Sofa 6', 'vip', false),
    ('f2-vip-7', 'VIP 7', 2, 'day-2', 'VIP Front Lounge Sofa 7', 'vip', false),
    -- Mezzanine Curved Balcony
    ('f2-m-1', 'M1', 2, 'day-2', 'Mezzanine Balcony Table M1', 'mezzanine', false),
    ('f2-m-2', 'M2', 2, 'day-2', 'Mezzanine Balcony Table M2', 'mezzanine', false),
    ('f2-m-3', 'M3', 2, 'day-2', 'Mezzanine Balcony Table M3', 'mezzanine', false),
    ('f2-m-4', 'M4', 2, 'day-2', 'Mezzanine Balcony Table M4', 'mezzanine', false),
    ('f2-m-5', 'M5', 2, 'day-2', 'Mezzanine Balcony Table M5', 'mezzanine', false),
    ('f2-m-6', 'M6', 2, 'day-2', 'Mezzanine Balcony Table M6', 'mezzanine', false),
    -- Private Alcoves
    ('f2-ts-1', 'TS-1', 2, 'day-2', 'Private Alcove TS-1', 'high_stool', false),
    ('f2-ts-2', 'TS-2', 2, 'day-2', 'Private Alcove TS-2', 'high_stool', false),
    ('f2-ts-3', 'TS-3', 2, 'day-2', 'Private Alcove TS-3', 'high_stool', false),
    -- Balcony High Stools
    ('f2-ts-4', 'TS-4', 2, 'day-2', 'High Stool TS-4', 'high_stool', false),
    ('f2-ts-5', 'TS-5', 2, 'day-2', 'High Stool TS-5', 'high_stool', false),
    ('f2-ts-6', 'TS-6', 2, 'day-2', 'High Stool TS-6', 'high_stool', false),
    ('f2-ts-7', 'TS-7', 2, 'day-2', 'High Stool TS-7', 'high_stool', false),
    ('f2-ts-8', 'TS-8', 2, 'day-2', 'High Stool TS-8', 'high_stool', false),
    -- Stage Front Cocktail Tables
    ('f2-t-1', 'T-1', 2, 'day-2', 'Stage Front Table T-1', 'cocktail', false),
    ('f2-t-2', 'T-2', 2, 'day-2', 'Stage Front Table T-2', 'cocktail', false),
    ('f2-t-3', 'T-3', 2, 'day-2', 'Stage Front Table T-3', 'cocktail', false),
    ('f2-t-4', 'T-4', 2, 'day-2', 'Stage Front Table T-4', 'cocktail', false),
    ('f2-t-8', 'T-8', 2, 'day-2', 'Center Cocktail Table T-8', 'cocktail', false),
    ('f2-t-9', 'T-9', 2, 'day-2', 'Center Cocktail Table T-9', 'cocktail', false),
    ('f2-t-7', 'T-7', 2, 'day-2', 'Center Cocktail Table T-7', 'cocktail', false),
    ('f2-t-10', 'T-10', 2, 'day-2', 'Center Cocktail Table T-10', 'cocktail', false),
    ('f2-t-6', 'T-6', 2, 'day-2', 'Center Cocktail Table T-6', 'cocktail', false),
    ('f2-t-5', 'T-5', 2, 'day-2', 'Center Cocktail Table T-5', 'cocktail', false)
ON CONFLICT (spot_id, day) DO UPDATE
SET 
    table_code = EXCLUDED.table_code,
    floor = EXCLUDED.floor,
    name = EXCLUDED.name,
    category = EXCLUDED.category;

-- Selesai! Seluruh meja Lantai 2 berhasil didaftarkan.
