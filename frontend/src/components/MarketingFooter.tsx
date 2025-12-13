import { Link } from 'react-router-dom';
import { Shield, Lock, Award, CheckCircle } from 'lucide-react';

export default function MarketingFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Trust Badges */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Shield className="w-10 h-10 text-blue-500 mb-3" />
              <div className="font-semibold text-white mb-1">Bank-Level Security</div>
              <div className="text-sm text-gray-400">AES-256 Encryption</div>
            </div>
            <div className="flex flex-col items-center">
              <Lock className="w-10 h-10 text-green-500 mb-3" />
              <div className="font-semibold text-white mb-1">GDPR Compliant</div>
              <div className="text-sm text-gray-400">Your Data Protected</div>
            </div>
            <div className="flex flex-col items-center">
              <Award className="w-10 h-10 text-purple-500 mb-3" />
              <div className="font-semibold text-white mb-1">99% Accuracy</div>
              <div className="text-sm text-gray-400">AI-Powered Analysis</div>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle className="w-10 h-10 text-yellow-500 mb-3" />
              <div className="font-semibold text-white mb-1">24/7 Support</div>
              <div className="text-sm text-gray-400">Always Here to Help</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">IQ</span>
              </div>
              <span className="text-xl font-bold text-white">InspectIQ</span>
            </div>
            <p className="text-gray-400 mb-4">
              AI-powered property inspection platform that helps you document conditions, 
              generate professional reports, and identify issues in minutes.
            </p>
            <div className="flex space-x-4">
              <Link to="/contact" className="text-gray-400 hover:text-white transition-colors" title="Contact Us">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </Link>
              <Link to="/blog" className="text-gray-400 hover:text-white transition-colors" title="Blog">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </Link>
              <Link to="/about" className="text-gray-400 hover:text-white transition-colors" title="About Us">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-white font-semibold mb-4">Solutions</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/solutions/inspectors" className="hover:text-white transition-colors">
                  For Inspectors
                </Link>
              </li>
              <li>
                <Link to="/solutions/homeowners" className="hover:text-white transition-colors">
                  For Homeowners
                </Link>
              </li>
              <li>
                <Link to="/solutions/property-managers" className="hover:text-white transition-colors">
                  For Property Managers
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/case-studies" className="hover:text-white transition-colors">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link to="/comparison" className="hover:text-white transition-colors">
                  Comparison
                </Link>
              </li>
              <li>
                <Link to="/demo" className="hover:text-white transition-colors">
                  Demo
                </Link>
              </li>
              <li>
                <Link to="/how-ai-works" className="hover:text-white transition-colors">
                  How AI Works
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 InspectIQ. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy
            </Link>
            <Link to="/terms-of-service" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms
            </Link>
            <Link to="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
