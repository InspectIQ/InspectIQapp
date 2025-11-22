import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import MarketingNav from '../components/MarketingNav';
import MarketingFooter from '../components/MarketingFooter';
import SEO from '../components/SEO';

interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'pricing' | 'technical' | 'security';
}

const faqs: FAQItem[] = [
  // General
  {
    category: 'general',
    question: 'What is InspectAI?',
    answer: 'InspectAI is an AI-powered property inspection platform that helps you document property conditions, generate professional reports, and identify maintenance issues in minutes instead of hours.'
  },
  {
    category: 'general',
    question: 'Who is InspectAI for?',
    answer: 'InspectAI is perfect for property inspectors, homeowners, landlords, property managers, real estate agents, and anyone who needs to document property conditions professionally.'
  },
  {
    category: 'general',
    question: 'Do I need any special equipment?',
    answer: 'No! All you need is a smartphone or tablet with a camera. Our mobile-friendly platform works on any device with a web browser.'
  },
  {
    category: 'general',
    question: 'How accurate is the AI analysis?',
    answer: 'Our AI achieves 99%+ accuracy in identifying common property issues. It\'s trained on thousands of property inspections and continuously improves. However, AI findings should always be verified by qualified professionals for critical decisions.'
  },
  
  // Pricing
  {
    category: 'pricing',
    question: 'What plans do you offer?',
    answer: 'We offer three plans: Starter ($29/month) for homeowners, Professional ($99/month) for inspectors and landlords, and Enterprise (custom pricing) for property management companies. All plans include a 14-day free trial.'
  },
  {
    category: 'pricing',
    question: 'Is there a free trial?',
    answer: 'Yes! All plans come with a 14-day free trial. No credit card required to start. You can explore all features and generate real reports during your trial.'
  },
  {
    category: 'pricing',
    question: 'Can I cancel anytime?',
    answer: 'Absolutely. You can cancel your subscription at any time with no penalties or fees. Your data remains accessible for 30 days after cancellation.'
  },
  {
    category: 'pricing',
    question: 'Do you offer refunds?',
    answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied with InspectAI, contact us within 30 days for a full refund.'
  },
  
  // Technical
  {
    category: 'technical',
    question: 'How long does it take to generate a report?',
    answer: 'Most reports are generated in 2-5 minutes. The AI analyzes your photos instantly, and the PDF report is compiled automatically. You can download or share it immediately.'
  },
  {
    category: 'technical',
    question: 'What file formats do you support?',
    answer: 'We support JPG, PNG, and HEIC image formats. Reports are generated as professional PDF documents that can be downloaded, printed, or shared via email.'
  },
  {
    category: 'technical',
    question: 'Can I use InspectAI offline?',
    answer: 'You can take photos offline, but you\'ll need an internet connection to upload them and generate reports. We\'re working on offline capabilities for future releases.'
  },
  {
    category: 'technical',
    question: 'How many photos can I upload per inspection?',
    answer: 'There\'s no limit! Upload as many photos as you need to document the property thoroughly. Most inspections include 20-100 photos.'
  },
  {
    category: 'technical',
    question: 'Can I edit the AI-generated reports?',
    answer: 'Yes! You can add notes, edit findings, and customize reports before finalizing. The AI provides a starting point, but you have full control over the final output.'
  },
  
  // Security
  {
    category: 'security',
    question: 'Is my data secure?',
    answer: 'Yes. We use bank-level encryption (AES-256) for data at rest and TLS 1.3 for data in transit. All data is stored in secure, SOC 2 compliant data centers.'
  },
  {
    category: 'security',
    question: 'Who can see my inspection reports?',
    answer: 'Only you and people you explicitly share with can access your reports. We never share your data with third parties without your permission.'
  },
  {
    category: 'security',
    question: 'Do you comply with privacy regulations?',
    answer: 'Yes, we\'re fully compliant with GDPR, CCPA, and other major privacy regulations. You own your data and can export or delete it at any time.'
  },
  {
    category: 'security',
    question: 'What happens to my photos?',
    answer: 'Your photos are securely stored and used only for generating your reports. We don\'t use your photos to train our AI without explicit permission. You can delete photos and reports anytime.'
  }
];

const categories = [
  { id: 'all', label: 'All Questions' },
  { id: 'general', label: 'General' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'technical', label: 'Technical' },
  { id: 'security', label: 'Security & Privacy' }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredFAQs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="Frequently Asked Questions"
        description="Get answers to common questions about InspectAI's property inspection platform, pricing, features, and security."
        keywords="property inspection FAQ, InspectAI questions, inspection software help"
      />
      <MarketingNav />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600">
            Everything you need to know about InspectAI
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-8">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still Have Questions CTA */}
        <div className="mt-16 bg-blue-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-600 mb-6">
            Our team is here to help. Get in touch and we'll respond within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Contact Support
            </a>
            <a
              href="/demo"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors border-2 border-blue-600"
            >
              Schedule a Demo
            </a>
          </div>
        </div>
      </div>
      
      <MarketingFooter />
    </div>
  );
}
