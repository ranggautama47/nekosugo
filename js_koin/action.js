// Path: js_koin/action.js

document.addEventListener("DOMContentLoaded", function () {
  const actionButtons = document.querySelectorAll('.action-btn');
  const dynamicSection = document.getElementById('dynamic-section');
  const sections = ['topup-section', 'stats-section', 'voucher-section', 'faq-section'];
  const closeSectionButton = document.getElementById('close-section');

  if (actionButtons.length && dynamicSection && closeSectionButton) {
    actionButtons.forEach(button => {
      button.addEventListener('click', () => {
        const target = button.getAttribute('data-target');

        sections.forEach(id => {
          const section = document.getElementById(id);
          if (section) section.classList.add('hidden');
        });

        const targetSection = document.getElementById(target);
        if (targetSection) targetSection.classList.remove('hidden');
        dynamicSection.classList.remove('hidden');
      });
    });

    closeSectionButton.addEventListener('click', () => {
      dynamicSection.classList.add('hidden');
    });
  } else {
    console.warn('actionButtons or dynamicSection or closeSectionButton not found.');
  }

  // Optional: Balance Show/Hide functionality (move from inline script)
  const balanceElement = document.getElementById('coin-balance');
  const hiddenBalance = document.getElementById('hidden-balance');
  const showBalanceButton = document.getElementById('show-balance');

  if (balanceElement && hiddenBalance && showBalanceButton) {
    let balanceVisible = false;

    showBalanceButton.addEventListener('click', () => {
      balanceVisible = !balanceVisible;

      if (balanceVisible) {
        balanceElement.classList.remove('hidden');
        hiddenBalance.classList.add('hidden');
      } else {
        balanceElement.classList.add('hidden');
        hiddenBalance.classList.remove('hidden');
      }
    });
  } else {
    console.warn('Balance elements not found.');
  }
});
