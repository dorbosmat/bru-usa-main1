import Layout from "@/components/Layout";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => (
  <Layout>
    <Helmet>
      <title>Privacy Policy | Build Right USA</title>
      <meta name="description" content="Privacy Policy for Build Right USA. Learn how we collect, use, and protect your personal information." />
    </Helmet>

    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground text-sm mb-10">
          Last Updated: April 10, 2026
        </p>

        <div className="prose prose-sm md:prose-base max-w-none text-foreground/90 space-y-8">
          <p>
            Build Right USA ("Company," "we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website at buildright-usa.com (the "Platform") or use our lead generation and contractor matching services.
          </p>
          <p>
            By using the Platform, you consent to the data practices described in this policy. If you do not agree with this policy, please do not use our Platform.
          </p>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">1. Information We Collect</h2>
            <p className="mb-2"><strong>Personal Information You Provide:</strong></p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>ZIP code and project location</li>
              <li>Description of your home improvement project</li>
              <li>Service type and preferred service area</li>
              <li>Any additional details you voluntarily provide in form submissions</li>
            </ul>
            <p className="mt-3 mb-2"><strong>Information Collected Automatically:</strong></p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>IP address and approximate geolocation</li>
              <li>Browser type, version, and operating system</li>
              <li>Device type (desktop, mobile, tablet)</li>
              <li>Pages visited, time spent on pages, and navigation patterns</li>
              <li>Referring URL and search terms used to find our Platform</li>
              <li>Cookies, pixel tags, and similar tracking technologies</li>
              <li>UTM parameters and advertising campaign data</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">2. How We Use Your Information</h2>
            <p className="mb-2">We use the information we collect for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li><strong>Lead Matching:</strong> To match you with licensed contractors and service providers in your area</li>
              <li><strong>Communication:</strong> To respond to your inquiries and provide project consultations</li>
              <li><strong>Service Improvement:</strong> To analyze usage patterns and improve Platform functionality</li>
              <li><strong>Marketing:</strong> To send you relevant offers and updates (with your consent)</li>
              <li><strong>Analytics:</strong> To measure advertising effectiveness and optimize our marketing campaigns</li>
              <li><strong>Compliance:</strong> To comply with legal obligations and enforce our Terms of Service</li>
              <li><strong>Fraud Prevention:</strong> To detect and prevent fraudulent or unauthorized activity</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">3. How We Share Your Information</h2>
            <p className="mb-2">Your personal information may be shared with the following parties:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li><strong>Licensed Contractors & Service Providers:</strong> Your project details, name, phone number, email, and ZIP code may be shared with one or more contractors for the purpose of providing you with estimates. See our <Link to="/lead-generation-disclosure" className="text-accent hover:underline">Lead Generation Disclosure</Link> for details.</li>
              <li><strong>Analytics Providers:</strong> We use Google Analytics, Meta Pixel, and similar tools to track website usage and advertising performance.</li>
              <li><strong>CRM & Communication Platforms:</strong> We may use third-party email, SMS, and customer relationship management tools to manage leads and communications.</li>
              <li><strong>Legal Compliance:</strong> We may disclose your information when required by law, subpoena, or government request.</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.</li>
            </ul>
            <p className="mt-2 font-medium">
              We do not sell your personal information to data brokers or unrelated third parties for their independent marketing purposes.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">4. Cookies & Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience on our Platform. For detailed information about the cookies we use and how to manage your preferences, please see our <Link to="/cookie-policy" className="text-accent hover:underline">Cookie Policy</Link>.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">5. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Lead data is typically retained for up to <strong>24 months</strong> from the date of submission. After this period, data may be anonymized or securely deleted.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">6. Data Security</h2>
            <p>
              We implement reasonable administrative, technical, and physical safeguards to protect your personal information from unauthorized access, use, alteration, or disclosure. However, no method of transmission over the Internet or method of electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">7. Your Privacy Rights</h2>
            <p className="mb-2">Depending on your location, you may have the following rights regarding your personal information:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Opt-Out:</strong> Opt out of marketing communications at any time</li>
              <li><strong>Data Portability:</strong> Request your data in a structured, commonly used format</li>
            </ul>
            <p className="mt-2">
              To exercise any of these rights, please contact us at{" "}
              <a href="mailto:support@buildright-usa.com" className="text-accent hover:underline">support@buildright-usa.com</a>.
            </p>
            <p className="mt-2">
              For California residents, please see our <Link to="/ccpa-notice" className="text-accent hover:underline">CCPA Privacy Notice</Link>. For information about international data rights, see our <Link to="/data-rights" className="text-accent hover:underline">Data Rights</Link> page.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">8. Children's Privacy</h2>
            <p>
              Our Platform is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a minor, please contact us immediately at{" "}
              <a href="mailto:support@buildright-usa.com" className="text-accent hover:underline">support@buildright-usa.com</a>.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">9. Third-Party Links</h2>
            <p>
              The Platform may contain links to third-party websites. We are not responsible for the privacy practices or content of those websites. We encourage you to read the privacy policies of any third-party sites you visit.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">10. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last Updated" date. Your continued use of the Platform constitutes acceptance of the revised policy.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">11. Contact Us</h2>
            <p>
              If you have questions or concerns about this Privacy Policy, please contact us at:
            </p>
            <div className="mt-2 text-foreground/80">
              <p>Build Right USA</p>
              <p>Email: <a href="mailto:support@buildright-usa.com" className="text-accent hover:underline">support@buildright-usa.com</a></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default PrivacyPolicy;
