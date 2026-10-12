import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://renghkmardohijraltsr.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlbmdoa21hcmRvaGlqcmFsdHNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3MzEwMDcsImV4cCI6MjEwNzMwNzAwN30.hZc8RPLK9zVEJ5HI7uwvh2M1foaZzzYLlXa0N-GPnlc';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function syncUniversalReservations() {
  console.log('🔄 Fetching all table reservations from Supabase...');
  const { data: allRows, error: fetchErr } = await supabase
    .from('table_reservations')
    .select('*');

  if (fetchErr) {
    console.error('❌ Error fetching tables:', fetchErr);
    process.exit(1);
  }

  console.log(`📊 Total rows found: ${allRows.length}`);

  // Find all spots that have is_reserved: true on ANY day
  const reservedBySpot = new Map();
  allRows.forEach(row => {
    if (row.is_reserved === true || row.status === 'reserved') {
      reservedBySpot.set(row.spot_id, {
        spot_id: row.spot_id,
        table_code: row.table_code,
        reserved_by: row.reserved_by,
        notes: row.notes,
        status: 'reserved'
      });
    }
  });

  console.log(`🔒 Unique reserved spots identified: ${reservedBySpot.size}`);
  for (const [spotId, meta] of reservedBySpot.entries()) {
    console.log(`   - ${meta.table_code} (${spotId}) booked by: ${meta.reserved_by}`);
  }

  // Update any sister rows for these spots that are not yet marked reserved
  let updatedCount = 0;
  for (const row of allRows) {
    if (reservedBySpot.has(row.spot_id) && (!row.is_reserved || row.status !== 'reserved')) {
      const source = reservedBySpot.get(row.spot_id);
      console.log(`⚙️ Syncing sister row: ${row.table_code} (${row.spot_id}) on ${row.day} -> RESERVED...`);

      const { error: updateErr } = await supabase
        .from('table_reservations')
        .update({
          is_reserved: true,
          status: 'reserved',
          reserved_by: source.reserved_by || row.reserved_by,
          notes: source.notes || 'Universal sync',
          updated_at: new Date().toISOString()
        })
        .eq('id', row.id);

      if (updateErr) {
        console.error(`❌ Failed to update row ${row.id}:`, updateErr.message);
      } else {
        updatedCount++;
        console.log(`   ✅ Row ${row.id} successfully synced.`);
      }
    }
  }

  console.log(`\n🎉 Synchronization complete! Total sister rows updated: ${updatedCount}`);
}

syncUniversalReservations().catch(console.error);
