/** qrpopup.js - QRIS popup logic with theme switch + animation */
(function () {
    const qrisMethods = ["dana", "gopay", "shopeepay"];
    let countdownInterval = null;
  
    function normalizeChannel(channel) {
        const map = {
            shopeepay: "shopeepay",
            dana: "dana",
            gopay: "gopay"
          };
      return map[channel.toLowerCase()] || channel.toLowerCase();
    }
  
    function formatDate(date) {
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
    }
  
    function formatDateOnly(date) {
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    }
  
    function hideAllPopups() {
        const ids = ["qrPopup", "bankTransferPopup", "uploadCompletePopup"];
        ids.forEach(id => {
          const el = document.getElementById(id);
          if (el) {
            el.classList.add("hidden");
            el.classList.remove("flex"); // 🧼 pastikan hilangkan flex agar tidak tampil
          }
        });
      }
      
  
    function showQrPopup({ channel, coin, price }) {
      const normalized = normalizeChannel(channel);
      if (!qrisMethods.includes(normalized)) return;
  
      hideAllPopups(); // ✅ pastikan bank popup tidak ikut tampil
  
      const qrPopup = document.getElementById("qrPopup");
      const qrAmount = document.getElementById("qrAmount");
      const qrImage = document.getElementById("qrImage");
      const paymentLogo = document.getElementById("paymentLogo");
      const currentDate = document.getElementById("currentDate");
      const timeLimit = document.getElementById("timeLimit");
      const scanInstruction = document.getElementById("scanInstruction");
      const countdownTimer = document.getElementById("countdownTimer");
      const orderId = document.getElementById("orderId");
  
      qrPopup.style.display = "flex"; // ✅ center fix
      qrPopup.style.alignItems = "center"; // ✅ center vertically
      qrPopup.style.justifyContent = "center"; // ✅ center horizontally

      qrAmount.textContent = `Rp ${Number(price).toLocaleString()}`;
      qrImage.src = "asset/qris_gpn.png";
      paymentLogo.src = `asset/qris/logo-${normalized}.png`;
      currentDate.textContent = formatDateOnly(new Date());
      scanInstruction.textContent = `Silakan scan QR code dengan aplikasi ${normalized} dan lakukan pembayaran menggunakan aplikasi tersebut.`;
      orderId.textContent = `Nomor pesanan: ORDER${Date.now()}`;
  
      document.body.classList.remove("shopeepay-theme", "gopay-theme", "dana-theme");
      document.body.classList.add(`${normalized}-theme`);
  
      const expireTime = new Date(Date.now() + 15 * 60 * 1000);
      timeLimit.innerHTML = `<span style="color: red; font-weight: bold;">Batas Waktu Pembayaran:</span><br>${formatDate(expireTime)}`;
  
      clearInterval(countdownInterval);
      function updateTimer() {
        const now = new Date();
        const diff = expireTime - now;
        if (diff <= 0) {
          countdownTimer.textContent = "Waktu habis, silakan coba lagi.";
          clearInterval(countdownInterval);
          return;
        }
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        countdownTimer.textContent = `Sisa waktu pembayaran: ${minutes} menit ${seconds} detik`;
      }
      updateTimer();
      countdownInterval = setInterval(updateTimer, 1000);
  
      qrPopup.classList.remove("hidden");
      qrPopup.classList.add("fade-in");
    }
 window.closeQrPopup = function () {
  const qrPopup = document.getElementById("qrPopup");
  qrPopup.classList.add("hidden");
  qrPopup.classList.remove("fade-in");

  // ✅ tambahkan baris ini untuk reset display
  qrPopup.style.display = "none";

  // ✅ dan juga reset alignment agar tidak bocor
  qrPopup.style.alignItems = "";
  qrPopup.style.justifyContent = "";

  clearInterval(countdownInterval);
};

  
    window.addEventListener("topupConfirmed", (e) => {
      const { channel } = e.detail || {};
      if (qrisMethods.includes(channel)) {
        showQrPopup(e.detail);
      }
    });
  })();
  window.addEventListener("topupConfirmed", (e) => {
    const isQr = !!e.detail?.isQris;
    console.log("📦 topupConfirmed:", e.detail);
    console.log("🔍 Apakah QRIS:", isQr);
  
    // Tunggu DOM update lalu cek visibilitas popup
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

document.getElementById("qrPopup").style.alignItems = "center";
document.getElementById("qrPopup").style.justifyContent = "center";

  