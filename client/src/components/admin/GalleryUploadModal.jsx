import React, { useState } from 'react';
import { Modal } from '../common/Modal.jsx';
import { Button } from '../common/Button.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { galleryService } from '../../services/galleryService.js';
import { GALLERY_CATEGORIES } from '../../utils/constants.js';
import { HiPhoto, HiCloudArrowUp } from 'react-icons/hi2';

export const GalleryUploadModal = ({ isOpen, onClose, onSaved }) => {
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    category: 'factory',
    caption: '',
    location: '',
    tags: '',
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imageFiles.length === 0) {
      showError('Please select at least one image file to upload.');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('caption', formData.caption);
      data.append('location', formData.location);
      data.append('tags', formData.tags);

      imageFiles.forEach((file) => {
        data.append('images', file);
      });

      await galleryService.createGalleryItem(data);
      showSuccess(`Successfully uploaded ${imageFiles.length} visual asset(s)!`);
      
      // Reset form
      setFormData({
        title: '',
        category: 'factory',
        caption: '',
        location: '',
        tags: '',
      });
      setImageFiles([]);

      onSaved();
      onClose();
    } catch (err) {
      showError(err.message || 'Failed to upload visual asset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Visual Assets to Gallery"
      subtitle="Images are automatically compressed to WebP and optimized for high-density displays."
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Asset Title / Description *
          </label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Heavy Induction Furnace Molten Pouring Bay"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Category & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
            >
              {GALLERY_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Location / Facility Bay
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Heavy Machine Shop Bay 1"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Caption */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Technical Caption / Engineering Details
          </label>
          <textarea
            rows={2}
            name="caption"
            value={formData.caption}
            onChange={handleChange}
            placeholder="Mention machine model, capacity, or metallurgical grade in this photo..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Search Tags (Comma separated)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g. Foundry, Metallurgy, Jaw Plates, Casting"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
          />
        </div>

        {/* File Upload Box */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center gap-2">
          <HiPhoto className="w-8 h-8 text-red-500" />
          <span className="text-xs font-bold text-slate-800">Select Images from Computer</span>
          <span className="text-[11px] text-slate-500">Supports JPG, PNG, WebP up to 25MB (Multiple Allowed)</span>
          <input
            type="file"
            accept="image/*"
            multiple
            required
            onChange={(e) => setImageFiles(Array.from(e.target.files))}
            className="mt-2 text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600 cursor-pointer"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={loading}
            icon={HiCloudArrowUp}
            className="font-bold text-xs uppercase tracking-wider"
          >
            Upload & Convert to WebP
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default GalleryUploadModal;
