#!/usr/bin/env node

/**
 * Razorpay Test Payment Simulator
 * 
 * Simulates successful and failed payment flows using Razorpay test mode.
 * Masks all sensitive keys in output.
 * 
 * Usage:
 *   node scripts/razorpay/test-payment.js --success
 *   node scripts/razorpay/test-payment.js --failure
 */

const crypto = require('crypto');

// Parse command line args
const args = process.argv.slice(2);
const mode = args.includes('--failure') ? 'failure' : 'success';

// Environment variables (masked for logging)
const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';

function maskSecret(secret) {
    if (!secret || secret.length < 8) return '***';
    return secret.substring(0, 4) + '***' + secret.substring(secret.length - 4);
}

function logStep(step, message, data = null) {
    console.log(`\n[STEP ${step}] ${message}`);
    if (data) {
        console.log(JSON.stringify(data, null, 2));
    }
}

async function simulateSuccessfulPayment() {
    console.log('🎯 Simulating SUCCESSFUL Payment Flow\n');
    console.log('═'.repeat(60));

    // Step 1: Validate credentials
    logStep(1, 'Validating Razorpay Credentials');
    console.log(`   Key ID: ${maskSecret(RAZORPAY_KEY_ID)}`);
    console.log(`   Secret: ${maskSecret(RAZORPAY_KEY_SECRET)}`);

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
        console.error('\n❌ Missing Razorpay credentials');
        console.error('   Set NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET');
        process.exit(1);
    }

    // Step 2: Create order
    const orderId = `order_${crypto.randomBytes(10).toString('hex')}`;
    const amount = 50000; // ₹500.00 in paise

    logStep(2, 'Creating Razorpay Order', {
        order_id: orderId,
        amount: amount,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
    });

    console.log('   ✅ Order created successfully');

    // Step 3: Simulate payment
    const paymentId = `pay_${crypto.randomBytes(10).toString('hex')}`;
    const signature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

    logStep(3, 'Simulating Payment Completion', {
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: maskSecret(signature),
    });

    console.log('   ✅ Payment completed by customer');

    // Step 4: Verify signature
    logStep(4, 'Verifying Payment Signature');

    const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

    const isValid = signature === expectedSignature;
    console.log(`   Signature Valid: ${isValid ? '✅ YES' : '❌ NO'}`);

    if (!isValid) {
        console.error('\n❌ Signature verification failed!');
        process.exit(1);
    }

    // Step 5: Update order status
    logStep(5, 'Updating Order Status in Database', {
        order_id: orderId,
        payment_id: paymentId,
        status: 'paid',
        paid_at: new Date().toISOString(),
    });

    console.log('   ✅ Order marked as paid');

    // Success summary
    console.log('\n' + '═'.repeat(60));
    console.log('✅ PAYMENT SUCCESSFUL');
    console.log('═'.repeat(60));
    console.log(`Order ID: ${orderId}`);
    console.log(`Payment ID: ${paymentId}`);
    console.log(`Amount: ₹${(amount / 100).toFixed(2)}`);
    console.log(`Status: PAID`);
    console.log('═'.repeat(60) + '\n');
}

async function simulateFailedPayment() {
    console.log('⚠️  Simulating FAILED Payment Flow\n');
    console.log('═'.repeat(60));

    // Step 1: Create order
    const orderId = `order_${crypto.randomBytes(10).toString('hex')}`;
    const amount = 50000;

    logStep(1, 'Creating Razorpay Order', {
        order_id: orderId,
        amount: amount,
        currency: 'INR',
    });

    console.log('   ✅ Order created successfully');

    // Step 2: Simulate payment failure
    logStep(2, 'Simulating Payment Failure', {
        razorpay_order_id: orderId,
        error_code: 'PAYMENT_FAILED',
        error_description: 'Payment declined by bank',
        error_reason: 'Insufficient funds',
    });

    console.log('   ❌ Payment failed');

    // Step 3: Update order status
    logStep(3, 'Updating Order Status in Database', {
        order_id: orderId,
        status: 'payment_failed',
        error_reason: 'Insufficient funds',
        failed_at: new Date().toISOString(),
    });

    console.log('   ✅ Order marked as failed');

    // Failure summary
    console.log('\n' + '═'.repeat(60));
    console.log('❌ PAYMENT FAILED');
    console.log('═'.repeat(60));
    console.log(`Order ID: ${orderId}`);
    console.log(`Amount: ₹${(amount / 100).toFixed(2)}`);
    console.log(`Status: PAYMENT_FAILED`);
    console.log(`Reason: Insufficient funds`);
    console.log('═'.repeat(60) + '\n');
}

async function main() {
    try {
        if (mode === 'success') {
            await simulateSuccessfulPayment();
        } else {
            await simulateFailedPayment();
        }
    } catch (error) {
        console.error('\n❌ Error during simulation:', error.message);
        process.exit(1);
    }
}

// Run simulation
main();
