import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HiPlus, 
  HiPencilSquare, 
  HiTrash, 
  HiMagnifyingGlass, 
  HiBuildingOffice2 
} from 'react-icons/hi2';

import { Card } from '../../components/common/Card.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { ProjectFormModal } from '../../components/admin/ProjectFormModal.jsx';
import { projectService } from '../../services/projectService.js';
import { useToast } from '../../context/ToastContext.jsx';
import { PROJECT_TYPES } from '../../utils/constants.js';

export const AdminProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToEdit, setProductToEdit] = useState(null);

  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { showSuccess, showError } = useToast();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (typeFilter !== 'all') params.projectType = typeFilter;
      if (search.trim()) params.search = search.trim();

      const res = await projectService.getProjects(params);
      setProjects(res.data || []);
    } catch (err) {
      showError('Failed to fetch projects list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [typeFilter, search]);

  const handleOpenCreate = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proj) => {
    setProductToEdit(proj);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    setDeleting(true);
    try {
      await projectService.deleteProject(projectToDelete._id);
      showSuccess(`Deleted '${projectToDelete.title}'`);
      setProjectToDelete(null);
      fetchProjects();
    } catch (err) {
      showError(err.message || 'Failed to delete project');
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
            Infrastructure Projects CMS
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage Railway Overbridges, turnkey crusher installations, M-Sand plants, and stage galleries.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenCreate}
          icon={HiPlus}
          className="w-full sm:w-auto font-bold text-xs uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20"
        >
          Add Infrastructure Project
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
            placeholder="Search by client, title..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-600 font-semibold">Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-xs focus:outline-none focus:border-red-500"
          >
            <option value="all">All Infrastructure Types</option>
            {PROJECT_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Projects Table */}
      <Card className="p-0 bg-white border-slate-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2">
            <Spinner size="md" />
            <span className="text-xs text-slate-500 font-mono">Loading projects records...</span>
          </div>
        ) : projects.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No projects found. Click "Add Infrastructure Project" to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Project Title & Client</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Scale / Capacity</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {projects.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded-lg bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                          {item.coverImage ? (
                            <img src={item.coverImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <HiBuildingOffice2 className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block truncate max-w-xs">{item.title}</span>
                          <span className="text-[11px] text-red-600 font-semibold">{item.clientName}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant="red" size="sm">
                        {item.projectType}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">
                      {item.location}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {item.projectCapacity}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded border capitalize ${
                        item.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {item.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg bg-slate-100 border border-slate-300 text-slate-700 hover:text-red-600 hover:border-red-400 transition-colors"
                          title="Edit Project"
                        >
                          <HiPencilSquare className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setProjectToDelete(item)}
                          className="p-1.5 rounded-lg bg-slate-100 border border-slate-300 text-rose-600 hover:bg-rose-50 hover:border-rose-400 transition-colors"
                          title="Delete Project"
                        >
                          <HiTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add / Edit Form Modal */}
      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectToEdit={projectToEdit}
        onSaved={fetchProjects}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        title="Confirm Project Deletion"
        subtitle="This action cannot be undone."
      >
        <div className="flex flex-col gap-4">
          <p className="text-xs text-slate-700 leading-relaxed">
            Are you sure you want to permanently delete <strong className="text-slate-900">{projectToDelete?.title}</strong> and remove all associated stage photographs and case study documentation from disk?
          </p>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <Button variant="ghost" size="sm" onClick={() => setProjectToDelete(null)}>
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

export default AdminProjectsPage;
