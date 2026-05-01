'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, animate } from 'framer-motion';
import {
  FileText,
  Search,
  BookOpen,
  BarChart3,
  Shield,
  Settings,
  ArrowRight,
  FlaskConical,
  Globe2,
} from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const stats = [
  { label: 'Journals Covered', value: 500, suffix: '+' },
  { label: 'Databases', value: 8, suffix: '' },
  { label: 'Guidelines', value: 22, suffix: '' },
  { label: 'Disciplines', value: 45, suffix: '' },
];

const features = [
  {
    href: '/manuscript',
    icon: FileText,
    title: 'Manuscript Evaluator',
    description: 'Get Q1-level peer review feedback with section-by-section analysis, scoring, and desk rejection risk assessment.',
    color: '#c9952a',
    badge: 'AI-Powered',
  },
  {
    href: '/search',
    icon: Search,
    title: 'Literature Search',
    description: 'Search PubMed, Semantic Scholar, and CrossRef simultaneously with AI-synthesized summaries.',
    color: '#2d6be4',
    badge: '3 Databases',
  },
  {
    href: '/review',
    icon: BookOpen,
    title: 'Systematic Review',
    description: 'Full PRISMA-compliant workflow: protocol generation, screening, data extraction, and narrative synthesis.',
    color: '#0d9e6e',
    badge: 'PRISMA 2020',
  },
  {
    href: '/analysis',
    icon: BarChart3,
    title: 'Analysis Assistant',
    description: 'Statistical test selection, R and Python code generation, and plain-English results interpretation.',
    color: '#8b5cf6',
    badge: 'R + Python',
  },
  {
    href: '/guidelines',
    icon: Shield,
    title: 'Guidelines Checker',
    description: 'Check compliance with CONSORT, STROBE, PRISMA, STARD, TRIPOD, and 4 more reporting standards.',
    color: '#0d9e6e',
    badge: '8 Standards',
  },
  {
    href: '/settings',
    icon: Settings,
    title: 'Settings',
    description: 'Manage your API key, preferences, and application configuration.',
    color: '#5a6a80',
    badge: 'Config',
  },
];

const disciplines = [
  'Cardiology', 'Oncology', 'Neuroscience', 'Immunology', 'Endocrinology',
  'Epidemiology', 'Public Health', 'Psychiatry', 'Pharmacology', 'Genetics',
  'Radiology', 'Surgery', 'Emergency Medicine', 'Pediatrics', 'Geriatrics',
  'Infectious Disease', 'Rheumatology', 'Nephrology', 'Gastroenterology',
  'Pulmonology', 'Hematology', 'Dermatology', 'Orthopedics', 'Ophthalmology',
  'Biomedical Engineering', 'Bioinformatics', 'Biochemistry', 'Pathology',
  'Obstetrics', 'Psychology', 'Economics', 'Sociology', 'Education',
  'Computer Science', 'Physics', 'Chemistry', 'Environmental Science',
  'Nutrition', 'Sports Medicine', 'Anesthesiology', 'Urology', 'ENT',
  'Dentistry', 'Nursing', 'Physiotherapy',
];

function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(0);

  useEffect(() => {
    const controls = animate(motionVal, value, {
      duration: 2,
      ease: 'easeOut',
      delay: 0.3,
    });

    const unsub = motionVal.on('change', (v) => {
      if (ref.current) {
        ref.current.textContent = Math.round(v).toString();
      }
    });

    return () => {
      controls.stop();
      unsub();
    };
  }, [value, motionVal]);

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="font-playfair text-3xl font-bold text-[#dde4ee] flex items-end justify-center gap-0.5">
        <span ref={ref}>0</span>
        <span style={{ color: '#c9952a' }}>{suffix}</span>
      </div>
      <div className="text-xs text-[#8b9ab0] font-dm mt-1 uppercase tracking-wider">{label}</div>
    </motion.div>
  );
}

export default function DashboardPage() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="px-8 py-8 max-w-6xl mx-auto"
    >
      {/* Hero */}
      <div className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Globe2 className="w-4 h-4 text-[#c9952a]" />
            <span className="text-xs text-[#8b9ab0] font-dm uppercase tracking-widest">
              Research Intelligence Platform
            </span>
          </div>
          <h1 className="font-playfair text-5xl font-bold leading-tight mb-4">
            <span className="text-[#dde4ee]">Research at </span>
            <span className="gradient-gold">Q1 Level</span>
          </h1>
          <p className="text-[#8b9ab0] text-lg font-dm max-w-xl leading-relaxed">
            AI-powered tools for manuscript evaluation, literature discovery, systematic
            reviews, and statistical analysis — built for researchers who demand precision.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-4 gap-6 mt-10 py-8 px-6 rounded-xl border border-[#1f2d45] bg-[#0d1117]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {stats.map((stat) => (
            <StatCounter key={stat.label} {...stat} />
          ))}
        </motion.div>
      </div>

      {/* Feature grid */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-playfair text-xl font-semibold text-[#dde4ee]">Research Modules</h2>
          <span className="text-xs text-[#5a6a80] font-dm">6 tools available</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.href}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Link href={feature.href}>
                  <motion.div
                    className="group p-5 rounded-xl border border-[#1f2d45] bg-[#111827] cursor-pointer h-full"
                    whileHover={{ scale: 1.02, translateY: -2 }}
                    transition={{ duration: 0.2 }}
                    style={{ boxShadow: 'none' }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: feature.color + '20',
                          border: `1px solid ${feature.color}40`,
                        }}
                      >
                        <Icon className="w-5 h-5" style={{ color: feature.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-dm font-semibold text-[#dde4ee] text-sm group-hover:text-white transition-colors">
                            {feature.title}
                          </h3>
                          <span
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
                            style={{
                              backgroundColor: feature.color + '20',
                              color: feature.color,
                            }}
                          >
                            {feature.badge}
                          </span>
                        </div>
                        <p className="text-xs text-[#8b9ab0] font-dm leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-4 text-xs font-dm text-[#5a6a80] group-hover:text-[#c9952a] transition-colors">
                      Open module
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Disciplines ticker */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <FlaskConical className="w-4 h-4 text-[#5a6a80]" />
          <span className="text-xs text-[#5a6a80] font-dm uppercase tracking-wider">45 Disciplines Supported</span>
        </div>
        <div className="overflow-hidden rounded-lg border border-[#1f2d45] py-3 bg-[#0d1117]">
          <div className="ticker-inner flex gap-4">
            {[...disciplines, ...disciplines].map((d, i) => (
              <span
                key={i}
                className="whitespace-nowrap text-xs font-dm px-3 py-1.5 rounded-full border border-[#1f2d45] text-[#8b9ab0] flex-shrink-0"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Quick start CTA */}
      <motion.div
        className="rounded-xl border border-[#c9952a]/20 bg-gradient-to-br from-[#c9952a]/5 to-transparent p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-playfair text-lg font-semibold text-[#dde4ee] mb-1">
              Ready to elevate your research?
            </h3>
            <p className="text-sm text-[#8b9ab0] font-dm">
              Start with manuscript evaluation or search the literature — results in seconds.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link href="/manuscript">
              <motion.button
                className="px-5 py-2.5 rounded-lg text-sm font-medium font-dm text-[#07090f] flex items-center gap-2"
                style={{ backgroundColor: '#c9952a' }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <FileText className="w-4 h-4" />
                Evaluate Manuscript
              </motion.button>
            </Link>
            <Link href="/search">
              <motion.button
                className="px-5 py-2.5 rounded-lg text-sm font-medium font-dm text-[#dde4ee] border border-[#1f2d45] flex items-center gap-2 hover:border-[#283d5e]"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Search className="w-4 h-4" />
                Search Literature
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
