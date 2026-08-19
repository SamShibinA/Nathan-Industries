import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiWrenchScrewdriver, 
  HiBuildingOffice2, 
  HiPhoto, 
  HiUsers, 
  HiDocumentText, 
  HiArrowRight,
  HiPlus,
  HiShieldCheck,
  HiChartBar
} from 'react-icons/hi2';

import { Card } from '../../components/common/Card.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { Button } from '../../components/common/Button.jsx';
import { productService } from '../../services/productService.js';
import { projectService } from '../../services/projectService.js';
import { galleryService } from '../../services/galleryService.js';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    productsCount: 6,
    projectsCount: 6,
    galleryCount: 10,
    clientsCount: 42,
    pendingQuotesCount: 8,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const [prodRes, projRes, galRes] = await Promise.allSettled([
          productService.getProducts({ limit: 1 }),
          projectService.getProjects({ limit: 1 }),
          galleryService.getGalleryItems({ limit: 1 }),
        ]);

        setStats((prev) => ({
          ...prev,
          productsCount: prodRes.status === 'fulfilled' ? prodRes.value.meta?.total || 6 : 6,
          projectsCount: projRes.status === 'fulfilled' ? projRes.value.meta?.total || 6 : 6,
          galleryCount: galRes.status === 'fulfilled' ? galRes.value.meta?.total || 10 : 10,
        }));
      } catch (err) {
        console.warn('Dashboard stats load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, []);

  const kpis = [
    {
      title: 'Equipment Catalog',
      val: stats.productsCount,
      sub: 'Active Machinery Models',
      link: '/admin/products',
      icon: HiWrenchScrewdriver,
      color: 'red',
    },
    {
      title: 'Infrastructure Undertakings',
      val: stats.projectsCount,
      sub: 'Case Studies & Bridges',
      link: '/admin/projects',
      icon: HiBuildingOffice2,
      color: 'red',
    },
    {
      title: 'Visual Assets Archive',
      val: stats.galleryCount,
      sub: 'Factory & Machine Photos',
      link: '/admin/gallery',
      icon: HiPhoto,
      color: 'red',
    },
    {
      title: 'Registered Clients',
      val: stats.clientsCount,
      sub: 'Quarries & Mining Firms',
      link: '/admin/users',
      icon: HiUsers,
      color: 'red',
    },
  ];

  const recentActivities = [
    {
      action: 'Landmark Case Study Published',
      desc: '4-Lane Railway Overbridge (ROB) EPC Erection at Salem Bypass',
      time: '2 hours ago',
      type: 'project',
    },
    {
      action: 'Machinery Model Updated',
      desc: 'Hydraulic Multi-Cylinder Cone Crusher (NI-CC-400)',
      time: '4 hours ago',
      type: 'product',
    },
    {
      action: 'Factory Visuals Uploaded',
      desc: 'Heavy CNC Horizontal Boring Bay & Manganese Foundry Pouring',
      time: 'Yesterday',
      type: 'gallery',
    },
    {
      action: 'New Client Registered',
      desc: 'Murugan Blue Metals Quarry Ltd (Salem, Tamil Nadu)',
      time: 'Yesterday',
      type: 'user',
    },
  ];

  return (
    <div className="flex flex-col gap-6 text-slate-800">
      {/* Top Banner (Solid White / Slate, No Gradients, No Black) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-red-600" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="red" size="sm" icon={HiShieldCheck}>
                Executive Control Center
              </Badge>
              <span className="text-xs font-mono text-emerald-600 font-bold">
                System: ONLINE • v1.0.0
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              NathanIndustries Management Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Real-time oversight of heavy crushing machinery specifications, national infrastructure case studies, quotation pipelines, and client registries.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <Link to="/admin/products" className="flex-1 sm:flex-initial">
              <Button variant="primary" size="md" icon={HiPlus} className="w-full font-bold text-xs uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20">
                Add Machinery
              </Button>
            </Link>
            <Link to="/admin/projects" className="flex-1 sm:flex-initial">
              <Button variant="outline" size="md" icon={HiPlus} className="w-full font-bold text-xs uppercase tracking-wider text-slate-800 bg-white border-slate-300 hover:border-red-400 hover:text-red-600 shadow-sm">
                Add Project
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Core KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.06 }}
            >
              <Card className="h-full p-6 bg-white border-slate-200 hover:border-red-400 hover:shadow-md flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-11 h-11 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center group-hover:scale-105 group-hover:bg-red-600 group-hover:text-white transition-all shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                      {kpi.val}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors mb-0.5">
                    {kpi.title}
                  </h3>
                  <p className="text-xs text-slate-500">{kpi.sub}</p>
                </div>

                <Link
                  to={kpi.link}
                  className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-red-600 font-bold hover:underline"
                >
                  <span>Manage Module</span>
                  <HiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Operations Overview & Recent Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent System Activity */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <Card className="p-6 bg-white border-slate-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HiChartBar className="w-5 h-5 text-red-600" />
                <span>Recent Platform Activity</span>
              </h3>
              <span className="text-xs font-mono text-slate-500">Live Audit Log</span>
            </div>

            <div className="divide-y divide-slate-200">
              {recentActivities.map((act, idx) => (
                <div key={idx} className="py-3 flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">{act.action}</span>
                    <span className="text-xs text-slate-500 block">{act.desc}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 flex-shrink-0">{act.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Operational Links */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <Card className="p-6 bg-white border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-slate-200">
              Quick Administrative Tasks
            </h3>

            <div className="flex flex-col gap-2.5">
              <Link to="/admin/products" className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-red-400 flex items-center justify-between text-xs transition-colors">
                <div className="flex items-center gap-2.5">
                  <HiWrenchScrewdriver className="w-4 h-4 text-red-600" />
                  <span className="font-bold text-slate-900">Add Stone Crusher / VSI Plant</span>
                </div>
                <span className="text-red-600 font-bold">Launch →</span>
              </Link>

              <Link to="/admin/projects" className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-red-400 flex items-center justify-between text-xs transition-colors">
                <div className="flex items-center gap-2.5">
                  <HiBuildingOffice2 className="w-4 h-4 text-red-600" />
                  <span className="font-bold text-slate-900">Publish Railway Overbridge Undertaking</span>
                </div>
                <span className="text-red-600 font-bold">Launch →</span>
              </Link>

              <Link to="/admin/gallery" className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-red-400 flex items-center justify-between text-xs transition-colors">
                <div className="flex items-center gap-2.5">
                  <HiPhoto className="w-4 h-4 text-red-600" />
                  <span className="font-bold text-slate-900">Upload Foundry / Machine Floor Assets</span>
                </div>
                <span className="text-red-600 font-bold">Launch →</span>
              </Link>

              <Link to="/admin/quotes" className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-red-400 flex items-center justify-between text-xs transition-colors">
                <div className="flex items-center gap-2.5">
                  <HiDocumentText className="w-4 h-4 text-red-600" />
                  <span className="font-bold text-slate-900">Review Client RFQ Quotation Pipeline</span>
                </div>
                <span className="text-red-600 font-bold">Launch →</span>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
