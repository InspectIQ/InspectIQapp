import { Check, X, ArrowRight } from 'lucide-react';
import MarketingNav from '../components/MarketingNav';
import MarketingFooter from '../components/MarketingFooter';
import SEO from '../components/SEO';

interface ComparisonRow {
  feature: string;
  traditional: boolean | string;
  inspectai: boolean | string;
  highlight?: boolean;
}

const comparisonData: ComparisonRow[] = [
  { feature: 'Time per inspection', traditional: '3-4 hours', inspectai: '30 minutes', highlight: true },
  { feature: 'Report generation', traditional: 'Manual typing', inspectai: 'AI-powered automation', highlight: true },
  { feature: 'Cost per inspection', traditional: '$300-500', inspectai: '$29-99/month unlimited', highlight: true },
  { feature: 'Photo organization', traditional: 'Manual sorting', inspectai: 'Automatic by room' },
  { feature: 'Issue detection', traditional: 'Manual review', inspectai: 'AI identifies 100+ issues' },
  { feature: 'Professional PDF reports', traditional: true, inspectai: true },
  { feature: 'Mobile-friendly', traditional: false, inspectai: true },
  { feature: 'Cloud storage', traditional: false, inspectai: true },
  { feature: 'Instant sharing', traditional: false, inspectai: true },
  { feature: 'Maintenance recommendations', traditional: false, inspectai: true },
  { feature: 'Cost estimates', traditional: false, inspectai: true },
  { feature: 'Historical tracking', traditional: false, inspectai: true },
  { feature: 'Team collaboration', traditional: false, inspectai: true },
  { feature: 'API access', traditional: false, inspectai: true },
  { feature: 'Custom branding', traditional: true, inspectai: true },
];

export default function Comparison() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="InspectAI vs Traditional Inspections"
        description="Compare InspectAI's AI-powered platform with traditional property inspection methods. See how you can save time and money."
        keywords="property inspection comparison, traditional vs AI inspection, inspection software benefits"
      />
      <MarketingNav />
      
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            InspectAI vs Traditional Methods
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See why thousands of professionals are switching from manual inspections to AI-powered automation
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <div className="text-5xl font-bold text-blue-600 mb-2">75%</div>
            <div className="text-gray-600">Time Saved</div>
          </div>
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <div className="text-5xl font-bold text-green-600 mb-2">90%</div>
            <div className="text-gray-600">Cost Reduction</div>
          </div>
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <div className="text-5xl font-bold text-purple-600 mb-2">10x</div>
            <div className="text-gray-600">More Inspections</div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-16">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                    Traditional Method
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-blue-600 bg-blue-50">
                    InspectAI
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {comparisonData.map((row, index) => (
                  <tr
                    key={index}
                    className={row.highlight ? 'bg-blue-50' : ''}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {row.feature}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {typeof row.traditional === 'boolean' ? (
                        row.traditional ? (
                          <Check className="w-5 h-5 text-gray-400 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-red-400 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm text-gray-600">{row.traditional}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center bg-blue-50/50">
                      {typeof row.inspectai === 'boolean' ? (
                        row.inspectai ? (
                          <Check className="w-5 h-5 text-green-600 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-red-400 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm font-semibold text-blue-600">{row.inspectai}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Comparison Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Traditional Method */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Traditional Method
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <X className="w-5 h-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900">Time-Consuming</div>
                  <div className="text-sm text-gray-600">3-4 hours per inspection including report writing</div>
                </div>
              </div>
              <div className="flex items-start">
                <X className="w-5 h-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900">Expensive</div>
                  <div className="text-sm text-gray-600">$300-500 per inspection from professional inspectors</div>
                </div>
              </div>
              <div className="flex items-start">
                <X className="w-5 h-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900">Error-Prone</div>
                  <div className="text-sm text-gray-600">Manual data entry leads to mistakes and inconsistencies</div>
                </div>
              </div>
              <div className="flex items-start">
                <X className="w-5 h-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900">Limited Scalability</div>
                  <div className="text-sm text-gray-600">Can only handle 2-3 inspections per day</div>
                </div>
              </div>
              <div className="flex items-start">
                <X className="w-5 h-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900">No Historical Data</div>
                  <div className="text-sm text-gray-600">Difficult to track property changes over time</div>
                </div>
              </div>
            </div>
          </div>

          {/* InspectAI Method */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 shadow-lg border-2 border-blue-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              InspectAI Method
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900">Lightning Fast</div>
                  <div className="text-sm text-gray-600">Complete inspections in 30 minutes with AI automation</div>
                </div>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900">Affordable</div>
                  <div className="text-sm text-gray-600">Unlimited inspections from $29/month</div>
                </div>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900">99% Accurate</div>
                  <div className="text-sm text-gray-600">AI-powered analysis eliminates human error</div>
                </div>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900">Infinitely Scalable</div>
                  <div className="text-sm text-gray-600">Handle 10+ inspections per day with ease</div>
                </div>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900">Complete History</div>
                  <div className="text-sm text-gray-600">Track every property change with cloud storage</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROI Calculator */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 mb-16 border-2 border-green-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Calculate Your Savings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">$450</div>
              <div className="text-sm text-gray-600">Average cost per traditional inspection</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">$99</div>
              <div className="text-sm text-gray-600">InspectAI monthly cost (unlimited)</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">$5,301</div>
              <div className="text-sm text-gray-600">Savings after just 10 inspections</div>
            </div>
          </div>
          <p className="text-center text-gray-600 mt-6">
            Break even after your first inspection. Everything after that is pure savings.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Make the Switch?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands who've already upgraded to AI-powered inspections
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
              href="/pricing"
              className="inline-flex items-center justify-center bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-800 transition-colors border-2 border-white"
            >
              View Pricing
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
