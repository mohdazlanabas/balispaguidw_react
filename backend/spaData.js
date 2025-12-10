// backend/spaData.js
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const csvPath = path.join(__dirname, 'bsg_spas.csv');

let spas = [];

function loadSpas() {
  const file = fs.readFileSync(csvPath, 'utf8');
  const records = parse(file, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  spas = records.map((row) => {
    const budget = row.budget ? Number(row.budget) : null;
    const rating = row.rating ? Number(row.rating) : null;
    const treatments = row.treatments
      ? row.treatments.split(';').map((t) => t.trim()).filter(Boolean)
      : [];

    return {
      id: Number(row.nid),
      title: row.title || '',
      email: row.email || '',
      phone: row.phone || '',
      address: row.address || '',
      website: row.website || '',
      location: row.location || '',
      budget,
      rating,
      opening_hour: row.opening_hour || '',
      closing_hour: row.closing_hour || '',
      treatments,
    };
  });
}

function getFilterOptions() {
  const locations = new Set();
  const treatmentSet = new Set();
  const budgets = new Set();

  spas.forEach((spa) => {
    if (spa.location) locations.add(spa.location);
    spa.treatments.forEach((t) => treatmentSet.add(t));
    if (spa.budget != null) budgets.add(spa.budget);
  });

  return {
    locations: Array.from(locations).sort(),
    treatments: Array.from(treatmentSet).sort(),
    budgets: Array.from(budgets).sort((a, b) => a - b),
  };
}

function querySpas({
  page = 1,
  pageSize = 20,
  location,
  treatment,
  budget,
  search,
  sort,
}) {
  let filtered = [...spas];

  if (location) {
    filtered = filtered.filter(
      (s) => s.location.toLowerCase() === location.toLowerCase()
    );
  }

  if (treatment) {
    const tLower = treatment.toLowerCase();
    filtered = filtered.filter((s) =>
      s.treatments.some((t) => t.toLowerCase() === tLower)
    );
  }

  if (budget) {
    const bNum = Number(budget);
    if (!Number.isNaN(bNum)) {
      filtered = filtered.filter((s) => s.budget === bNum);
    }
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q)
    );
  }

  if (sort === 'rating_desc') {
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sort === 'rating_asc') {
    filtered.sort((a, b) => (a.rating || 0) - (b.rating || 0));
  } else if (sort === 'budget_desc') {
    filtered.sort((a, b) => (b.budget || 0) - (a.budget || 0));
  } else if (sort === 'budget_asc') {
    filtered.sort((a, b) => (a.budget || 0) - (b.budget || 0));
  } else if (sort === 'title_asc') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === 'title_desc') {
    filtered.sort((a, b) => b.title.localeCompare(a.title));
  }

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, Number(page)), pageCount);

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const items = filtered.slice(start, end);

  return {
    total,
    page: currentPage,
    pageCount,
    pageSize,
    items,
  };
}

function getSpaById(id) {
  const nid = Number(id);
  return spas.find((s) => s.id === nid) || null;
}

loadSpas();

module.exports = {
  getFilterOptions,
  querySpas,
  getSpaById,
};
