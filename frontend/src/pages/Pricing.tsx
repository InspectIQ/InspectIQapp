import { useNavigate } from 'react-router-dom'
import MarketingNav from '../components/MarketingNav'
import { Check, ArrowRight } from 'lucide-react'

export default function Pricing() {
  const navigate = useNavigate()

  const plans = [
    {
      name: 'Starter',
      price: '29',
      description: 'Perfect for individual homeowners',
      features: [
        '10 inspections per month',
        'AI-powered analysis',
        'PDF reports',
        'Mobile app access',
        'Email support'
      ],
      cta: 'Start Free Trial',
      popular: false
    },
    {
      name: 'Professional',
      price: '99',
      description: 'For professional inspectors',
      features: [
        'Unlimited inspections',
        'Advanced AI analysis',
        'Branded reports',
        'Priority support',
        'Client portal',
        'Team collaboration',
        'API access'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For property management companies',
      features: [
        'Everything in Professional',
        'Dedicated account manager',
        'Custom integrations',
        'SLA guarantee',
        'Training & onboarding',
        'Volume discounts'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <MarketingNav />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Simple, Transparent <span className="text-blue-400">Pricing</span>
            </h1>
            <p className="text-xl text-gray-400">
              Choose the plan that's right for you. All plans include a 14-day free trial.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-2xl border transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-b from-blue-500/10 to-purple-500/10 border-blue-500/50 scale-105'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    {plan.price === 'Custom' ? (
                      <span className="text-4xl font-bold">{plan.price}</span>
                    ) : (
                      <>
                        <span className="text-5xl font-bold">${plan.price}</span>
                        <span className="text-gray-400">/month</span>
                      </>
                    )}
                  </div>
                  <p className="text-gray-400">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate(plan.price === 'Custom' ? '/contact' : '/register')}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
