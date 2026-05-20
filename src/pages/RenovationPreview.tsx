import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import PhotoUpload from "@/components/renovation/PhotoUpload";
import ProjectConfig from "@/components/renovation/ProjectConfig";
import LeadCaptureForm from "@/components/renovation/LeadCaptureForm";
import RenovationResult from "@/components/renovation/RenovationResult";
import { toast } from "@/hooks/use-toast";
import { generateRenovation } from "@/services/renovation";
import { Loader2, Sparkles } from "lucide-react";
import aiBg from "@/assets/ai-preview/ai-preview-bg.jpg";

// FLOW: upload → configure → capture (lead + personalization) → generating → result
// Personalization fields are collected alongside lead info, then passed to generateRenovation.

type Step = "upload" | "configure" | "capture" | "generating" | "result";

const scanBeamCss = `
  @keyframes ai-section-scan {
    0%   { transform: translateX(-120%) rotate(-3deg); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 1; }
    100% { transform: translateX(220%) rotate(-3deg); opacity: 0; }
  }
  @keyframes ai-section-scan-core {
    0%   { transform: translateX(-120%) rotate(-3deg); opacity: 0; }
    15%  { opacity: 1; }
    85%  { opacity: 1; }
    100% { transform: translateX(220%) rotate(-3deg); opacity: 0; }
  }
  .ai-scan-beam {
    position: absolute; inset: 0; z-index: 1; pointer-events: none; overflow: hidden;
  }
  .ai-scan-beam::before {
    content: '';
    position: absolute; top: -20%; left: 0; width: 55%; height: 140%;
    background: linear-gradient(105deg, transparent 30%, rgba(234,179,8,0.07) 50%, transparent 70%);
    animation: ai-section-scan 7s ease-in-out infinite;
    filter: blur(28px);
  }
  .ai-scan-beam::after {
    content: '';
    position: absolute; top: 0; left: 0; width: 22%; height: 100%;
    background: linear-gradient(105deg, transparent 20%, rgba(234,179,8,0.18) 50%, transparent 80%);
    animation: ai-section-scan-core 7s ease-in-out infinite;
    filter: blur(10px);
  }
  @media (max-width: 640px) {
    .ai-scan-beam::before { filter: blur(20px); width: 70%; }
    .ai-scan-beam::after  { filter: blur(8px);  width: 35%; }
  }
  @media (prefers-reduced-motion: reduce) {
    .ai-scan-beam::before, .ai-scan-beam::after { animation: none; opacity: 0; }
  }
`;

const RenovationPreview = () => {
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [projectType, setProjectType] = useState("");
  const [style, setStyle] = useState("");
  const [afterImage, setAfterImage] = useState("");
  const sectionRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePhotoSelected = (f: File, preview: string) => {
    setFile(f);
    setPreviewUrl(preview);
    setStep("configure");
    setTimeout(scrollToTop, 100);
  };

  const handleConfigureDone = () => {
    if (!file) return;
    // projectType already set via onProjectTypeChange
    // style already set via onStyleChange
    setStep("capture");
    setTimeout(scrollToTop, 100);
  };

  const handleLeadCaptured = async (
    budget: string,
    region: string,
    clientType: string,
    personalRequest: string
  ) => {
    if (!file) return;
    setStep("generating");
    setTimeout(scrollToTop, 100);
    try {
      const result = await generateRenovation(
        { imageFile: file, projectType, style, budget, region, clientType, personalRequest },
        (status) => console.log("Progress:", status)
      );
      setAfterImage(result.imageUrl);
      setStep("result");
      setTimeout(scrollToTop, 100);
    } catch (err: any) {
      console.error("Generation error:", err);
      toast({
        title: "Generation failed",
        description: err?.message ?? "Please try again.",
        variant: "destructive",
      });
      setStep("capture");
    }
  };

  const handleReset = () => {
    setStep("upload");
    setFile(null);
    setPreviewUrl("");
    setProjectType("");
    setStyle("");
    setAfterImage("");
    setTimeout(scrollToTop, 100);
  };

  const showBg = step === "upload" || step === "configure";

  const stepLabels = [
    { key: "upload",    label: "Upload"    },
    { key: "configure", label: "Customize" },
    { key: "preview",   label: "Preview"   },
    { key: "quote",     label: "Get Quote" },
  ];

  const stepIndexMap: Record<Step, number> = {
    upload:     0,
    configure:  1,
    capture:    2,
    generating: 2,
    result:     3,
  };

  const activeIdx = stepIndexMap[step];

  return (
    <Layout>
      <Helmet>
        <title>AI Renovation Preview | Build Right USA</title>
        <meta name="description" content="Upload a photo of your space and see an AI-generated renovation preview — a free planning tool from Build Right USA. Illustrative only; not a guarantee of final build, materials, cost, or scope." />
        <link rel="canonical" href="https://www.buildright-usa.com/renovation-preview" />
        <style>{scanBeamCss}</style>
      </Helmet>

      <section ref={sectionRef} className="relative py-6 md:py-12 min-h-[60vh] overflow-hidden">
        {showBg && (
          <div className="absolute inset-0 -z-10">
            <img src={aiBg} alt="" aria-hidden="true" className="w-full h-full object-cover object-center" width={1920} height={1080} />
            <div className="absolute inset-0 -z-10 bg-background/75 backdrop-blur-[2px]" />
          </div>
        )}
        <div className="ai-scan-beam" aria-hidden="true" />

        {/* Full-section AI scanner — visible accent scanning band sweeping
            top→bottom every 8s. Sits behind content (z-0), reuses the
            hologram-line keyframe. Pointer-events-none + aria-hidden. */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden z-0"
          aria-hidden="true"
        >
          <div className="absolute inset-x-0 h-full motion-safe:animate-[hologram-line_8s_ease-in-out_infinite]">
            {/* Visible 3px scanning band — bright core with two-stop halo glow */}
            <div
              className="absolute inset-x-0 top-0 h-[3px]"
              style={{
                background:
                  "linear-gradient(90deg, transparent 4%, hsl(var(--accent) / 0.95) 50%, transparent 96%)",
                boxShadow:
                  "0 0 28px 4px hsl(var(--accent) / 0.55), 0 0 64px 12px hsl(var(--accent) / 0.22)",
              }}
            />
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-3xl relative z-10">
          {/* AI-DISCLOSURE-TODO: page-level banner so the AI nature of every
              generated image is visible above the flow itself. */}
          <div
            className="mx-auto mb-5 max-w-xl rounded-full bg-accent/10 ring-1 ring-accent/25 px-3 py-1.5 text-center"
            role="note"
            aria-label="AI disclosure"
          >
            <p className="text-[11px] sm:text-xs font-medium text-foreground">
              <span className="font-bold text-accent">AI-Generated:</span> Images and copy on this page are produced by AI for inspiration only — not a guarantee of final build, materials, cost, or scope.
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-6 md:mb-10">
            {stepLabels.map(({ key, label }, idx) => {
              const isActive = idx === activeIdx;
              const isPast = idx < activeIdx;
              return (
                <div key={key} className="flex items-center gap-1.5 sm:gap-2">
                  {idx > 0 && (
                    <div className={`w-5 sm:w-8 h-px ${isPast || isActive ? "bg-accent" : "bg-border"}`} />
                  )}
                  <div className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium transition-all ${
                    isActive ? "bg-accent text-accent-foreground"
                    : isPast  ? "bg-accent/20 text-accent"
                    : "bg-muted text-muted-foreground"
                  }`}>
                    <span>{idx + 1}</span>
                    <span className="hidden sm:inline">{label}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {step === "upload" && (
            <PhotoUpload onPhotoSelected={handlePhotoSelected} />
          )}

          {step === "configure" && (
            <ProjectConfig
              previewUrl={previewUrl}
              projectType={projectType}
              style={style}
              onProjectTypeChange={setProjectType}
              onStyleChange={setStyle}
              onBack={() => { setStep("upload"); setTimeout(scrollToTop, 100); }}
              onGenerate={handleConfigureDone}
              generating={false}
            />
          )}

          {step === "capture" && (
            <LeadCaptureForm
              previewUrl={previewUrl}
              projectType={projectType}
              style={style}
              onBack={() => { setStep("configure"); setTimeout(scrollToTop, 100); }}
              onLeadCaptured={handleLeadCaptured}
            />
          )}

          {step === "generating" && (
            <div className="flex flex-col items-center justify-center py-12 md:py-20 space-y-5 text-center">
              <div className="relative">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-accent/10 flex items-center justify-center">
                  <Loader2 size={32} className="text-accent animate-spin" />
                </div>
                <Sparkles size={16} className="absolute -top-1 -right-1 text-accent animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <h2 className="font-display text-lg md:text-xl font-bold text-foreground">
                  Creating your renovation preview…
                </h2>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Our AI is analyzing your space. This usually takes 15–30 seconds.
                </p>
              </div>
              <div className="w-full max-w-xs">
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-accent animate-pulse" style={{ width: "60%" }} />
                </div>
              </div>
            </div>
          )}

          {step === "result" && (
            <RenovationResult
              beforeImage={previewUrl}
              afterImage={afterImage}
              projectType={projectType}
              style={style}
              onReset={handleReset}
            />
          )}
        </div>
      </section>
    </Layout>
  );
};

export default RenovationPreview;
