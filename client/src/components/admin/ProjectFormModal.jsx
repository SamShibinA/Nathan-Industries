import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal.jsx';
import { Button } from '../common/Button.jsx';
import { Badge } from '../common/Badge.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { projectService } from '../../services/projectService.js';
import { PROJECT_TYPES } from '../../utils/constants.js';
import { 
  HiPlus, 
  HiTrash, 
  HiPhoto, 
  HiCloudArrowUp 
} from 'react-icons/hi2';

export const ProjectFormModal = ({ isOpen, onClose, projectToEdit, onSaved }) => {
  const isEditing = !!projectToEdit;
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    projectType: 'railway-overbridge',
    clientName: '',
    status: 'completed',
    startDate: '',
    endDate: '',
    duration: '',
    location: '',
    fullAddress: '',
    googleMapsLink: '',
    projectCapacity: '',
    description: '',
    isFeatured: false,
    isActive: true,
  });

  const [scopeOfWork, setScopeOfWork] = useState(['']);
  const [machineryUsed, setMachineryUsed] = useState(['']);

  // File uploads
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [documentFiles, setDocumentFiles] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (projectToEdit) {
      setFormData({
        title: projectToEdit.title || '',
        projectType: projectToEdit.projectType || 'railway-overbridge',
        clientName: projectToEdit.clientName || '',
        status: projectToEdit.status || 'completed',
        startDate: projectToEdit.startDate ? projectToEdit.startDate.split('T')[0] : '',
        endDate: projectToEdit.endDate ? projectToEdit.endDate.split('T')[0] : '',
        duration: projectToEdit.duration || '',
        location: projectToEdit.location || '',
        fullAddress: projectToEdit.fullAddress || '',
        googleMapsLink: projectToEdit.googleMapsLink || '',
        projectCapacity: projectToEdit.projectCapacity || '',
        description: projectToEdit.description || '',
        isFeatured: !!projectToEdit.isFeatured,
        isActive: projectToEdit.isActive !== false,
      });

      setScopeOfWork(projectToEdit.scopeOfWork?.length > 0 ? projectToEdit.scopeOfWork : ['']);
      setMachineryUsed(projectToEdit.machineryUsed?.length > 0 ? projectToEdit.machineryUsed : ['']);
    } else {
      setFormData({
        title: '',
        projectType: 'railway-overbridge',
        clientName: '',
        status: 'completed',
        startDate: '',
        endDate: '',
        duration: '',
        location: '',
        fullAddress: '',
        googleMapsLink: '',
        projectCapacity: '',
        description: '',
        isFeatured: false,
        isActive: true,
      });
      setScopeOfWork(['']);
      setMachineryUsed(['']);
      setCoverImageFile(null);
      setGalleryFiles([]);
      setDocumentFiles([]);
    }
  }, [projectToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const addScope = () => setScopeOfWork([...scopeOfWork, '']);
  const updateScope = (idx, val) => {
    const arr = [...scopeOfWork];
    arr[idx] = val;
    setScopeOfWork(arr);
  };
  const removeScope = (idx) => setScopeOfWork(scopeOfWork.filter((_, i) => i !== idx));

  const addMachinery = () => setMachineryUsed([...machineryUsed, '']);
  const updateMachinery = (idx, val) => {
    const arr = [...machineryUsed];
    arr[idx] = val;
    setMachineryUsed(arr);
  };
  const removeMachinery = (idx) => setMachineryUsed(machineryUsed.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        data.append(key, val);
      });

      const validScope = scopeOfWork.filter((s) => s.trim());
      data.append('scopeOfWork', JSON.stringify(validScope));

      const validMachinery = machineryUsed.filter((m) => m.trim());
      data.append('machineryUsed', JSON.stringify(validMachinery));

      if (coverImageFile) {
        data.append('coverImage', coverImageFile);
      }

      if (galleryFiles.length > 0) {
        galleryFiles.forEach((file) => {
          data.append('galleryImages', file);
        });
      }

      if (documentFiles.length > 0) {
        documentFiles.forEach((file) => {
          data.append('documents', file);
        });
      }

      if (isEditing) {
        await projectService.updateProject(projectToEdit._id, data);
        showSuccess('Project updated successfully!');
      } else {
        await projectService.createProject(data);
        showSuccess('Project created successfully!');
      }

      onSaved();
      onClose();
    } catch (err) {
      showError(err.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Project: ${projectToEdit.title}` : 'Add New Infrastructure Undertaking'}
      subtitle="Publish civil infrastructure, railway overbridge, or crushing plant case studies."
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-h-[75vh] overflow-y-auto pr-1">
        {/* Row 1: Title & Type */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Project Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. 4-Lane Railway Overbridge (ROB) EPC Erection"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Project Type *
            </label>
            <select
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
            >
              {PROJECT_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Client Name, Location, Capacity */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Client / Authority *
            </label>
            <input
              type="text"
              name="clientName"
              required
              value={formData.clientName}
              onChange={handleChange}
              placeholder="e.g. State Highways Authority"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Location (City, State) *
            </label>
            <input
              type="text"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Salem, Tamil Nadu"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Capacity / Scale *
            </label>
            <input
              type="text"
              name="projectCapacity"
              required
              value={formData.projectCapacity}
              onChange={handleChange}
              placeholder="e.g. 720m 4-Lane Span or 600 TPH"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Row 3: Status, Start Date, End Date, Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
            >
              <option value="completed">Completed</option>
              <option value="ongoing">Ongoing</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Duration (or Auto)
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g. 14 Months"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Full Address & Google Maps Link */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Full Site Address
            </label>
            <input
              type="text"
              name="fullAddress"
              value={formData.fullAddress}
              onChange={handleChange}
              placeholder="Chainage NH-44 Railway Crossing, Salem"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Google Maps URL
            </label>
            <input
              type="url"
              name="googleMapsLink"
              value={formData.googleMapsLink}
              onChange={handleChange}
              placeholder="https://maps.google.com/?q=..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Narrative Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Case Study Description *
          </label>
          <textarea
            rows={3}
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed overview of technical civil milestones, girder launching, rock reduction..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Dynamic Scope & Machinery Builders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Scope */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400">
                Scope of Work
              </h4>
              <button
                type="button"
                onClick={addScope}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <HiPlus className="w-3.5 h-3.5 text-orange-500" /> Add
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {scopeOfWork.map((s, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Fabrication of 48 PSC Box Girders"
                    value={s}
                    onChange={(e) => updateScope(idx, e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs"
                  />
                  {scopeOfWork.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeScope(idx)}
                      className="p-1 text-rose-400"
                    >
                      <HiTrash className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Machinery Used */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400">
                Machinery Deployed
              </h4>
              <button
                type="button"
                onClick={addMachinery}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <HiPlus className="w-3.5 h-3.5 text-sky-400" /> Add
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {machineryUsed.map((m, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="e.g. 300 MT Hydraulic Telescopic Crane"
                    value={m}
                    onChange={(e) => updateMachinery(idx, e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs"
                  />
                  {machineryUsed.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMachinery(idx)}
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

        {/* Media & Document Uploads */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Project Visuals & Document Uploads (WebP Optimized)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverImageFile(e.target.files[0])}
                className="w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-500 file:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-semibold">Stage Gallery Photos</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setGalleryFiles(Array.from(e.target.files))}
                className="w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-700"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-semibold">Case Study PDF</label>
              <input
                type="file"
                accept="application/pdf"
                multiple
                onChange={(e) => setDocumentFiles(Array.from(e.target.files))}
                className="w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-700"
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
            <span className="font-bold">Feature on Home Page</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 rounded text-orange-500 focus:ring-0"
            />
            <span className="font-bold">Active in Portfolio</span>
          </label>
        </div>

        {/* Submit */}
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
            {isEditing ? 'Update Project' : 'Publish Project'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectFormModal;
