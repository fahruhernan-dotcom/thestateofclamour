import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://renghkmardohijraltsr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlbmdoa21hcmRvaGlqcmFsdHNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3MzEwMDcsImV4cCI6MjEwNzMwNzAwN30.hZc8RPLK9zVEJ5HI7uwvh2M1foaZzzYLlXa0N-GPnlc';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const reservationsToUpdate = [
  { codePattern: 'T-10', reservedBy: 'Veronica Lidia', notes: 'Reserved Mizu Day 2' },
  { codePattern: 'TS-4', reservedBy: 'reyhan', notes: 'Reserved Mizu Day 2' },
  { codePattern: 'VIP 2', reservedBy: 'Rachel Aulia', notes: 'Reserved Mizu Day 2' },
  { codePattern: 'VIP 4', reservedBy: 'Macil Cekut', notes: 'Reserved Mizu Day 2' },
  { codePattern: 'VIP 10', reservedBy: 'Haykal', notes: 'Reserved Mizu Day 2' },
  { codePattern: 'VIP 11', reservedBy: 'Babarafi', notes: 'Reserved Mizu Day 2' },
];

async function run() {
  console.log('Fetching Floor 2 Day 2 tables...');
  const { data: allTables, error: fetchErr } = await supabase
    .from('table_reservations')
    .select('id, table_code, spot_id, floor, day, is_reserved')
    .eq('floor', 2)
    .eq('day', 'day-2');

  if (fetchErr) {
    console.error('Error fetching tables:', fetchErr);
    return;
  }

  console.log(`Found ${allTables.length} tables for Floor 2 Day 2:`);
  console.log(allTables.map(t => `${t.table_code} (${t.spot_id})`).join(', '));

  for (const item of reservationsToUpdate) {
    // Find matching table
    const target = allTables.find(t => 
      t.table_code.toUpperCase().replace(/[\.\s-]/g, '') === item.codePattern.toUpperCase().replace(/[\.\s-]/g, '') ||
      t.spot_id.toUpperCase().includes(item.codePattern.toLowerCase().replace(/[\.\s]/g, '-'))
    );

    if (target) {
      console.log(`Updating ${target.table_code} (${target.spot_id}) -> RESERVED for ${item.reservedBy}...`);
      const { data, error } = await supabase
        .from('table_reservations')
        .update({
          is_reserved: true,
          status: 'reserved',
          reserved_by: item.reservedBy,
          notes: item.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', target.id)
        .select();

      if (error) {
        console.error(`Failed to update ${target.table_code}:`, error);
      } else {
        console.log(`SUCCESS: ${target.table_code} is now RESERVED by ${item.reservedBy}`);
      }
    } else {
      console.warn(`WARNING: Target table not found for pattern: ${item.codePattern}`);
    }
  }

  console.log('Done!');
}

run();
