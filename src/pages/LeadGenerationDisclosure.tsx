import Layout from "@/components/Layout";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const LeadGenerationDisclosure = () => (
  <Layout>
    <Helmet>
      <title>Lead Generation Disclosure | Build Right USA</title>
      <meta name="description" content="Important disclosure about how Build Right USA refers homeowner requests to independent licensed contractors. Florida-first, no obligation, no charge." />
      <link rel="canonical" href="https://www.buildright-usa.com/lead-generation-disclosure" />
    </Helmet>

    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
          Lead Generation Disclosure
        </h1>
        <p className="text-muted-foreground text-sm mb-10">
          Last Updated: May 20, 2026 · Consent text version: v1-2026-05-20
        </p>

        <div className="prose prose-sm md:prose-base max-w-none text-foreground/90 space-y-8">
          {/* LEGAL-TODO: this disclosure is currently aligned with the
              conservative pre-counsel-review framing where Build Right USA
              contacts the visitor itself rather than naming specific
              contractor buyers. When the contractor monetization model is
              finalized AND counsel has reviewed against the FCC one-to-one
              consent rule, bump CURRENT_CONSENT to v2 and add the
              per-seller language here. */}
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
            <p className="font-medium text-foreground">
              <strong>Important:</strong> Build Right USA is a contractor referral platform that connects homeowners in selected U.S. metro areas with independent licensed contractors. We are not a contractor and do not perform construction work. By submitting your information, you acknowledge and agree to the terms described in this disclosure.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">1. How Our Service Works</h2>
            <p>
              Build Right USA operates as a <strong>lead generation and contractor matching service</strong>. When you submit a project request through our website, we collect your information and share it with independent, licensed contractors and home improvement service providers who may be able to assist with your project.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">2. Information Sharing with Contractors</h2>
            <p className="mb-2">By submitting a lead form on our Platform, you explicitly acknowledge and consent to the following:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>Your personal information — including your <strong>name, phone number, email address, ZIP code, and project details</strong> — may be shared with <strong>one or more contractors</strong> or service providers</li>
              <li>Your information may be shared with <strong>multiple contractors simultaneously</strong> to provide you with competitive estimates</li>
              <li>Contractors who receive your information may <strong>contact you via phone, email, and/or text message (SMS)</strong> regarding your project</li>
              <li>The number of contractors who receive your information may vary based on your location, project type, and contractor availability</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">3. Contractor Vetting</h2>
            <p>
              While Build Right USA strives to work with reputable, licensed professionals, <strong>we do not independently verify, guarantee, or warrant</strong> the licensing status, insurance coverage, bonding, qualifications, reputation, or workmanship of any contractor in our network.
            </p>
            <p className="mt-2">
              <strong>It is your responsibility</strong> to independently verify the credentials, insurance, licensing, and references of any contractor before entering into a contract or authorizing work.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">4. Marketplace Connection Service</h2>
            <p>
              Build Right USA is a <strong>marketplace connection service only</strong>. We are not a contractor, general contractor, subcontractor, or construction company. We do not:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80 mt-2">
              <li>Perform any construction or home improvement work</li>
              <li>Supervise or manage any project</li>
              <li>Guarantee project outcomes, timelines, or costs</li>
              <li>Act as an agent for any contractor or user</li>
              <li>Mediate disputes between users and contractors</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">5. No Obligation</h2>
            <p>
              Submitting a project request through Build Right USA does not obligate you to hire any contractor or proceed with any project. You are free to accept or decline any estimate or proposal you receive. There is no cost to you for submitting a lead request.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">6. Compensation Disclosure</h2>
            <p>
              Build Right USA may receive compensation from contractors for lead referrals. This compensation arrangement does not affect the cost of services to you and does not create an employment or agency relationship between Build Right USA and any contractor.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">7. Opt-Out</h2>
            <p>
              If you wish to stop receiving communications from contractors who received your information, you may contact each contractor directly to opt out, or contact us at{" "}
              <a href="mailto:support@buildright-usa.com" className="text-accent hover:underline">support@buildright-usa.com</a>{" "}
              for assistance. See our <Link to="/sms-consent" className="text-accent hover:underline">SMS & Communication Consent</Link> page for more details.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">8. Contact Us</h2>
            <p>
              For questions about this Lead Generation Disclosure, please contact:{" "}
              <a href="mailto:support@buildright-usa.com" className="text-accent hover:underline">
                support@buildright-usa.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default LeadGenerationDisclosure;
