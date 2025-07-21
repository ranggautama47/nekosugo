/** banktransfer.js - Fixed version with complete popup flow + countdown + full tanggal */
(function () {
    console.log("✅ banktransfer.js berhasil dimuat");

    let dataOrderTerakhir = null;
    let countdownInterval = null;
    const CHANNEL_BANK = "bank";

    const elemen = {
        popup: document.getElementById("bankTransferPopup"),
        jumlah: document.getElementById("bankAmount"),
        batasWaktu: document.getElementById("transferDeadline"),
        infoOrder: document.getElementById("orderInfo"),
        tampilanOrder: document.getElementById("orderNumberDisplay"),
        popupUpload: document.getElementById("uploadCompletePopup"),
        buktiTransfer: document.getElementById("paymentProof"),
        uploadBtn: document.querySelector("#bankTransferPopup button[onclick='uploadCompletePopup()']"),
        waktuLengkap: document.getElementById("timeLimitBank"),
        countdownArea: document.getElementById("countdownTimerBank")
    };

    function formatTanggalIndo(date) {
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    }

    function sembunyikanSemuaPopup() {
        ["qrPopup", "bankTransferPopup", "uploadCompletePopup"].forEach(id => {
            const popup = document.getElementById(id);
            if (popup) {
                popup.classList.add("hidden");
                popup.classList.remove("flex");
            }
        });
    }

    function tampilkanPopupBank({ channel, coin, price }) {
        if (channel !== CHANNEL_BANK) return;

        if (!elemen.popup || !elemen.jumlah || !elemen.batasWaktu) {
            console.error("❌ Elemen penting tidak ditemukan");
            return;
        }

        const nomorOrder = `ORDER${Date.now().toString().slice(-8)}`;
        const waktuKadaluarsa = new Date(Date.now() + 15 * 60 * 1000);
        dataOrderTerakhir = { channel, coin, price, nomorOrder, waktuKadaluarsa };

        elemen.jumlah.textContent = `Rp ${Number(price).toLocaleString("id-ID")}`;
        elemen.batasWaktu.textContent = waktuKadaluarsa.toLocaleTimeString("id-ID", {
            hour: '2-digit',
            minute: '2-digit'
        });

        if (elemen.waktuLengkap) {
            elemen.waktuLengkap.innerHTML = `
                <span style="color:red;font-weight:bold;">Batas Waktu Pembayaran:</span><br>
                ${formatTanggalIndo(waktuKadaluarsa)}
                <div id="countdownTimerBank" class="text-green-700 font-semibold mt-1"></div>
            `;
            elemen.countdownArea = document.getElementById("countdownTimerBank");
        }

        if (elemen.infoOrder) {
            elemen.infoOrder.innerHTML = `<p class="text-green-600">Nomer pesanan: ${nomorOrder}</p>`;
        }

        if (elemen.tampilanOrder) {
            elemen.tampilanOrder.textContent = `Nomor Pesanan: ${nomorOrder}`;
        }

        if (elemen.buktiTransfer) {
            elemen.buktiTransfer.value = "";
        }

        clearInterval(countdownInterval);
        countdownInterval = setInterval(() => {
            const now = new Date();
            const selisih = waktuKadaluarsa - now;
            if (selisih <= 0) {
                if (elemen.countdownArea) elemen.countdownArea.textContent = "⛔ Waktu habis";
                clearInterval(countdownInterval);
                return;
            }
            const menit = Math.floor(selisih / 60000);
            const detik = Math.floor((selisih % 60000) / 1000);
            if (elemen.countdownArea) {
                elemen.countdownArea.textContent = `⏳ Hitung mundur: ${menit}m ${detik}s`;
            }
        }, 1000);

        sembunyikanSemuaPopup();
        elemen.popup.classList.remove("hidden");
        elemen.popup.classList.add("flex");
    }

    function handleUploadSelesai() {
        if (!elemen.buktiTransfer || !elemen.popup || !elemen.popupUpload) {
            console.error("❌ Elemen tidak lengkap");
            return;
        }

        if (!elemen.buktiTransfer.files || elemen.buktiTransfer.files.length === 0) {
            alert("Silakan pilih bukti transfer terlebih dahulu.");
            return;
        }

        elemen.popup.classList.add("hidden");
        elemen.popup.classList.remove("flex");
        elemen.popupUpload.classList.remove("hidden");
        elemen.popupUpload.classList.add("flex");

        console.log("✅ Bukti transfer terkirim, menampilkan popup uploadCompletePopup");
    }

    function tutupSemuaPopupBank() {
        clearInterval(countdownInterval);
        sembunyikanSemuaPopup();
    }

    function setupEventListeners() {
        // Handle close button
        const closeBtn = document.querySelector("#bankTransferPopup .close-btn");
        if (closeBtn) {
            closeBtn.addEventListener("click", tutupSemuaPopupBank);
        }

        // Handle upload button
        if (elemen.uploadBtn) {
            elemen.uploadBtn.addEventListener("click", handleUploadSelesai);
        }

        // Handle close button in upload complete popup
        const uploadCloseBtn = document.querySelector("#uploadCompletePopup button");
        if (uploadCloseBtn) {
            uploadCloseBtn.addEventListener("click", tutupSemuaPopupBank);
        }
    }

    document.addEventListener("DOMContentLoaded", function() {
        setupEventListeners();
    });

    window.addEventListener("topupConfirmed", (e) => {
        if (e.detail?.channel === CHANNEL_BANK) {
            tampilkanPopupBank(e.detail);
        }
    });

    window.showBankPopup = tampilkanPopupBank;
    window.uploadCompletePopup = handleUploadSelesai;
    window.closeBankTransferPopup = tutupSemuaPopupBank;
    window.closeBankPopup = tutupSemuaPopupBank;

    window.copyWithToast = function(elementId) {
        const text = document.getElementById(elementId)?.innerText;
        if (!text) return;

        navigator.clipboard.writeText(text).then(() => {
            const toast = document.getElementById("copyToast");
            if (toast) {
                toast.classList.remove("hidden");
                setTimeout(() => toast.classList.add("hidden"), 2000);
            }
        }).catch(err => console.error("Gagal menyalin:", err));
    };
})();