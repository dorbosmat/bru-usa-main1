import Layout from "@/components/Layout";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const CcpaNotice = () => (
  <Layout>
    <Helmet>
      <title>CCPA Privacy Notice | Build Right USA</title>
      <meta name="description" content="California Consumer Privacy Act (CCPA) notice for Build Right USA. Learn about your California privacy rights." />
    </Helmet>

    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
          CCPA Privacy Notice
        </h1>
        <p className="text-muted-foreground text-sm mb-4">
          California Consumer Privacy Act Disclosure
        </p>
        <p className="text-muted-foreground text-sm mb-10">
          Last Updated: May 20, 2026 · Consent text version: v1-2026-05-20
        </p>

        <div className="prose prose-sm md:prose-base max-w-none text-foreground/90 space-y-8">
          <p>
            This CCPA Privacy Notice supplements the information contained in our <Link to="/privacy-policy" className="text-accent hover:underline">Privacy Policy</Link> and applies solely to visitors, users, and others who reside in the State of California ("consumers" or "you"). Build Right USA ("we," "us," or "our") adopts this notice to comply with the California Consumer Privacy Act of 2018 ("CCPA") as amended by the California Privacy Rights Act ("CPRA"), and any terms defined in the CCPA/CPRA have the same meaning when used in this notice.
          </p>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">1. Categories of Personal Information Collected</h2>
            <p className="mb-2">In the preceding twelve (12) months, we have collected the following categories of personal information from consumers:</p>

            <div className="overflow-x-auto mt-3">
              <table className="w-full text-sm border border-border rounded">
                <thead>
                  <tr className="bg-muted">
                    <th className="text-left p-3 font-semibold text-foreground border-b border-border">Category</th>
                    <th className="text-left p-3 font-semibold text-foreground border-b border-border">Examples</th>
                    <th className="text-center p-3 font-semibold text-foreground border-b border-border">Collected</th>
                  </tr>
                </thead>
                <tbody className="text-foreground/80">
                  <tr className="border-b border-border">
                    <td className="p-3">Identifiers</td>
                    <td className="p-3">Name, email, phone number, ZIP code</td>
                    <td className="p-3 text-center">Yes</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3">Internet Activity</td>
                    <td className="p-3">Browsing history, search history, interaction with Platform</td>
                    <td className="p-3 text-center">Yes</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3">Geolocation Data</td>
                    <td className="p-3">Approximate location derived from IP address or ZIP code</td>
                    <td className="p-3 text-center">Yes</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3">Professional Information</td>
                    <td className="p-3">Project descriptions and home improvement needs</td>
                    <td className="p-3 text-center">Yes</td>
                  </tr>
                  <tr>
                    <td className="p-3">Inferences</td>
                    <td className="p-3">Preferences and characteristics derived from collected data</td>
                    <td className="p-3 text-center">Yes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">2. Use of Personal Information</h2>
            <p className="mb-2">We may use or disclose the personal information we collect for the following business purposes:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>To match consumers with licensed contractors and service providers</li>
              <li>To process and respond to project requests and inquiries</li>
              <li>To provide, maintain, and improve our Platform</li>
              <li>To detect security incidents and protect against fraudulent activity</li>
              <li>To comply with legal obligations</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">3. Sale & Sharing of Personal Information</h2>
            <p>
              Under the CCPA, "sale" is broadly defined and may include sharing personal information with contractors in exchange for compensation. Build Right USA shares consumer personal information (name, phone, email, ZIP code, project details) with contractors for the purpose of providing lead matching services. This may be considered a "sale" or "sharing" under the CCPA.
            </p>
          </div>

          <div className="bg-accent/10 border border-accent/20 rounded-lg p-5">
            <h2 className="font-display text-xl font-bold text-foreground mb-3">4. Do Not Sell or Share My Personal Information</h2>
            <p>
              California residents have the right to opt out of the sale or sharing of their personal information. To exercise this right, please contact us at:
            </p>
            <p className="mt-2">
              <strong>Email:</strong>{" "}
              <a href="mailto:support@buildright-usa.com" className="text-accent hover:underline">support@buildright-usa.com</a>
            </p>
            <p className="mt-1">
              <strong>Subject Line:</strong> "Do Not Sell My Personal Information"
            </p>
            <p className="mt-2 text-sm text-foreground/70">
              We will process your request within 45 days of receipt, as required by the CCPA.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">5. Your California Privacy Rights</h2>
            <p className="mb-2">As a California resident, you have the following rights under the CCPA/CPRA:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li><strong>Right to Know:</strong> You have the right to request that we disclose the categories and specific pieces of personal information we have collected about you, the categories of sources, the business purpose for collection, and the categories of third parties with whom we share your data.</li>
              <li><strong>Right to Delete:</strong> You have the right to request the deletion of your personal information, subject to certain exceptions provided by law.</li>
              <li><strong>Right to Correct:</strong> You have the right to request the correction of inaccurate personal information.</li>
              <li><strong>Right to Opt-Out of Sale/Sharing:</strong> You have the right to opt out of the sale or sharing of your personal information.</li>
              <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising any of your CCPA rights. We will not deny goods or services, charge different prices, or provide a different level of quality based on your exercise of privacy rights.</li>
              <li><strong>Right to Limit Use of Sensitive Personal Information:</strong> You may limit our use of sensitive personal information to purposes necessary to provide the services you requested.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">6. How to Submit a Request</h2>
            <p className="mb-2">To exercise your California privacy rights, you may submit a verifiable consumer request by:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li>Emailing us at <a href="mailto:support@buildright-usa.com" className="text-accent hover:underline">support@buildright-usa.com</a></li>
              <li>Including "CCPA Request" in the subject line</li>
              <li>Providing sufficient information for us to verify your identity (name, email address, and ZIP code used in your original submission)</li>
            </ul>
            <p className="mt-2">
              Only you, or a person registered with the California Secretary of State that you authorize to act on your behalf, may make a verifiable consumer request related to your personal information. You may make a verifiable consumer request no more than twice within a 12-month period.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">7. Response Timing</h2>
            <p>
              We will acknowledge receipt of your request within <strong>10 business days</strong> and provide a substantive response within <strong>45 calendar days</strong>. If we require more time (up to an additional 45 days), we will inform you of the reason and extension period in writing.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">8. Contact Us</h2>
            <p>
              For questions about this CCPA Notice, please contact:{" "}
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

export default CcpaNotice;
