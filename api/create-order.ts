// api/create-order.ts
import Razorpay from 'razorpay';

export default async function handler(req: any, res: any) {
  // Debug logging
  console.log("Razorpay Key Check:", {
    keyId: process.env.RAZORPAY_KEY_ID ? "Present" : "MISSING",
    secret: process.env.RAZORPAY_KEY_SECRET ? "Present" : "MISSING",
    keyIdValue: process.env.RAZORPAY_KEY_ID?.substring(0, 12) + "...",
  });

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return res.status(500).json({
      success: false,
      error: "Razorpay keys are not configured on Vercel"
    });
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { amount = 499 } = req.body;

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `donate_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
    });
  } catch (error: any) {
    console.error("Razorpay Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to create order'
    });
  }
}