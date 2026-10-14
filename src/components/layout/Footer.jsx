import { Link } from 'react-router-dom';
import { Microscope, Globe, ExternalLink, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-navy-200 dark:border-navy-800 bg-white/50 dark:bg-navy-950/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-500">
                <Microscope className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                MICRO <span className="gradient-text">LENS</span> AI
              </span>
            </Link>
            <p className="text-sm text-navy-500 dark:text-navy-400 max-w-md leading-relaxed">
              AI-powered microplastic detection platform helping researchers and environmental
              agencies identify and quantify plastic pollution in water and soil samples.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-navy-900 dark:text-gray-100 mb-3">Platform</h4>
            <ul className="space-y-2">
              {['Dashboard', 'Upload', 'History', 'Reports'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className="text-sm text-navy-500 dark:text-navy-400 hover:text-primary-500 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-navy-900 dark:text-gray-100 mb-3">Company</h4>
            <ul className="space-y-2">
              {['About', 'Privacy Policy', 'Terms of Service', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    to={item === 'About' ? '/about' : '#'}
                    className="text-sm text-navy-500 dark:text-navy-400 hover:text-primary-500 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-navy-200 dark:border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-navy-400 dark:text-navy-500">
            © {new Date().getFullYear()} MICRO LENS AI. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {[Globe, ExternalLink, Mail].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="p-2 rounded-lg text-navy-400 hover:text-primary-500 hover:bg-navy-100 dark:hover:bg-navy-800 transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
