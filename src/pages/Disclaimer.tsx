import Layout from "@/components/Layout";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const Disclaimer = () => (
  <Layout>
    <Helmet>
      <title>Disclaimer | Build Right USA</title>
      <meta name="description" content="Important disclaimers regarding Build Right USA's lead generation services and contractor referral platform." />
    </Helmet>

    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
          Disclaimer
        </h1>
        <p className="text-muted-foreground text-sm mb-10">
          Last Updated: April 10, 2026
        </p>

        <div className="prose prose-sm md:prose-base max-w-none text-foreground/90 space-y-8">
          <p>
            The information provided on the Build Right USA website at buildright-usa.com (the "Platform") is for general informational purposes only. Please read this Disclaimer carefully before using the Platform.
          </p>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">1. We Do Not Perform Construction Work</h2>
            <p>
              Build Right USA is a <strong>lead generation and contractor referral platform only</strong>. We do not perform, manage, supervise, or guarantee any construction, renovation, home improvement, or repair work of any kind. All work is performed exclusively by independent, third-party contractors.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">2. Matching Platform Only</h2>
            <p>
              Our sole role is to connect homeowners and property managers with independent licensed contractors and service providers. Build Right USA serves as a marketplace facilitator and does not participate in the execution of any project.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">3. No Guarantee of Results</h2>
            <p>Build Right USA makes no representations, warranties, or guarantees regarding:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80 mt-2">
              <li>The quality, timeliness, or outcome of any work performed by contractors</li>
              <li>The accuracy of any estimates, price ranges, or project timelines displayed on the Platform</li>
              <li>The licensing status, insurance coverage, bonding, or qualifications of any contractor</li>
              <li>The availability of contractors in your area</li>
              <li>The suitability of any contractor for your specific project</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">4. Independent Contractors</h2>
            <p>
              All contractors and service providers accessible through the Platform are <strong>independent businesses</strong>. They are not employees, agents, partners, or representatives of Build Right USA. We do not endorse, recommend, or vouch for any specific contractor. Users are solely responsible for verifying contractor credentials, insurance, licensing, and references before entering into any agreement.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">5. Estimates & Pricing</h2>
            <p>
              Any cost estimates, price ranges, or pricing information displayed on the Platform are <strong>preliminary and for informational purposes only</strong>. They do not constitute a binding quote, bid, or contract. Actual project costs may vary significantly based on scope, materials, labor, location, and other factors. Users must obtain detailed, written estimates directly from contractors before authorizing any work.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">6. AI-Generated Content</h2>
            <p>
              Certain features on the Platform may use artificial intelligence to generate renovation previews, estimates, or suggestions. This AI-generated content is for <strong>illustrative and informational purposes only</strong> and should not be relied upon as accurate representations of actual project outcomes, costs, or feasibility.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">7. No Professional Advice</h2>
            <p>
              The content on the Platform does not constitute professional construction, architectural, engineering, legal, or financial advice. Users should consult with qualified professionals before making decisions about home improvement projects.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">8. Limitation of Liability</h2>
            <p>
              Build Right USA shall not be liable for any damages, losses, or injuries arising from the use of the Platform or from any interaction with contractors found through the Platform. For full details, see our <Link to="/terms-of-service" className="text-accent hover:underline">Terms of Service</Link>.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">9. Contact Us</h2>
            <p>
              If you have questions about this Disclaimer, please contact us at:{" "}
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

export default Disclaimer;
