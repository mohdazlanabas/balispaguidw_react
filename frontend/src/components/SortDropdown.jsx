import React from 'react';

const SORT_OPTIONS = [
  { value: 'rating_desc', label: 'Rating High Low' },
  { value: 'rating_asc', label: 'Rating Low High' },
  { value: 'budget_desc', label: 'Price High Low' },
  { value: 'budget_asc', label: 'Price Low High' },
  { value: 'title_asc', label: 'Alphabetically Ascending' },
  { value: 'title_desc', label: 'Alphabetically Descending' },
];

export default function SortDropdown({ value, onChange }) {
  const currentLabel = SORT_OPTIONS.find(opt => opt.value === value)?.label || 'Sort By';

  return (
    <div className="sort-dropdown">
      <label htmlFor="sort-select">Sort By: </label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sort-select"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
