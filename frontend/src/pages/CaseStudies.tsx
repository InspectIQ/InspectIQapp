import React from 'react';
import { TrendingUp, Clock, DollarSign, Users, ArrowRight } from 'lucide-react';
import MarketingNav from '../components/MarketingNav';
import MarketingFooter from '../components/MarketingFooter';
import SEO from '../components/SEO';

interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  industry: string;
  image: string;
  challenge: string;
  solution: string;
  results: {
    metric: string;
    value: string;
    icon: React.ReactNode;
  }[];
  quote: string;
  author: string;
  authorTitle: string;
}

const caseStudies: CaseStudy[] = [
  {
    id: 'metro-inspections',
    title: 'Metro Property Inspections',
    subtitle: 'How a solo inspector scaled to 200+ inspections per month',
    industry: 'Professional Inspector',
    image: '🏢',
    challenge: 'John was spending 3-4 hours per inspection on documentation and report writing. He could only complete 2-3 inspections per day, limiting his revenue potential. Manual report writing was error-prone and clients often requested revisions.',
    solution: 'John adopted InspectAI and transformed his workflow. He now captures photos on-site, and the AI generates comprehensive reports while he drives to the next job. He reviews and customizes reports in minutes instead of hours.',
    results: [
      {
        metric: 'Time Saved',
        value: '75%',
        icon: <Clock className="w-6 h-6" />
      },
      {
        metric: 'Revenue Increase',
        value: '$4,200/mo',
        icon: <DollarSign className="w-6 h-6" />
      },
      {
        metric: 'Inspections/Month',
        value: '200+',
        icon: <TrendingUp className="w-6 h-6" />
      }
    ],
    quote: 'InspectAI gave me my evenings back. I used to spend 2-3 hours every night writing reports. Now I finish everything during business hours and have doubled my income.',
    author: 'John Martinez',
    authorTitle: 'Owner, Metro Property Inspections'
  },
  {
    id: 'riverside-properties',
    title: 'Riverside Property Management',
    subtitle: 'Managing 500+ units with a lean team',
    industry: 'Property Management',
    image: '🏘️',
    challenge: 'Riverside managed 500 rental units but relied on expensive third-party inspectors for move-in/move-out inspections. Costs were $150 per inspection, and scheduling was a nightmare. Reports took 3-5 days to receive.',
    solution: 'Riverside trained their maintenance team to use InspectAI. Now, their 3-person team handles all inspections in-house. Reports are generated instantly, and they can schedule inspections same-day without external dependencies.',
    results: [
      {
        metric: 'Cost Savings',
        value: '$72,000/yr',
        icon: <DollarSign className="w-6 h-6" />
      },
      {
        metric: 'Report Speed',
        value: 'Same Day',
        icon: <Clock className="w-6 h-6" />
      },
      {
        metric: 'Team Efficiency',
        value: '10x',
        icon: <Users className="w-6 h-6" />
      }
    ],
    quote: 'We were spending $6,000 per month on inspections. InspectAI paid for itself in the first week. The ROI is incredible, and our tenants love the fast turnaround.',
    author: 'Sarah Chen',
    authorTitle: 'Operations Director, Riverside Property Management'
  },
  {
    id: 'homeowner-success',
    title: 'The Johnson Family',
    subtitle: 'Protecting a $2,500 security deposit',
    industry: 'Homeowner',
    image: '🏠',
    challenge: 'The Johnsons were moving out of their rental after 3 years. Their landlord had a reputation for keeping security deposits. They needed professional documentation to prove the property\'s condition but couldn\'t afford a $400 inspector.',
    solution: 'They used InspectAI to document every room, capturing 87 photos with timestamps. The AI identified pre-existing damage and generated a professional report. They shared it with their landlord before move-out.',
    results: [
      {
        metric: 'Deposit Recovered',
        value: '$2,500',
        icon: <DollarSign className="w-6 h-6" />
      },
      {
        metric: 'Cost vs Inspector',
        value: 'Saved $371',
        icon: <TrendingUp className="w-6 h-6" />
      },
      {
        metric: 'Time to Complete',
        value: '45 min',
        icon: <Clock className="w-6 h-6" />
      }
    ],
    quote: 'InspectAI saved us $2,500. Our landlord tried to claim damage that was there when we moved in, but our timestamped photos and professional report proved otherwise. Best $29 we ever spent.',
    author: 'Michael Johnson',
    authorTitle: 'Homeowner'
  }
];

export default function CaseStudies() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="Customer Success Stories"
        description="See how property inspectors, managers, and homeowners are saving time and money with InspectAI's AI-powered inspection platform."
        keywords="property inspection case studies, customer success stories, inspection software results"
      />
      <MarketingNav />
      
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Customer Success Stories
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real results from real customers. See how InspectAI is transforming property inspections across the industry.
          </p>
        </div>

        {/* Case Studies */}
        <div className="space-y-16">
          {caseStudies.map((study, index) => (
            <div
              key={study.id}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className="p-8 lg:p-12">
                {/* Header */}
                <div className="mb-8">
                  <div className="inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                    {study.industry}
                  </div>
                  <div className="text-6xl mb-4">{study.image}</div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {study.title}
                  </h2>
                  <p className="text-xl text-gray-600">
                    {study.subtitle}
                  </p>
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {study.results.map((result, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 text-center"
                    >
                      <div className="flex justify-center text-blue-600 mb-3">
                        {result.icon}
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        {result.value}
                      </div>
                      <div className="text-sm text-gray-600">
                        {result.metric}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Challenge */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    The Challenge
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {study.challenge}
                  </p>
                </div>

                {/* Solution */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    The Solution
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {study.solution}
                  </p>
                </div>

                {/* Quote */}
                <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-blue-600">
                  <p className="text-gray-700 italic mb-4 text-lg">
                    "{study.quote}"
                  </p>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {study.author}
                    </div>
                    <div className="text-sm text-gray-600">
                      {study.authorTitle}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Write Your Success Story?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of satisfied customers who are saving time and money with InspectAI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
            <a
              href="/demo"
              className="inline-flex items-center justify-center bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-800 transition-colors border-2 border-white"
            >
              Schedule a Demo
            </a>
          </div>
          <p className="mt-4 text-sm text-blue-100">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>
      
      <MarketingFooter />
    </div>
  );
}
