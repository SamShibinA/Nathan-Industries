import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HiPlus, 
  HiTrash, 
  HiMagnifyingGlass, 
  HiPhoto,
  HiMapPin
} from 'react-icons/hi2';

import { Card } from '../../components/common/Card.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { GalleryUploadModal } from '../../components/admin/GalleryUploadModal.jsx';
import { galleryService } from '../../services/galleryService.js';
import { useToast } from '../../context/ToastContext.jsx';
import { GALLERY_CATEGORIES } from '../../utils/constants.js';

export const AdminGalleryPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { showSuccess, showError } = useToast();

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (search.trim()) params.search = search.trim();

      const res = await galleryService.getGalleryItems(params);
      setItems(res.data || []);
    } catch (err) {
      showError('Failed to fetch gallery records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [categoryFilter, search]);

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      await galleryService.deleteGalleryItem(itemToDelete._id);
      showSuccess(`Deleted asset '${itemToDelete.title}'`);
      setItemToDelete(null);
      fetchGallery();
    } catch (err) {
      showError(err.message || 'Failed to delete gallery item');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-slate-800">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Visual Media & Gallery CMS
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Upload factory photographs, CNC machine shop assets, foundry bays, and site execution logs.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setUploadModalOpen(true)}
          icon={HiPlus}
          className="w-full sm:w-auto font-bold text-xs uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20"
        >
          Upload Visual Asset
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 bg-white border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <HiMagnifyingGlass className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, location..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-600 font-semibold">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-xs focus:outline-none focus:border-red-500"
          >
            <option value="all">All Visual Categories</option>
            {GALLERY_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Gallery Cards Grid */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-2">
          <Spinner size="md" />
          <span className="text-xs text-slate-500 font-mono">Loading gallery assets...</span>
        </div>
      ) : items.length === 0 ? (
        <Card className="p-12 text-center text-slate-500 text-xs bg-white border-dashed border-slate-300">
          No gallery images found. Click "Upload Visual Asset" to add new photographs.
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item) => (
            <Card key={item._id} className="p-3 bg-white border-slate-200 group flex flex-col justify-between shadow-sm">
              <div>
                <div className="aspect-[4/3] w-full rounded-xl bg-slate-100 border border-slate-200 overflow-hidden relative flex items-center justify-center mb-3">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <HiPhoto className="w-8 h-8 text-slate-400" />
                  )}

                  <div className="absolute top-2 left-2">
                    <Badge variant="red" size="sm">
                      {item.category}
                    </Badge>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 line-clamp-1 mb-1">
                  {item.title}
                </h3>

                {item.caption && (
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-2">
                    {item.caption}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono truncate max-w-[60%]">
                  {item.location || 'Coimbatore'}
                </span>

                <button
                  onClick={() => setItemToDelete(item)}
                  className="p-1.5 rounded-lg bg-slate-100 border border-slate-300 text-rose-600 hover:bg-rose-50 hover:border-rose-400 transition-colors"
                  title="Delete Visual"
                >
                  <HiTrash className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <GalleryUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploaded={fetchGallery}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        title="Confirm Asset Deletion"
        subtitle="This action cannot be undone."
      >
        <div className="flex flex-col gap-4">
          <p className="text-xs text-slate-700 leading-relaxed">
            Are you sure you want to permanently delete <strong className="text-slate-900">{itemToDelete?.title}</strong> and remove the photo from disk?
          </p>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <Button variant="ghost" size="sm" onClick={() => setItemToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={deleting}
              onClick={handleDelete}
              icon={HiTrash}
            >
              Confirm Permanent Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminGalleryPage;
