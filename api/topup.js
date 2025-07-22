// api/topup.js
export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  const method = req.query.method?.toLowerCase();
  return res.json({
    success: true,
    order_id: "ORD" + Date.now(),
    expires_at: new Date(Date.now() + 5 * 60000).toISOString(),
    qr_code_url: `https://dummy.qr/${method}`
  });
}
