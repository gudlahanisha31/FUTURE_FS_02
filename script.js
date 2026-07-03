const sampleLeads = [
  { id: 1, name: 'Aria Morgan', company: 'Luma Growth', email: 'aria.morgan@lumagrowth.com', phone: '+1 555 132 8974', status: 'Active' },
  { id: 2, name: 'Noah Patel', company: 'Horizon Media', email: 'noah.patel@horizonmedia.com', phone: '+1 555 438 2146', status: 'Contacted' },
  { id: 3, name: 'Mia Chen', company: 'Vertex Labs', email: 'mia.chen@vertexlabs.co', phone: '+1 555 910 2217', status: 'Proposal' },
  { id: 4, name: 'Ethan Ross', company: 'BluePeak', email: 'ethan.ross@bluepeak.io', phone: '+1 555 713 6543', status: 'Won' },
  { id: 5, name: 'Sofia Alvarez', company: 'PulseCommerce', email: 'sofia.alvarez@pulsecommerce.com', phone: '+1 555 382 9041', status: 'Active' },
];

let leads = [...sampleLeads];
const page = document.body.dataset.page;

const authKey = 'crmLoggedIn';

const initLoginPage = () => {
  const loginForm = document.getElementById('loginForm');
  if (sessionStorage.getItem(authKey) === 'true') {
    window.location.assign('dashboard.html');
    return;
  }

  loginForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    sessionStorage.setItem(authKey, 'true');
    window.location.assign('dashboard.html');
  });
};

const initPage = () => {
  if (page === 'login') {
    initLoginPage();
  }
  if (page === 'dashboard') {
    initDashboard();
  }
};

window.addEventListener('DOMContentLoaded', initPage);

const createStatusLabel = (status) => {
  const normalized = status.toLowerCase();
  const classMap = {
    active: 'status-active',
    contacted: 'status-contacted',
    proposal: 'status-proposal',
    won: 'status-won',
  };
  return `<span class="status-pill ${classMap[normalized] || 'status-active'}">${status}</span>`;
};

const updateStats = () => {
  const total = leads.length;
  const active = leads.filter((lead) => lead.status === 'Active').length;
  const contacted = leads.filter((lead) => lead.status === 'Contacted').length;
  const won = leads.filter((lead) => lead.status === 'Won').length;

  document.getElementById('totalLeads').textContent = total;
  document.getElementById('activeLeads').textContent = active;
  document.getElementById('contactedLeads').textContent = contacted;
  document.getElementById('wonLeads').textContent = won;
};

const renderRows = (displayLeads) => {
  const tableBody = document.getElementById('leadTableBody');
  if (!tableBody) return;
  tableBody.innerHTML = displayLeads.map((lead) => {
    return `
      <tr>
        <td>${lead.name}</td>
        <td>${lead.company}</td>
        <td>${lead.email}</td>
        <td>${lead.phone}</td>
        <td>${createStatusLabel(lead.status)}</td>
        <td><button class="secondary-btn" data-action="delete" data-id="${lead.id}">Delete</button></td>
      </tr>`;
  }).join('');
};

const applyFilters = () => {
  const query = document.getElementById('searchInput')?.value.trim().toLowerCase() || '';
  const statusFilter = document.getElementById('statusFilter')?.value || 'all';

  const filtered = leads.filter((lead) => {
    const text = `${lead.name} ${lead.company} ${lead.email} ${lead.phone} ${lead.status}`.toLowerCase();
    const matchesQuery = !query || text.includes(query);
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  renderRows(filtered);
};

const refreshTable = () => {
  updateStats();
  applyFilters();
};

const showModal = () => {
  document.getElementById('leadModal')?.classList.remove('hidden');
};

const hideModal = () => {
  document.getElementById('leadModal')?.classList.add('hidden');
  document.getElementById('leadForm')?.reset();
};

const deleteLead = (id) => {
  leads = leads.filter((lead) => lead.id !== Number(id));
  refreshTable();
};

const initDashboard = () => {
  const logoutBtn = document.getElementById('logoutBtn');
  const addLeadBtn = document.getElementById('addLeadBtn');
  const closeModalBtn = document.getElementById('closeModal');
  const cancelBtn = document.getElementById('cancelBtn');
  const leadForm = document.getElementById('leadForm');
  const searchInput = document.getElementById('searchInput');
  const statusFilter = document.getElementById('statusFilter');
  const tableBody = document.getElementById('leadTableBody');

  if (sessionStorage.getItem(authKey) !== 'true') {
    window.location.href = 'index.html';
    return;
  }

  logoutBtn?.addEventListener('click', () => {
    sessionStorage.removeItem(authKey);
    window.location.href = 'index.html';
  });

  addLeadBtn?.addEventListener('click', showModal);
  closeModalBtn?.addEventListener('click', hideModal);
  cancelBtn?.addEventListener('click', hideModal);

  leadForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('leadName').value.trim();
    const company = document.getElementById('leadCompany').value.trim();
    const email = document.getElementById('leadEmail').value.trim();
    const phone = document.getElementById('leadPhone').value.trim();
    const status = document.getElementById('leadStatus').value;

    if (!name || !company || !email || !phone) return;

    leads.unshift({
      id: Date.now(),
      name,
      company,
      email,
      phone,
      status,
    });
    hideModal();
    refreshTable();
  });

  searchInput?.addEventListener('input', applyFilters);
  statusFilter?.addEventListener('change', applyFilters);

  tableBody?.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action="delete"]');
    if (!button) return;
    deleteLead(button.dataset.id);
  });

  refreshTable();
};

if (window.location.pathname.endsWith('dashboard.html')) {
  initDashboard();
}
