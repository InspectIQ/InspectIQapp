import { useNavigate } from 'react-router-dom'
import MarketingNav from '../components/MarketingNav'
import InteractiveDemo from '../components/InteractiveDemo'
import { 
  Camera, 
  FileText, 
  Clock, 
  TrendingUp, 
  Users, 
  Shield,
  ArrowRight,
  CheckCircle,
  Zap
} from 'lucide-react'

export default function ForInspectors() {
  const navigate = useNavigate()

  const features = [
    {
      icon: Camera,
      title: 'AI-Powered Photo Analysis',
      description: 'Capture photos and let AI identify issues, defects, and areas of concern automatically'
    },
    {
      icon: FileText,
      title: 'Instant Professional Reports',
      description: 'Generate comprehensive, branded PDF reports in under 5 minutes'
    },
    {
      icon: Clock,
      title: '10x Faster Workflow',
      description: 'Complete inspections in a fraction of the time while maintaining quality'
    },
    {
      icon: TrendingUp,
      title: 'Close More Deals',
      description: 'Impress clients with speed and professionalism, leading to more referrals'
    },
    {
      icon: Users,
      title: 'Client Portal',
      description: 'Share reports instantly with clients through a secure online portal'
    },
    {
      icon: Shield,
      title: 'Liability Protection',
      description: 'Comprehensive documentation and timestamped records for your protection'
    }
  ]

  const workflow = [
    { step: '1', title: 'Capture', description: 'Take photos with your phone during the inspection' },
    { step: '2', title: 'Analyze', description: 'AI identifies issues and categorizes findings' },
    { step: '3', title: 'Review', description: 'Quickly review and edit AI-generated notes' },
    { step: '4', title: 'Deliver', description: 'Send professional report to client instantly' }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <MarketingNav />
      
      {/* Hero */}
      <div className="relative pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full mb-6">
                <Zap className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-400 font-medium">For Professional Inspectors</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Inspect Smarter,
                <span className="block text-blue-400">Not Harder</span>
              </h1>
              
              <p className="text-xl text-gray-400 mb-8">
                Join thousands of inspectors who've transformed their business with AI-powered inspections. 
                Complete more jobs, impress more clients, and grow your revenue.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/register')}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold text-lg hover:scale-105 transition-transform flex items-center justify-center"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="px-8 py-4 bg-white/10 border border-white/20 rounded-full font-semibold text-lg hover:bg-white/20 transition-colors"
                >
                  Schedule Demo
                </button>
              </div>
              
              <div className="mt-8 flex items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  14-day free trial
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 p-8 backdrop-blur-sm">
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-blue-400 mb-2">10x</div>
                    <div className="text-xl text-gray-300">Faster Inspections</div>
                    <div className="mt-8 grid grid-cols-2 gap-4 text-left">
                      <div className="bg-white/5 p-4 rounded-lg">
                        <div className="text-3xl font-bold text-purple-400">99%</div>
                        <div className="text-sm text-gray-400">Accuracy</div>
                      </div>
                      <div className="bg-white/5 p-4 rounded-lg">
                        <div className="text-3xl font-bold text-green-400">&lt;5min</div>
                        <div className="text-sm text-gray-400">Reports</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-20 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to <span className="text-blue-400">Excel</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Built specifically for professional inspectors who demand the best
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Demo */}
      <InteractiveDemo />

      {/* Workflow */}
      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Simple <span className="text-purple-400">4-Step</span> Process
            </h2>
            <p className="text-xl text-gray-400">
              From inspection to delivery in minutes
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {workflow.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
                {index < workflow.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 opacity-30" style={{ transform: 'translateX(50%)' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROI Calculator */}
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Calculate Your <span className="text-green-400">ROI</span>
          </h2>
          
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Traditional Method</h3>
                <div className="space-y-3 text-gray-300">
                  <div className="flex justify-between">
                    <span>Time per inspection:</span>
                    <span className="font-semibold">3 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inspections per day:</span>
                    <span className="font-semibold">2-3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Report generation:</span>
                    <span className="font-semibold">1-3 days</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-4 text-green-400">With InspectIQ</h3>
                <div className="space-y-3 text-gray-300">
                  <div className="flex justify-between">
                    <span>Time per inspection:</span>
                    <span className="font-semibold text-green-400">30 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inspections per day:</span>
                    <span className="font-semibold text-green-400">8-10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Report generation:</span>
                    <span className="font-semibold text-green-400">Instant</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-green-500/20 pt-6">
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-2">Potential Additional Revenue</div>
                <div className="text-5xl font-bold text-green-400 mb-2">$50,000+</div>
                <div className="text-sm text-gray-400">per year with 3x more inspections</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">
            What <span className="text-blue-400">Inspectors</span> Say
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "InspectIQ has completely transformed my business. I'm doing 3x more inspections and my clients love the instant reports.",
                author: "Mike Johnson",
                role: "Home Inspector, 15 years",
                rating: 5
              },
              {
                quote: "The AI catches things I might have missed. It's like having a second pair of eyes on every inspection.",
                author: "Sarah Chen",
                role: "Property Inspector",
                rating: 5
              },
              {
                quote: "My clients are amazed when they get their report within minutes. It's a huge competitive advantage.",
                author: "David Martinez",
                role: "Commercial Inspector",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.quote}"</p>
                <div className="border-t border-white/10 pt-4">
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Preview */}
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Simple, Transparent <span className="text-blue-400">Pricing</span>
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Professional plan designed for inspectors
          </p>
          
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-2 border-blue-500/50 rounded-2xl p-8 max-w-md mx-auto">
            <div className="text-sm text-blue-400 font-semibold mb-2">PROFESSIONAL</div>
            <div className="mb-4">
              <span className="text-6xl font-bold">$99</span>
              <span className="text-gray-400">/month</span>
            </div>
            <ul className="space-y-3 mb-8 text-left">
              {[
                'Unlimited inspections',
                'AI-powered analysis',
                'Branded PDF reports',
                'Client portal access',
                'Priority support',
                'Mobile app included'
              ].map((feature, i) => (
                <li key={i} className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate('/register')}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold text-lg hover:scale-105 transition-transform"
            >
              Start 14-Day Free Trial
            </button>
            <p className="text-xs text-gray-500 mt-4">No credit card required</p>
          </div>
          
          <button
            onClick={() => navigate('/pricing')}
            className="mt-8 text-blue-400 hover:text-blue-300 transition-colors"
          >
            View all plans →
          </button>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to <span className="text-blue-400">10x</span> Your Inspection Business?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of inspectors already using InspectIQ
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => navigate('/register')}
              className="px-12 py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-bold text-xl hover:scale-105 transition-transform inline-flex items-center justify-center"
            >
              Start Free Trial
              <ArrowRight className="ml-3 w-6 h-6" />
            </button>
            <button
              onClick={() => navigate('/demo')}
              className="px-12 py-5 bg-white/10 border border-white/20 rounded-full font-bold text-xl hover:bg-white/20 transition-colors"
            >
              View Sample Report
            </button>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
              14-day free trial
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
              No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
              Cancel anytime
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
