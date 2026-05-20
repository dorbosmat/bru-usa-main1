import { CheckCircle, Phone, CalendarCheck } from "lucide-react";
import { COMPANY_EMAIL } from "@/lib/constants";

interface WhatHappensNextProps {
  name?: string;
  service?: string;
  onReset?: () => void;
  resetLabel?: string;
}

const STEPS = [
  { icon: CheckCircle,  time: "Right now",     title: "Request confirmed",       desc: "We've received your project details and are matching you with local contractors." },
  { icon: Phone,        time: "Within 2 hours", title: "A contractor will call",  desc: "A licensed, insured contractor in your area will reach out to discuss your project." },
  { icon: CalendarCheck,time: "Your schedule",  title: "Free on-site estimate",   desc: "Schedule a no-obligation walkthrough at a time that works for you." },
];

export default function WhatHappensNext({ name, service, onReset, resetLabel = "Submit another request" }: WhatHappensNextProps) {
  return (
    <div className="bg-card rounded-lg shadow-xl p-6 md:p-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-100 mx-auto">
          <CheckCircle size={28} className="text-green-600" />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground">
          {name ? `You're all set, ${name.split(" ")[0]}!` : "You're all set!"}
        </h2>
        {service && (
          <p className="text-sm text-muted-foreground">
            Your <span className="font-medium text-foreground">{service}</span> request has been received.
          </p>
        )}
      </div>

      <div className="space-y-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">What happens next</p>
        {STEPS.map(({ icon: Icon, time, title, desc }, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <Icon size={15} className="text-accent" />
              </div>
              {i < STEPS.length - 1 && <div className="w-px flex-1 bg-border my-1" />}
            </div>
            <div className="pb-5">
              <p className="text-[11px] font-medium text-accent uppercase tracking-wide">{time}</p>
              <p className="text-sm font-semibold text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* PHONE-TODO: this card used to offer an Israeli WhatsApp button as the
          primary "talk right now" CTA. Replaced with honest email copy until
          a US callback line is provisioned (COMPANY_PHONE in
          src/lib/constants.ts). */}
      <div className="bg-muted rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Need to reach us in the meantime?</p>
          <p className="text-xs text-muted-foreground">A phone callback line is coming soon — for now please email us.</p>
        </div>
        <a
          href={`mailto:${COMPANY_EMAIL}`}
          aria-label={`Email ${COMPANY_EMAIL}`}
          className="shrink-0 inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/10 hover:text-accent transition-colors"
        >
          {COMPANY_EMAIL}
        </a>
      </div>

      {onReset && (
        <button onClick={onReset} className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors text-center">
          {resetLabel}
        </button>
      )}
    </div>
  );
}
