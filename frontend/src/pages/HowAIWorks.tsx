import { useNavigate } from 'react-router-dom'
import MarketingNav from '../components/MarketingNav'
import SEO from '../components/SEO'
import { 
  Camera, 
  Brain, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Eye,
  FileText,
  TrendingUp,
  Shield,
  Clock
} from 'lucide-react'

export default function HowAIWorks() {
  const navigate = useNavigate()

  const aiSteps = [
    {
      icon: Camera,
      title: 'Image Recognition',
      description: 'Advanced computer vision analyzes every pixel of your photos',
      details: [
        'Identifies objects, materials, and surfaces',
        'Detects patterns and anomalies',
        'Recognizes room types automatically',
        'Processes images in real-time'
      ]
    },
    {
      icon: Brain,
      title: 'Deep Learning Analysis',
      description: 'Neural networks trained on millions of property images',
      details: [
        'Compares against database of known issues',
        'Learns from thousands of inspections',
        'Identifies damage patterns',
        'Predicts potential problems'
      ]
    },
    {
      icon: Eye,
      title: 'Defect Detection',
      description: 'AI spots issues that might be missed by the human eye',
      details: [
        'Water damage and stains',
        'Cracks and structural issues',
        'Mold and moisture problems',
        'Wear and tear patterns'
      ]
    },
    {
      icon: FileText,
      title: 'Intelligent Reporting',
      description: 'Natural language processing generates clear, professional descriptions',
      details: [
        'Describes issues in plain English',
        'Categorizes by severity',
        'Provides context and location',
        'Suggests remediation steps'
      ]
    }
  ]

  const benefits = [
    {
      icon: Zap,
      title: '10x Faster',
      description: 'Complete inspections in minutes instead of hours',
      stat: '30 min',
      label: 'Average inspection time'
    },
    {
      icon: CheckCircle,
      title: '99% Accurate',
      description: 'AI catches issues with near-perfect accuracy',
      stat: '99%',
      label: 'Detection accuracy'
    },
    {
      icon: TrendingUp,
      title: 'Always Learning',
      description: 'Gets smarter with every inspection',
      stat: '1M+',
      label: 'Images analyzed'
    },
    {
      icon: Shield,
      title: 'Consistent Quality',
      description: 'No human error or oversight',
      stat: '100%',
      label: 'Consistency rate'
    }
  ]

  const comparison = [
    {
      aspect: 'Speed',
      traditional: '2-4 hours per inspection',
      ai: '20-30 minutes per inspection',
      improvement: '10x faster'
    },
    {
      aspect: 'Accuracy',
      traditional: '85-90% (varies by inspector)',
      ai: '99% consistent accuracy',
      improvement: '10% more accurate'
    },
    {
      aspect: 'Documentation',
      traditional: 'Manual notes and photos',
      ai: 'Automatic categorization & analysis',
      improvement: 'Zero manual work'
    },
    {
      aspect: 'Report Generation',
      traditional: '1-3 days',
      ai: 'Instant (under 5 minutes)',
      improvement: '99% faster'
    }
  ]

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "How AI-Powered Property Inspections Work",
    "description": "Learn how InspectIQ uses artificial intelligence to make property inspections 10x faster and more accurate",
    "author": {
      "@type": "Organization",
      "name": "InspectIQ"
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO
        title="How AI Works"
        description="Discover how InspectIQ uses artificial intelligence, computer vision, and deep learning to revolutionize property inspections. 10x faster, 99% accurate."
        keywords="AI property inspection, computer vision, deep learning, artificial intelligence, automated inspection, AI technology"
        structuredData={structuredData}
      />
      <MarketingNav />
      
      {/* Hero */}
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-full mb-6">
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-400 font-medium">AI Technology</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            How Our <span className="text-purple-400">AI</span> Works
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Discover the technology that makes property inspections 10x faster and more accurate
          </p>
        </div>
      </div>

      {/* AI Process */}
      <div className="py-20 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">
            The <span className="text-purple-400">AI Pipeline</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {aiSteps.map((step, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                    <p className="text-gray-400 mb-4">{step.description}</p>
                    <ul className="space-y-2">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-start space-x-2 text-sm text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Why <span className="text-blue-400">AI</span> Makes a Difference
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-4xl font-bold text-blue-400 mb-2">{benefit.stat}</div>
                <div className="text-sm text-gray-400 mb-3">{benefit.label}</div>
                <h3 className="font-bold mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="py-20 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Traditional vs <span className="text-purple-400">AI-Powered</span>
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold">Aspect</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold">Traditional Method</th>
                  <th className="text-left py-4 px-6 text-purple-400 font-semibold">InspectIQ AI</th>
                  <th className="text-left py-4 px-6 text-green-400 font-semibold">Improvement</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 font-semibold">{row.aspect}</td>
                    <td className="py-4 px-6 text-gray-400">{row.traditional}</td>
                    <td className="py-4 px-6 text-purple-300">{row.ai}</td>
                    <td className="py-4 px-6 text-green-400 font-semibold">{row.improvement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* How It Works Visually */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">
            From Photo to <span className="text-blue-400">Report</span>
          </h2>
          
          <div className="relative">
            {/* Timeline */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 hidden md:block"></div>
            
            <div className="space-y-12">
              {[
                { time: '0s', title: 'Photo Captured', desc: 'Inspector takes photo with phone' },
                { time: '1s', title: 'AI Analysis Begins', desc: 'Image uploaded and processed' },
                { time: '2s', title: 'Issues Detected', desc: 'AI identifies and categorizes problems' },
                { time: '3s', title: 'Report Generated', desc: 'Professional PDF created automatically' }
              ].map((step, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:pl-12'}`}>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 inline-block">
                      <div className="text-sm text-blue-400 font-semibold mb-2">{step.time}</div>
                      <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                      <p className="text-gray-400">{step.desc}</p>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold z-10 flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Experience the <span className="text-purple-400">AI</span> Difference
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            See how AI can transform your property inspections
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/demo')}
              className="px-8 py-4 bg-white/10 border border-white/20 rounded-full font-semibold text-lg hover:bg-white/20 transition-colors"
            >
              View Sample Report
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold text-lg hover:scale-105 transition-transform inline-flex items-center justify-center"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
