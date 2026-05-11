import teamHeroImg from "@/assets/services/team-hero.jpg";

interface ImageHeroProps {
  title: React.ReactNode;
  subtitle?: string;
  imageSrc?: string;
}

const ImageHero = ({ title, subtitle, imageSrc }: ImageHeroProps) => {
  const src = imageSrc || teamHeroImg;

  return (
    <section className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] flex items-end justify-center overflow-hidden bg-primary pb-6">
      <img
        src={src}
        alt="Professional construction team working together"
        className="absolute inset-0 w-full h-full object-cover object-top scale-[1.03] transition-transform duration-700"
        width={1920}
        height={768}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="font-display text-5xl md:text-6xl font-extrabold tracking-tight text-primary-foreground drop-shadow-lg">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 text-lg md:text-xl text-primary-foreground/90 max-w-xl mx-auto drop-shadow">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
};

export default ImageHero;
