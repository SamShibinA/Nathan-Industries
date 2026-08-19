import React from 'react';
import { Card } from '../../components/common/Card.jsx';
import { Button } from '../../components/common/Button.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import {
  HiArrowDownTray,
  HiDocumentText,
  HiShieldCheck,
  HiWrenchScrewdriver,
  HiBuildingOffice2,
} from 'react-icons/hi2';

export const CustomerDownloadsPage = () => {
  const { showSuccess } = useToast();

  const downloads = [
    {
      id: 'DL-01',
      title: 'NathanIndustries Corporate Equipment Brochure (2026 Edition)',
      category: 'Catalog',
      size: '8.4 MB',
      format: 'PDF',
      description: 'Comprehensive 48-page catalog featuring Primary Jaw Crushers, Hydraulic Cone Crushers, VSI Sand Plants, and Overland Conveyor Corridors.',
      icon: HiDocumentText,
    },
    {
      id: 'DL-02',
      title: 'Integrated 3-Stage Crushing Plant (200-600 TPH) Technical Flowsheet',
      category: 'Engineering CAD',
      size: '4.2 MB',
      format: 'PDF',
      description: 'Standard civil layout, foundation loading parameters, power distribution single-line diagram, and conveyor routing drawings.',
      icon: HiWrenchScrewdriver,
    },
    {
      id: 'DL-03',
      title: 'Primary Jaw Crusher (NI-JC Series) Operation & Maintenance Manual',
      category: 'Spec Sheet',
      size: '3.1 MB',
      format: 'PDF',
      description: 'Jaw plate replacement procedure, lubrication schedules, toggle plate alignment tolerances, and bearing torque specifications.',
      icon: HiWrenchScrewdriver,
    },
    {
      id: 'DL-04',
      title: 'M-Sand & P-Sand Dry Air Classifier Technical Performance Report',
      category: 'Product Sheet',
      size: '2.8 MB',
      format: 'PDF',
      description: 'Zero-water dry classification results, particle size distribution charts, and silt reduction compliance certificates under IS:383.',
      icon: HiDocumentText,
    },
    {
      id: 'DL-05',
      title: 'Railway Overbridge (ROB) EPC Erection Methodology & Steel Truss Specs',
      category: 'Civil Infra',
      size: '5.6 MB',
      format: 'PDF',
      description: 'Prestressed concrete girder casting standards, hydraulic launcher erection sequences, and RDSO compliance documentation.',
      icon: HiBuildingOffice2,
    },
    {
      id: 'DL-06',
      title: 'ISO 9001:2015 & Heavy Foundry Metallurgical Quality Certification',
      category: 'Quality Cert',
      size: '1.2 MB',
      format: 'PDF',
      description: 'High manganese casting (Mn18Cr2, Mn22) chemical analysis reports, non-destructive testing (NDT) standards, and ISO accreditation.',
      icon: HiShieldCheck,
    },
  ];

  const handleDownload = (item) => {
    // Generate a dummy downloadable text blob simulating PDF download
    const dummyContent = `NathanIndustries Official Technical Document\nTitle: ${item.title}\nDocument ID: ${item.id}\nCategory: ${item.category}\nFormat: ${item.format}\nDescription: ${item.description}\n\n© 2026 NathanIndustries Heavy Engineering Works. All rights reserved.`;
    const element = document.createElement('a');
    const file = new Blob([dummyContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${item.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showSuccess(`Started download for "${item.title}".`);
  };

  return (
    <div className="flex flex-col gap-6 text-slate-800">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Downloads & Technical Documentation
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Access official machinery brochures, CAD flowsheets, foundation guidelines, and quality certificates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {downloads.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.id} className="p-6 bg-white border-slate-200 shadow-sm flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                    {item.category}
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-400">
                    {item.format} • {item.size}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug flex items-start gap-2 mt-1">
                  <Icon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>{item.title}</span>
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">Doc ID: {item.id}</span>
                <Button
                  size="sm"
                  variant="primary"
                  icon={HiArrowDownTray}
                  onClick={() => handleDownload(item)}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm shadow-red-600/20"
                >
                  Download {item.format}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CustomerDownloadsPage;
