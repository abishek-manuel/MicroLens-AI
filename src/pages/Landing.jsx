import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Microscope,
  Upload,
  BarChart3,
  Shield,
  Zap,
  Globe,
  ArrowRight,
  Droplets,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Particles from '../components/ui/Particles';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.12 } },
};

const features = [
  {
    icon: Zap,
    title: 'AI-Powered Detection',
    description: 'Advanced deep learning models identify and classify microplastic particles with high accuracy.',
    color: 'from-primary-500 to-primary-600',
  },
  {
    icon: BarChart3,
    title: 'Detailed Analytics',
    description: 'Comprehensive charts and reports break down particle types, severity, and pollution trends over time.',
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    icon: Upload,
    title: 'Simple Upload',
    description: 'Drag-and-drop your sample images and get instant results with annotated detection overlays.',
    color: 'from-amber-500 to-amber-600',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your research data is encrypted and stored securely. Full access control and audit logging.',
    color: 'from-rose-500 to-rose-600',
  },
];

const steps = [
  { number: '01', title: 'Upload Sample', description: 'Capture or upload an image of your water or soil sample.', icon: Upload },
  { number: '02', title: 'AI Analysis', description: 'Our model processes the image, detecting and classifying particles.', icon: Microscope },
  { number: '03', title: 'View Results', description: 'Get detailed breakdowns, severity scores, and annotated images.', icon: BarChart3 },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero — Ocean Background */}
      <section
        className="relative overflow-hidden"
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #0a2540 0%, #07243d 15%, #051c35 40%, #040f22 65%, #020810 100%)',
        }}
      >
        {/* WebGL particle layer — z-index -1 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
          }}
        >
          <Particles
            particleColors={['#7dd3fc', '#38bdf8', '#bae6fd', '#e0f2fe', '#ffffff', '#67e8f9']}
            particleCount={220}
            particleSpread={12}
            speed={0.06}
            particleBaseSize={80}
            moveParticlesOnHover={true}
            particleHoverFactor={0.4}
            alphaParticles={true}
            sizeRandomness={1.2}
            cameraDistance={22}
            disableRotation={false}
            pixelRatio={window.devicePixelRatio}
          />
        </div>

        {/* Subtle vignette overlay so text stays legible */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(2,8,16,0.50) 100%)',
            zIndex: 1,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 py-32 md:py-44" style={{ zIndex: 2 }}>
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
              style={{
                background: 'rgba(56,189,248,0.12)',
                border: '1px solid rgba(56,189,248,0.25)',
                color: '#7dd3fc',
              }}
            >
              <Droplets className="w-4 h-4" />
              <span className="text-sm font-medium tracking-wide">AI-Powered Environmental Analysis</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6"
              style={{ color: '#f0f9ff' }}
            >
              Detect Microplastics{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #38bdf8 0%, #22d3ee 50%, #67e8f9 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                with AI Precision
              </span>
            </motion.h1>

            {/* Sub-copy */}
            <motion.p
              variants={fadeUp}
              className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
              style={{ color: 'rgba(186,230,253,0.85)' }}
            >
              Upload water or soil sample images and let our advanced AI model identify,
              classify, and quantify microplastic pollution in seconds.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login" className="btn-primary text-base px-8 py-4">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold rounded-xl transition-all duration-200 text-base"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#e0f2fe',
                  backdropFilter: 'blur(8px)',
                }}
              >
                Learn More
              </Link>
            </motion.div>

          </motion.div>
        </div>

        {/* Wave divider — blends ocean into next section */}
        <div className="absolute bottom-0 left-0 right-0" style={{ zIndex: 2 }}>
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M0 50L48 45C96 40 192 30 288 28C384 26 480 32 576 42C672 52 768 66 864 68C960 70 1056 60 1152 52C1248 44 1344 38 1392 35L1440 32V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z"
              className="fill-gray-50 dark:fill-navy-950"
            />
          </svg>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-28 bg-gray-50 dark:bg-navy-950">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title mb-4">Why MICRO LENS AI?</h2>
            <p className="section-subtitle mx-auto">
              Our platform combines cutting-edge AI with an intuitive interface for rapid, accurate microplastic analysis.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card group hover:shadow-glow transition-all duration-300"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4 
                                group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-navy-500 dark:text-navy-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 md:py-28 bg-white dark:bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title mb-4">How It Works</h2>
            <p className="section-subtitle mx-auto">
              Three simple steps to analyze your samples for microplastic contamination.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative text-center"
              >
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary-500/50 to-transparent" />
                )}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-500/10 mb-6">
                  <step.icon className="w-7 h-7 text-primary-500" />
                </div>
                <span className="block text-xs font-bold text-primary-500 mb-2 tracking-widest">
                  STEP {step.number}
                </span>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-sm text-navy-500 dark:text-navy-400 max-w-xs mx-auto leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-gray-50 dark:bg-navy-950">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-primary-50 dark:from-navy-800 dark:to-navy-900 p-12 md:p-16 text-center border border-navy-100 dark:border-transparent shadow-glass"
          >
            <div className="absolute top-0 right-0 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />

            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-navy-900 dark:text-white mb-4">
                Ready to Start Analyzing?
              </h2>
              <p className="text-navy-600 dark:text-navy-300 mb-8 max-w-lg mx-auto">
                Join researchers worldwide using MICRO LENS AI to detect and track microplastic pollution.
              </p>
              <Link to="/login" className="btn-primary text-base px-8 py-4">
                Launch Platform
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
