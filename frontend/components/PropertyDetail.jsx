import React from 'react';

export default function PropertyDetail({ property, onBack }) {
  const priceInMillion = (property.price / 1000000).toFixed(2);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
      {/* Header with Back Button */}
      <div className="bg-slate-900 px-6 py-4 flex items-center gap-4">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-white flex-1">{property.title}</h1>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Placeholder */}
            <div className="w-full h-96 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center mb-6">
              <div className="text-amber-500 text-6xl">🏠</div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Description</h3>
              <p className="text-gray-300 leading-relaxed">{property.description}</p>
            </div>

            {/* Property Features */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-4">Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.bedrooms > 0 && (
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="text-2xl mb-2">🛏️</div>
                    <div className="text-gray-400 text-sm">Bedrooms</div>
                    <div className="text-white font-bold text-lg">{property.bedrooms}</div>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="text-2xl mb-2">🚿</div>
                    <div className="text-gray-400 text-sm">Bathrooms</div>
                    <div className="text-white font-bold text-lg">{property.bathrooms}</div>
                  </div>
                )}
                {property.area_sqft && (
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="text-2xl mb-2">📐</div>
                    <div className="text-gray-400 text-sm">Area</div>
                    <div className="text-white font-bold text-lg">{property.area_sqft} sqft</div>
                  </div>
                )}
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="text-2xl mb-2">📍</div>
                  <div className="text-gray-400 text-sm">City</div>
                  <div className="text-white font-bold text-lg">{property.city}</div>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="text-2xl mb-2">🏷️</div>
                  <div className="text-gray-400 text-sm">Type</div>
                  <div className="text-white font-bold text-lg">
                    {property.property_type.charAt(0).toUpperCase() + property.property_type.slice(1)}
                  </div>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="text-2xl mb-2">👁️</div>
                  <div className="text-gray-400 text-sm">Views</div>
                  <div className="text-white font-bold text-lg">{property.views_count}</div>
                </div>
              </div>
            </div>

            {/* Location Details */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Location</h3>
              <div className="text-gray-300">
                <p className="mb-1"><strong>Address:</strong> {property.address}</p>
                <p className="mb-1"><strong>City:</strong> {property.city}</p>
                <p className="mb-1"><strong>Emirate:</strong> {property.emirate}</p>
                <p><strong>Country:</strong> {property.country || 'UAE'}</p>
              </div>
            </div>
          </div>

          {/* Sidebar - Price & Contact */}
          <div>
            {/* Price Card */}
            <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-lg p-6 mb-6">
              <div className="text-gray-200 text-sm mb-2">Price</div>
              <div className="text-4xl font-bold text-white mb-2">
                AED {priceInMillion}M
              </div>
              <div className="text-amber-100 text-sm">
                Total: AED {property.price.toLocaleString()}
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-slate-700 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-white mb-4">Interested?</h3>
              <button className="w-full px-4 py-3 bg-amber-500 text-white font-semibold rounded hover:bg-amber-600 transition mb-3">
                💬 Contact Agent
              </button>
              <button className="w-full px-4 py-3 bg-slate-600 text-white font-semibold rounded hover:bg-slate-500 transition">
                ❤️ Save Property
              </button>
            </div>

            {/* Property Info */}
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-3">
                <p><strong>Property ID:</strong> {property.id}</p>
              </div>
              <div className="text-gray-400 text-xs space-y-1">
                <p>✓ Active listing</p>
                <p>✓ Verified details</p>
                <p>✓ Professional photos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
