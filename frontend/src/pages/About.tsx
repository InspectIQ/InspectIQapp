import { useNavigate } from 'react-router-dom'
import MarketingNav from '../components/MarketingNav'
import { Target, Users, Zap, Heart, Award, TrendingUp, ArrowRight } from 'lucide-react'

export default function About() {
  const navigate = useNavigate()

  const values = [
    {
      icon: Target,
      title: 'Innovation First',
      description: 'We leverage cutting-edge AI to solve real problems in property inspection'
    },
    {
      icon: Users,
      title: 'Customer Focused',
      description: 'Every feature is built with our users\' needs and feedback in mind'
    },
    {
      icon: Zap,
      title: 'Speed & Quality',
      description: 'We believe you shouldn\'t have to choose between fast and thorough'
    },
    {
      icon: Heart,
      title: 'Integrity',
      description: 'Transparent pricing, honest communication, and reliable service'
    }
  ]

  const stats = [
    { value: '10,000+', label: 'Inspections Completed' },
    { value: '500+', label: 'Active Inspectors' },
    { value: '99.9%', label: 'Uptime' },
    { value: '4.9/5', label: 'Customer Rating' }
  ]

  const team = [
    {
      name: 'Kevin Colahan',
      role: 'Founder & CEO',
      bio: 'Passionate about using technology to transform traditional industries',
      image: '👨‍💼'
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <MarketingNav />
      
      {/* Hero */}
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Transforming Property Inspections
            <span className="block text-blue-400 mt-2">With AI</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            We're on a mission to make property inspections faster, more accurate, 
            and accessible to everyone.
          </p>
        </div>
      </div>

      {/* Story */}
      <div className="py-20 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center">Our Story</h2>
          <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
            <p>
              InspectIQ was born from a simple observation: property inspections haven't 
              changed in decades, while technology has transformed nearly every other industry.
            </p>
            <p>
              Traditional inspections are time-consuming, expensive, and prone to human error. 
              Inspectors spend hours documenting properties, homeowners wait days for reports, 
              and property managers struggle to keep track of multiple units.
            </p>
            <p>
              We knew there had to be a better way. By combining artificial intelligence with 
              mobile technology, we've created a platform that makes inspections 10x faster 
              while maintaining professional quality.
            </p>
            <p className="text-blue-400 font-semibold">
              Today, InspectIQ is helping thousands of inspectors, homeowners, and property 
              managers save time and money while delivering better results.
            </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="py-20 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">By The Numbers</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Meet The Team</h2>
          <div className="flex justify-center">
            {team.map((member, index) => (
              <div
                key={index}
                className="max-w-sm p-8 rounded-2xl bg-white/5 border border-white/10 text-center"
              >
                <div className="text-6xl mb-4">{member.image}</div>
                <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                <div className="text-blue-400 mb-4">{member.role}</div>
                <p className="text-gray-400">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join Us On This Journey
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Be part of the future of property inspections
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold text-lg hover:scale-105 transition-transform inline-flex items-center justify-center"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-8 py-4 bg-white/10 border border-white/20 rounded-full font-semibold text-lg hover:bg-white/20 transition-colors"
            >
              Get In Touch
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
