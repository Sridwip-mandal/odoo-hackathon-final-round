import fs from 'fs';

const transcriptPath = 'C:\\Users\\argha\\.gemini\\antigravity-ide\\brain\\54fcc0fe-5adb-4708-a6a2-03704b23b4d8\\.system_generated\\logs\\transcript_full.jsonl';
const text = fs.readFileSync(transcriptPath, 'utf8');

const blocks = [];
const regex = /==Start of OCR for page \d+==\n([\s\S]*?)==End of OCR for page \d+==/g;
let match;
while ((match = regex.exec(text)) !== null) {
  blocks.push(match[1].trim());
}

console.log('Found blocks:', blocks.length);

if (blocks.length > 0) {
  // Let's assume the first 24 blocks are Employee pages, next 14 are Vehicle pages
  // But wait, there might be multiple runs of this prompt in the transcript.
  // Let's just grab the last 38 blocks (24 emp + 14 veh).
  const lastBlocks = blocks.slice(-38);
  const empBlocks = lastBlocks.slice(0, 24);
  const vehBlocks = lastBlocks.slice(24);
  
  fs.writeFileSync('emp_ocr.txt', empBlocks.join('\n'));
  fs.writeFileSync('veh_ocr.txt', vehBlocks.join('\n'));
  console.log('Saved emp_ocr.txt and veh_ocr.txt');
}
