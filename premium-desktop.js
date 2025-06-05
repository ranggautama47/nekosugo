console.log("🖥️ premium-desktop.js aktif - Script loaded successfully");

// ==================== CONSTANTS ====================
const plans = {
  "mobile-plan": {
    name: "Mobile",
    price: "Rp 54.000",
    quality: "Adil",
    resolution: "480p",
    devices: "Ponsel seluler, tablet",
    simultaneous: "1",
    download: "1"
  },
  "basic-plan": {
    name: "Basic",
    price: "Rp 65.000",
    quality: "Baik",
    resolution: "720p (HD)",
    devices: "TV, computer, Ponsel seluler, tablet",
    simultaneous: "1",
    download: "1"
  },
  "standard-plan": {
    name: "Standard",
    price: "Rp 120.000",
    quality: "Sangat bagus",
    resolution: "1080p (Full HD)",
    devices: "TV, computer, ponsel seluler, tablet",
    simultaneous: "2",
    download: "2"
  },
  "premium-plan": {
    name: "Premium",
    price: "Rp 186.000",
    quality: "Paling baik",
    resolution: "4K (Ultra HD) + HDR",
    devices: "TV, computer, Ponsel seluler, tablet",
    simultaneous: "4",
    download: "6",
    audio: "Termasuk"
  }
};

const mobilePlanIds = {
  "mobile-mobile-plan": "mobile-plan",
  "mobile-basic-plan": "basic-plan",
  "mobile-standard-plan": "standard-plan",
  "mobile-premium-plan": "premium-plan"
};

// ==================== VIEW TOGGLE SYSTEM ====================
function toggleView() {
  const isMobile = window.innerWidth <= 767;
  console.log(`View toggle: ${isMobile ? 'Mobile' : 'Desktop'} view`);

  const desktopView = document.querySelector(".desktop-view");
  const mobileView = document.querySelector(".mobile-view");

  if (isMobile) {
    if (desktopView) desktopView.style.display = "none";
    if (mobileView) mobileView.style.display = "block";
    // Set default mobile selection
    handlePlanSelection('premium-plan', true);
    updateMobilePlanDetails('premium-plan');
  } else {
    if (desktopView) desktopView.style.display = "block";
    if (mobileView) mobileView.style.display = "none";
    // Set default desktop selection
    handlePlanSelection('mobile-plan');
  }
}

// ==================== PLAN SELECTION SYSTEM ====================
function updateMobilePlanDetails(planId) {
  const plan = plans[planId];
  if (!plan) {
    console.error('Plan not found:', planId);
    return;
  }

  // Update all details
  document.getElementById('mobile-price-value').textContent = plan.price;
  document.getElementById('mobile-quality-value').textContent = plan.quality;
  document.getElementById('mobile-resolution-value').textContent = plan.resolution;
  document.getElementById('mobile-devices-value').textContent = plan.devices;
  document.getElementById('mobile-simultaneous-value').textContent = plan.simultaneous;
  document.getElementById('mobile-download-value').textContent = plan.download;

  // Handle spatial audio specifically for premium
  const audioElement = document.getElementById('mobile-audio-value');
  const audioContainer = audioElement.closest('div');
  if (planId === 'premium-plan') {
    audioElement.textContent = plan.audio;
    audioContainer.style.display = 'flex';
  } else {
    audioElement.textContent = '-';
    audioContainer.style.display = 'none';
  }
}

// In your handlePlanSelection function:
function handlePlanSelection(planId, isMobile = false) {
  console.log(`Plan selected: ${planId}`);
  
  if (isMobile) {
    // For mobile view
    document.querySelectorAll('.mobile-plan-card').forEach(card => {
      card.classList.remove('selected');
      const checkmark = card.querySelector('.mobile-checkmark');
      if (checkmark) checkmark.style.display = 'none';
      
      // Also remove selected class from popular tag
      const popularTag = card.querySelector('.popular-tag');
      if (popularTag) popularTag.classList.remove('selected');
    });

    const selectedCard = document.getElementById(`mobile-${planId.split('-')[0]}-plan`);
    if (selectedCard) {
      selectedCard.classList.add('selected');
      const checkmark = selectedCard.querySelector('.mobile-checkmark');
      if (checkmark) checkmark.style.display = 'flex';
      
      // Add selected class to popular tag if it's premium plan
      if (planId === 'premium-plan') {
        const popularTag = selectedCard.querySelector('.popular-tag');
        if (popularTag) popularTag.classList.add('selected');
      }
    }
  } else {
    // For desktop view
    document.querySelectorAll('.plan-card').forEach(card => {
      card.classList.remove('selected');
      const checkmark = card.querySelector('.plan-checkmark');
      if (checkmark) checkmark.style.display = 'none';
    });

    const selectedCard = document.getElementById(planId);
    if (selectedCard) {
      selectedCard.classList.add('selected');
      const checkmark = selectedCard.querySelector('.plan-checkmark');
      if (checkmark) checkmark.style.display = 'flex';
    }
  }

  // Update popular tag
  const popularTag = document.querySelector('.popular-tag');
  if (planId === 'premium-plan') {
    popularTag?.classList.add('selected');
  } else {
    popularTag?.classList.remove('selected');
  }

  // Update mobile details if in mobile view
  if (window.innerWidth <= 767) {
    updateMobilePlanDetails(planId);
  }
}

// ==================== PAYMENT SYSTEM ====================
let countdownInterval;

function generateOrderNumber() {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `NS${year}${month}${day}${randomNum}`;
}

function getSelectedPlanInfo() {
  let selectedCard;
  
  if (window.innerWidth <= 767) {
    // Mobile view
    selectedCard = document.querySelector('.mobile-plan-card.selected');
    if (!selectedCard) {
      selectedCard = document.getElementById('mobile-premium-plan');
    }
    const planId = mobilePlanIds[selectedCard.id];
    return plans[planId] || plans['premium-plan'];
  } else {
    // Desktop view
    selectedCard = document.querySelector('.plan-card.selected');
    if (!selectedCard) {
      selectedCard = document.getElementById('premium-plan');
    }
    return plans[selectedCard.id] || plans['premium-plan'];
  }
}

function startCountdown() {
  clearInterval(countdownInterval);
  const deadline = new Date(Date.now() + 30 * 60 * 1000);
  
  const jam = deadline.getHours().toString().padStart(2, '0');
  const menit = deadline.getMinutes().toString().padStart(2, '0');
  document.getElementById('transferDeadline').textContent = `${jam}:${menit}`;

  const orderNumber = generateOrderNumber();
  document.getElementById('orderNumberDisplay').textContent = `Nomor Pesanan: ${orderNumber}`;
  document.getElementById('orderNumberBank').textContent = `Nomor Pesanan: ${orderNumber}`;

  const countdownElement = document.getElementById('countdownBank');
  countdownInterval = setInterval(() => {
    const now = new Date();
    const diff = deadline - now;
    
    if (diff <= 0) {
      countdownElement.textContent = '⛔ Waktu habis';
      countdownElement.style.color = 'red';
      clearInterval(countdownInterval);
      return;
    }
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    countdownElement.textContent = `⏳ Hitung mundur: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    countdownElement.style.color = minutes < 5 ? 'red' : 'inherit';
  }, 1000);
}

// ==================== MODAL SYSTEM ====================
function closeBankTransferPopup() {
  console.log("Closing bank transfer popup");
  const popup = document.getElementById("bankTransferPopup");
  if (popup) {
    popup.style.display = "none";
    if (window.countdownInterval) {
      clearInterval(window.countdownInterval);
    }
  }
  return false;
}

function closeAllModals() {
  document.getElementById("confirmModal").style.display = "none";
  document.getElementById("mobileConfirmModal").style.display = "none";
  document.getElementById("bankTransferPopup").style.display = "none";
  document.getElementById("uploadCompletePopup").style.display = "none";
  clearInterval(countdownInterval);
  document.getElementById('paymentProof').value = '';
  return false;
}

function showConfirmationModal() {
  const selectedPlan = getSelectedPlanInfo();
  console.log('Selected plan for confirmation:', selectedPlan);
  
  if (!selectedPlan) {
    console.error('No plan selected');
    return;
  }
  
  if (window.innerWidth <= 767) {
    // Mobile view
    document.getElementById('mobile-confirm-amount').textContent = selectedPlan.price;
    document.getElementById('mobile-confirm-plan').textContent = selectedPlan.name;
    document.getElementById('mobileConfirmModal').style.display = 'flex';
  } else {
    // Desktop view
    document.getElementById('confirmText').innerHTML = 
      `Apakah Anda Yakin ingin melanjutkan pembayaran sebesar 
      <span class="font-bold">${selectedPlan.price}</span> untuk paket 
      <span class="font-bold">${selectedPlan.name}</span>?`;
    document.getElementById('confirmModal').style.display = 'flex';
  }
  
  // Update bank transfer amount
  document.getElementById('bankAmount').textContent = selectedPlan.price.replace('Rp ', '');
}

// ==================== INITIALIZATION ====================
function initializeApp() {
  console.log("Initializing application");
  
  // Initial view setup
  toggleView();
  
  // Responsive view handling
  window.addEventListener("resize", () => {
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(toggleView, 250);
  });

  // Plan selection setup
  document.querySelectorAll('.plan-card').forEach(card => {
    card.addEventListener('click', function() {
      handlePlanSelection(this.id);
    });
  });

  document.querySelectorAll('.mobile-plan-card').forEach(card => {
    card.addEventListener('click', function() {
      const planId = mobilePlanIds[this.id];
      handlePlanSelection(planId, true);
      updateMobilePlanDetails(planId);
    });
  });

  // Payment buttons
  document.getElementById('confirmButton')?.addEventListener('click', showConfirmationModal);
  document.getElementById('mobile-confirmButton')?.addEventListener('click', showConfirmationModal);

  // Modal buttons
  document.getElementById('cancelBtn')?.addEventListener('click', closeAllModals);
  document.getElementById('confirmPaymentBtn')?.addEventListener('click', function() {
    closeAllModals();
    document.getElementById('bankTransferPopup').style.display = 'flex';
    startCountdown();
  });

  // Mobile modal buttons
  document.getElementById('cancelBtnMobile')?.addEventListener('click', closeAllModals);
  document.getElementById('confirmBtnMobile')?.addEventListener('click', function() {
    closeAllModals();
    document.getElementById('bankTransferPopup').style.display = 'flex';
    startCountdown();
  });

  // File upload handling
  document.getElementById('paymentProof')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        alert('Format file harus JPG/JPEG/PNG');
        this.value = '';
        return false;
      }
      
      if (file.size > 3 * 1024 * 1000) {
        alert('Ukuran file maksimal 3MB');
        this.value = '';
        return false;
      }
    }
  });

  // Global functions
  window.uploadCompletePopup = function() {
    const fileInput = document.getElementById('paymentProof');
    if (!fileInput.files?.length) {
      alert('Silakan pilih file bukti transfer terlebih dahulu');
      return false;
    }
    document.getElementById('bankTransferPopup').style.display = 'none';
    document.getElementById('uploadCompletePopup').style.display = 'flex';
    return false;
  };

  window.closeAllModals = closeAllModals;
  window.closeBankTransferPopup = closeBankTransferPopup;

  window.copyWithToast = function(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return false;
    
    navigator.clipboard.writeText(element.textContent.trim()).then(() => {
      const toast = document.getElementById('copyToast');
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2000);
    });
    return false;
  };
}

// Start the application
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}