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
  HiCloudArrowUp,
  HiXMark,
  HiCheckCircle,
  HiArrowUpTray
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

  // Project Media & Stage File Uploads
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [beforeStageFiles, setBeforeStageFiles] = useState([]);
  const [duringStageFiles, setDuringStageFiles] = useState([]);
  const [afterStageFiles, setAfterStageFiles] = useState([]);
  const [documentFiles, setDocumentFiles] = useState([]);
  const [existingGallery, setExistingGallery] = useState([]);

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
      setExistingGallery(projectToEdit.gallery || []);
      setCoverImageFile(null);
      setBeforeStageFiles([]);
      setDuringStageFiles([]);
      setAfterStageFiles([]);
      setDocumentFiles([]);
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
      setExistingGallery([]);
      setCoverImageFile(null);
      setBeforeStageFiles([]);
      setDuringStageFiles([]);
      setAfterStageFiles([]);
      setDocumentFiles([]);
    }
  }, [projectToEdit, isOpen]);

  const removeExistingGalleryItem = (indexToRemove) => {
    setExistingGallery((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

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

      if (beforeStageFiles.length > 0) {
        beforeStageFiles.forEach((file) => {
          data.append('beforeImages', file);
        });
      }

      if (duringStageFiles.length > 0) {
        duringStageFiles.forEach((file) => {
          data.append('duringImages', file);
        });
      }

      if (afterStageFiles.length > 0) {
        afterStageFiles.forEach((file) => {
          data.append('afterImages', file);
        });
      }

      if (isEditing || existingGallery.length > 0) {
        data.append('gallery', JSON.stringify(existingGallery));
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

        {/* Cover Image & Documents */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <HiPhoto className="w-4 h-4 text-red-600" />
            <span>Primary Cover Visual & Technical Documentation</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 mb-1 font-semibold">Hero Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverImageFile(e.target.files[0])}
                className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer"
              />
              {projectToEdit?.coverImage && !coverImageFile && (
                <div className="mt-2 flex items-center gap-2">
                  <img src={projectToEdit.coverImage} alt="Current Cover" className="w-12 h-9 object-cover rounded-lg border border-slate-200" />
                  <span className="text-[10px] text-slate-500 font-mono">Current cover active</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-semibold">Case Study Drawings / PDFs</label>
              <input
                type="file"
                accept="application/pdf"
                multiple
                onChange={(e) => setDocumentFiles(Array.from(e.target.files))}
                className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300 cursor-pointer"
              />
              {documentFiles.length > 0 && (
                <span className="text-[11px] text-emerald-600 font-bold block mt-1">
                  ✓ {documentFiles.length} PDF document(s) selected
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 3-Stage Photo Documentation Section */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col gap-4 shadow-sm">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <HiCloudArrowUp className="w-4 h-4 text-red-600" />
              <span>Project Execution Stage Photo Visuals (Before, During & After)</span>
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Upload high-resolution photography for each phase. These directly populate the Before, During, and After interactive stage filters on the case study page.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* 1. Before Stage Upload */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
                    <span>🧱 Before Stage</span>
                  </span>
                  <Badge variant="warning" size="sm">Phase 1</Badge>
                </div>
                <p className="text-[11px] text-amber-800/80 mb-3 leading-relaxed">
                  Initial site topography, virgin quarry ground, foundation excavation, and pre-civil alignment.
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setBeforeStageFiles(Array.from(e.target.files))}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-600 file:text-white hover:file:bg-amber-700 cursor-pointer mb-2"
                />
                {beforeStageFiles.length > 0 && (
                  <span className="text-[10px] font-bold text-amber-800 block mb-2">
                    ✓ {beforeStageFiles.length} new Before photo(s) chosen
                  </span>
                )}
              </div>

              {/* Existing Before Photos (when editing) */}
              {existingGallery.some(item => item.stage === 'before') && (
                <div className="pt-2 border-t border-amber-200/60 mt-2">
                  <span className="text-[10px] font-bold text-amber-800 uppercase block mb-1.5">Existing Photos:</span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {existingGallery.map((item, idx) => {
                      if (item.stage !== 'before') return null;
                      return (
                        <div key={idx} className="relative group/thumb flex-shrink-0">
                          <img src={item.url} alt="Before Stage" className="w-12 h-10 object-cover rounded-lg border border-amber-300" />
                          <button
                            type="button"
                            onClick={() => removeExistingGalleryItem(idx)}
                            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] shadow"
                            title="Remove photo"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 2. During Stage Upload */}
            <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sky-900 flex items-center gap-1.5 text-xs">
                    <span>⚙️ During Stage</span>
                  </span>
                  <Badge variant="blue" size="sm">Phase 2</Badge>
                </div>
                <p className="text-[11px] text-sky-800/80 mb-3 leading-relaxed">
                  Tandem crane girder launching, heavy machine pre-erection, structural welding, and assembly works.
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setDuringStageFiles(Array.from(e.target.files))}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-sky-600 file:text-white hover:file:bg-sky-700 cursor-pointer mb-2"
                />
                {duringStageFiles.length > 0 && (
                  <span className="text-[10px] font-bold text-sky-800 block mb-2">
                    ✓ {duringStageFiles.length} new During photo(s) chosen
                  </span>
                )}
              </div>

              {/* Existing During Photos (when editing) */}
              {existingGallery.some(item => item.stage === 'during' || !item.stage) && (
                <div className="pt-2 border-t border-sky-200/60 mt-2">
                  <span className="text-[10px] font-bold text-sky-800 uppercase block mb-1.5">Existing Photos:</span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {existingGallery.map((item, idx) => {
                      if (item.stage !== 'during' && item.stage !== 'general' && item.stage) return null;
                      return (
                        <div key={idx} className="relative group/thumb flex-shrink-0">
                          <img src={item.url} alt="During Stage" className="w-12 h-10 object-cover rounded-lg border border-sky-300" />
                          <button
                            type="button"
                            onClick={() => removeExistingGalleryItem(idx)}
                            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] shadow"
                            title="Remove photo"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 3. After Stage Upload */}
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs">
                    <span>🏁 After Stage</span>
                  </span>
                  <Badge variant="success" size="sm">Phase 3</Badge>
                </div>
                <p className="text-[11px] text-emerald-800/80 mb-3 leading-relaxed">
                  Final load-tested railway overbridge, fully automated crushing plant running at capacity, and client handover.
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setAfterStageFiles(Array.from(e.target.files))}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer mb-2"
                />
                {afterStageFiles.length > 0 && (
                  <span className="text-[10px] font-bold text-emerald-800 block mb-2">
                    ✓ {afterStageFiles.length} new After photo(s) chosen
                  </span>
                )}
              </div>

              {/* Existing After Photos (when editing) */}
              {existingGallery.some(item => item.stage === 'after') && (
                <div className="pt-2 border-t border-emerald-200/60 mt-2">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-1.5">Existing Photos:</span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {existingGallery.map((item, idx) => {
                      if (item.stage !== 'after') return null;
                      return (
                        <div key={idx} className="relative group/thumb flex-shrink-0">
                          <img src={item.url} alt="After Stage" className="w-12 h-10 object-cover rounded-lg border border-emerald-300" />
                          <button
                            type="button"
                            onClick={() => removeExistingGalleryItem(idx)}
                            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] shadow"
                            title="Remove photo"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
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
