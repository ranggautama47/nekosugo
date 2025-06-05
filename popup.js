/* popup.js - Konfirmasi top up (QRIS, Bank Transfer, Kartu Kredit) */
(function () {
  let selectedData = null; // ⬅️ Global scope agar dikenali semua handler

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
        orderNumber: card.dataset.orderNumber // ⬅️ Penting untuk kartu kredit
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

      if (selectedData.isQris) {
        window.dispatchEvent(new CustomEvent("topupConfirmed", { detail: selectedData }));
      } else if (selectedData.channel === "bank") {
        console.log("🔁 Mengirim data ke showBankPopup:", selectedData);
        if (typeof window.showBankPopup === "function") {
          window.showBankPopup({
            channel: selectedData.channel,
            coin: selectedData.coin,
            price: selectedData.price
          });
        } else {
          console.warn("⚠️ showBankPopup tidak tersedia.");
        }
      } else if (selectedData.channel === "kartukredit") {
        const creditCardPopup = document.getElementById("credit-card-popup");
        creditCardPopup.classList.remove("popup-hidden");
        creditCardPopup.classList.add("flex");

        const orderNumber = `ORDER${Date.now()}`;
        window.dispatchEvent(new CustomEvent("creditCardTopupConfirmed", {
          detail: {
            coin: selectedData.coin,
            price: selectedData.price,
            orderNumber: orderNumber
          }
        }));
      }
    });

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
  });
})();
