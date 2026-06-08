import React, { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [city, setCity] = useState('');

  const handleSearch = () => {
    onSearch({
      search,
      minPrice: minPrice ? parseInt(minPrice) : null,
      maxPrice: maxPrice ? parseInt(maxPrice) : null,
      bedrooms: bedrooms ? parseInt(bedrooms) : null,
      propertyType,
      city,
    });
  };

  const handleReset = () => {
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('');
    setPropertyType('');
    setCity('');
    onSearch({});
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-4">Search Properties</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Search by Title/Description */}
        <input
          type="text"
          placeholder="Search by title, location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-amber-500"
        />

        {/* Min Price */}
        <input
          type="number"
          placeholder="Min Price (AED)"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-amber-500"
        />

        {/* Max Price */}
        <input
          type="number"
          placeholder="Max Price (AED)"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-amber-500"
        />

        {/* Bedrooms */}
        <select
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-amber-500"
        >
          <option value="">All Bedrooms</option>
          <option value="1">1 Bedroom</option>
          <option value="2">2 Bedrooms</option>
          <option value="3">3 Bedrooms</option>
          <option value="4">4 Bedrooms</option>
          <option value="5">5+ Bedrooms</option>
        </select>

        {/* Property Type */}
        <select
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-amber-500"
        >
          <option value="">All Types</option>
          <option value="apartment">Apartment</option>
          <option value="villa">Villa</option>
          <option value="townhouse">Townhouse</option>
          <option value="land">Land</option>
          <option value="office">Office</option>
        </select>

        {/* City */}
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleSearch}
          className="flex-1 px-6 py-2 bg-amber-500 text-white font-semibold rounded hover:bg-amber-600 transition"
        >
          🔍 Search
        </button>
        <button
          onClick={handleReset}
          className="flex-1 px-6 py-2 bg-slate-700 text-white font-semibold rounded hover:bg-slate-600 transition"
        >
          ↻ Reset
        </button>
      </div>
    </div>
  );
}
