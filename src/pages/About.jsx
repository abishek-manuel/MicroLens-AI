import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Microscope,
  Brain,
  Database,
  Shield,
  Users,
  Target,
  Globe,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const techStack = [
  { icon: Brain, title: 'YOLOv8 Detection', description: 'State-of-the-art object detection model fine-tuned on microplastic datasets for accurate particle identification.' },
  { icon: Microscope, title: 'Multi-Class Classification', description: 'Classifies particles into fibers, films, fragments, and spheres with confidence scoring.' },
  { icon: Database, title: 'Cloud Processing', description: 'Scalable cloud infrastructure processes samples quickly regardless of image resolution.' },
  { icon: Shield, title: 'Data Security', description: 'End-to-end encryption ensures your research data remains private and secure.' },
];

const values = [
  'Accelerate environmental research workflows',
  'Standardize microplastic identification methods',
  'Enable data-driven policy decisions',
  'Build a global pollution monitoring network',
  'Make advanced AI accessible to all researchers',
];

export default function About() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-primary-50 to-cyan-50 dark:bg-hero-pattern dark:from-transparent dark:via-transparent dark:to-transparent">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-navy-900 dark:text-white leading-tight mb-6">
              About <span className="gradient-text">MICRO LENS AI</span>
            </h1>
            <p className="text-lg text-navy-600 dark:text-navy-300 leading-relaxed">
              We're building the future of environmental monitoring — using AI to detect,
              classify, and track microplastic pollution at scale. Our mission is to empower
              researchers, agencies, and policymakers with actionable data.
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full">
            <path
              d="M0 40L60 36C120 32 240 24 360 22C480 20 600 24 720 32C840 40 960 52 1080 54C1200 56 1320 48 1380 44L1440 40V80H0V40Z"
              className="fill-gray-50 dark:fill-navy-950"
            />
          </svg>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-gray-50 dark:bg-navy-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-sm font-bold text-primary-500 tracking-widest uppercase mb-3 block">Our Mission</span>
              <h2 className="section-title mb-6">
                Making Invisible Pollution Visible
              </h2>
              <p className="text-navy-500 dark:text-navy-400 leading-relaxed mb-8">
                Microplastics are everywhere — in our oceans, rivers, soil, and even the air we breathe.
                Yet detecting and quantifying them remains a time-consuming, manual process.
                MICRO LENS AI automates this with deep learning, turning hours of lab work into seconds.
              </p>
              <ul className="space-y-3">
                {values.map((value) => (
                  <li key={value} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-navy-600 dark:text-navy-300">{value}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="py-20 bg-white dark:bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title mb-4">Our Technology</h2>
            <p className="section-subtitle mx-auto">
              Powered by state-of-the-art deep learning models trained on thousands of labeled microplastic samples.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card group hover:shadow-glow transition-all duration-300"
              >
                <div className="p-3 rounded-xl bg-primary-500/10 inline-flex mb-4 group-hover:scale-110 transition-transform">
                  <tech.icon className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{tech.title}</h3>
                <p className="text-sm text-navy-500 dark:text-navy-400 leading-relaxed">
                  {tech.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-50 dark:bg-navy-950">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title mb-4">Ready to Get Started?</h2>
            <p className="section-subtitle mx-auto mb-8">
              Start analyzing your samples today with MICRO LENS AI.
            </p>
            <Link to="/login" className="btn-primary text-base px-8 py-4">
              Launch Platform
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
