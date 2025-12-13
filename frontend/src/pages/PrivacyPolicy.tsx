import React from 'react';
import MarketingNav from '../components/MarketingNav';
import MarketingFooter from '../components/MarketingFooter';
import SEO from '../components/SEO';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="Privacy Policy"
        description="InspectIQ's privacy policy - how we collect, use, and protect your personal information."
        keywords="privacy policy, data protection, personal information, GDPR"
      />
      <MarketingNav />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              <strong>Last updated:</strong> December 13, 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h3>
              <p className="text-gray-700 mb-4">
                When you create an account or use InspectIQ, we collect:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Name and email address</li>
                <li>Account credentials (encrypted passwords)</li>
                <li>Property information you enter</li>
                <li>Photos and inspection data you upload</li>
                <li>Usage analytics and performance data</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Automatically Collected Information</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Usage patterns and feature interactions</li>
                <li>Error logs and performance metrics</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">We use your information to:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Provide and improve our inspection services</li>
                <li>Process and analyze your property photos with AI</li>
                <li>Generate inspection reports and recommendations</li>
                <li>Communicate with you about your account and updates</li>
                <li>Ensure platform security and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or rent your personal information. We may share information only in these circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li><strong>With your consent:</strong> When you explicitly authorize sharing</li>
                <li><strong>Service providers:</strong> Trusted partners who help operate our platform</li>
                <li><strong>Legal requirements:</strong> When required by law or to protect rights</li>
                <li><strong>Business transfers:</strong> In case of merger or acquisition</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement industry-standard security measures:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and monitoring</li>
                <li>Access controls and authentication</li>
                <li>Secure cloud infrastructure</li>
                <li>Regular backups and disaster recovery</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights</h2>
              <p className="text-gray-700 mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Delete your account and data</li>
                <li>Export your data</li>
                <li>Opt out of marketing communications</li>
                <li>File complaints with data protection authorities</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
              <p className="text-gray-700 mb-4">
                We retain your information only as long as necessary to provide services and comply with legal obligations. 
                You can delete your account at any time, which will remove your personal data within 30 days.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies and Tracking</h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar technologies to improve your experience, analyze usage, and provide personalized content. 
                You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. International Transfers</h2>
              <p className="text-gray-700 mb-4">
                Your information may be processed in countries other than your own. We ensure appropriate safeguards 
                are in place to protect your data according to this privacy policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
              <p className="text-gray-700 mb-4">
                InspectIQ is not intended for children under 13. We do not knowingly collect personal information 
                from children under 13. If we become aware of such collection, we will delete the information immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this privacy policy periodically. We will notify you of significant changes via email 
                or through our platform. Your continued use constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have questions about this privacy policy or your personal information:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Email:</strong> privacy@inspectiq.app</p>
                <p className="text-gray-700 mb-2"><strong>Address:</strong> InspectIQ Privacy Team</p>
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