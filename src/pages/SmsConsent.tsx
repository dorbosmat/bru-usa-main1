import Layout from "@/components/Layout";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const SmsConsent = () => (
  <Layout>
    <Helmet>
      <title>SMS & Communication Consent | Build Right USA</title>
      <meta name="description" content="SMS and communication consent policy for Build Right USA. Learn about how we and our contractor partners may contact you." />
    </Helmet>

    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
          SMS & Communication Consent
        </h1>
        <p className="text-muted-foreground text-sm mb-10">
          Last Updated: April 10, 2026
        </p>

        <div className="prose prose-sm md:prose-base max-w-none text-foreground/90 space-y-8">
          <p>
            By submitting your contact information through a form on the Build Right USA website at buildright-usa.com (the "Platform"), you provide your express written consent to the following communication practices.
          </p>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">1. Consent to Contact</h2>
            <p className="mb-2">By submitting a lead form, you expressly consent to receive communications from Build Right USA and/or our network of licensed contractors and service providers, including:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/80">
              <li><strong>Phone calls</strong> (including calls made using automated dialing technology or prerecorded messages)</li>
              <li><strong>Text messages (SMS/MMS)</strong> related to your project inquiry</li>
              <li><strong>Emails</strong> regarding your project request, estimates, and related services</li>
            </ul>
            <p className="mt-2">
              You understand that these communications may be sent to the phone number and/or email address you provided, even if it is registered on a federal or state Do Not Call registry.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">2. Message Frequency & Rates</h2>
            <p>Message frequency may vary depending on your project needs and contractor availability. Standard message and data rates may apply based on your mobile carrier plan. Build Right USA is not responsible for any charges incurred from your carrier.</p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">3. Consent Is Not a Condition of Purchase</h2>
            <p>
              Your consent to receive communications is <strong>not a condition of purchasing any goods or services</strong>. You may still use the Platform without providing consent, although certain features (such as contractor matching) require your contact information to function.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">4. How to Opt Out</h2>
            <p className="mb-2">You may opt out of communications at any time using any of the following methods:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li><strong>SMS:</strong> Reply <strong>STOP</strong> to any text message you receive from us to unsubscribe from text messages</li>
              <li><strong>Email:</strong> Click the "Unsubscribe" link at the bottom of any marketing email, or send an opt-out request to{" "}
                <a href="mailto:support@buildright-usa.com" className="text-accent hover:underline">support@buildright-usa.com</a>
              </li>
              <li><strong>Phone:</strong> Request to be removed from our contact list during any phone conversation</li>
              <li><strong>Written Request:</strong> Send an email to{" "}
                <a href="mailto:support@buildright-usa.com" className="text-accent hover:underline">support@buildright-usa.com</a>{" "}
                with the subject line "Opt-Out Request"
              </li>
            </ul>
            <p className="mt-2">
              Please allow up to <strong>10 business days</strong> for opt-out requests to be fully processed. Note that opting out of marketing communications does not prevent transactional messages related to existing project inquiries.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">5. Help</h2>
            <p>
              For help with text messages, reply <strong>HELP</strong> to any text message or contact us at{" "}
              <a href="mailto:support@buildright-usa.com" className="text-accent hover:underline">support@buildright-usa.com</a>.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">6. Third-Party Communications</h2>
            <p>
              Please note that contractors who receive your lead information operate independently. To stop communications from a specific contractor, you must contact that contractor directly. Build Right USA will make reasonable efforts to assist you, but cannot guarantee cessation of communications from independent third parties.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">7. Contact Us</h2>
            <p>
              For questions about this SMS & Communication Consent policy, please contact:{" "}
              <a href="mailto:support@buildright-usa.com" className="text-accent hover:underline">
                support@buildright-usa.com
              </a>
            </p>
            <p className="mt-2">
              See also: <Link to="/privacy-policy" className="text-accent hover:underline">Privacy Policy</Link> | <Link to="/terms-of-service" className="text-accent hover:underline">Terms of Service</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default SmsConsent;
