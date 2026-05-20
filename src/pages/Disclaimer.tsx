import Layout from "@/components/Layout";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const Disclaimer = () => (
  <Layout>
    <Helmet>
      <title>Disclaimer | Build Right USA</title>
      <meta name="description" content="Important disclaimers regarding Build Right USA's contractor referral service. Includes the AI-generated content disclaimer and emergency redirect to 911." />
      <link rel="canonical" href="https://www.buildright-usa.com/disclaimer" />
    </Helmet>

    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
          Disclaimer
        </h1>
        <p className="text-muted-foreground text-sm mb-10">
          Last Updated: May 20, 2026
        </p>

        <div className="prose prose-sm md:prose-base max-w-none text-foreground/90 space-y-8">
          {/* LEGAL-TODO: emergency callout — sits above the fold so it's the
              first thing a visitor in distress sees. Aligned with the chatbot
              system prompt (Task 4) and chatbot-flows.ts (Task 4) which both
              redirect active emergencies to 911. */}
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
            <p className="font-semibold text-foreground">
              Emergency? Call 911 or your local emergency services immediately.
            </p>
            <p className="text-sm text-foreground/80 mt-1">
              Build Right USA cannot dispatch emergency help. If you're dealing with
              active flooding, structural collapse, fire, gas, electrical hazards,
              or injury, contact 911 or a local emergency contractor right away —
              not this website.
            </p>
          </div>

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
            <h2 className="font-display text-xl font-bold text-foreground mb-3">6. AI-Generated Content & AI Assistant</h2>
            <p>
              Certain features on the Platform are powered by artificial intelligence. The <strong>AI Renovation Preview</strong> generates illustrative before/after images from photos you upload, and the <strong>AI Assistant</strong> chat answers general home-improvement questions in real time.
            </p>
            <p className="mt-2">
              All AI-generated content — images, recommendations, cost ranges, advice — is for <strong>illustrative and informational purposes only</strong>. It is not a guarantee of final build, materials, cost, scope, timing, or feasibility, and it should not be treated as professional construction, design, engineering, legal, or financial advice. The AI Assistant is automated software, not a human contractor or employee, and may produce inaccurate responses. Always confirm any specific question with a licensed professional before acting on it.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">7. Service Availability</h2>
            <p>
              Build Right USA is currently active in a limited number of U.S. metro areas and is expanding. We do <strong>not</strong> claim a nationwide footprint, and we do not guarantee that a contractor is available in every ZIP code at the time of your submission. If we cannot match your request, we will let you know — there is no charge.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">8. No Professional Advice</h2>
            <p>
              The content on the Platform does not constitute professional construction, architectural, engineering, legal, or financial advice. Users should consult with qualified professionals before making decisions about home improvement projects.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">9. Limitation of Liability</h2>
            <p>
              Build Right USA shall not be liable for any damages, losses, or injuries arising from the use of the Platform or from any interaction with contractors found through the Platform. For full details, see our <Link to="/terms-of-service" className="text-accent hover:underline">Terms of Service</Link>.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">10. Contact Us</h2>
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
