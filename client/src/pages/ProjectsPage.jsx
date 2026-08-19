import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiMagnifyingGlass, 
  HiAdjustmentsHorizontal, 
  HiBuildingOffice2, 
  HiXMark
} from 'react-icons/hi2';

import { Container } from '../components/common/Container.jsx';
import { SectionHeading } from '../components/common/SectionHeading.jsx';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Spinner } from '../components/common/Spinner.jsx';
import { Button } from '../components/common/Button.jsx';
import { ProjectCard } from '../components/projects/ProjectCard.jsx';
import { projectService } from '../services/projectService.js';
import { PROJECT_TYPES } from '../utils/constants.js';

export const ProjectsPage = () => {
  const [searchParams] = useSearchParams();

  const currentType = searchParams.get('type') || 'all';
  const currentStatus = searchParams.get('status') || 'all';
  const currentSearch = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [projects, setProjects] = useState([]);
  const [meta, setMeta] = useState({ total: 0, pages: 1, page: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: 9,
        };

        if (currentType !== 'all') params.projectType = currentType;
        if (currentStatus !== 'all') params.status = currentStatus;
        if (currentSearch.trim()) params.search = currentSearch.trim();

        const res = await projectService.getProjects(params);
        setProjects(res.data || []);
        setMeta(res.meta || { total: 0, pages: 1, page: 1 });
      } catch (err) {
        console.error('Failed to load projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [currentType, currentStatus, currentSearch, currentPage]);

  const updateFilters = (newParams) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, val]) => {
      if (!val || val === 'all') {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    params.set('page', '1');
    setSearchParams(params);
  };

  const projectTypes = [
    { id: 'all', name: 'All Infrastructure Portfolio' },
    ...PROJECT_TYPES,
  ];

  return (
    <div className="py-12 bg-slate-50/70 min-h-screen">
      <Container>
        {/* Section Heading */}
        <SectionHeading
          badge="National Infrastructure Portfolio"
          title="Railway Overbridges, Turnkey Crusher Plants & Civil Engineering"
          subtitle="Explore landmark civil undertakings, bridge girder launching, overland conveyor corridors, and 600 TPH turnkey quarry installations executed across India."
        />

        {/* Filter and Search Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:max-w-md">
              <HiMagnifyingGlass className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                value={currentSearch}
                onChange={(e) => updateFilters({ search: e.target.value })}
                placeholder="Search by client, title, location, span..."
                className="w-full pl-11 pr-9 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500 transition-colors text-xs"
              />
              {currentSearch && (
                <button
                  type="button"
                  onClick={() => updateFilters({ search: '' })}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
                >
                  <HiXMark className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <span className="font-semibold text-slate-500">Status:</span>
                <select
                  value={currentStatus}
                  onChange={(e) => updateFilters({ status: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-xs focus:outline-none focus:border-red-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="ongoing">Ongoing</option>
                </select>
              </div>

              {(currentType !== 'all' || currentStatus !== 'all' || currentSearch) && (
                <button
                  onClick={() => setSearchParams({})}
                  className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
                >
                  <HiXMark className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Project Types Filter Horizontal Pills */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200 overflow-x-auto pb-1 scrollbar-none">
            {projectTypes.map((type) => {
              const isActive = currentType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => updateFilters({ type: type.id })}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex-shrink-0 border ${
                    isActive
                      ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-600/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400 hover:text-slate-900'
                  }`}
                >
                  {type.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Spinner size="lg" />
            <p className="text-xs text-slate-500 font-mono">Loading infrastructure case studies...</p>
          </div>
        ) : projects.length === 0 ? (
          <Card className="p-12 text-center bg-white border-dashed border-slate-300">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4">
              <HiBuildingOffice2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No Projects Found</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto mb-6">
              No project case studies matched your current filter criteria.
            </p>
            <Button variant="primary" onClick={() => setSearchParams({})} className="bg-red-600 hover:bg-red-700 text-white">
              Reset Filters
            </Button>
          </Card>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj) => (
                <ProjectCard key={proj._id} project={proj} />
              ))}
            </div>

            {/* Pagination */}
            {meta.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                {[...Array(meta.pages)].map((_, i) => {
                  const pageNum = i + 1;
                  const isActive = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        params.set('page', pageNum.toString());
                        setSearchParams(params);
                      }}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                          : 'bg-white text-slate-700 border border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
};

export default ProjectsPage;
