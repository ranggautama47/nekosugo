window.addEventListener('DOMContentLoaded', () => {
  const creditCardPopup = document.getElementById('credit-card-popup');
  const cardNumberInput = document.getElementById('cardNumber');
  const expiryDateInput = document.getElementById('expiryDate');
  const cvvInput = document.getElementById('cvv');
  const saveCardCheckbox = document.getElementById('saveCard');
  const installmentSelect = document.getElementById('installmentSelect');
  const totalAmountDisplay = document.getElementById('totalAmount');
  const totalCoinDisplay = document.getElementById('totalCoin');
  const payButton = document.getElementById('payButton');
  const showCoinInfoLink = document.getElementById('showCoinInfo');
  const coinInfoSection = document.getElementById('coinInfo');
  const cvvPopup = document.getElementById('cvvPopup');
  const saveInfoPopup = document.getElementById('saveInfoPopup');
  const countdownDisplay = document.getElementById('countdownText');
  const popupKartuKredit = document.getElementById('popupkartukredit');
  const confirmModal = document.getElementById('confirmModal');
  const confirmBtn = document.getElementById('confirmBtn');
  const confirmTopupBtn = document.getElementById('confirmTopupBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const confirmAmount = document.getElementById('confirmAmount');
  const confirmCoin = document.getElementById('confirmCoin');
  const orderNumberText = document.getElementById('orderNumberText');
  const orderInfoRow = document.getElementById('orderInfoRow');
  const installmentInfoRow = document.getElementById('installmentInfoRow');
  const installmentAmountText = document.getElementById('installmentAmountText');


  let basePrice = 0;
  let coinAmount = 0;
  let selectedCard = null;
  let timerInterval;


  function updateTotal() {
    let adjustedPrice = basePrice + 2500;
    const option = installmentSelect.value;

    if (option.includes('penuh')) {
      adjustedPrice += Math.round(basePrice * 0.01);
    } else if (option.includes('3')) {
      adjustedPrice += Math.round(basePrice * 0.035);
    } else if (option.includes('6')) {
      adjustedPrice += Math.round(basePrice * 0.045);
    } else if (option.includes('12')) {
      adjustedPrice += Math.round(basePrice * 0.055);
    }

    totalAmountDisplay.textContent = `Rp${adjustedPrice.toLocaleString('id-ID')}`;
    totalCoinDisplay.textContent = `${coinAmount} Coin`;
  }

  function validateInputs() {
    const cardNumber = cardNumberInput.value.replace(/\D/g, '');
    const expiryDate = expiryDateInput.value;
    const cvv = cvvInput.value;

    const isCardValid = cardNumber.length >= 16;
    const isExpiryValid = /^\d{2}\/\d{2}$/.test(expiryDate);
    const isCvvValid = /^\d{3,4}$/.test(cvv);

    payButton.disabled = !(isCardValid && isExpiryValid && isCvvValid);
    payButton.style.backgroundColor = payButton.disabled ? '#ccc' : '#1a73e8';
    payButton.style.cursor = payButton.disabled ? 'not-allowed' : 'pointer';
  }

  function startTimer() {
    let minutes = 59;
    let seconds = 59;

    function updateTimerDisplay(mins, secs) {
      const formattedMins = mins < 10 ? `0${mins}` : mins;
      const formattedSecs = secs < 10 ? `0${secs}` : secs;
      countdownDisplay.textContent = `Selesaikan pembayaran dalam 00j ${formattedMins}m ${formattedSecs}d`;
    }

    updateTimerDisplay(minutes, seconds);

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      seconds--;
      if (seconds < 0) {
        seconds = 59;
        minutes--;
      }

      if (minutes < 0) {
        clearInterval(timerInterval);
        countdownDisplay.textContent = "Waktu pembayaran telah habis";
        return;
      }

      updateTimerDisplay(minutes, seconds);
    }, 1000);
  }

  function openCVVPopup() {
    cvvPopup.classList.remove('hidden');
  }

  function closeCVVPopup() {
    cvvPopup.classList.add('hidden');
  }

  function toggleSaveInfo() {
    saveInfoPopup.classList.toggle('hidden');
  }

function closecreditPopup() {
  const popup = document.getElementById('credit-card-popup');
  if (popup) {
    popup.classList.remove('flex');
    popup.classList.add('popup-hidden');
  }

  clearInterval(timerInterval); // pastikan ini dideklarasikan di luar agar global
}


window.openCVVPopup = function () {
  document.getElementById("cvvPopup").style.display = "block";
};

window.closeCVVPopup = function () {
  document.getElementById("cvvPopup").style.display = "none";
};

window.toggleSaveInfo = function () {
  const popup = document.getElementById("saveInfoPopup");
  popup.style.display = (popup.style.display === "block") ? "none" : "block";
};


  document.addEventListener('click', function (event) {
    if (!event.target.closest('.fa-info-circle') && saveInfoPopup && !saveInfoPopup.classList.contains('hidden')) {
      saveInfoPopup.classList.add('hidden');
    }
  });

  document.querySelectorAll('.popup-card[data-channel="kartukredit"]').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.popup-card[data-channel="kartukredit"]').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      selectedCard = {
        coin: parseInt(card.dataset.coin),
        price: parseInt(card.dataset.price)
      };

      basePrice = selectedCard.price;
      coinAmount = selectedCard.coin;
      updateTotal();

      confirmCoin.innerText = `${selectedCard.coin} coin`;
      confirmAmount.innerText = `Rp ${selectedCard.price.toLocaleString('id-ID')}`;
    });
  });

  confirmBtn?.addEventListener('click', () => {
  if (!(selectedCard && !popupKartuKredit.classList.contains('hidden'))) return;
  confirmModal.classList.remove('hidden');
});


  confirmTopupBtn?.addEventListener('click', () => {
    confirmModal.classList.add('hidden');
    creditCardPopup.classList.remove('hidden');
    popupKartuKredit?.classList.add('hidden');
    updateTotal();
    startTimer();
  });

  cancelBtn?.addEventListener('click', () => {
    confirmModal.classList.add('hidden');
  });

  cardNumberInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0) value = value.match(/.{1,4}/g).join(' ');
    e.target.value = value;
    validateInputs();
  });

  expiryDateInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) value = value.substring(0, 2) + '/' + value.substring(2, 4);
    e.target.value = value;
    validateInputs();
  });

  cvvInput.addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '');
    validateInputs();
  });

  installmentSelect.addEventListener('change', updateTotal);

installmentSelect.addEventListener('change', () => {
  updateTotal();
  // Trigger ulang detail jika sudah muncul
  const iconInfoVisible = !coinInfoSection.classList.contains('hidden');
  if (iconInfoVisible) {
    const event = new CustomEvent("creditCardTopupConfirmed", {
      detail: {
        coin: coinAmount,
        price: basePrice,
        orderNumber: `ORDER${Date.now()}`
      }
    });
    window.dispatchEvent(event);
  }
});

if (!window.__showCoinInfoInitialized) {
  showCoinInfoLink.addEventListener('click', function (e) {
  e.preventDefault();

  console.log('🔍 Lihat detail diklik');
  console.log('Status coinInfo:', coinInfoSection.classList.contains('hidden') ? 'Tersembunyi' : 'Tampil');
  console.log('Cicilan:', installmentSelect.value);

  const isHidden = coinInfoSection.classList.contains('hidden');

  coinInfoSection.classList.toggle('hidden');
  coinInfoSection.style.display = isHidden ? 'block' : 'none'; // 👈 Paksa tampil

  const icon = this.querySelector('i');
  icon?.classList.toggle('fa-chevron-down');
  icon?.classList.toggle('fa-chevron-up');

  const installmentInfoRow = document.getElementById('installmentInfoRow');
  const installmentAmountText = document.getElementById('installmentAmountText');
  const installmentOption = installmentSelect.value;

 // Jangan auto-return — biarkan kode di bawah tetap berjalan untuk hitung cicilan
if (!isHidden && installmentOption.includes("Cicilan")) {
  const totalAmount = totalAmountDisplay.textContent.replace(/[^\d]/g, '');
  const months = parseInt(installmentOption.match(/\d+/)[0]);
  const monthly = Math.round(parseInt(totalAmount) / months);
  installmentAmountText.textContent = `Rp${monthly.toLocaleString('id-ID')} x ${months}`;
  installmentInfoRow.style.display = 'flex';
} else {
  installmentInfoRow.style.display = 'none';
}
console.log('🧮 Cicilan tampil?', installmentOption);
console.log('💰 Total:', totalAmountDisplay.textContent);
console.log('🧾 Baris cicilan:', installmentInfoRow);


  if (installmentOption.includes("Cicilan")) {
    const totalAmount = totalAmountDisplay.textContent.replace(/[^\d]/g, '');
    const months = parseInt(installmentOption.match(/\d+/)[0]);
    const monthly = Math.round(parseInt(totalAmount) / months);
    installmentAmountText.textContent = `Rp${monthly.toLocaleString('id-ID')} x ${months}`;
    installmentInfoRow.style.display = 'flex';
  } else {
    installmentInfoRow.style.display = 'none';
  }
});

  // Mencegah listener ganda
  window.__showCoinInfoInitialized = true;
}



 window.addEventListener('creditCardTopupConfirmed', (e) => {
  const { coin, price, orderNumber } = e.detail;

  basePrice = +price;
  coinAmount = +coin;

  creditCardPopup.classList.remove('hidden');
  popupKartuKredit?.classList.add('hidden');

  updateTotal();
  startTimer();

  // ⬇️ Isi order number ke tampilan
  if (orderNumberText && orderInfoRow && orderNumber) {
    orderNumberText.textContent = orderNumber;
    orderInfoRow.style.display = 'flex';
  }
  const option = installmentSelect.value;
let installmentCount = 0;

if (option.includes('3')) installmentCount = 3;
else if (option.includes('6')) installmentCount = 6;
else if (option.includes('12')) installmentCount = 12;

// Ambil totalAmount dari DOM dan konversi angka
const amountText = totalAmountDisplay.textContent.replace(/[^\d]/g, '');
const totalAmount = parseInt(amountText, 10);

if (installmentCount > 0 && !isNaN(totalAmount)) {
  const perMonth = Math.round(totalAmount / installmentCount);
  document.getElementById('installmentAmountText').textContent = `Rp${perMonth.toLocaleString('id-ID')} x ${installmentCount}`;
  document.getElementById('installmentInfoRow').style.display = 'flex';
} else {
  // Jika bayar penuh, sembunyikan info cicilan
  document.getElementById('installmentInfoRow').style.display = 'none';
}

});



  updateTotal(); // ⬅️ setelah ini tambahkan:

  payButton.addEventListener('click', () => {
    creditCardPopup.classList.add('popup-hidden');
    creditCardPopup.classList.remove('flex');

    cardNumberInput.value = '';
    expiryDateInput.value = '';
    cvvInput.value = '';
    payButton.disabled = true;

    alert('Pembayaran berhasil dikirim!');

    if (orderNumberText && orderInfoRow) {
      orderNumberText.textContent = '';
      orderInfoRow.style.display = 'none';
    }

    clearInterval(timerInterval);
  });
});
function openCVVPopup() {
  cvvPopup.style.display = "block";
}
function closeCVVPopup() {
  cvvPopup.style.display = "none";
}

function toggleSaveInfo() {
  saveInfoPopup.classList.toggle("hidden");
}

let timerInterval; // ← Taruh ini paling atas, di luar semuanya

window.addEventListener('DOMContentLoaded', () => {
  // ... semua kode kamu termasuk startTimer() yang pakai timerInterval
});

function closecreditPopup() {
  const popup = document.getElementById('credit-card-popup');
  if (popup) {
    popup.classList.remove('flex');
    popup.classList.add('popup-hidden'); // atau 'hidden'
  }

  clearInterval(timerInterval); // Sekarang ini tidak error
}

window.closeBankPopup = closeBankPopup;
window.toggleCVVPopup = function () {
  const tooltip = document.getElementById('cvvPopup');
  tooltip.classList.toggle('hidden');
};

// Menutup jika klik di luar
document.addEventListener('click', function (e) {
  const tooltip = document.getElementById('cvvPopup');
  if (
    tooltip &&
    !e.target.closest('#cvvPopup') &&
    !e.target.closest('.fa-info-circle')
  ) {
    tooltip.classList.add('hidden');
  }
});
