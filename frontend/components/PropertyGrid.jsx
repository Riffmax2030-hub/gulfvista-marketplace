import React from 'react';
import PropertyCard from './PropertyCard';

export default function PropertyGrid({ properties, onPropertyClick }) {
  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <span className="text-4xl mb-4">🔍</span>
        <h3 className="text-xl font-bold text-white mb-2">No Properties Found</h3>
        <p className="text-gray-400">Try adjusting your search filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          onClick={() => onPropertyClick(property)}
        />
      ))}
    </div>
  );
}
