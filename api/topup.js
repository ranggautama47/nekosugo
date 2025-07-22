// api/index.js
const express = require("express");
const cors = require("cors");
const app = express();

// Fungsi penting untuk dipakai di Vercel,
// jangan pakai app.listen() di deployment.
app.use(cors());
app.use(express.json());

app.get("/api/topup/:method", (req, res) => {
  const { method } = req.params;
  if (!method) return res.status(400).json({ error: "Metode diperlukan" });
  return res.json({ success: true, message: `GET topup ${method}` });
});

app.post("/api/topup/:method", (req, res) => {
  const { method } = req.params;
  // Simulasikan response
  return res.json({
    success: true,
    order_id: "ORD" + Date.now(),
    expires_at: new Date(Date.now() + 5 * 60000).toISOString(),
    qr_code_url: `https://dummy.qr/${method}`
  });
});

module.exports = app;
