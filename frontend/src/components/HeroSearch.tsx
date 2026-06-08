/**
 * HeroSearch Component
 * Premium hero section with property search filters
 */

import React, { useState } from 'react';
import { Search, MapPin, Home, DollarSign, Bed } from 'lucide-react';
import type { PropertyType } from '@/types';

interface HeroSearchProps {
  onSearch: (filters: SearchFilters) => void;
  isLoading?: boolean;
}

interface SearchFilters {
  city?: string;
  property_type?: PropertyType;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({ onSearch, isLoading = false }) => {
  const [city, setCity] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType | ''>('');
  const [bedrooms, setBedrooms] = useState<number | ''>('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const filters: SearchFilters = {};
    if (city) filters.city = city;
    if (propertyType) filters.property_type = propertyType as PropertyType;
    if (bedrooms) filters.bedrooms = Number(bedrooms);
    if (minPrice) filters.min_price = Number(minPrice);
    if (maxPrice) filters.max_price = Number(maxPrice);

    onSearch(filters);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Background imagery placeholder */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-transparent mix-blend-multiply" />
      </div>

      {/* Content */}
      <div className="relative z-10 pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 tracking-tight">
              Discover Your Dream <span className="text-amber-500">Luxury Property</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Explore the most exclusive real estate in the GCC. Premium villas, apartments,
              and commercial properties curated for discerning investors.
            </p>
          </div>

          {/* Search Form */}
          <div className="backdrop-blur-md bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 shadow-luxury-lg">
            <form onSubmit={handleSearch} className="space-y-6">
              {/* First Row - Main Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-amber-500" />
                      Location
                    </div>
                  </label>
                  <input
                    type="text"
                    placeholder="Dubai, Abu Dhabi..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                  />
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    <div className="flex items-center gap-2">
                      <Home size={16} className="text-amber-500" />
                      Property Type
                    </div>
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition cursor-pointer"
                  >
                    <option value="">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="land">Land</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    <div className="flex items-center gap-2">
                      <Bed size={16} className="text-amber-500" />
                      Bedrooms
                    </div>
                  </label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition cursor-pointer"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-amber-500" />
                      Price (AED)
                    </div>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="flex-1 px-3 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="flex-1 px-3 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                    />
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-lg transition transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                <Search size={20} />
                {isLoading ? 'Searching...' : 'Search Properties'}
              </button>
            </form>

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-slate-700/50 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-500">2,500+</div>
                <div className="text-sm text-slate-400 mt-1">Luxury Properties</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-500">15K+</div>
                <div className="text-sm text-slate-400 mt-1">Happy Investors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-500">$50B+</div>
                <div className="text-sm text-slate-400 mt-1">Total Volume</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave effect */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900 to-transparent" />
    </div>
  );
};

export default HeroSearch;
