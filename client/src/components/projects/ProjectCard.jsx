import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HiMapPin, 
  HiBuildingOffice2, 
  HiArrowRight, 
  HiCheckCircle 
} from 'react-icons/hi2';

import { Card } from '../common/Card.jsx';
import { Badge } from '../common/Badge.jsx';

export const ProjectCard = ({ project }) => {
  if (!project) return null;

  return (
    <Card className="h-full p-4 sm:p-5 bg-white border-slate-200 hover:border-red-400 hover:shadow-md flex flex-col justify-between group shadow-sm relative overflow-hidden transition-all duration-200">
      <div>
        {/* Cover Preview Image */}
        <div className="aspect-[16/10] w-full rounded-xl bg-slate-100 border border-slate-200 relative overflow-hidden flex items-center justify-center mb-3 sm:mb-4">
          {project.coverImage ? (
            <img
              src={project.coverImage}
              alt={project.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mb-2 shadow-sm">
                <HiBuildingOffice2 className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono text-slate-500 font-semibold">Civil Infrastructure</span>
            </div>
          )}

          {/* Project Type Badge */}
          <div className="absolute top-2.5 left-2.5">
            <Badge variant="red" size="sm">
              {project.projectType}
            </Badge>
          </div>

          {/* Status Badge */}
          <div className="absolute top-2.5 right-2.5">
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border capitalize ${
              project.status === 'completed'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              {project.status}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors mb-1.5 leading-snug">
          {project.title}
        </h3>

        {/* Client Name */}
        <div className="flex items-center gap-1.5 text-xs text-red-600 font-semibold mb-2">
          <HiBuildingOffice2 className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{project.clientName}</span>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3 sm:mb-4">
          {project.description}
        </p>

        {/* Location and Capacity Bar */}
        <div className="flex items-center justify-between p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] sm:text-xs mb-4">
          <div className="flex items-center gap-1 text-slate-700 truncate max-w-[50%]">
            <HiMapPin className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
            <span className="truncate">{project.location}</span>
          </div>
          <div className="text-right">
            <span className="font-mono font-bold text-slate-900">{project.projectCapacity}</span>
          </div>
        </div>
      </div>

      {/* Footer Link */}
      <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
        <Link
          to={`/projects/${project.slug || project._id}`}
          className="text-xs font-bold text-slate-700 hover:text-red-600 flex items-center gap-1 transition-colors"
        >
          <span>Explore Case Study</span>
          <HiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-red-600" />
        </Link>

        {project.duration && (
          <span className="text-[11px] font-mono text-slate-500">
            {project.duration}
          </span>
        )}
      </div>
    </Card>
  );
};

export default ProjectCard;
