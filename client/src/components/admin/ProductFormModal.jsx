import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal.jsx';
import { Button } from '../common/Button.jsx';
import { Badge } from '../common/Badge.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { productService } from '../../services/productService.js';
import { 
  HiPlus, 
  HiTrash, 
  HiPhoto, 
  HiDocumentText, 
  HiCheck, 
  HiCloudArrowUp 
} from 'react-icons/hi2';

export const ProductFormModal = ({ isOpen, onClose, productToEdit, onSaved }) => {
  const isEditing = !!productToEdit;
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    modelNumber: '',
    category: 'stone-crushers',
    capacity: '',
    power: '',
    feedSize: '',
    outputSize: '',
    description: '',
    isFeatured: false,
    isActive: true,
    order: 0,
  });

  // Dynamic Specs, Features, Applications
  const [specifications, setSpecifications] = useState([{ key: '', value: '' }]);
  const [features, setFeatures] = useState(['']);
  const [applications, setApplications] = useState(['']);

  // File states
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [brochureFile, setBrochureFile] = useState(null);

  const [loading, setLoading] = useState(false);

  // Pre-fill on edit
  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || '',
        modelNumber: productToEdit.modelNumber || '',
        category: productToEdit.category || 'stone-crushers',
        capacity: productToEdit.capacity || '',
        power: productToEdit.power || '',
        feedSize: productToEdit.feedSize || '',
        outputSize: productToEdit.outputSize || '',
        description: productToEdit.description || '',
        isFeatured: !!productToEdit.isFeatured,
        isActive: productToEdit.isActive !== false,
        order: productToEdit.order || 0,
      });

      setSpecifications(
        productToEdit.specifications?.length > 0
          ? productToEdit.specifications
          : [{ key: '', value: '' }]
      );
      setFeatures(productToEdit.features?.length > 0 ? productToEdit.features : ['']);
      setApplications(productToEdit.applications?.length > 0 ? productToEdit.applications : ['']);
    } else {
      // Reset form
      setFormData({
        name: '',
        modelNumber: '',
        category: 'stone-crushers',
        capacity: '',
        power: '',
        feedSize: '',
        outputSize: '',
        description: '',
        isFeatured: false,
        isActive: true,
        order: 0,
      });
      setSpecifications([{ key: '', value: '' }]);
      setFeatures(['']);
      setApplications(['']);
      setCoverImageFile(null);
      setGalleryFiles([]);
      setBrochureFile(null);
    }
  }, [productToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Spec helper methods
  const addSpec = () => setSpecifications([...specifications, { key: '', value: '' }]);
  const updateSpec = (idx, field, val) => {
    const updated = [...specifications];
    updated[idx][field] = val;
    setSpecifications(updated);
  };
  const removeSpec = (idx) => {
    setSpecifications(specifications.filter((_, i) => i !== idx));
  };

  // Features helper methods
  const addFeature = () => setFeatures([...features, '']);
  const updateFeature = (idx, val) => {
    const updated = [...features];
    updated[idx] = val;
    setFeatures(updated);
  };
  const removeFeature = (idx) => setFeatures(features.filter((_, i) => i !== idx));

  // Applications helper methods
  const addApp = () => setApplications([...applications, '']);
  const updateApp = (idx, val) => {
    const updated = [...applications];
    updated[idx] = val;
    setApplications(updated);
  };
  const removeApp = (idx) => setApplications(applications.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        data.append(key, val);
      });

      // Filter non-empty specs, features, apps
      const validSpecs = specifications.filter((s) => s.key.trim() && s.value.trim());
      data.append('specifications', JSON.stringify(validSpecs));

      const validFeatures = features.filter((f) => f.trim());
      data.append('features', JSON.stringify(validFeatures));

      const validApps = applications.filter((a) => a.trim());
      data.append('applications', JSON.stringify(validApps));

      // Append files if selected
      if (coverImageFile) {
        data.append('coverImage', coverImageFile);
      }

      if (galleryFiles.length > 0) {
        galleryFiles.forEach((file) => {
          data.append('images', file);
        });
      }

      if (brochureFile) {
        data.append('brochure', brochureFile);
      }

      if (isEditing) {
        await productService.updateProduct(productToEdit._id, data);
        showSuccess('Product updated successfully!');
      } else {
        await productService.createProduct(data);
        showSuccess('Product created successfully!');
      }

      onSaved();
      onClose();
    } catch (err) {
      showError(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'stone-crushers', label: 'Stone Crusher Machines' },
    { id: 'jaw-crushers', label: 'Jaw Crushers' },
    { id: 'cone-crushers', label: 'Cone Crushers' },
    { id: 'sand-plants', label: 'M-Sand & P-Sand Plants' },
    { id: 'conveyors', label: 'Conveyor Systems' },
    { id: 'spare-parts', label: 'Crusher Spare Parts' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Equipment: ${productToEdit.name}` : 'Add New Heavy Equipment Model'}
      subtitle="Configure technical specifications, upload high-res imagery, and attach PDF brochures."
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-h-[75vh] overflow-y-auto pr-1">
        {/* Row 1: Name, Model, Category */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Equipment Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Heavy Duty Primary Jaw Crusher"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Model Number
            </label>
            <input
              type="text"
              name="modelNumber"
              value={formData.modelNumber}
              onChange={handleChange}
              placeholder="e.g. NI-JC-1209"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500 font-mono"
            />
          </div>
        </div>

        {/* Row 2: Category, Capacity, Power */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Capacity *
            </label>
            <input
              type="text"
              name="capacity"
              required
              value={formData.capacity}
              onChange={handleChange}
              placeholder="e.g. 200 - 500 TPH"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Power *
            </label>
            <input
              type="text"
              name="power"
              required
              value={formData.power}
              onChange={handleChange}
              placeholder="e.g. 160 kW (215 HP)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Row 3: Feed Size, Output Size */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Feed Size
            </label>
            <input
              type="text"
              name="feedSize"
              value={formData.feedSize}
              onChange={handleChange}
              placeholder="e.g. Max 850 mm"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Output Size
            </label>
            <input
              type="text"
              name="outputSize"
              value={formData.outputSize}
              onChange={handleChange}
              placeholder="e.g. 0-5mm, 10mm, 20mm"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Description *
          </label>
          <textarea
            rows={3}
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed engineering overview of crushing chambers, metallurgy, bearings..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Dynamic Specifications Builder */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400">
              Technical Specifications (Key - Value Pairs)
            </h4>
            <button
              type="button"
              onClick={addSpec}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
            >
              <HiPlus className="w-3.5 h-3.5 text-orange-500" />
              <span>Add Spec Row</span>
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {specifications.map((spec, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Parameter (e.g. Feed Opening)"
                  value={spec.key}
                  onChange={(e) => updateSpec(idx, 'key', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. 1200 x 900 mm)"
                  value={spec.value}
                  onChange={(e) => updateSpec(idx, 'value', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs font-mono"
                />
                {specifications.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSpec(idx)}
                    className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Features & Applications */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Features */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400">
                Key Features
              </h4>
              <button
                type="button"
                onClick={addFeature}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <HiPlus className="w-3.5 h-3.5 text-sky-400" /> Add
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Deep symmetrical cavity"
                    value={feat}
                    onChange={(e) => updateFeature(idx, e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs"
                  />
                  {features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(idx)}
                      className="p-1 text-rose-400"
                    >
                      <HiTrash className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Applications */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Applications
              </h4>
              <button
                type="button"
                onClick={addApp}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <HiPlus className="w-3.5 h-3.5 text-amber-400" /> Add
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {applications.map((app, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Basalt & Granite Quarries"
                    value={app}
                    onChange={(e) => updateApp(idx, e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs"
                  />
                  {applications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeApp(idx)}
                      className="p-1 text-rose-400"
                    >
                      <HiTrash className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Media & Uploads Section (Sharp Multi-Image & PDF) */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Machinery Media & PDF Brochure Upload
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Cover Image */}
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">
                Cover Image (WebP Compressed)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverImageFile(e.target.files[0])}
                className="w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
              />
            </div>

            {/* Gallery Images */}
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">
                Gallery Images (Multiple)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setGalleryFiles(Array.from(e.target.files))}
                className="w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300"
              />
            </div>

            {/* PDF Brochure */}
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">
                PDF Spec Brochure
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setBrochureFile(e.target.files[0])}
                className="w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300"
              />
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-6 text-xs text-slate-700">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="w-4 h-4 rounded text-orange-500 focus:ring-0"
            />
            <span className="font-bold">Mark as Featured Equipment</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 rounded text-orange-500 focus:ring-0"
            />
            <span className="font-bold">Active in Catalog</span>
          </label>
        </div>

        {/* Modal Bottom Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
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
            {isEditing ? 'Update Equipment' : 'Save & Publish Equipment'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductFormModal;
