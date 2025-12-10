import React, { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header.jsx';
import FiltersBar from '../components/FilterBar.jsx';
import SpaList from '../components/SpaList.jsx';
import Pagination from '../components/Pagination.jsx';
import Footer from '../components/Footer.jsx';
import SideFilters from '../components/SideFilters.jsx';
import SortDropdown from '../components/SortDropdown.jsx';

const API_BASE = import.meta?.env?.VITE_API_BASE || 'http://localhost:4000';

export default function HomePage() {
  const [filters, setFilters] = useState({
    location: '',
    treatment: '',
    budget: '',
    search: '',
    sort: 'rating_desc',
  });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [data, setData] = useState({
    items: [],
    total: 0,
    page: 1,
    pageCount: 1,
  });
  const [options, setOptions] = useState({
    locations: [],
    treatments: [],
    budgets: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/filters`)
      .then((r) => r.json())
      .then((res) => setOptions(res))
      .catch((err) => console.error('filters error', err));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('page', page);
    params.set('pageSize', pageSize);
    if (filters.location) params.set('location', filters.location);
    if (filters.treatment) params.set('treatment', filters.treatment);
    if (filters.budget) params.set('budget', filters.budget);
    if (filters.search) params.set('search', filters.search);
    if (filters.sort) params.set('sort', filters.sort);

    setLoading(true);
    fetch(`${API_BASE}/api/spas?` + params.toString())
      .then((r) => r.json())
      .then((res) => setData(res))
      .catch((err) => console.error('spas error', err))
      .finally(() => setLoading(false));
  }, [filters, page, pageSize]);

  const summaryText = useMemo(() => {
    if (!data.total) return 'No spas found for current filters';
    const from = (data.page - 1) * pageSize + 1;
    const to = Math.min(data.page * pageSize, data.total);
    return `Showing ${from}-${to} of ${data.total} spas`;
  }, [data, pageSize]);

  const handleFilterChange = (patch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(1);
  };

  const handleQuickFilter = ({ location, treatment }) => {
    setFilters((prev) => ({
      ...prev,
      location: location ?? prev.location,
      treatment: treatment ?? prev.treatment,
    }));
    setPage(1);
  };

  const handleSortChange = (newSort) => {
    setFilters((prev) => ({ ...prev, sort: newSort }));
    setPage(1);
  };

  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <FiltersBar
          filters={filters}
          options={options}
          onChange={handleFilterChange}
        />

        <div className="summary-row">
          <span>{summaryText}</span>
          <SortDropdown value={filters.sort} onChange={handleSortChange} />
        </div>

        <div className="spa-layout">
          <div>
            <SpaList spas={data.items} loading={loading} />
            <Pagination
              page={data.page}
              pageCount={data.pageCount}
              onChange={setPage}
            />
          </div>
          <SideFilters options={options} onQuickFilter={handleQuickFilter} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
