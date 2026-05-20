import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/i18n/LanguageContext";

// Feature flags
const PHOTOS_V1 = true;
const GALLERY_CTA_LINE_V1 = true;
const PHOTOS_DEBUG = false;

const CATEGORY_TABS = ["All", "Roofing", "Solar", "Windows & Doors", "Remodel"];

interface Photo {
  id: string;
  url: string;
  storage_path: string | null;
  service_category: string;
  location_tag: string;
}

// Stock placeholders when no approved photos exist
const STOCK_PLACEHOLDERS: Photo[] = [
  { id: "stock-0", url: "/placeholder.svg", storage_path: null, service_category: "Roofing", location_tag: "Tampa FL" },
  { id: "stock-1", url: "/placeholder.svg", storage_path: null, service_category: "Solar", location_tag: "Florida" },
  { id: "stock-2", url: "/placeholder.svg", storage_path: null, service_category: "Remodel", location_tag: "Los Angeles CA" },
  { id: "stock-3", url: "/placeholder.svg", storage_path: null, service_category: "Roofing", location_tag: "San Jose CA" },
  { id: "stock-4", url: "/placeholder.svg", storage_path: null, service_category: "Windows & Doors", location_tag: "San Francisco CA" },
  { id: "stock-5", url: "/placeholder.svg", storage_path: null, service_category: "Solar", location_tag: "Tampa FL" },
];

function resolvePhotoUrl(photo: Photo): string {
  if (photo.storage_path) {
    const { data } = supabase.storage.from("photos").getPublicUrl(photo.storage_path);
    return data.publicUrl;
  }
  if (photo.url) return photo.url;
  return "/placeholder.svg";
}
function DebugOverlay({ src, imgRef }: { src: string; imgRef: React.RefObject<HTMLImageElement> }) {
  const [status, setStatus] = useState<string>("loading...");
  const [dims, setDims] = useState<string>("");

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    const onLoad = () => {
      setStatus("✅ loaded OK");
      setDims(`${img.naturalWidth}x${img.naturalHeight}`);
    };
    const onError = () => {
      setStatus("❌ onError");
      setDims("n/a");
    };
    if (img.complete && img.naturalWidth > 0) {
      onLoad();
    } else {
      img.addEventListener("load", onLoad);
      img.addEventListener("error", onError);
      return () => {
        img.removeEventListener("load", onLoad);
        img.removeEventListener("error", onError);
      };
    }
  }, [imgRef, src]);

  return (
    <div className="absolute top-0 left-0 right-0 bg-black/80 text-[9px] text-green-400 p-1 z-20 font-mono break-all leading-tight">
      <div>{status} {dims}</div>
      <div className="text-yellow-300 mt-0.5">{src}</div>
    </div>
  );
}

const Lightbox = ({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 backdrop-blur-sm p-4" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-background/80 text-foreground hover:bg-background transition-colors z-10" aria-label="Close">
        <X size={24} />
      </button>
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-[90vh] rounded-xl object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

const GalleryImage = ({ photo, isAdmin, onTap }: { photo: Photo; isAdmin: boolean; onTap: (url: string, alt: string) => void }) => {
  const imgUrl = resolvePhotoUrl(photo);
  const imgRef = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);
  const alt = `${photo.service_category} project in ${photo.location_tag}`;

  return (
    <div
      className="group relative aspect-[4/3] rounded-lg overflow-hidden shadow-sm border border-border bg-muted cursor-pointer"
      onClick={() => !failed && onTap(imgUrl, alt)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && !failed && onTap(imgUrl, alt)}
    >
      {PHOTOS_DEBUG && isAdmin && <DebugOverlay src={imgUrl} imgRef={imgRef} />}
      {!failed ? (
        <img
          ref={imgRef}
          src={imgUrl}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          decoding="async"
          width={800}
          height={600}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground text-xs">
          Image failed to load
        </div>
      )}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-foreground/70 to-transparent p-3">
        <div className="flex items-center gap-1 text-primary-foreground text-xs">
          <MapPin className="h-3 w-3" />
          <span>{photo.location_tag}</span>
          <span className="mx-1">·</span>
          <span>{photo.service_category}</span>
        </div>
      </div>
    </div>
  );
};

export default function ProjectGallery() {
  let isAdmin = false;
  try {
    const auth = useAuth();
    isAdmin = auth.isAdmin;
  } catch { /* not in auth provider */ }
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  const openLightbox = useCallback((src: string, alt: string) => setLightbox({ src, alt }), []);

  useEffect(() => {
    if (!PHOTOS_V1) { setLoading(false); return; }
    supabase
      .from("photos")
      .select("id, url, storage_path, service_category, location_tag")
      .eq("approved", true)
      .order("quality_score", { ascending: false })
      .limit(12)
      .then(({ data, error }) => {
        if (error) console.error("[Gallery] fetch error:", error);
        
        setPhotos((data as Photo[]) || []);
        setLoading(false);
      });
  }, []);

  if (!PHOTOS_V1) return null;

  const displayPhotos = photos.length > 0 ? photos : STOCK_PLACEHOLDERS;

  const availableCategories = new Set(displayPhotos.map(p => p.service_category));
  const visibleTabs = CATEGORY_TABS.filter(t => t === "All" || availableCategories.has(t));

  const filtered = activeTab === "All"
    ? displayPhotos
    : displayPhotos.filter(p => p.service_category === activeTab);

  const { t } = useLanguage();

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {GALLERY_CTA_LINE_V1 && (
          <p className="text-center text-sm md:text-base text-muted-foreground mb-3 max-w-2xl mx-auto leading-relaxed">
            {t.galleryTitle} {t.galleryHighlight} —{" "}
            <Link to="/get-a-quote" className="font-semibold text-accent hover:underline">
              {t.galleryCta}
            </Link>.
          </p>
        )}

        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            {t.galleryTitle} <span className="text-accent">{t.galleryHighlight}</span>
          </h2>
        </div>

        {visibleTabs.length > 2 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {visibleTabs.map(tab => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab(tab)}
                className="text-xs"
              >
                {tab}
              </Button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">{t.galleryLoading}</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.slice(0, 12).map((photo) => (
              <GalleryImage key={photo.id} photo={photo} isAdmin={isAdmin} onTap={openLightbox} />
            ))}
          </div>
        )}

        {lightbox && <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />}
      </div>
    </section>
  );
}
