/**
 * PropertyCard Component
 * Individual property listing card with image carousel and key details
 */

import React, { useState } from 'react';
import { Heart, MapPin, Bed, Bath, Maximize2, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import type { Property } from '@/types';
import { formatPrice } from '@/utils/formatting';

interface PropertyCardProps {
  property: Property;
  onViewDetails: (id: number) => void;
  onToggleFavorite?: (id: number) => void;
  isFavorite?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onViewDetails,
  onToggleFavorite,
  isFavorite = false,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = property.images || [];
  const currentImage = images[currentImageIndex] || '';

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(property.id);
  };

  return (
    <div
      className="group cursor-pointer bg-slate-800 rounded-xl overflow-hidden shadow-luxury-md hover:shadow-luxury-xl transition duration-300 transform hover:-translate-y-1"
      onClick={() => onViewDetails(property.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className="relative h-64 bg-slate-900 overflow-hidden">
        {/* Main Image */}
        {currentImage ? (
          <img
            src={currentImage}
            alt={property.title}
            className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
            <div className="text-slate-500 text-center">
              <Maximize2 size={32} className="mx-auto mb-2" />
              <p>No image available</p>
            </div>
          </div>
        )}

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-40" />

        {/* Badge */}
        {property.is_featured && (
          <div className="absolute top-4 left-4 bg-amber-500 text-slate-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Star size={12} fill="currentColor" />
            Featured
          </div>
        )}

        {/* View Count */}
        <div className="absolute top-4 right-4 bg-slate-900/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs">
          {property.views_count} views
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          className="absolute bottom-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full transition transform hover:scale-110 shadow-lg"
        >
          <Heart
            size={20}
            className={isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-400'}
          />
        </button>

        {/* Image Navigation - Only show if multiple images and hovered */}
        {images.length > 1 && isHovered && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full transition shadow-lg z-10"
            >
              <ChevronLeft size={20} className="text-slate-900" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full transition shadow-lg z-10"
            >
              <ChevronRight size={20} className="text-slate-900" />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-4 bg-slate-900/70 backdrop-blur-sm text-white px-2 py-1 rounded text-xs">
              {currentImageIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 bg-slate-800">
        {/* Price */}
        <div className="mb-2">
          <div className="text-2xl font-bold text-amber-500">
            {formatPrice(property.price)}
            <span className="text-sm text-slate-400 ml-1">{property.currency}</span>
          </div>
          {property.price_per_sqft && (
            <div className="text-xs text-slate-500">
              AED {property.price_per_sqft}/sqft
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-amber-400 transition">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-start gap-2 text-slate-400 mb-4 text-sm">
          <MapPin size={16} className="flex-shrink-0 mt-0.5 text-amber-500" />
          <span className="line-clamp-1">{property.address}</span>
        </div>

        {/* Specs */}
        <div className="flex gap-4 mb-4 text-sm">
          {property.bedrooms !== null && (
            <div className="flex items-center gap-1.5 text-slate-400">
              <Bed size={16} className="text-amber-500" />
              <span>{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms !== null && (
            <div className="flex items-center gap-1.5 text-slate-400">
              <Bath size={16} className="text-amber-500" />
              <span>{property.bathrooms}</span>
            </div>
          )}
          {property.area_sqft && (
            <div className="flex items-center gap-1.5 text-slate-400">
              <Maximize2 size={16} className="text-amber-500" />
              <span>{property.area_sqft.toLocaleString()} sqft</span>
            </div>
          )}
        </div>

        {/* Developer Info */}
        {property.project_name && (
          <div className="text-xs text-slate-500 mb-3 p-2 bg-slate-700/50 rounded">
            {property.developer_name && <span className="font-semibold">{property.developer_name}</span>}
            {property.project_name && <div>{property.project_name}</div>}
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={() => onViewDetails(property.id)}
          className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-lg transition transform hover:scale-105 active:scale-95 shadow-md"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
