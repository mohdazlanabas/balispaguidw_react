import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import SpaList from '../components/SpaList.jsx';
import Pagination from '../components/Pagination.jsx';
import SortDropdown from '../components/SortDropdown.jsx';

const API_BASE = import.meta?.env?.VITE_API_BASE || 'http://localhost:4000';

export default function TreatmentPage() {
  const { treatment } = useParams();
  const navigate = useNavigate();
  const [options, setOptions] = useState({ treatments: [] });
  const [data, setData] = useState({ items: [], total: 0, page: 1, pageCount: 1 });
  const [sort, setSort] = useState('rating_desc');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 20;

  useEffect(() => {
    fetch(`${API_BASE}/api/filters`)
      .then((r) => r.json())
      .then((res) => setOptions(res))
      .catch((err) => console.error('filters error', err));
  }, []);

  useEffect(() => {
    if (!treatment) return;

    const params = new URLSearchParams();
    params.set('page', page);
    params.set('pageSize', pageSize);
    params.set('treatment', treatment);
    params.set('sort', sort);

    setLoading(true);
    fetch(`${API_BASE}/api/spas?` + params.toString())
      .then((r) => r.json())
      .then((res) => setData(res))
      .catch((err) => console.error('spas error', err))
      .finally(() => setLoading(false));
  }, [treatment, sort, page]);

  const handleSortChange = (newSort) => {
    setSort(newSort);
    setPage(1);
  };

  const handleTreatmentClick = (treat) => {
    navigate(`/treatments/${encodeURIComponent(treat)}`);
    setPage(1);
  };

  if (!treatment) {
    return (
      <div className="app-shell">
        <Header />
        <main className="app-main">
          <h1 className="page-title">Explore by Treatment</h1>
          <div className="cards-grid">
            {options.treatments.map((treat) => (
              <div
                key={treat}
                className="treatment-card"
                onClick={() => handleTreatmentClick(treat)}
              >
                <h3>{treat}</h3>
              </div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <div className="page-header">
          <button onClick={() => navigate('/treatments')} className="back-button">
            ← Back to Treatments
          </button>
          <h1 className="page-title">Spas offering {treatment}</h1>
          <SortDropdown value={sort} onChange={handleSortChange} />
        </div>

        <div className="summary-row">
          <span>Showing {data.total} spa{data.total !== 1 ? 's' : ''}</span>
        </div>

        <SpaList spas={data.items} loading={loading} />
        <Pagination
          page={data.page}
          pageCount={data.pageCount}
          onChange={setPage}
        />
      </main>
      <Footer />
    </div>
  );
}
