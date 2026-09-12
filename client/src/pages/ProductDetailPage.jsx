import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiArrowLeft, 
  HiDocumentText, 
  HiArrowDownTray, 
  HiCheckCircle, 
  HiShieldCheck, 
  HiBolt, 
  HiCpuChip, 
  HiWrenchScrewdriver,
  HiMagnifyingGlassPlus
} from 'react-icons/hi2';

import { Container } from '../components/common/Container.jsx';
import { Button } from '../components/common/Button.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Card } from '../components/common/Card.jsx';
import { Spinner } from '../components/common/Spinner.jsx';
import { QuoteModal } from '../components/products/QuoteModal.jsx';
import { ImageGalleryModal } from '../components/products/ImageGalleryModal.jsx';
import { ProductCard } from '../components/products/ProductCard.jsx';
import { productService } from '../services/productService.js';

export const ProductDetailPage = () => {
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await productService.getProductBySlugOrId(slug);
        setProduct(res.data?.product || null);
        setRelated(res.data?.relatedProducts || []);
      } catch (err) {
        setError(err.message || 'Failed to load product specifications');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <div className="py-28 flex flex-col items-center justify-center gap-3 bg-slate-50 min-h-screen">
        <Spinner size="lg" />
        <p className="text-xs text-slate-500 font-mono">Loading technical equipment datasheets...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-20 bg-slate-50 min-h-screen">
        <Container>
          <Card className="p-12 text-center bg-white border-slate-200 max-w-xl mx-auto">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Equipment Not Found</h2>
            <p className="text-xs text-slate-600 mb-6">{error || 'Requested machinery does not exist.'}</p>
            <Link to="/products">
              <Button variant="primary" className="bg-red-600 hover:bg-red-700 text-white">Back to Equipment Catalog</Button>
            </Link>
          </Card>
        </Container>
      </div>
    );
  }

  const galleryImages = [
    product.coverImage,
    ...(product.images || []),
  ].filter(Boolean);

  return (
    <div className="py-10 bg-slate-50/70 min-h-screen text-slate-700">
      <Container>
        {/* Back Link */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-red-600 mb-6 transition-colors"
        >
          <HiArrowLeft className="w-4 h-4" />
          <span>Back to Machinery Catalog</span>
        </Link>

        {/* Top Product Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left: Gallery & Zoom Preview */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div
              onClick={() => {
                setActiveImageIdx(0);
                setGalleryOpen(true);
              }}
              className="aspect-[16/11] w-full rounded-2xl bg-white border border-slate-200 relative overflow-hidden flex items-center justify-center cursor-pointer group shadow-sm hover:shadow-md transition-all"
            >
              {product.coverImage ? (
                <img
                  src={product.coverImage}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mb-3">
                    <HiWrenchScrewdriver className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">{product.modelNumber || 'Heavy Equipment'}</span>
                </div>
              )}

              <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold">
                <HiMagnifyingGlassPlus className="w-5 h-5 text-red-400" />
                <span>Click to Inspect High-Res</span>
              </div>

              <div className="absolute top-3 left-3">
                <Badge variant="red" size="sm">
                  {product.category}
                </Badge>
              </div>
            </div>

            {/* Thumbnails Strip */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveImageIdx(idx);
                      setGalleryOpen(true);
                    }}
                    className="w-20 h-16 rounded-xl bg-white border border-slate-200 overflow-hidden flex-shrink-0 hover:border-red-500 transition-colors shadow-sm"
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Technical Specs & RFQ Action */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.modelNumber && (
                  <span className="text-xs font-mono font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
                    Model: {product.modelNumber}
                  </span>
                )}
                <Badge variant="success" size="sm">
                  In Production
                </Badge>
              </div>

              {/* Refined Title Typography */}
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
                {product.name}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Core Ratings Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 text-xs mb-6 shadow-sm">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Production Capacity</span>
                  <span className="font-bold text-slate-900 text-xs sm:text-sm font-mono mt-0.5 block">{product.capacity || 'Custom'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Motor Power</span>
                  <span className="font-bold text-slate-900 text-xs sm:text-sm font-mono mt-0.5 block">{product.power || 'Dual Electric'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">IS Standard</span>
                  <span className="font-bold text-red-600 text-xs sm:text-sm font-mono mt-0.5 block">IS 383 Compliant</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 pt-6 border-t border-slate-200">
              <Button
                variant="primary"
                size="lg"
                onClick={() => setQuoteModalOpen(true)}
                icon={HiDocumentText}
                className="w-full sm:w-auto font-bold text-xs uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20"
              >
                Request Plant RFQ & Drawing
              </Button>

              {(product.brochure || product.brochureUrl) && (
                <a
                  href={product.brochure || product.brochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    icon={HiArrowDownTray}
                    className="w-full font-semibold text-xs text-slate-800 bg-white border-slate-300 hover:border-red-400 hover:text-red-600 shadow-sm"
                  >
                    Download Tech PDF
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Key-Value Specifications Matrix */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="mb-12">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
              <HiBolt className="w-5 h-5 text-red-600" />
              <span>Full Engineering Specifications</span>
            </h3>

            <Card className="p-0 bg-white border-slate-200 overflow-hidden shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="p-3 sm:p-3.5 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors">
                    <span className="font-semibold text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="font-mono font-bold text-slate-900 text-right">{val}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Features & Applications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
          {/* Features */}
          {product.features?.length > 0 && (
            <Card className="p-4 sm:p-6 bg-white border-slate-200">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <HiShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Heavy-Duty Construction Features</span>
              </h3>
              <ul className="flex flex-col gap-2.5 text-xs text-slate-600">
                {product.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <HiCheckCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Applications */}
          {product.applications?.length > 0 && (
            <Card className="p-4 sm:p-6 bg-white border-slate-200">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <HiCpuChip className="w-5 h-5 text-sky-600" />
                <span>Industrial Applications</span>
              </h3>
              <ul className="flex flex-col gap-2.5 text-xs text-slate-600">
                {product.applications.map((app, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <HiCheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{app}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {/* Related Machinery Lineup */}
        {related.length > 0 && (
          <div className="mt-14 pt-10 border-t border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6">
              Complementary Crushing & Screening Machinery
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <ProductCard
                  key={rel._id}
                  product={rel}
                  onQuoteClick={() => {
                    setSelectedProduct(rel);
                    setQuoteModalOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Modals */}
        <QuoteModal
          isOpen={quoteModalOpen}
          onClose={() => setQuoteModalOpen(false)}
          product={product}
        />

        <ImageGalleryModal
          isOpen={galleryOpen}
          onClose={() => setGalleryOpen(false)}
          images={galleryImages}
          initialIndex={activeImageIdx}
          title={product.name}
        />
      </Container>
    </div>
  );
};

export default ProductDetailPage;
