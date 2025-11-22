import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Camera, 
  FileText, 
  Zap, 
  Shield, 
  TrendingUp, 
  Users,
  ArrowRight,
  CheckCircle,
  Sparkles
} from 'lucide-react'
import MarketingNav from '../components/MarketingNav'
import InteractiveDemo from '../components/InteractiveDemo'
import PDFReportPreview from '../components/PDFReportPreview'
import SEO from '../components/SEO'

export default function Landing() {
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: Camera,
      title: 'AI-Powered Vision',
      description: 'Capture photos and let AI identify issues instantly',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FileText,
      title: 'Instant Reports',
      description: 'Generate professional PDF reports in seconds',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Complete inspections 10x faster than traditional methods',
      color: 'from-orange-500 to-red-500'
    }
  ]

  const benefits = [
    {
      icon: Shield,
      title: 'For Inspectors',
      description: 'Streamline your workflow, impress clients, and close more deals',
      points: ['Automated documentation', 'Professional reports', 'Mobile-first design']
    },
    {
      icon: Users,
      title: 'For Homeowners',
      description: 'Document your property condition with confidence',
      points: ['Move-in/out records', 'Maintenance tracking', 'Easy sharing']
    },
    {
      icon: TrendingUp,
      title: 'For Property Managers',
      description: 'Manage multiple properties with ease',
      points: ['Bulk inspections', 'Historical data', 'Team collaboration']
    }
  ]

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "InspectIQ",
    "url": "https://inspectiq.app",
    "description": "AI-powered property inspection software",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://inspectiq.app/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <SEO
        title="Home"
        description="Transform property inspections with AI. Complete inspections 10x faster with InspectIQ. Generate professional reports in minutes. Perfect for inspectors, homeowners, and property managers."
        keywords="property inspection software, AI inspection, home inspection, inspection app, property management software, real estate inspection, move-in inspection, move-out inspection"
        structuredData={structuredData}
      />
      <MarketingNav />
      
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.3), transparent 50%)',
              transform: `scale(${1 + scrollY * 0.001})`,
              transition: 'transform 0.1s ease-out'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
          
          {/* Animated Grid */}
          <div className="absolute inset-0 opacity-20">
            <div className="h-full w-full" style={{
              backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
              transform: `perspective(500px) rotateX(60deg) translateY(${scrollY * 0.5}px)`,
              transformOrigin: 'center top'
            }} />
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <div className="mb-6 inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium">AI-Powered Property Inspections</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              InspectIQ
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-8 max-w-3xl mx-auto font-light">
            Transform property inspections with artificial intelligence
          </p>
          
          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Capture. Analyze. Report. All in minutes, not hours.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/register')}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50"
            >
              <span className="relative z-10 flex items-center">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full font-semibold text-lg hover:bg-white/20 transition-all"
            >
              Sign In
            </button>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-white/50 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Demo */}
      <InteractiveDemo />

      {/* Features Carousel */}
      <div className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Powered by <span className="text-blue-400">Intelligence</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-2xl border transition-all duration-500 cursor-pointer ${
                  activeFeature === index
                    ? 'bg-white/10 border-white/30 scale-105'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 transform transition-transform ${
                  activeFeature === index ? 'scale-110 rotate-6' : ''
                }`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400 text-lg">{feature.description}</p>
                
                {activeFeature === index && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 -z-10 blur-xl" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="relative py-32 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Built for <span className="text-purple-400">Everyone</span>
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            Whether you're a professional inspector, homeowner, or property manager
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-400 mb-6">{benefit.description}</p>
                
                <ul className="space-y-3">
                  {benefit.points.map((point, i) => (
                    <li key={i} className="flex items-center text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10x', label: 'Faster Inspections' },
              { value: '99%', label: 'Accuracy Rate' },
              { value: '<5min', label: 'Report Generation' },
              { value: '24/7', label: 'AI Support' }
            ].map((stat, index) => (
              <div key={index} className="p-6">
                <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PDF Report Preview */}
      <div className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Professional <span className="text-blue-400">Reports</span> in Minutes
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              See the quality of reports you'll generate. Clean, professional, and ready to share.
            </p>
          </div>
          <PDFReportPreview />
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to <span className="text-blue-400">Transform</span> Your Inspections?
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Join thousands of professionals using InspectIQ
          </p>
          
          <button
            onClick={() => navigate('/register')}
            className="group relative px-12 py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-bold text-xl overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
          >
            <span className="relative z-10 flex items-center justify-center">
              Get Started Free
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          
          <p className="text-gray-500 mt-6">No credit card required • 14-day free trial</p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-gray-500">
          <div className="mb-4 md:mb-0">
            © 2025 InspectIQ. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <button className="hover:text-white transition-colors">Privacy</button>
            <button className="hover:text-white transition-colors">Terms</button>
            <button className="hover:text-white transition-colors">Contact</button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  )
}
