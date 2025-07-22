// index.js (Express backend API)
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// Topup list data for all methods
const topupData = {
  dana: [
    { id: 1, koin: 28, harga: 5000 },
    { id: 2, koin: 169, harga: 30000 },
    { id: 3, koin: 566, harga: 100000 },
    { id: 4, koin: 1421, harga: 250000 },
    { id: 5, koin: 2852, harga: 500000 },
    { id: 6, koin: 5724, harga: 1000000 },
    { id: 7, koin: 14359, harga: 2500000 },
    { id: 8, koin: 28877, harga: 5000000 }
  ],
  gopay: [
    { id: 9, koin: 28, harga: 6000 },
    { id: 10, koin: 169, harga: 31000 },
    { id: 11, koin: 566, harga: 101000 },
    { id: 12, koin: 1421, harga: 251000 },
    { id: 13, koin: 2852, harga: 501000 },
    { id: 14, koin: 5724, harga: 1001000 },
    { id: 15, koin: 14359, harga: 2501000 },
    { id: 16, koin: 28877, harga: 5001000 }
  ],
  shopeepay: [
    { id: 17, koin: 28, harga: 6000 },
    { id: 18, koin: 169, harga: 31000 },
    { id: 19, koin: 566, harga: 101000 },
    { id: 20, koin: 1421, harga: 251000 },
    { id: 21, koin: 2852, harga: 501000 },
    { id: 22, koin: 5724, harga: 1001000 },
    { id: 23, koin: 14359, harga: 2501000 },
    { id: 24, koin: 28877, harga: 5001000 }
  ],
  bank: [
    { id: 25, koin: 28, harga: 5000 },
    { id: 26, koin: 169, harga: 30000 },
    { id: 27, koin: 566, harga: 100000 },
    { id: 28, koin: 1421, harga: 250000 },
    { id: 29, koin: 2852, harga: 500000 },
    { id: 30, koin: 5724, harga: 1000000 },
    { id: 31, koin: 14359, harga: 2500000 },
    { id: 32, koin: 28877, harga: 5000000 }
  ],
  kartu_kredit: [
    { id: 33, koin: 28, harga: 5000 },
    { id: 34, koin: 169, harga: 30000 },
    { id: 35, koin: 566, harga: 100000 },
    { id: 36, koin: 1421, harga: 250000 },
    { id: 37, koin: 2852, harga: 500000 },
    { id: 38, koin: 5724, harga: 1000000 },
    { id: 39, koin: 14359, harga: 2500000 },
    { id: 40, koin: 28877, harga: 5000000 }
  ]
};

app.get("/api/topup/:method", (req, res) => {
  const method = req.params.method.toLowerCase();
  if (topupData[method]) {
    res.json(topupData[method]);
  } else {
    res.status(404).json({ error: "Metode pembayaran tidak ditemukan." });
  }
});

module.exports = app;
app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});
