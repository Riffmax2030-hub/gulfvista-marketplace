import React, { useState } from 'react';

export default function Dashboard({ user, userProperties }) {
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [newProperty, setNewProperty] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    emirate: 'Dubai',
    country: 'UAE',
    price: '',
    bedrooms: '',
    bathrooms: '',
    area_sqft: '',
    property_type: 'apartment',
  });
  const [properties, setProperties] = useState(userProperties || []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProperty({
      ...newProperty,
      [name]: value,
    });
  };

  const handleAddProperty = (e) => {
    e.preventDefault();

    if (!newProperty.title || !newProperty.price || !newProperty.bedrooms) {
      alert('Please fill in required fields');
      return;
    }

    const property = {
      id: Math.random(),
      owner_id: user.id,
      ...newProperty,
      price: parseFloat(newProperty.price),
      bedrooms: parseInt(newProperty.bedrooms),
      bathrooms: parseInt(newProperty.bathrooms) || 0,
      area_sqft: parseInt(newProperty.area_sqft) || 0,
      views_count: 0,
      price_per_sqft: newProperty.area_sqft
        ? (parseFloat(newProperty.price) / parseInt(newProperty.area_sqft)).toFixed(2)
        : 0,
      created_at: new Date().toISOString(),
    };

    setProperties([...properties, property]);
    setNewProperty({
      title: '',
      description: '',
      address: '',
      city: '',
      emirate: 'Dubai',
      country: 'UAE',
      price: '',
      bedrooms: '',
      bathrooms: '',
      area_sqft: '',
      property_type: 'apartment',
    });
    setShowAddProperty(false);
  };

  const handleDeleteProperty = (propertyId) => {
    setProperties(properties.filter((p) => p.id !== propertyId));
  };

  const totalPropertyValue = properties.reduce((sum, p) => sum + (p.price || 0), 0);
  const totalViews = properties.reduce((sum, p) => sum + (p.views_count || 0), 0);

  return (
    <div className="w-full">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <div className="text-amber-100 text-sm mb-1">Welcome back,</div>
            <div className="text-white text-2xl font-bold">{user.email.split('@')[0]}</div>
            <div className="text-amber-100 text-xs mt-2">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-amber-100 text-xs mb-1">Your Properties</div>
            <div className="text-white text-3xl font-bold">{properties.length}</div>
          </div>

          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-amber-100 text-xs mb-1">Total Value</div>
            <div className="text-white text-2xl font-bold">
              AED {(totalPropertyValue / 1000000).toFixed(1)}M
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-amber-100 text-xs mb-1">Total Views</div>
            <div className="text-white text-3xl font-bold">{totalViews}</div>
          </div>
        </div>
      </div>

      {/* Add Property Button */}
      {(user.role === 'seller' || user.role === 'agent') && (
        <div className="mb-8">
          <button
            onClick={() => setShowAddProperty(!showAddProperty)}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded transition"
          >
            {showAddProperty ? '✕ Cancel' : '+ Add New Property'}
          </button>
        </div>
      )}

      {/* Add Property Form */}
      {showAddProperty && (user.role === 'seller' || user.role === 'agent') && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-6">List New Property</h3>

          <form onSubmit={handleAddProperty} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Property Title *
              </label>
              <input
                type="text"
                name="title"
                value={newProperty.title}
                onChange={handleInputChange}
                placeholder="Luxury villa in Dubai Marina"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Property Type
              </label>
              <select
                name="property_type"
                value={newProperty.property_type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-amber-500"
              >
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="townhouse">Townhouse</option>
                <option value="land">Land</option>
                <option value="office">Office</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Price (AED) *
              </label>
              <input
                type="number"
                name="price"
                value={newProperty.price}
                onChange={handleInputChange}
                placeholder="1000000"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Bedrooms *
              </label>
              <input
                type="number"
                name="bedrooms"
                value={newProperty.bedrooms}
                onChange={handleInputChange}
                placeholder="3"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Bathrooms
              </label>
              <input
                type="number"
                name="bathrooms"
                value={newProperty.bathrooms}
                onChange={handleInputChange}
                placeholder="2"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Area */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Area (sqft)
              </label>
              <input
                type="number"
                name="area_sqft"
                value={newProperty.area_sqft}
                onChange={handleInputChange}
                placeholder="5000"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={newProperty.address}
                onChange={handleInputChange}
                placeholder="123 Marina Boulevard"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                value={newProperty.city}
                onChange={handleInputChange}
                placeholder="Dubai"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Emirate */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Emirate
              </label>
              <select
                name="emirate"
                value={newProperty.emirate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Dubai">Dubai</option>
                <option value="Abu Dhabi">Abu Dhabi</option>
                <option value="Sharjah">Sharjah</option>
                <option value="Ajman">Ajman</option>
                <option value="Fujairah">Fujairah</option>
                <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                <option value="Umm Al Quwain">Umm Al Quwain</option>
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={newProperty.description}
                onChange={handleInputChange}
                placeholder="Describe your property..."
                rows="4"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded transition"
              >
                List Property
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Properties List */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-6">Your Properties</h3>

        {properties.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 flex flex-col items-center justify-center">
            <span className="text-4xl mb-4">🏠</span>
            <h4 className="text-xl font-bold text-white mb-2">No Properties Yet</h4>
            <p className="text-gray-400">
              {user.role === 'buyer'
                ? 'Start exploring properties or contact an agent'
                : 'List your first property to get started'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div
                key={property.id}
                className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden hover:border-amber-500/50 transition"
              >
                {/* Image Placeholder */}
                <div className="w-full h-48 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                  <div className="text-amber-500 text-4xl">🏠</div>
                </div>

                {/* Property Info */}
                <div className="p-4">
                  <h4 className="text-lg font-bold text-white mb-2 line-clamp-2">
                    {property.title}
                  </h4>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl font-bold text-amber-500">
                      AED {(property.price / 1000000).toFixed(1)}M
                    </span>
                  </div>

                  <div className="text-gray-400 text-sm mb-3">
                    📍 {property.city}, {property.emirate}
                  </div>

                  <div className="flex gap-3 text-sm text-gray-300 mb-4">
                    {property.bedrooms > 0 && <span>🛏️ {property.bedrooms} BR</span>}
                    {property.bathrooms > 0 && <span>🚿 {property.bathrooms} BA</span>}
                    {property.area_sqft && <span>📐 {property.area_sqft} sqft</span>}
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-amber-500/20 text-amber-400 text-sm rounded hover:bg-amber-500/30 transition">
                      ✎ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProperty(property.id)}
                      className="flex-1 px-3 py-2 bg-red-900/20 text-red-400 text-sm rounded hover:bg-red-900/30 transition"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
