import Layout from "@/components/Layout";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const TermsOfService = () => (
  <Layout>
    <Helmet>
      <title>Terms of Service | Build Right USA</title>
      <meta name="description" content="Terms of Service for Build Right USA, a contractor referral service for homeowners in selected U.S. metro areas." />
      <link rel="canonical" href="https://www.buildright-usa.com/terms-of-service" />
    </Helmet>

    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
          Terms of Service
        </h1>
        <p className="text-muted-foreground text-sm mb-10">
          Last Updated: May 20, 2026 · Consent text version: v1-2026-05-20
        </p>

        <div className="prose prose-sm md:prose-base max-w-none text-foreground/90 space-y-8">
          <p>
            Welcome to Build Right USA ("Company," "we," "us," or "our"). These Terms of Service ("Terms") govern your access to and use of our website, services, and platform located at buildright-usa.com (the "Platform"). By accessing or using the Platform, you agree to be bound by these Terms. If you do not agree to these Terms, you must not access or use the Platform.
          </p>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">1. Platform Description</h2>
            <p>
              Build Right USA operates as a <strong>lead generation and contractor referral platform</strong>. Our service connects homeowners and property managers ("Users") with independent, licensed contractors and home improvement service providers ("Contractors") for the purpose of obtaining project estimates and consultations.
            </p>
            <p className="mt-2">
              <strong>Build Right USA does not perform, supervise, or guarantee any construction, renovation, or home improvement work.</strong> We serve exclusively as a marketplace facilitator connecting Users with Contractors.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">2. Eligibility</h2>
            <p>
              You must be at least 18 years of age and a legal resident of the United States to use the Platform. By using our services, you represent and warrant that you meet these eligibility requirements and have the legal capacity to enter into these Terms.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">3. User Responsibilities</h2>
            <p className="mb-2">As a User of the Platform, you agree to:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>Provide accurate, current, and complete information when submitting project requests or lead forms</li>
              <li>Not submit false, misleading, or fraudulent information</li>
              <li>Independently verify the licensing, insurance, and qualifications of any Contractor before entering into an agreement</li>
              <li>Not use the Platform for any unlawful purpose or in violation of any applicable laws or regulations</li>
              <li>Not attempt to scrape, harvest, or collect data from the Platform through automated means</li>
              <li>Not interfere with or disrupt the integrity or performance of the Platform</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">4. Contractor Independence</h2>
            <p>
              All Contractors and service providers accessible through Build Right USA are <strong>independent businesses</strong>. They are not employees, agents, subcontractors, or representatives of Build Right USA. We do not:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80 mt-2">
              <li>Employ or supervise any Contractor</li>
              <li>Control the methods, materials, or timeline of any project</li>
              <li>Guarantee the licensing status, insurance coverage, or qualifications of any Contractor</li>
              <li>Set or guarantee pricing, project scope, or completion dates</li>
              <li>Assume responsibility for any work performed or not performed by Contractors</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">5. No Guarantee of Performance</h2>
            <p>
              Build Right USA makes <strong>no representations or warranties</strong> regarding the quality, safety, legality, timeliness, or any other aspect of the work performed by Contractors. Any estimates, price ranges, or project timelines displayed on the Platform are for informational purposes only and do not constitute a binding quote, bid, or contract.
            </p>
            <p className="mt-2">
              Users are solely responsible for negotiating terms, verifying credentials, and entering into contracts directly with Contractors. Build Right USA is not a party to any agreement between Users and Contractors.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">6. Lead Generation & Data Sharing</h2>
            <p>
              By submitting information through the Platform, you acknowledge and consent to the following:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80 mt-2">
              <li>Your information may be shared with one or more Contractors for the purpose of providing project estimates</li>
              <li>Contractors may contact you via phone, email, or text message regarding your project request</li>
              <li>Your data may be used in accordance with our <Link to="/privacy-policy" className="text-accent hover:underline">Privacy Policy</Link></li>
            </ul>
            <p className="mt-2">
              For full details on how your information is shared, please review our <Link to="/lead-generation-disclosure" className="text-accent hover:underline">Lead Generation Disclosure</Link>.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">7. Intellectual Property</h2>
            <p>
              All content on the Platform, including but not limited to text, graphics, logos, images, software, and design elements, is the property of Build Right USA or its licensors and is protected by United States and international copyright, trademark, and intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any content on the Platform without our prior written consent.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">8. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, BUILD RIGHT USA, ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND AFFILIATES SHALL NOT BE LIABLE FOR:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80 mt-2">
              <li>Any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform</li>
              <li>Any work performed or not performed by Contractors</li>
              <li>Project delays, property damage, personal injury, or cost overruns</li>
              <li>Contract disputes between Users and Contractors</li>
              <li>Any loss of data, revenue, profits, or business opportunities</li>
              <li>Any errors, inaccuracies, or omissions in the content provided on the Platform</li>
            </ul>
            <p className="mt-2">
              IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED THE AMOUNT OF FIFTY DOLLARS ($50.00) OR THE AMOUNT YOU PAID TO US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, WHICHEVER IS GREATER.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">9. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Build Right USA and its officers, directors, employees, agents, and affiliates from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or related to your use of the Platform, your violation of these Terms, or your interaction with any Contractor.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">10. Dispute Resolution & Arbitration</h2>
            <p>
              Any dispute, claim, or controversy arising out of or relating to these Terms or the use of the Platform shall be resolved through <strong>binding arbitration</strong> administered by the American Arbitration Association ("AAA") in accordance with its Consumer Arbitration Rules. The arbitration shall take place in Miami-Dade County, Florida.
            </p>
            <p className="mt-2">
              <strong>CLASS ACTION WAIVER:</strong> You agree that any disputes will be resolved on an individual basis only. You waive the right to participate in any class action, class arbitration, or representative proceeding.
            </p>
            <p className="mt-2">
              Notwithstanding the foregoing, either party may seek injunctive or equitable relief in a court of competent jurisdiction to prevent the actual or threatened infringement of intellectual property rights.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">11. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the <strong>State of Florida, United States of America</strong>, without regard to its conflict of law provisions. Any legal proceedings not subject to arbitration shall be brought in the state or federal courts located in Miami-Dade County, Florida.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">12. Termination</h2>
            <p>
              Build Right USA reserves the right to suspend or terminate your access to the Platform at any time, with or without cause, and with or without notice. Upon termination, your right to use the Platform will immediately cease. All provisions of these Terms that by their nature should survive termination shall survive, including but not limited to limitation of liability, indemnification, and dispute resolution provisions.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">13. Modifications to Terms</h2>
            <p>
              Build Right USA reserves the right to modify these Terms at any time. Changes will be effective immediately upon posting on the Platform. Your continued use of the Platform after any modifications constitutes your acceptance of the updated Terms. We encourage you to review these Terms periodically.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">14. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that these Terms will otherwise remain in full force and effect.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">15. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:{" "}
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

export default TermsOfService;
