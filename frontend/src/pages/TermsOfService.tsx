import React from 'react';
import MarketingNav from '../components/MarketingNav';
import MarketingFooter from '../components/MarketingFooter';
import SEO from '../components/SEO';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="Terms of Service"
        description="InspectIQ's terms of service - the legal agreement governing your use of our platform."
        keywords="terms of service, user agreement, legal terms, conditions"
      />
      <MarketingNav />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              <strong>Last updated:</strong> December 13, 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing or using InspectIQ ("Service"), you agree to be bound by these Terms of Service ("Terms"). 
                If you disagree with any part of these terms, you may not access the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 mb-4">
                InspectIQ is an AI-powered property inspection platform that allows users to:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Upload and analyze property photos</li>
                <li>Generate automated inspection reports</li>
                <li>Detect potential building code violations</li>
                <li>Manage property portfolios</li>
                <li>Access maintenance recommendations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Account Creation</h3>
              <p className="text-gray-700 mb-4">
                You must create an account to use InspectIQ. You are responsible for:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Providing accurate and complete information</li>
                <li>Maintaining the security of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of unauthorized access</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Account Termination</h3>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your account for violations of these Terms, illegal activity, 
                or at our discretion with reasonable notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Acceptable Use</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Permitted Uses</h3>
              <p className="text-gray-700 mb-4">You may use InspectIQ for legitimate property inspection purposes.</p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Prohibited Uses</h3>
              <p className="text-gray-700 mb-4">You may not:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Upload illegal, harmful, or inappropriate content</li>
                <li>Violate any laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Attempt to hack, disrupt, or damage the Service</li>
                <li>Use the Service for unauthorized commercial purposes</li>
                <li>Share account credentials with others</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Content and Data</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Your Content</h3>
              <p className="text-gray-700 mb-4">
                You retain ownership of photos and data you upload. By using InspectIQ, you grant us a license to 
                process your content to provide the Service, including AI analysis and report generation.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Content</h3>
              <p className="text-gray-700 mb-4">
                InspectIQ's software, AI models, reports, and other materials are our intellectual property. 
                You may not copy, modify, or distribute our content without permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. AI Analysis Disclaimer</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-4">
                <p className="text-gray-700 mb-4">
                  <strong>Important:</strong> InspectIQ's AI analysis is for informational purposes only and should not be 
                  considered as professional inspection advice, legal guidance, or building code compliance certification.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>AI analysis may not detect all issues or may identify false positives</li>
                  <li>Building codes vary by jurisdiction - consult local authorities</li>
                  <li>Professional inspection is recommended for official assessments</li>
                  <li>We are not liable for decisions based on AI analysis</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Pricing and Payments</h2>
              <p className="text-gray-700 mb-4">
                Subscription fees are charged in advance and are non-refundable except as required by law. 
                We may change pricing with 30 days notice to existing subscribers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                To the maximum extent permitted by law, InspectIQ shall not be liable for any indirect, incidental, 
                special, consequential, or punitive damages, including but not limited to loss of profits, data, 
                or business opportunities.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Warranties and Disclaimers</h2>
              <p className="text-gray-700 mb-4">
                The Service is provided "as is" without warranties of any kind. We do not guarantee that the Service 
                will be uninterrupted, error-free, or meet your specific requirements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Indemnification</h2>
              <p className="text-gray-700 mb-4">
                You agree to indemnify and hold InspectIQ harmless from any claims, damages, or expenses arising 
                from your use of the Service or violation of these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
              <p className="text-gray-700 mb-4">
                These Terms are governed by the laws of [Your Jurisdiction]. Any disputes will be resolved 
                through binding arbitration or in the courts of [Your Jurisdiction].
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We may modify these Terms at any time. We will notify users of significant changes via email 
                or through the Service. Continued use constitutes acceptance of modified Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                For questions about these Terms:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Email:</strong> legal@inspectiq.app</p>
                <p className="text-gray-700 mb-2"><strong>Address:</strong> InspectIQ Legal Team</p>
                <p className="text-gray-700">123 Innovation Drive, Tech City, TC 12345</p>
              </div>
            </section>
          </div>
        </div>
      </div>
      
      <MarketingFooter />
    </div>
  );
}