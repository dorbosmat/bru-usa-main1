import { Helmet } from "react-helmet-async";

// ─────────────────────────────────────────────────────────────────────────────
// SeoHead (Sprint Task 10)
//
// Single reusable per-route SEO block. Every public page mounts this with a
// unique title + description + path; SeoHead renders the appropriate
// <title>, <meta description>, canonical link, OpenGraph tags, Twitter card,
// and (when requested) a noindex meta. The site-wide defaults live in
// index.html and act as fallbacks before React mounts.
//
// Usage:
//   <SeoHead
//     title="About Build Right USA"
//     description="Florida-first contractor referral service ..."
//     path="/about"
//   />
//
// For regulatory pages (SMS Consent, CCPA, Data Rights, Cookie Policy):
//   <SeoHead title="..." description="..." path="/sms-consent" noindex />
//
// SEO-TODO: when /og.png ships in public/, the default OG image below
// resolves and social cards render correctly. Until then social cards
// fall back to whatever the platform infers from the page title.
// ─────────────────────────────────────────────────────────────────────────────

const HOST = "https://www.buildright-usa.com";
const DEFAULT_OG_IMAGE = `${HOST}/og.png`;
const DEFAULT_OG_IMAGE_W = "1200";
const DEFAULT_OG_IMAGE_H = "630";

interface SeoHeadProps {
  /** Page title — appears in browser tab + Google snippet. ~60 chars max. */
  title: string;
  /** Page description — meta description + OG/Twitter description. ~155 chars. */
  description: string;
  /** Path beginning with "/" (e.g. "/about"). Used to build canonical URL + og:url. */
  path: string;
  /** Override the OG image (defaults to /og.png). */
  ogImage?: string;
  /** Force noindex,nofollow — for regulatory pages and the NotFound page. */
  noindex?: boolean;
  /** Optional override for og:type (defaults to "website"). */
  ogType?: "website" | "article";
}

export default function SeoHead({
  title,
  description,
  path,
  ogImage = DEFAULT_OG_IMAGE,
  noindex = false,
  ogType = "website",
}: SeoHeadProps) {
  const url = `${HOST}${path}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Build Right USA" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content={DEFAULT_OG_IMAGE_W} />
      <meta property="og:image:height" content={DEFAULT_OG_IMAGE_H} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
