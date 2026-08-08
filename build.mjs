import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure public directory exists
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('Building bundled application for standalone execution...');

// Let's create an integrated, pre-compiled application bundle
// that mounts all components, routes, icons, charts, and Leaflet maps
// with full fidelity and zero external transpiler dependencies!
