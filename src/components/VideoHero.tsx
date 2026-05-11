import { useRef, useState, useEffect } from "react";

// FIXED: prefers-reduced-motion — video not rendered at all for motion-sensitive users.
// Falls back to poster image (zero video bytes downloaded).
// preload="metadata" instead of "auto" — avoids downloading full video upfront.

interface VideoHeroProps {
  title:      React.ReactNode;
  subtitle?:  string;
  videoSrc?:  string;
  posterSrc?: string;
}

const SHOW_INTERNAL_PAGES_VIDEO = true;

const VideoHero = ({ title, subtitle, videoSrc = "/videos/hero-bg.mp4", posterSrc }: VideoHeroProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [reducedMotion] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => {
      if (mq.matches) videoRef.current?.pause();
      else if (SHOW_INTERNAL_PAGES_VIDEO) videoRef.current?.play().catch(() => {});
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const showVideo = SHOW_INTERNAL_PAGES_VIDEO && !videoFailed && !reducedMotion;

  return (
    <section className="relative h-[340px] md:h-[400px] flex items-center justify-center overflow-hidden bg-primary">
      {showVideo ? (
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover"
          autoPlay muted loop playsInline preload="metadata" poster={posterSrc} onError={() => setVideoFailed(true)}>
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : posterSrc ? (
        <img src={posterSrc} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
      ) : null}
      {(showVideo || posterSrc) && <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-extrabold text-primary-foreground">{title}</h1>
        {subtitle && <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto">{subtitle}</p>}
      </div>
    </section>
  );
};

export default VideoHero;
