import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiArrowRight, 
  HiDocumentText, 
  HiWrenchScrewdriver 
} from 'react-icons/hi2';

import { Card } from '../common/Card.jsx';
import { Badge } from '../common/Badge.jsx';
import { Button } from '../common/Button.jsx';

export const ProductCard = ({ product, onQuoteClick }) => {
  if (!product) return null;

  return (
    <Card className="h-full p-5 bg-white border-slate-200 hover:border-red-400 hover:shadow-md flex flex-col justify-between group shadow-sm relative overflow-hidden transition-all duration-200">
      <div>
        {/* Cover Visual Preview */}
        <div className="aspect-[16/10] w-full rounded-xl bg-slate-100 border border-slate-200 relative overflow-hidden flex items-center justify-center mb-4">
          {product.coverImage ? (
            <img
              src={product.coverImage}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mb-2 shadow-sm">
                <HiWrenchScrewdriver className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono text-slate-500 font-semibold">{product.modelNumber || 'Heavy Equipment'}</span>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-2.5 left-2.5">
            <Badge variant="red" size="sm">
              {product.category}
            </Badge>
          </div>

          {/* Model Number */}
          {product.modelNumber && (
            <div className="absolute top-2.5 right-2.5">
              <span className="text-[10px] font-mono font-bold text-slate-800 bg-white/90 px-2 py-0.5 rounded border border-slate-200 shadow-sm">
                {product.modelNumber}
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors mb-2 leading-snug">
          {product.name}
        </h3>

        {/* Summary Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {product.description}
        </p>

        {/* Key Specs Matrix */}
        <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs mb-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Capacity</span>
            <span className="font-bold text-slate-800 truncate block">{product.capacity || 'Customizable'}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Power</span>
            <span className="font-bold text-slate-800 truncate block">{product.power || 'Electric / Dual'}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
        <Link
          to={`/products/${product.slug || product._id}`}
          className="text-xs font-bold text-slate-700 hover:text-red-600 flex items-center gap-1 transition-colors"
        >
          <span>View Specs</span>
          <HiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-red-600" />
        </Link>

        <Button
          variant="primary"
          size="sm"
          onClick={() => onQuoteClick && onQuoteClick(product)}
          icon={HiDocumentText}
          className="text-xs font-bold bg-red-600 hover:bg-red-700 text-white"
        >
          Get Quote
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;
