import React from 'react';

export default function PropertyCard({ property, onClick }) {
  const priceInMillion = (property.price / 1000000).toFixed(1);

  return (
    <div
      onClick={onClick}
      className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/20 transition cursor-pointer transform hover:scale-105"
    >
      {/* Property Image Placeholder */}
      <div className="w-full h-48 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
        <div className="text-amber-500 text-4xl">🏠</div>
      </div>

      {/* Property Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
          {property.title}
        </h3>

        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {property.description}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-bold text-amber-500">
            AED {priceInMillion}M
          </span>
          {property.price_per_sqft && (
            <span className="text-gray-400 text-xs">
              ({property.price_per_sqft}/sqft)
            </span>
          )}
        </div>

        {/* Location */}
        <div className="text-gray-400 text-sm mb-3">
          📍 {property.address}, {property.city}
        </div>

        {/* Property Details */}
        <div className="flex gap-4 text-sm text-gray-300 mb-3">
          {property.bedrooms > 0 && (
            <div className="flex items-center gap-1">
              <span>🛏️</span>
              <span>{property.bedrooms} BR</span>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="flex items-center gap-1">
              <span>🚿</span>
              <span>{property.bathrooms} BA</span>
            </div>
          )}
          {property.area_sqft && (
            <div className="flex items-center gap-1">
              <span>📐</span>
              <span>{property.area_sqft} sqft</span>
            </div>
          )}
        </div>

        {/* Property Type & Views */}
        <div className="flex justify-between items-center">
          <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded">
            {property.property_type.charAt(0).toUpperCase() + property.property_type.slice(1)}
          </span>
          <span className="text-gray-500 text-xs">
            👁️ {property.views_count} views
          </span>
        </div>
      </div>
    </div>
  );
}
