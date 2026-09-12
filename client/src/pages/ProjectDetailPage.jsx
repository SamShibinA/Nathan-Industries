import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiArrowLeft, 
  HiMapPin, 
  HiCheckCircle, 
  HiBuildingOffice2, 
  HiArrowTopRightOnSquare, 
  HiWrenchScrewdriver, 
  HiPhoto, 
  HiMagnifyingGlassPlus, 
  HiShieldCheck 
} from 'react-icons/hi2';

import { Container } from '../components/common/Container.jsx';
import { Button } from '../components/common/Button.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Card } from '../components/common/Card.jsx';
import { Spinner } from '../components/common/Spinner.jsx';
import { ImageGalleryModal } from '../components/products/ImageGalleryModal.jsx';
import { ProjectCard } from '../components/projects/ProjectCard.jsx';
import { projectService } from '../services/projectService.js';

export const ProjectDetailPage = () => {
  const { slug } = useParams();

  const [project, setProject] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gallery Stage Filter ('all' | 'before' | 'during' | 'after')
  const [activeStage, setActiveStage] = useState('all');

  // Lightbox Zoom
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await projectService.getProjectBySlugOrId(slug);
        const fetchedProject = res?.project || res?.data?.project || (res && !res.data ? res : null);
        const fetchedRelated = res?.relatedProjects || res?.data?.relatedProjects || [];
        setProject(fetchedProject);
        setRelated(fetchedRelated);
      } catch (err) {
        setError(err?.message || 'Failed to load project details');
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
        <p className="text-xs text-slate-500 font-mono">Loading case study datasheets & stage visuals...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="py-20 bg-slate-50 min-h-screen">
        <Container>
          <Card className="p-12 text-center bg-white border-slate-200 max-w-xl mx-auto">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Project Case Study Not Found</h2>
            <p className="text-xs text-slate-600 mb-6">{error || 'Requested infrastructure case study does not exist.'}</p>
            <Link to="/projects">
              <Button variant="primary" className="bg-red-600 hover:bg-red-700 text-white">Back to Infrastructure Portfolio</Button>
            </Link>
          </Card>
        </Container>
      </div>
    );
  }

  const allStageImages = [
    ...(project.gallery || []),
  ];

  const filteredGallery = activeStage === 'all'
    ? allStageImages
    : allStageImages.filter((img) => img.stage === activeStage);

  const lightboxUrls = (filteredGallery.length > 0 ? filteredGallery : allStageImages)
    .map((item) => item.url)
    .filter(Boolean);

  return (
    <div className="py-10 bg-slate-50/70 min-h-screen text-slate-700">
      <Container>
        {/* Back Link */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-red-600 mb-6 transition-colors"
        >
          <HiArrowLeft className="w-4 h-4" />
          <span>Back to Projects Portfolio</span>
        </Link>

        {/* Project Header Overview */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 pb-8 border-b border-slate-200 mb-10">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
              <Badge variant="red" size="md">
                {project.projectType}
              </Badge>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded border capitalize ${
                project.status === 'completed'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {project.status}
              </span>
            </div>

            {/* Refined Title Typography */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
              {project.title}
            </h1>

            <div className="flex items-center gap-2 text-xs text-red-600 font-semibold">
              <HiBuildingOffice2 className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>Client / Authority: {project.clientName}</span>
            </div>
          </div>

          {/* External Google Maps Button */}
          {project.googleMapsLink && (
            <a
              href={project.googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 w-full sm:w-auto"
            >
              <Button variant="outline" size="md" icon={HiArrowTopRightOnSquare} iconPosition="right" className="w-full sm:w-auto text-slate-800 bg-white border-slate-300 hover:border-red-400 hover:text-red-600 shadow-sm">
                View Site on Google Maps
              </Button>
            </a>
          )}
        </div>

        {/* 4 Core Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mb-10 sm:mb-12">
          <Card className="p-3 sm:p-4 bg-white border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Project Output Scale</span>
            <span className="text-sm sm:text-base font-bold text-slate-900 font-mono">{project.projectCapacity}</span>
          </Card>

          <Card className="p-3 sm:p-4 bg-white border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Duration & Timeline</span>
            <span className="text-sm sm:text-base font-bold text-red-600 font-mono">{project.duration || 'Turnkey EPC'}</span>
          </Card>

          <Card className="p-3 sm:p-4 bg-white border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Site Location</span>
            <span className="text-sm sm:text-base font-bold text-slate-900 truncate block">{project.location}</span>
          </Card>

          <Card className="p-3 sm:p-4 bg-white border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Contract Execution</span>
            <span className="text-sm sm:text-base font-bold text-emerald-600 truncate block">Class-1 Contractor</span>
          </Card>
        </div>

        {/* Narrative Description & Scope */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mb-12 sm:mb-14">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <Card className="p-4 sm:p-6 bg-white border-slate-200">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <HiShieldCheck className="w-5 h-5 text-red-600" />
                <span>Executive Case Study & Civil Engineering Milestones</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </Card>

            {/* Scope of Work */}
            {project.scopeOfWork?.length > 0 && (
              <Card className="p-4 sm:p-6 bg-white border-slate-200">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-4">
                  Itemized Scope of Engineering Deliverables
                </h3>
                <ul className="flex flex-col gap-2.5 text-xs text-slate-600">
                  {project.scopeOfWork.map((scope, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <HiCheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{scope}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Machinery Deployed */}
            {project.machineryUsed?.length > 0 && (
              <Card className="p-4 sm:p-6 bg-white border-slate-200">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <HiWrenchScrewdriver className="w-5 h-5 text-red-600" />
                  <span>Machinery & Heavy Cranes Deployed</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.machineryUsed.map((m, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* Site Address */}
            <Card className="p-4 sm:p-6 bg-white border-slate-200">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <HiMapPin className="w-5 h-5 text-red-600" />
                <span>Geographic Site Parameters</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {project.fullAddress || `${project.location}, India`}
              </p>

              {project.googleMapsLink && (
                <a
                  href={project.googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1.5"
                >
                  <span>Open Coordinates in Google Maps</span>
                  <HiArrowTopRightOnSquare className="w-3.5 h-3.5" />
                </a>
              )}
            </Card>
          </div>
        </div>

        {/* Stage-by-Stage Photo Gallery (Before / During / After) */}
        {allStageImages.length > 0 && (
          <div className="mb-14">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Execution Stage Photographs & Visual Logs
                </h3>
                <p className="text-xs text-slate-500">
                  Inspect foundation excavation, structural pre-assembly, and final plant handover.
                </p>
              </div>

              {/* Stage Filter Pills */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-slate-200 shadow-sm">
                {['all', 'before', 'during', 'after'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setActiveStage(st)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                      activeStage === st
                        ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGallery.map((item, idx) => (
                <Card
                  key={idx}
                  onClick={() => {
                    setActiveImageIdx(idx);
                    setLightboxOpen(true);
                  }}
                  className="p-3 bg-white border-slate-200 hover:border-red-400 hover:shadow-md cursor-pointer group flex flex-col justify-between"
                >
                  <div className="aspect-[16/10] w-full rounded-xl bg-slate-100 border border-slate-200 overflow-hidden relative flex items-center justify-center mb-3">
                    {item.url ? (
                      <img
                        src={item.url}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <HiPhoto className="w-8 h-8 text-slate-400" />
                    )}

                    <div className="absolute top-2 left-2">
                      <Badge variant={item.stage === 'after' ? 'success' : 'red'} size="sm">
                        {item.stage} Stage
                      </Badge>
                    </div>

                    <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold">
                      <HiMagnifyingGlassPlus className="w-4 h-4 text-red-400" />
                      <span>Inspect Photo</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 line-clamp-2">
                    {item.caption || `${project.title} - ${item.stage} phase`}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Related Projects */}
        {related.length > 0 && (
          <div className="mt-14 pt-10 border-t border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6">
              Related National Infrastructure Case Studies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <ProjectCard key={rel._id} project={rel} />
              ))}
            </div>
          </div>
        )}

        {/* Fullscreen Lightbox Modal */}
        <ImageGalleryModal
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          images={lightboxUrls}
          initialIndex={activeImageIdx}
          title={project.title}
        />
      </Container>
    </div>
  );
};

export default ProjectDetailPage;
