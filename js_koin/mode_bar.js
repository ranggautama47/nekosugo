document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const themeText = document.getElementById('themeText');
  const themeIcon = document.getElementById('themeIcon');

  function applyMode(isDark) {
    if (isDark) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
      if (themeText) themeText.textContent = 'Mode Terang';
      if (themeIcon) {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
      }
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
      if (themeText) themeText.textContent = 'Mode Gelap';
      if (themeIcon) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
      }
    }
  }

  // Cek preferensi user atau gunakan dark mode sebagai default
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedMode = localStorage.getItem('themeMode');
  const initialMode = savedMode ? savedMode === 'dark' : prefersDark;
  
  applyMode(initialMode);

  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', function(e) {
      e.preventDefault();
      const isDark = !document.body.classList.contains('dark-mode');
      localStorage.setItem('themeMode', isDark ? 'dark' : 'light');
      applyMode(isDark);
    });
  }
});