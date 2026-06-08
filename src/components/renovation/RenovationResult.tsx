import { useEffect, useRef } from "react";
import BeforeAfterSlider from "./BeforeAfterSlider";
import PriceEstimate from "./PriceEstimate";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowLeft, Sparkles, Hourglass } from "lucide-react";
import { Link } from "react-router-dom";
import { trackFunnelStep } from "@/lib/analytics";

interface RenovationResultProps {
    beforeImage: string;
    afterImage: string;
    projectType: string;
    style: string;
    onReset: () => void;
}

const RenovationResult = ({ beforeImage, afterImage, projectType, style, onReset }: RenovationResultProps) => {
    const hasAfter = !!(afterImage && afterImage.length > 0);

    // T1 analytics: fire reveal_viewed once when a real before/after appears,
    // and slider_interacted at most once per result.
    const revealTrackedRef = useRef(false);
    const sliderTrackedRef = useRef(false);

    useEffect(() => {
          if (hasAfter && !revealTrackedRef.current) {
                revealTrackedRef.current = true;
                trackFunnelStep("reveal_viewed", { project_type: projectType || "", style: style || "" });
          }
    }, [hasAfter, projectType, style]);

    const handleSliderInteract = () => {
          if (sliderTrackedRef.current) return;
          sliderTrackedRef.current = true;
          trackFunnelStep("slider_interacted");
    };

    return (
          <div className="space-y-6 md:space-y-8 animate-fade-in">
                <button onClick={onReset} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft size={16} /> Start Over
                </button>
          
                <div className="text-center space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium">
                                  <Sparkles size={14} />
                          {hasAfter ? "Your Preview Is Ready" : "Preview In Progress"}
                        </div>
                        <h2 className="font-display text-xl md:text-3xl font-bold text-foreground">
                          {hasAfter ? "Your Renovation Preview" : "Thanks! Your request is in."}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {hasAfter ? "Drag the slider to compare before & after" : "Our team will reach out shortly with your personalized renovation preview and quote."}
                        </p>
                </div>
          
            {hasAfter ? (
                    <div onPointerDown={handleSliderInteract}>
                      <BeforeAfterSlider beforeSrc={beforeImage} afterSrc={afterImage} />
                    </div>
                  ) : (
                    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-border shadow-lg">
                      {beforeImage && (
                                  <img src={beforeImage} alt="Your space" className="absolute inset-0 w-full h-full object-cover" />
                                )}
                              <div className="absolute inset-0 bg-foreground/55 flex flex-col items-center justify-center text-background text-center p-6 space-y-3">
                                          <Hourglass size={36} className="animate-pulse" />
                                          <p className="font-display text-lg font-semibold">Generating your preview…</p>
                                          <p className="text-sm max-w-xs opacity-90">
                                                        A licensed contractor will contact you shortly with personalized recommendations and a detailed quote.
                                          </p>
                              </div>
                    </div>
                )}
          
                <PriceEstimate projectType={projectType} style={style} />
          
                <div className="bg-card rounded-xl border border-border p-4 md:p-6 space-y-4">
                        <h3 className="font-display font-bold text-foreground text-center text-base md:text-lg">
                                  Want a real quote for this renovation?
                        </h3>
                        {/* T2: one dominant primary CTA; secondary contact options
                            collapsed into a single demoted text link. */}
                        <Link to="/get-a-quote" className="block" onClick={() => trackFunnelStep("cta_tap", { label: "get_exact_quote" })}>
                                  <Button variant="cta" className="w-full gap-2" size="lg">
                                              <MessageSquare size={16} />
                                              Get Exact Quote
                                  </Button>
                        </Link>
                        <p className="text-center text-sm text-muted-foreground">
                                  Prefer to talk first?{" "}
                                  <Link
                                              to="/contact"
                                              className="font-medium text-accent hover:underline"
                                              onClick={() => trackFunnelStep("cta_tap", { label: "speak_with_specialist" })}
                                  >
                                              Speak with a specialist
                                  </Link>
                        </p>
                </div>
          </div>
        );
};

export default RenovationResult;
