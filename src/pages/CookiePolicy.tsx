import Layout from "@/components/Layout";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const CookiePolicy = () => (
  <Layout>
    {/* SEO-TODO: regulatory page — Disallowed in robots.txt AND noindex
        here. Mirrors the strategy for /sms-consent, /ccpa-notice, and
        /data-rights. Reachable via direct link from the footer + from
        within the Privacy Policy. */}
    <Helmet>
      <title>Cookie Policy | Build Right USA</title>
      <meta name="description" content="Cookie Policy for Build Right USA. Learn about the cookies and tracking technologies we use." />
      <meta name="robots" content="noindex, nofollow" />
      <link rel="canonical" href="https://www.buildright-usa.com/cookie-policy" />
    </Helmet>

    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
          Cookie Policy
        </h1>
        <p className="text-muted-foreground text-sm mb-10">
          Last Updated: May 20, 2026
        </p>

        <div className="prose prose-sm md:prose-base max-w-none text-foreground/90 space-y-8">
          <p>
            Build Right USA ("we," "us," or "our") uses cookies and similar tracking technologies on our website at buildright-usa.com (the "Platform"). This Cookie Policy explains what cookies are, how we use them, and how you can manage your cookie preferences.
          </p>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files that are placed on your device (computer, smartphone, or tablet) when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and supply information to website operators.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">2. Types of Cookies We Use</h2>

            <div className="mt-3">
              <h3 className="font-display font-semibold text-foreground mb-2">Essential Cookies</h3>
              <p>These cookies are necessary for the Platform to function properly. They enable core features such as page navigation, form submissions, and security. These cookies cannot be disabled.</p>
              <ul className="list-disc pl-6 space-y-1 text-foreground/80 mt-2">
                <li>Session management and authentication</li>
                <li>Cookie consent preferences</li>
                <li>Security and fraud prevention</li>
              </ul>
            </div>

            <div className="mt-4">
              <h3 className="font-display font-semibold text-foreground mb-2">Analytics Cookies</h3>
              <p>These cookies help us understand how visitors interact with the Platform by collecting and reporting information anonymously.</p>
              <ul className="list-disc pl-6 space-y-1 text-foreground/80 mt-2">
                <li><strong>Google Analytics:</strong> Tracks page views, user behavior, session duration, and traffic sources</li>
                <li><strong>Internal Analytics:</strong> Monitors form submissions, lead conversions, and user engagement</li>
              </ul>
            </div>

            <div className="mt-4">
              <h3 className="font-display font-semibold text-foreground mb-2">Marketing & Advertising Cookies</h3>
              <p>These cookies are used to track visitors across websites and display relevant advertisements.</p>
              <ul className="list-disc pl-6 space-y-1 text-foreground/80 mt-2">
                <li><strong>Meta Pixel (Facebook):</strong> Tracks conversions from Facebook and Instagram ads and enables retargeting</li>
                <li><strong>Google Ads:</strong> Measures advertising campaign performance and enables remarketing</li>
                <li><strong>UTM Tracking:</strong> Tracks the source, medium, and campaign of inbound traffic</li>
              </ul>
            </div>

            <div className="mt-4">
              <h3 className="font-display font-semibold text-foreground mb-2">Functional Cookies</h3>
              <p>These cookies enable enhanced functionality and personalization.</p>
              <ul className="list-disc pl-6 space-y-1 text-foreground/80 mt-2">
                <li>Language preferences</li>
                <li>Previously submitted form data</li>
                <li>Chat widget session persistence</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">3. How to Manage Cookies</h2>
            <p className="mb-2">You can control and manage cookies in several ways:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li><strong>Browser Settings:</strong> Most browsers allow you to block or delete cookies through their settings. Note that blocking essential cookies may impact Platform functionality.</li>
              <li><strong>Cookie Consent Banner:</strong> When you first visit our Platform, you will see a cookie consent banner where you can accept or manage your cookie preferences.</li>
              <li><strong>Google Analytics Opt-Out:</strong> You can opt out of Google Analytics by installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Google Analytics Opt-Out Browser Add-on</a>.</li>
              <li><strong>Ad Preferences:</strong> You can manage your ad preferences through <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Digital Advertising Alliance</a> or <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Network Advertising Initiative</a>.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">4. Third-Party Cookies</h2>
            <p>
              Some cookies on our Platform are set by third-party services. We do not control these cookies and recommend reviewing the privacy policies of these third parties for more information about their data practices.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">5. Changes to This Cookie Policy</h2>
            <p>
              We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated "Last Updated" date. We encourage you to review this policy periodically.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">6. Contact Us</h2>
            <p>
              If you have questions about our use of cookies, please contact us at:{" "}
              <a href="mailto:support@buildright-usa.com" className="text-accent hover:underline">
                support@buildright-usa.com
              </a>
            </p>
            <p className="mt-2">
              For more information about how we handle your data, please see our <Link to="/privacy-policy" className="text-accent hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default CookiePolicy;
