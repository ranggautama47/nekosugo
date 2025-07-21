// Path: js_koin/transactions.js

document.addEventListener("DOMContentLoaded", function() {
  // Data contoh (nanti bisa diganti dengan data dari database)
  const sampleData = {
    topup: [
      {
        id: 1,
        title: "Top Up via Bank BCA",
        date: "2023-05-15 14:30",
        amount: 500000,
        status: "completed"
      },
      {
        id: 2,
        title: "Top Up via Gopay",
        date: "2023-05-10 09:15",
        amount: 250000,
        status: "completed"
      }
    ],
    purchase: [
      {
        id: 1,
        title: "Beli Voucher Game",
        date: "2023-05-12 16:45",
        amount: -150000,
        merchant: "GameStoreID"
      },
      {
        id: 2,
        title: "Donasi Streamer",
        date: "2023-05-08 20:20",
        amount: -50000,
        merchant: "NekoChannel"
      }
    ]
  };

  // Inisialisasi tab
  initTabs();
  
  // Load data awal
  loadTransactions('topup', sampleData.topup);
  loadTransactions('purchase', sampleData.purchase);

  // Fungsi untuk inisialisasi tab
  function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');
        
        // Update active state
        tabButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Show/hide content
        document.querySelectorAll('.tab-content').forEach(content => {
          content.classList.add('hidden');
        });
        document.getElementById(tabId).classList.remove('hidden');
      });
    });
  }

  // Fungsi untuk memuat transaksi ke DOM
  function loadTransactions(type, transactions) {
    const container = document.getElementById(`${type}-list`);
    container.innerHTML = '';
    
    if (transactions.length === 0) {
      container.innerHTML = '<li class="text-gray-500 text-center py-4">Tidak ada transaksi</li>';
      return;
    }
    
    transactions.forEach(transaction => {
      const li = document.createElement('li');
      li.className = 'transaction-item';
      li.innerHTML = `
        <div class="transaction-details">
          <div class="transaction-title">${transaction.title}</div>
          <div class="transaction-date">${formatDate(transaction.date)}</div>
          ${type === 'purchase' ? `<div class="transaction-merchant">${transaction.merchant}</div>` : ''}
        </div>
        <div class="transaction-amount ${transaction.amount > 0 ? 'income' : 'expense'}">
          ${formatCurrency(transaction.amount)}
        </div>
      `;
      container.appendChild(li);
    });
  }

  // Fungsi helper untuk format tanggal
  function formatDate(dateString) {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  }

  // Fungsi helper untuk format mata uang
  function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  }

  // Fungsi untuk mengambil data dari API/database
  async function fetchTransactions(type) {
    try {
      // Contoh endpoint API (sesuaikan dengan backend Anda)
      const response = await fetch(`/api/transactions/${type}`);
      const data = await response.json();
      loadTransactions(type, data);
    } catch (error) {
      console.error('Gagal memuat transaksi:', error);
      document.getElementById(`${type}-list`).innerHTML = `
        <li class="text-red-500 text-center py-4">Gagal memuat data transaksi</li>
      `;
    }
  }
});

async function loadStatisticsChart() {
  try {
    const response = await fetch('/api/get_transactions.php?type=all');
    const transactions = await response.json();
    
    const chartData = prepareChartData(transactions);
    renderStatisticsChart(chartData);
    
    // Sembunyikan pesan error jika sebelumnya ada
    const errorElement = document.querySelector('#stats-section .text-red-500');
    if (errorElement) {
      errorElement.remove();
    }
  } catch (error) {
    console.error('Gagal memuat data statistik:', error);
    // Tidak menampilkan pesan error seperti permintaan
  }
}
function prepareChartData(transactions) {
  // Kelompokkan data per bulan
  const monthlyData = {};
  
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
    
    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = { topup: 0, purchase: 0 };
    }
    
    if (transaction.type === 'topup') {
      monthlyData[monthYear].topup += transaction.amount;
    } else {
      monthlyData[monthYear].purchase += Math.abs(transaction.amount);
    }
  });
  
  // Format untuk Chart.js
  const labels = Object.keys(monthlyData).sort();
  const topupData = labels.map(label => monthlyData[label].topup);
  const purchaseData = labels.map(label => monthlyData[label].purchase);
  
  return {
    labels,
    datasets: [
      {
        label: 'Top Up',
        data: topupData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: 'Penggunaan',
        data: purchaseData,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };
}

let statisticsChart = null;

function renderStatisticsChart(chartData) {
  const ctx = document.createElement('canvas');
  ctx.id = 'statisticsChart';
  
  const statsSection = document.getElementById('stats-section');
  // Hanya mengganti chart-container, tidak menghapus seluruh konten
  const chartContainer = statsSection.querySelector('.chart-container');
  chartContainer.innerHTML = '';
  chartContainer.appendChild(ctx);
  
  if (statisticsChart) {
    statisticsChart.destroy();
  }
  
  statisticsChart = new Chart(ctx, {
    type: 'bar',
    data: chartData,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Jumlah (IDR)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Bulan'
          }
        }
      }
    }
  });
}

// Update action button handler untuk statistik
document.querySelector('[data-target="stats-section"]').addEventListener('click', function() {
  loadStatisticsChart();
});

// Fungsi untuk auto-update ketika ada transaksi baru
function setupTransactionUpdates() {
  // Simulasi update realtime (dalam implementasi nyata bisa pakai WebSocket)
  setInterval(() => {
    const statsSection = document.getElementById('stats-section');
    if (statsSection && !statsSection.classList.contains('hidden')) {
      loadStatisticsChart();
    }
  }, 30000); // Update setiap 30 detik
}

// Panggil saat inisialisasi
setupTransactionUpdates();