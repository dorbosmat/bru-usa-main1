import Layout from "@/components/Layout";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const DataRights = () => (
  <Layout>
    <Helmet>
      <title>Data Rights | Build Right USA</title>
      <meta name="description" content="Your data rights with Build Right USA. Learn about your right to access, delete, and control your personal data." />
    </Helmet>

    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
          Your Data Rights
        </h1>
        <p className="text-muted-foreground text-sm mb-10">
          Last Updated: April 10, 2026
        </p>

        <div className="prose prose-sm md:prose-base max-w-none text-foreground/90 space-y-8">
          <p>
            Build Right USA is committed to transparency and protecting the privacy of all users, regardless of location. This page outlines your rights regarding the personal data we collect, in alignment with global data protection principles including the General Data Protection Regulation (GDPR) and similar frameworks.
          </p>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">1. Right to Access</h2>
            <p>
              You have the right to request a copy of the personal information we hold about you. This includes your name, email, phone number, project details, and any other data you have provided through our Platform. Upon verification of your identity, we will provide this information in a structured, commonly used, and machine-readable format.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">2. Right to Rectification</h2>
            <p>
              If any of the personal information we hold about you is inaccurate or incomplete, you have the right to request its correction or completion. We will make the requested changes promptly upon verification.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">3. Right to Deletion (Right to be Forgotten)</h2>
            <p className="mb-2">
              You have the right to request the deletion of your personal information from our systems. We will honor deletion requests unless we are required to retain the data for:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>Compliance with a legal obligation</li>
              <li>Exercising or defending legal claims</li>
              <li>Completing a transaction you initiated</li>
              <li>Detecting security incidents or fraud</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">4. Right to Restrict Processing</h2>
            <p>
              You may request that we restrict the processing of your personal data under certain circumstances, such as when you contest the accuracy of the data or when you have objected to processing pending verification.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">5. Right to Data Portability</h2>
            <p>
              Where technically feasible, you have the right to receive your personal data in a structured, commonly used, machine-readable format and to transmit that data to another controller without hindrance.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">6. Right to Object</h2>
            <p>
              You have the right to object to the processing of your personal data for direct marketing purposes, including profiling related to direct marketing. Upon receiving your objection, we will cease processing your data for those purposes.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">7. Right to Opt-Out</h2>
            <p className="mb-2">You may opt out of:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li><strong>Marketing emails:</strong> Click "Unsubscribe" in any marketing email</li>
              <li><strong>SMS messages:</strong> Reply STOP to any text message</li>
              <li><strong>Data sharing with contractors:</strong> Contact us at <a href="mailto:support@buildright-usa.com" className="text-accent hover:underline">support@buildright-usa.com</a></li>
              <li><strong>Cookies & tracking:</strong> Manage your preferences through our cookie consent banner or browser settings</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">8. How to Exercise Your Rights</h2>
            <p>To submit a data rights request, please contact us at:</p>
            <div className="mt-2 bg-muted/50 rounded-lg p-4 text-foreground/80">
              <p><strong>Email:</strong> <a href="mailto:support@buildright-usa.com" className="text-accent hover:underline">support@buildright-usa.com</a></p>
              <p className="mt-1"><strong>Subject Line:</strong> "Data Rights Request"</p>
              <p className="mt-2 text-sm">Please include your full name and the email address you used to submit your original inquiry so we can locate and verify your records.</p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">9. Response Time</h2>
            <p>
              We will acknowledge your request within <strong>10 business days</strong> and provide a substantive response within <strong>30 calendar days</strong>. If additional time is needed, we will notify you of the delay and the reason for it.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">10. No Retaliation</h2>
            <p>
              We will never discriminate against you or provide a lesser quality of service for exercising any of your data rights.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">11. Related Policies</h2>
            <p>For more information about our data practices, please see:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80 mt-2">
              <li><Link to="/privacy-policy" className="text-accent hover:underline">Privacy Policy</Link></li>
              <li><Link to="/cookie-policy" className="text-accent hover:underline">Cookie Policy</Link></li>
              <li><Link to="/ccpa-notice" className="text-accent hover:underline">CCPA Privacy Notice</Link> (for California residents)</li>
              <li><Link to="/lead-generation-disclosure" className="text-accent hover:underline">Lead Generation Disclosure</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default DataRights;
