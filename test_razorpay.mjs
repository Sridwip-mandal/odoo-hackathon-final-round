import crypto from 'node:crypto';

async function testRazorpaySuite() {
  console.log('--- Testing Razorpay Standard Checkout Backend Suite ---');

  const RAZORPAY_KEY_SECRET = 'sQzV8g1234567890abcdefgh';

  // 1. Test Order Creation
  const orderRes = await fetch('http://localhost:3000/api/razorpay/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: 500, userId: 'emp-001' }),
  });
  const orderData = await orderRes.json();
  console.log('1. Create Order Response:', orderData);
  if (!orderData.success || !orderData.orderId) {
    throw new Error('Create order failed');
  }

  // 2. Test Payment Signature Verification (Valid)
  const paymentId = `pay_${crypto.randomBytes(8).toString('hex')}`;
  const orderId = orderData.orderId;
  const signature = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET).update(`${orderId}|${paymentId}`).digest('hex');

  const verifyRes = await fetch('http://localhost:3000/api/razorpay/verify-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      razorpay_payment_id: paymentId,
      razorpay_order_id: orderId,
      razorpay_signature: signature,
      amount: 500,
      userId: 'emp-001',
    }),
  });
  const verifyData = await verifyRes.json();
  console.log('2. Verify Payment (Valid Signature):', verifyData);
  if (!verifyData.success || verifyData.newBalance === undefined) {
    throw new Error('Payment verification failed');
  }

  // 3. Test Idempotency Guard (Duplicate Payment ID)
  const duplicateRes = await fetch('http://localhost:3000/api/razorpay/verify-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      razorpay_payment_id: paymentId,
      razorpay_order_id: orderId,
      razorpay_signature: signature,
      amount: 500,
      userId: 'emp-001',
    }),
  });
  const duplicateData = await duplicateRes.json();
  console.log('3. Duplicate Payment Protection (Idempotent):', duplicateData);
  if (!duplicateData.isDuplicate) {
    throw new Error('Idempotency protection failed to catch duplicate payment');
  }

  // 4. Test Invalid Signature Rejection
  const invalidRes = await fetch('http://localhost:3000/api/razorpay/verify-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      razorpay_payment_id: 'pay_fake_attack',
      razorpay_order_id: orderId,
      razorpay_signature: 'invalid_signature_hash',
      amount: 500,
      userId: 'emp-001',
    }),
  });
  const invalidData = await invalidRes.json();
  console.log('4. Invalid Signature Rejection:', invalidRes.status, invalidData);
  if (invalidRes.status !== 400) {
    throw new Error('Invalid signature was not rejected');
  }

  // 5. Test Wallet Statement Retrieval
  const walletRes = await fetch('http://localhost:3000/api/wallet');
  const walletData = await walletRes.json();
  console.log('5. GET /api/wallet (Balance & Transactions):', {
    balance: walletData.balance,
    transactionCount: walletData.transactions?.length,
    latestTx: walletData.transactions?.[0],
  });

  console.log('\n✅ ALL RAZORPAY AND WALLET TESTS PASSED WITH 100% SUCCESS!');
}

testRazorpaySuite().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
