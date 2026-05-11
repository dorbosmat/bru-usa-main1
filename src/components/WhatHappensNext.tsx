import { CheckCircle, Phone, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY_PHONE } from "@/lib/constants";

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

      <div className="bg-muted rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Need to talk right now?</p>
          <p className="text-xs text-muted-foreground">Our team is available Mon–Sat 8am–7pm ET</p>
        </div>
        <Button asChild variant="outline" size="sm" className="gap-2 shrink-0">
          <a href="https://wa.me/972503721520?text=Hi%2C%20I%20saw%20your%20website%20and%20want%20a%20quote" target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp" title="Chat with us on WhatsApp"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.1.55 4.15 1.6 5.96L2 22l4.25-1.11a9.9 9.9 0 0 0 5.79 1.85h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.83 9.83 0 0 0 12.04 2zm5.81 14.13c-.25.69-1.41 1.32-1.97 1.41-.5.07-1.13.1-1.83-.12-.42-.13-.96-.31-1.66-.61-2.92-1.26-4.83-4.2-4.97-4.39-.15-.19-1.19-1.58-1.19-3.01 0-1.43.75-2.13 1.02-2.42.27-.29.59-.36.79-.36h.57c.18 0 .43-.07.67.51.25.6.84 2.07.91 2.22.07.15.12.32.02.51-.1.19-.15.31-.3.48-.15.17-.31.38-.45.51-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.03 1.12 1 2.07 1.31 2.36 1.46.29.15.46.12.63-.07.17-.19.72-.84.91-1.13.19-.29.39-.24.65-.15.27.1 1.71.81 2 .96.29.15.49.22.56.34.07.13.07.74-.18 1.43z"/></svg></a>
        </Button>
      </div>

      {onReset && (
        <button onClick={onReset} className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors text-center">
          {resetLabel}
        </button>
      )}
    </div>
  );
}
