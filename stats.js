const API_BASE = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  if (code) {
    loadStats(code);
  }
});

async function loadStats(code) {
  try {
    const response = await fetch(`${API_BASE}/links/${code}`);
    const link = await response.json();
    if (response.ok) {
      document.getElementById('code').textContent = link.short_code;
      document.getElementById('target-url').textContent = link.target_url;
      document.getElementById('clicks').textContent = link.click_count;
      document.getElementById('last-clicked').textContent = link.last_clicked ? new Date(link.last_clicked).toLocaleString() : 'Never';
    } else {
      document.getElementById('stats').innerHTML = '<p class="text-red-600">Link not found</p>';
    }
  } catch (error) {
    document.getElementById('stats').innerHTML = '<p class="text-red-600">Error loading stats</p>';
  }
}
