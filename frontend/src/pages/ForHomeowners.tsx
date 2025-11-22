import { useNavigate } from 'react-router-dom'
import MarketingNav from '../components/MarketingNav'
import SEO from '../components/SEO'
import { Home, Shield, Clock, DollarSign, FileText, Camera, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react'

export default function ForHomeowners() {
  const navigate = useNavigate()

  const benefits = [
    {
      icon: Shield,
      title: 'Protect Your Investment',
      description: 'Document property condition before moving in or out to avoid disputes'
    },
    {
      icon: Clock,
      title: 'Save Time & Money',
      description: 'No need to hire expensive inspectors for routine documentation'
    },
    {
      icon: FileText,
      title: 'Professional Records',
      description: 'Keep detailed records of your property\'s condition over time'
    },
    {
      icon: Camera,
      title: 'Easy Photo Documentation',
      description: 'Simply take photos with your phone - AI does the rest'
    }
  ]

  const useCases = [
    {
      title: 'Move-In Inspection',
      description: 'Document existing damage before you move in to protect your security deposit',
      icon: '📥',
      features: ['Photo evidence', 'Timestamped records', 'Shareable reports', 'Dispute protection']
    },
    {
      title: 'Move-Out Inspection',
      description: 'Prove the condition you left the property in to get your full deposit back',
      icon: '📤',
      features: ['Before/after comparison', 'Professional documentation', 'Instant reports', 'Legal protection']
    },
    {
      title: 'Maintenance Tracking',
      description: 'Keep records of repairs and maintenance for insurance and resale value',
      icon: '🔧',
      features: ['Maintenance history', 'Issue tracking', 'Cost documentation', 'Value preservation']
    }
  ]

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Property Inspection for Homeowners",
    "description": "DIY property inspection and documentation for homeowners",
    "provider": {
      "@type": "Organization",
      "name": "InspectIQ"
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO
        title="Home Inspection App for Homeowners"
        description="Document your property condition like a pro. Perfect for move-ins, move-outs, and maintenance tracking. No expensive inspector needed. Start free."
        keywords="home inspection app, move-in inspection, move-out inspection, property documentation, security deposit protection"
        structuredData={structuredData}
      />
      <MarketingNav />
      
      {/* Hero */}
      <div className="relative pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full mb-6">
              <Home className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400 font-medium">For Homeowners</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Document Your Home
              <span className="block text-green-400">Like a Pro</span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-8">
              Protect yourself with professional property documentation. Perfect for move-ins, 
              move-outs, and keeping track of your home's condition.
            </p>
            
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full font-semibold text-lg hover:scale-105 transition-transform inline-flex items-center"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            
            <p className="text-sm text-gray-500 mt-4">No credit card required • 14-day free trial</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
            {benefits.map((benefit, index) => (
              <div key={index} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                <benefit.icon className="w-10 h-10 text-green-400 mb-4" />
                <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                <p className="text-gray-400 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="py-20 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Perfect For <span className="text-green-400">Every Situation</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
                <div className="text-5xl mb-4">{useCase.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{useCase.title}</h3>
                <p className="text-gray-400 mb-6">{useCase.description}</p>
                <ul className="space-y-2">
                  {useCase.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Problem/Solution */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Don't Lose Your <span className="text-red-400">Security Deposit</span>
              </h2>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold mb-1">Without Documentation</div>
                    <div className="text-sm text-gray-400">Landlords can claim you caused damage that was already there</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold mb-1">Disputes Are Common</div>
                    <div className="text-sm text-gray-400">40% of renters lose part of their security deposit</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold mb-1">Photos Aren't Enough</div>
                    <div className="text-sm text-gray-400">Unorganized photos won't hold up in disputes</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-green-400">With InspectIQ</h3>
              <ul className="space-y-4">
                {[
                  'Professional documentation in minutes',
                  'Timestamped, organized records',
                  'AI identifies all issues automatically',
                  'Shareable PDF reports',
                  'Legal-grade documentation',
                  'Protect your deposit'
                ].map((item, i) => (
                  <li key={i} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/register')}
                className="w-full mt-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-semibold hover:scale-105 transition-transform"
              >
                Start Protecting Yourself
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="py-20 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Affordable <span className="text-green-400">Protection</span>
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Less than the cost of hiring an inspector once
          </p>
          
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/50 rounded-2xl p-8 max-w-md mx-auto">
            <div className="text-sm text-green-400 font-semibold mb-2">STARTER</div>
            <div className="mb-4">
              <span className="text-6xl font-bold">$29</span>
              <span className="text-gray-400">/month</span>
            </div>
            <div className="text-sm text-gray-400 mb-6">
              vs. $300-500 per professional inspection
            </div>
            <ul className="space-y-3 mb-8 text-left">
              {[
                '10 inspections per month',
                'AI-powered analysis',
                'Professional PDF reports',
                'Mobile app access',
                'Email support',
                'Unlimited storage'
              ].map((feature, i) => (
                <li key={i} className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate('/register')}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-semibold text-lg hover:scale-105 transition-transform"
            >
              Start 14-Day Free Trial
            </button>
            <p className="text-xs text-gray-500 mt-4">No credit card required</p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Protect Your <span className="text-green-400">Investment</span> Today
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Don't risk losing your security deposit. Document everything professionally.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="px-12 py-5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full font-bold text-xl hover:scale-105 transition-transform inline-flex items-center justify-center"
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
          
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-400 mt-8">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
              14-day free trial
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
              No credit card
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
