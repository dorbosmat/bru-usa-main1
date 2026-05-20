// PHONE-TODO: this floating button used to deep-link into an Israeli WhatsApp
// number (wa.me/972…) as the primary "talk to us now" CTA. That number is not
// a US contact path and was deceptive on a "USA" brand. The button is now a
// no-op render until a real US contact path (US phone tel: link, US-based
// SMS, or US-registered WhatsApp Business with a +1 number) is provisioned.
//
// To re-enable: replace the body of this default export with the new CTA
// (ideally a `tel:` to COMPANY_PHONE from src/lib/constants.ts) and remove
// this guard.
export default function WhatsAppButton() {
  return null;
}
