import { useNavigate } from 'react-router-dom'
import MarketingNav from '../components/MarketingNav'
import SEO from '../components/SEO'
import { Building2, Users, TrendingUp, Clock, Shield, FileText, ArrowRight, CheckCircle, BarChart, Zap } from 'lucide-react'

export default function ForPropertyManagers() {
  const navigate = useNavigate()

  const features = [
    {
      icon: Building2,
      title: 'Multi-Property Dashboard',
      description: 'Manage all your properties from one central dashboard with real-time status updates'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Assign inspections to team members and track progress in real-time'
    },
    {
      icon: Clock,
      title: 'Bulk Inspections',
      description: 'Complete multiple unit inspections in a single day with AI assistance'
    },
    {
      icon: BarChart,
      title: 'Analytics & Reporting',
      description: 'Track trends, identify recurring issues, and make data-driven decisions'
    },
    {
      icon: Shield,
      title: 'Compliance & Records',
      description: 'Maintain complete inspection history for legal and insurance requirements'
    },
    {
      icon: Zap,
      title: 'Automated Workflows',
      description: 'Set up automatic inspection schedules and reminders for routine checks'
    }
  ]

  const benefits = [
    { metric: '75%', label: 'Time Saved', description: 'Complete inspections in 1/4 the time' },
    { metric: '10x', label: 'More Units', description: 'Manage 10x more properties efficiently' },
    { metric: '$50k+', label: 'Cost Savings', description: 'Annual savings on inspection costs' },
    { metric: '99%', label: 'Accuracy', description: 'Consistent quality across all units' }
  ]

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Property Management Inspection Software",
    "description": "Multi-property inspection management with AI",
    "provider": {
      "@type": "Organization",
      "name": "InspectIQ"
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO
        title="Property Management Inspection Software"
        description="Manage multiple properties efficiently with AI-powered inspections. Scale your business while maintaining quality. Bulk inspections made easy. Start free trial."
        keywords="property management software, multi-unit inspection, rental inspection software, property inspection management, bulk inspections"
        structuredData={structuredData}
      />
      <MarketingNav />
      
      {/* Hero */}
      <div className="relative pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-full mb-6">
              <Building2 className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-400 font-medium">For Property Managers</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Manage Multiple Properties
              <span className="block text-purple-400">With Ease</span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Scale your property management business with AI-powered inspections. 
              Handle hundreds of units efficiently while maintaining quality.
            </p>
            
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold text-lg hover:scale-105 transition-transform inline-flex items-center"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            
            <p className="text-sm text-gray-500 mt-4">No credit card required • 14-day free trial</p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="py-20 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Built for <span className="text-purple-400">Scale</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-5xl font-bold text-purple-400 mb-2">{benefit.metric}</div>
                <div className="font-semibold mb-2">{benefit.label}</div>
                <div className="text-sm text-gray-400">{benefit.description}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Use Case */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Real-World <span className="text-purple-400">Scenario</span>
          </h2>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-red-400">Without InspectIQ</h3>
                <ul className="space-y-3 text-gray-300">
                  <li>• 50 units to inspect before month-end</li>
                  <li>• 3 hours per unit = 150 hours total</li>
                  <li>• Need to hire 3 inspectors</li>
                  <li>• Reports take 2-3 days each</li>
                  <li>• Cost: $15,000+ in inspector fees</li>
                  <li>• Inconsistent quality across inspectors</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-4 text-green-400">With InspectIQ</h3>
                <ul className="space-y-3 text-gray-300">
                  <li>• 50 units inspected in 5 days</li>
                  <li>• 30 minutes per unit = 25 hours total</li>
                  <li>• 1 person with InspectIQ</li>
                  <li>• Reports generated instantly</li>
                  <li>• Cost: $99/month subscription</li>
                  <li>• 100% consistent AI-powered quality</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/10 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">Save $14,900+</div>
              <div className="text-gray-400">per month in inspection costs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="py-20 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Enterprise <span className="text-purple-400">Pricing</span>
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Custom solutions for property management companies
          </p>
          
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/50 rounded-2xl p-8 max-w-md mx-auto">
            <div className="text-sm text-purple-400 font-semibold mb-2">ENTERPRISE</div>
            <div className="mb-4">
              <span className="text-6xl font-bold">Custom</span>
            </div>
            <div className="text-sm text-gray-400 mb-6">
              Tailored to your portfolio size
            </div>
            <ul className="space-y-3 mb-8 text-left">
              {[
                'Unlimited inspections',
                'Unlimited team members',
                'Advanced analytics',
                'Custom integrations',
                'Dedicated account manager',
                'SLA guarantee',
                'Training & onboarding',
                'Volume discounts'
              ].map((feature, i) => (
                <li key={i} className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-purple-400 mr-3 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate('/contact')}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-lg hover:scale-105 transition-transform"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Scale Your <span className="text-purple-400">Portfolio</span> Today
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join property management companies managing thousands of units with InspectIQ
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-xl hover:scale-105 transition-transform inline-flex items-center justify-center"
            >
              Start Free Trial
              <ArrowRight className="ml-3 w-6 h-6" />
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-12 py-5 bg-white/10 border border-white/20 rounded-full font-bold text-xl hover:bg-white/20 transition-colors"
            >
              Contact Sales
            </button>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-400 mt-8">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-purple-400 mr-2" />
              14-day free trial
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-purple-400 mr-2" />
              Custom pricing
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-purple-400 mr-2" />
              Dedicated support
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
