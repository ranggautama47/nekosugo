/* popup.js - Konfirmasi top up (QRIS, Bank Transfer, Kartu Kredit) */
(function () {
  let selectedData = null;
  
 const API_BASE = location.hostname === "localhost"
    ? "http://localhost:8000/api/topup"
    : "https://nekosugo.vercel.app/api/topup";
  
  document.addEventListener("DOMContentLoaded", function () {
    const confirmBtn = document.getElementById("confirmBtn");
    const confirmModal = document.getElementById("confirmModal");
    const confirmAmount = document.getElementById("confirmAmount");
    const confirmCoin = document.getElementById("confirmCoin");
    const cancelBtn = document.getElementById("cancelBtn");
    const confirmTopupBtn = document.getElementById("confirmTopupBtn");

    document.addEventListener("click", function (e) {
      const card = e.target.closest(".popup-card");
      if (!card) return;
      e.stopPropagation();
      e.preventDefault();

      document.querySelectorAll(".popup-card").forEach(el => {
        el.classList.remove("selected");
        const check = el.querySelector(".checkmark-container");
        if (check) check.style.display = "none";
      });

      card.classList.add("selected");
      const mark = card.querySelector(".checkmark-container");
      if (mark) mark.style.display = "flex";

      selectedData = {
        channel: card.dataset.channel?.toLowerCase(),
        coin: card.dataset.coin,
        price: card.dataset.price,
        isQris: card.hasAttribute("data-qris"),
        orderNumber: card.dataset.orderNumber
      };
    });

    confirmBtn?.addEventListener("click", () => {
      if (!selectedData) return;

      confirmAmount.textContent = `Rp ${Number(selectedData.price).toLocaleString()}`;
      confirmCoin.textContent = `${selectedData.coin} koin melalui ${selectedData.channel}`;
      confirmModal.classList.add("show");
      confirmModal.classList.remove("hidden");
    });

    cancelBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      confirmModal.classList.remove("show");
      confirmModal.classList.add("hidden");
    });

    confirmTopupBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      confirmModal.classList.remove("show");
      confirmModal.classList.add("hidden");

      if (!selectedData) return;

     fetch(`${API_BASE}/${selectedData.channel}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          channel: selectedData.channel,
          coin_amount: parseInt(selectedData.coin),
          price: parseInt(selectedData.price)
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            selectedData.order_id = data.order_id;
            selectedData.expires_at = data.expires_at;
            selectedData.qr_code_url = data.qr_code_url;

            window.dispatchEvent(new CustomEvent("topupConfirmed", { detail: selectedData }));
          } else {
            alert("Gagal melakukan top-up. Silakan coba lagi.");
          }
        })
        .catch(err => {
          console.error("Gagal fetch:", err);
          alert("Terjadi kesalahan saat menghubungi server.");
        });
    });

    // 💡 Letakkan ini di luar tombol agar tidak didaftarkan ulang tiap klik
    window.addEventListener("topupConfirmed", (e) => {
      const isQr = !!e.detail?.isQris;
      console.log("📦 topupConfirmed:", e.detail);
      console.log("🔍 Apakah QRIS:", isQr);

      setTimeout(() => {
        const isQrVisible = !document.getElementById("qrPopup")?.classList.contains("hidden");
        const isBankVisible = !document.getElementById("bankTransferPopup")?.classList.contains("hidden");

        console.log("📊 QR Popup visible:", isQrVisible);
        console.log("📊 Bank Transfer Popup visible:", isBankVisible);

        if (isQrVisible && isBankVisible) {
          console.warn("🚨 Dua popup tampil bersamaan! Ada konflik!");
        }
      }, 300);
    });
  }); // ⬅️ Tutup DOMContentLoaded
})(); // ⬅️ Tutup IIFE
