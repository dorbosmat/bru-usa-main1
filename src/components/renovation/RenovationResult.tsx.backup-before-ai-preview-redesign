import BeforeAfterSlider from "./BeforeAfterSlider";
import PriceEstimate from "./PriceEstimate";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, CalendarCheck, ArrowLeft, Sparkles, Hourglass } from "lucide-react";
import { Link } from "react-router-dom";

interface RenovationResultProps {
    beforeImage: string;
    afterImage: string;
    projectType: string;
    style: string;
    onReset: () => void;
}

const RenovationResult = ({ beforeImage, afterImage, projectType, style, onReset }: RenovationResultProps) => {
    const hasAfter = !!(afterImage && afterImage.length > 0);

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
                    <BeforeAfterSlider beforeSrc={beforeImage} afterSrc={afterImage} />
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
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                  <Link to="/get-a-quote" className="block">
                                              <Button variant="cta" className="w-full gap-2" size="lg">
                                                            <MessageSquare size={16} />
                                                            Get Exact Quote
                                              </Button>
                                  </Link>
                                  <Link to="/contact" className="block">
                                              <Button variant="outline" className="w-full gap-2" size="lg">
                                                            <Phone size={16} />
                                                            Speak With Specialist
                                              </Button>
                                  </Link>
                                  <Link to="/contact" className="block">
                                              <Button variant="outline" className="w-full gap-2" size="lg">
                                                            <CalendarCheck size={16} />
                                                            Book a Callback
                                              </Button>
                                  </Link>
                        </div>
                </div>
          </div>
        );
};

export default RenovationResult;
