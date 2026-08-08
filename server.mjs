import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.ts': 'application/javascript; charset=utf-8',
  '.tsx': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

function resolveFilePath(urlPath) {
  let cleanPath = urlPath.split('?')[0];
  if (cleanPath.startsWith('/')) cleanPath = cleanPath.slice(1);
  if (!cleanPath) cleanPath = 'index.html';

  let candidate = path.join(__dirname, cleanPath);

  // If candidate is a file that exists
  if (fs.existsSync(candidate) && !fs.statSync(candidate).isDirectory()) {
    return candidate;
  }

  // Try extensions
  const extensions = ['.tsx', '.ts', '.jsx', '.js', '.json', '/index.tsx', '/index.ts', '/index.jsx', '/index.js'];
  for (const ext of extensions) {
    const full = candidate + ext;
    if (fs.existsSync(full) && !fs.statSync(full).isDirectory()) {
      return full;
    }
  }

  // Check in public/
  const publicCandidate = path.join(__dirname, 'public', cleanPath);
  if (fs.existsSync(publicCandidate) && !fs.statSync(publicCandidate).isDirectory()) {
    return publicCandidate;
  }

  // If path has no extension and is not an API call, fallback to index.html for SPA routing
  if (!path.extname(cleanPath)) {
    const indexPath = path.join(__dirname, 'index.html');
    if (fs.existsSync(indexPath)) {
      return indexPath;
    }
  }

  return null;
}

// --- In-Memory & File-backed Persistent Wallet Store ---
const DATA_DIR = path.join(__dirname, 'data');
const WALLET_FILE = path.join(DATA_DIR, 'wallet.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadWalletData() {
  const defaultData = {
    walletBalance: 1250,
    corporateSubsidy: 5000,
    corporateSubsidyUsed: 1200,
    autoDebitEnabled: true,
    currency: 'INR',
    lastUpdated: new Date().toISOString(),
    transactions: [
      {
        id: 'tx-init-1',
        type: 'credit',
        amount: 1000,
        description: 'Instant Wallet Top-up (UPI - GPay)',
        paymentMethod: 'UPI',
        timestamp: new Date(Date.now() - 3600000 * 2).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
        referenceId: 'TXN-KOL-884921',
        status: 'success',
      },
      {
        id: 'tx-init-2',
        type: 'debit',
        amount: 120,
        description: 'Ride Debit: Park Street to Sector V (Swift Dzire)',
        paymentMethod: 'Wallet Auto-Debit',
        timestamp: new Date(Date.now() - 3600000 * 5).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
        referenceId: 'TXN-KOL-651230',
        status: 'success',
      },
      {
        id: 'tx-init-3',
        type: 'credit',
        amount: 500,
        description: 'Odoo Enterprise Corporate Mobility Bonus',
        paymentMethod: 'Corporate Voucher',
        timestamp: new Date(Date.now() - 3600000 * 24).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
        referenceId: 'TXN-KOL-429910',
        status: 'success',
      },
      {
        id: 'tx-init-4',
        type: 'debit',
        amount: 130,
        description: 'Ride Debit: Bally Bridge to Sector V (Tata Nexon EV)',
        paymentMethod: 'Wallet Auto-Debit',
        timestamp: new Date(Date.now() - 3600000 * 48).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
        referenceId: 'TXN-KOL-119283',
        status: 'success',
      },
    ],
  };

  try {
    if (fs.existsSync(WALLET_FILE)) {
      const content = fs.readFileSync(WALLET_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error('Error loading wallet.json, using defaults:', e.message);
  }

  saveWalletData(defaultData);
  return defaultData;
}

function saveWalletData(data) {
  try {
    fs.writeFileSync(WALLET_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving wallet.json:', e.message);
  }
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  // CORS & Security Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = parsedUrl.pathname;

  // --- REST API: GET /api/wallet (Fetch Balance & State) ---
  if (req.method === 'GET' && pathname === '/api/wallet') {
    const data = loadWalletData();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, data }));
    return;
  }

  // --- REST API: GET /api/wallet/transactions (Fetch Transactions) ---
  if (req.method === 'GET' && pathname === '/api/wallet/transactions') {
    const data = loadWalletData();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, transactions: data.transactions }));
    return;
  }

  // --- REST API: POST /api/wallet/recharge (Recharge Wallet Backend) ---
  if (req.method === 'POST' && pathname === '/api/wallet/recharge') {
    try {
      const body = await parseJsonBody(req);
      const amount = Math.max(10, parseInt(body.amount) || 0);
      const paymentMethod = body.paymentMethod || 'UPI (GPay / PhonePe)';
      const promoCode = (body.promoCode || '').toUpperCase().trim();

      if (amount <= 0) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid recharge amount. Minimum is ₹10.' }));
        return;
      }

      // Promo Code & Cashback Calculation
      let bonusAmount = 0;
      let promoMessage = '';
      if (promoCode === 'KOLKATA50') {
        bonusAmount = 50;
        promoMessage = 'Promo KOLKATA50 applied: Flat ₹50 Bonus added!';
      } else if (promoCode === 'ODOOFLEET') {
        bonusAmount = 100;
        promoMessage = 'Promo ODOOFLEET applied: ₹100 Corporate Match added!';
      } else if (promoCode === 'CARPOOLWB') {
        bonusAmount = Math.round(amount * 0.1);
        promoMessage = `Promo CARPOOLWB applied: 10% Cashback (+₹${bonusAmount}) added!`;
      }

      const totalCredit = amount + bonusAmount;
      const wallet = loadWalletData();
      wallet.walletBalance += totalCredit;
      wallet.lastUpdated = new Date().toISOString();

      const newTx = {
        id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type: 'credit',
        amount: totalCredit,
        baseAmount: amount,
        bonusAmount,
        promoCode: promoCode || null,
        description: `Wallet Top-up via ${paymentMethod}${bonusAmount ? ` (+₹${bonusAmount} Bonus)` : ''}`,
        paymentMethod,
        timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
        referenceId: `TXN-KOL-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'success',
        metadata: {
          upiId: body.upiId || 'raj@okaxis',
          cardLast4: body.cardNumber ? body.cardNumber.slice(-4) : null,
          bankName: body.bankName || null,
        },
      };

      wallet.transactions.unshift(newTx);
      saveWalletData(wallet);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: `Wallet recharged successfully with ₹${amount}${bonusAmount ? ` + ₹${bonusAmount} bonus` : ''}!`,
        newBalance: wallet.walletBalance,
        bonusAmount,
        promoMessage,
        transaction: newTx,
      }));
      return;
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
      return;
    }
  }

  // --- REST API: POST /api/wallet/auto-debit (Toggle Auto-Debit) ---
  if (req.method === 'POST' && pathname === '/api/wallet/auto-debit') {
    try {
      const body = await parseJsonBody(req);
      const wallet = loadWalletData();
      wallet.autoDebitEnabled = body.enabled !== undefined ? !!body.enabled : !wallet.autoDebitEnabled;
      wallet.lastUpdated = new Date().toISOString();
      saveWalletData(wallet);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        autoDebitEnabled: wallet.autoDebitEnabled,
        message: `Auto-debit for ride payments is now ${wallet.autoDebitEnabled ? 'ENABLED' : 'DISABLED'}.`,
      }));
      return;
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
      return;
    }
  }

  // --- REST API: POST /api/wallet/withdraw (Driver Earnings Payout) ---
  if (req.method === 'POST' && pathname === '/api/wallet/withdraw') {
    try {
      const body = await parseJsonBody(req);
      const amount = parseInt(body.amount) || 0;
      const upiId = body.upiId || 'driver@okhdfcbank';

      const wallet = loadWalletData();
      if (amount <= 0 || amount > wallet.walletBalance) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: `Invalid payout amount. Max available: ₹${wallet.walletBalance}` }));
        return;
      }

      wallet.walletBalance -= amount;
      const withdrawTx = {
        id: `tx-wd-${Date.now()}`,
        type: 'debit',
        amount,
        description: `Driver Earnings Payout to UPI (${upiId})`,
        paymentMethod: 'Bank / UPI Payout',
        timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
        referenceId: `PO-KOL-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'success',
      };
      wallet.transactions.unshift(withdrawTx);
      saveWalletData(wallet);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: `Payout of ₹${amount} initiated successfully to ${upiId}.`,
        newBalance: wallet.walletBalance,
        transaction: withdrawTx,
      }));
      return;
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
      return;
    }
  }

  // Static File Serving & SPA Fallback
  const resolved = resolveFilePath(req.url);

  if (resolved && fs.existsSync(resolved)) {
    const ext = path.extname(resolved).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(resolved).pipe(res);
  } else {
    // Fallback to index.html for SPA
    const indexPath = path.join(__dirname, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(indexPath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    }
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`CARPOOL Enterprise Platform & Wallet Backend running on http://localhost:${PORT}`);
});
