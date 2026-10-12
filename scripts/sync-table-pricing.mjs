import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/data/floorPlanData.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Function to process each spot object block
// We can parse with regex matching each `{ ... id: '...' ... }` block
const spotBlockRegex = /\{\s*id:\s*['"]([^'"]+)['"][\s\S]*?zoneTag:\s*['"][^'"]+['"]\s*\}/g;

let updatedCount = 0;

content = content.replace(spotBlockRegex, (match, id) => {
  // Extract code
  const codeMatch = match.match(/code:\s*['"]([^'"]+)['"]/);
  if (!codeMatch) return match;
  const code = codeMatch[1].trim();
  const floorMatch = match.match(/floor:\s*([12])/);
  const floor = floorMatch ? parseInt(floorMatch[1], 10) : 1;

  let minSpend = 2000000;
  let bookingFee = 200000;
  let capacity = '4 PAX';
  let compTickets = 2;
  let venue = floor === 1 ? 'tetra' : 'mizu';

  if (floor === 1) {
    // TETRA
    venue = 'tetra';
    if (code.startsWith('SOFA')) {
      capacity = '6 PAX';
      compTickets = 3;
      minSpend = 3000000;
      bookingFee = 300000;
    } else if (code.startsWith('T-11') || code.startsWith('T-12')) {
      capacity = '4 PAX';
      compTickets = 2;
      minSpend = 3000000;
      bookingFee = 200000;
    } else if (code.startsWith('T-')) {
      capacity = '4 PAX';
      compTickets = 2;
      minSpend = 2000000;
      bookingFee = 200000;
    } else if (code.startsWith('ST-')) {
      const num = parseInt(code.replace('ST-', ''), 10);
      if (num >= 16 && num <= 22) {
        capacity = '4 PAX';
        compTickets = 2;
        minSpend = 2500000;
        bookingFee = 200000;
      } else {
        capacity = '4 PAX';
        compTickets = 2;
        minSpend = 1500000;
        bookingFee = 200000;
      }
    }
  } else {
    // MIZU
    venue = 'mizu';
    if (code.startsWith('VVIP')) {
      capacity = '8 PAX';
      compTickets = 4;
      minSpend = 9000000;
      bookingFee = 500000;
    } else if (code.startsWith('VIP')) {
      capacity = '6 PAX';
      compTickets = 3;
      minSpend = 6000000;
      bookingFee = 500000;
    } else if (code.startsWith('M')) {
      capacity = '6 PAX';
      compTickets = 3;
      minSpend = 5500000;
      bookingFee = 500000;
    } else if (code.startsWith('TS-')) {
      capacity = '4 PAX';
      compTickets = 2;
      minSpend = 4000000;
      bookingFee = 400000;
    } else if (code.startsWith('T-')) {
      capacity = '4 PAX';
      compTickets = 2;
      minSpend = 2500000;
      bookingFee = 250000;
    }
  }

  const formattedMinSpend = 'Rp ' + minSpend.toLocaleString('id-ID');
  const formattedBookingFee = 'Rp ' + bookingFee.toLocaleString('id-ID');

  let updatedBlock = match;
  updatedBlock = updatedBlock.replace(/capacityText:\s*['"][^'"]+['"]/, `capacityText: '${capacity}'`);
  updatedBlock = updatedBlock.replace(/minSpendDay1:\s*\d+/, `minSpendDay1: ${minSpend}`);
  updatedBlock = updatedBlock.replace(/minSpendDay2:\s*\d+/, `minSpendDay2: ${minSpend}`);
  updatedBlock = updatedBlock.replace(/formattedMinSpendDay1:\s*['"][^'"]+['"]/, `formattedMinSpendDay1: '${formattedMinSpend}'`);
  updatedBlock = updatedBlock.replace(/formattedMinSpendDay2:\s*['"][^'"]+['"]/, `formattedMinSpendDay2: '${formattedMinSpend}'`);

  // Ensure bookingFee, formattedBookingFee, complementTickets, venue exist in block
  if (!updatedBlock.includes('bookingFee:')) {
    updatedBlock = updatedBlock.replace(
      `formattedMinSpendDay2: '${formattedMinSpend}',`,
      `formattedMinSpendDay2: '${formattedMinSpend}',\n    bookingFee: ${bookingFee},\n    formattedBookingFee: '${formattedBookingFee}',\n    complementTickets: ${compTickets},\n    venue: '${venue}',`
    );
  } else {
    updatedBlock = updatedBlock.replace(/bookingFee:\s*\d+/, `bookingFee: ${bookingFee}`);
    updatedBlock = updatedBlock.replace(/formattedBookingFee:\s*['"][^'"]+['"]/, `formattedBookingFee: '${formattedBookingFee}'`);
    updatedBlock = updatedBlock.replace(/complementTickets:\s*\d+/, `complementTickets: ${compTickets}`);
    updatedBlock = updatedBlock.replace(/venue:\s*['"][^'"]+['"]/, `venue: '${venue}'`);
  }

  updatedCount++;
  return updatedBlock;
});

fs.writeFileSync(filePath, content, 'utf-8');
console.log(`Successfully updated pricing and metadata for ${updatedCount} table spots in floorPlanData.ts!`);
