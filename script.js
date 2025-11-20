// Use deployed backend URL
const API_BASE = "https://url-shortner-web-app-backend.onrender.com";

document.addEventListener('DOMContentLoaded', () => {
  loadLinks();
  document.getElementById('create-form').addEventListener('submit', createLink);
});

async function loadLinks() {
  try {
    const response = await fetch(`${API_BASE}/api/links`);
    const links = await response.json();
    const tbody = document.getElementById('links-body');
    tbody.innerHTML = '';
    links.forEach(link => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="border px-4 py-2">${link.short_code}</td>
        <td class="border px-4 py-2"><a href="${link.original_url}" target="_blank" class="text-blue-600">${link.original_url}</a></td>
        <td class="border px-4 py-2">${link.click_count || 0}</td>
        <td class="border px-4 py-2">${link.last_clicked ? new Date(link.last_clicked).toLocaleString() : 'Never'}</td>
        <td class="border px-4 py-2">
          <button onclick="viewStats('${link.short_code}')" class="bg-green-600 text-white px-2 py-1 mr-2">Stats</button>
          <button onclick="deleteLink('${link.short_code}')" class="bg-red-600 text-white px-2 py-1">Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error('Error loading links:', error);
  }
}

async function createLink(event) {
  event.preventDefault();
  const targetUrl = document.getElementById('target-url').value;
  const customCode = document.getElementById('short-code').value.trim();
  const messageDiv = document.getElementById('message');

  try {
    const response = await fetch(`${API_BASE}/shorten`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        original_url: targetUrl,
        custom_code: customCode || undefined
      })
    });

    const result = await response.json();

    if (response.ok) {
      messageDiv.innerHTML = `<p class="text-green-600">Link created successfully! Short code: ${result.short_code}</p>`;
      document.getElementById('create-form').reset();
      loadLinks();
    } else {
      messageDiv.innerHTML = `<p class="text-red-600">${result.error}</p>`;
    }
  } catch (error) {
    messageDiv.innerHTML = '<p class="text-red-600">Error creating link</p>';
  }
}


function viewStats(code) {
  window.location.href = `stats.html?code=${code}`;
}

async function deleteLink(code) {
  if (confirm('Are you sure you want to delete this link?')) {
    try {
      const response = await fetch(`${API_BASE}/api/links/${code}`, { method: 'DELETE' });
      if (response.ok) {
        loadLinks();
      } else {
        alert('Error deleting link');
      }
    } catch (error) {
      alert('Error deleting link');
    }
  }
}
