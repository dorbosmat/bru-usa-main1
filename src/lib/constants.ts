import cardRoofing from "@/assets/services/roof-repair.jpg";
import cardKitchen from "@/assets/services/card-kitchen.jpg";
import cardFlooring from "@/assets/services/card-flooring.jpg";
import cardPainting from "@/assets/services/card-painting.jpg";
import cardConcrete from "@/assets/services/card-concrete.jpg";
import cardWindowsDoors from "@/assets/services/card-windows-doors.jpg";
import cardGeneralRemodeling from "@/assets/services/card-general-remodeling.jpg";

export const SERVICES = [
  {
    slug: "roofing",
    title: "Roofing",
    shortDesc: "Roof repair, replacement & new installations for lasting protection.",
    description: "From minor repairs to complete roof replacements, our certified roofing team delivers durable, weather-resistant solutions using top-grade materials. We handle asphalt shingles, metal roofing, flat roofs, and more — backed by industry-leading warranties.",
    icon: "🏠",
    image: cardRoofing,
    features: ["Roof Inspections & Repair", "Full Roof Replacement", "Storm Damage Restoration", "Metal & Shingle Options", "Warranty-Backed Materials"],
  },
  {
    slug: "kitchen-bath-remodel",
    title: "Kitchen & Bath Remodel",
    shortDesc: "Transform your kitchen and bathrooms into stunning, functional spaces.",
    description: "Upgrade your home's most-used rooms with custom cabinetry, premium countertops, modern fixtures, and expert tile work. Our designers and craftsmen work together to bring your vision to life — on time and on budget.",
    icon: "🍳",
    image: cardKitchen,
    features: ["Custom Cabinetry", "Countertop Installation", "Tile & Backsplash", "Plumbing & Fixtures", "Full Layout Design"],
  },
  {
    slug: "flooring",
    title: "Flooring",
    shortDesc: "Hardwood, tile, LVP and more — expertly installed.",
    description: "Whether you prefer the warmth of hardwood, the durability of luxury vinyl plank, or the elegance of natural stone tile, our flooring experts ensure a flawless installation that transforms any room.",
    icon: "🪵",
    image: cardFlooring,
    features: ["Hardwood & Engineered Wood", "Luxury Vinyl Plank (LVP)", "Tile & Natural Stone", "Carpet Installation", "Subfloor Prep & Repair"],
  },
  {
    slug: "painting",
    title: "Painting",
    shortDesc: "Interior & exterior painting with premium finishes.",
    description: "A fresh coat of paint is the fastest way to transform your home. We deliver clean, professional results with premium paints that stand up to the elements — inside and out.",
    icon: "🎨",
    image: cardPainting,
    features: ["Interior Painting", "Exterior Painting", "Cabinet Refinishing", "Deck & Fence Staining", "Color Consultation"],
  },
  {
    slug: "concrete-driveway",
    title: "Concrete & Driveway",
    shortDesc: "Driveways, patios, walkways and flatwork built to last.",
    description: "Our concrete specialists handle everything from new driveway pours to decorative stamped patios. We focus on proper grading, reinforcement, and finishing for surfaces that look great and last for decades.",
    icon: "🛤️",
    image: cardConcrete,
    features: ["Driveway Installation & Repair", "Stamped & Decorative Concrete", "Patio & Walkway Construction", "Foundation Work", "Retaining Walls"],
  },
  {
    slug: "windows-doors",
    title: "Windows & Doors",
    shortDesc: "Energy-efficient windows and doors, professionally installed.",
    description: "Boost your home's curb appeal, security, and energy efficiency with expertly installed windows and doors. We carry top brands and handle every step — from measurement to final trim.",
    icon: "🪟",
    image: cardWindowsDoors,
    features: ["Window Replacement", "Entry & Patio Doors", "Sliding & French Doors", "Energy-Efficient Options", "Custom Trim & Finishing"],
  },
  {
    slug: "general-remodeling",
    title: "General Remodeling",
    shortDesc: "Full-home renovations tailored to your lifestyle.",
    description: "From basement finishing to whole-home renovations, our general remodeling services cover every aspect of transforming your space. We manage permits, subcontractors, and timelines so you don't have to.",
    icon: "🔨",
    image: cardGeneralRemodeling,
    features: ["Basement Finishing", "Room Additions", "Open-Concept Conversions", "Structural Modifications", "Permit Management"],
  },
];
// PHONE-TODO: the previous value was the fictional Hollywood placeholder
// "(555) 123-4567". It is now an empty string until a real US callback line
// is provisioned (OpenPhone / Twilio). Every consumer that interpolates
// COMPANY_PHONE MUST guard against the empty string and fall back to honest
// copy ("Callback line coming soon" / "Use the contact form when it reopens"
// / "Email support@buildright-usa.com"). When you fill this in, also update
// CALLBACK_PHONE_E164 / CALLBACK_PHONE_DISPLAY in src/lib/lead-submission-gate.ts.
export const COMPANY_PHONE = "";
export const COMPANY_EMAIL = "info@buildright-usa.com";
export const COMPANY_ADDRESS = "11401 NW 12th St, Miami, FL 33172";

// ── Lead Notification Email Config ──
// Edit these addresses to change where lead notifications are sent.
export const LEAD_EMAIL_CONFIG = {
  primary: "estimate@buildright-usa.com",
  cc: ["info@buildright-usa.com", "support@buildright-usa.com"],
  fromName: "Build Right USA Leads",
  fromEmail: "leads@buildright-usa.com",
  subjectTemplate: (service: string, location: string) =>
    `New Lead – ${service} – ${location}`,
};

// FLORIDA-FIRST-TODO: this list is the authoritative service-area registry.
// Build Right USA is currently Florida-first (Tampa + statewide Florida)
// with selected California metros (LA, San Jose, SF Bay) as the early
// expansion footprint. When adding a new metro:
//   1. Make sure at least one independent licensed contractor in that ZIP
//      cluster is onboarded with a signed referral agreement.
//   2. Update the Florida-first eyebrow chips (Index.tsx, Services.tsx,
//      Contact.tsx) and the i18n servingTitle/servingHighlight keys if the
//      footprint description changes.
//   3. NEVER use the word "nationwide" / "national" / "all 50 states" in
//      hero copy until contractor supply actually covers the country —
//      Task 8 stripped those claims everywhere and they must not return.
export const SERVICE_AREAS = [
  {
    slug: "tampa",
    name: "Tampa, FL",
    city: "Tampa",
    state: "Florida",
    heroHeadline: "Tampa's Trusted Home Improvement Experts",
    heroSub: "Hurricane-tough roofing, impact windows, and outdoor living — built for Florida's climate and your lifestyle.",
    topServices: ["roofing", "windows-doors", "concrete-driveway", "painting"],
    serviceNotes: {
      "roofing": "Storm-rated roofing that protects your home year-round.",
      "windows-doors": "Impact-rated windows & doors for hurricane season.",
      "concrete-driveway": "Heat-resistant driveways, patios & pool decks.",
      "painting": "UV-resistant exterior painting that lasts in Florida sun.",
    },
  },
  {
    slug: "florida",
    name: "Florida (Statewide)",
    city: "Florida",
    state: "Florida",
    heroHeadline: "Florida's Full-Service Construction Partner",
    heroSub: "From the Panhandle to the Keys — roofing, windows, concrete & remodeling built for the Sunshine State.",
    topServices: ["roofing", "windows-doors", "concrete-driveway", "general-remodeling"],
    serviceNotes: {
      "roofing": "Code-compliant roofing for every Florida county.",
      "windows-doors": "Energy-efficient & impact-rated options statewide.",
      "concrete-driveway": "Durable flatwork for Florida's sandy soils.",
      "general-remodeling": "Whole-home renovations tailored to Florida living.",
    },
  },
  {
    slug: "los-angeles",
    name: "Los Angeles, CA",
    city: "Los Angeles",
    state: "California",
    heroHeadline: "Los Angeles Home Renovation Specialists",
    heroSub: "Kitchen & bath upgrades, modern flooring, and full remodels — designed for SoCal style and resale value.",
    topServices: ["kitchen-bath-remodel", "flooring", "windows-doors", "general-remodeling"],
    serviceNotes: {
      "kitchen-bath-remodel": "Modern kitchens & spa bathrooms that boost home value.",
      "flooring": "Luxury vinyl, hardwood & tile for LA's indoor-outdoor lifestyle.",
      "windows-doors": "Energy-efficient upgrades that cut cooling costs.",
      "general-remodeling": "Open-concept conversions & ADU-ready renovations.",
    },
  },
  {
    slug: "san-jose",
    name: "San Jose, CA",
    city: "San Jose",
    state: "California",
    heroHeadline: "San Jose's Premier Construction Company",
    heroSub: "High-ROI remodels for Silicon Valley homeowners — kitchens, baths, flooring & ADU-ready projects.",
    topServices: ["kitchen-bath-remodel", "flooring", "general-remodeling", "windows-doors"],
    serviceNotes: {
      "kitchen-bath-remodel": "Premium finishes that match Silicon Valley standards.",
      "flooring": "Engineered hardwood & LVP for busy family homes.",
      "general-remodeling": "Garage conversions, ADU prep & room additions.",
      "windows-doors": "Dual-pane upgrades for year-round comfort.",
    },
  },
  {
    slug: "san-francisco",
    name: "San Francisco, CA (Bay Area)",
    city: "San Francisco",
    state: "California",
    heroHeadline: "Bay Area Home Improvement, Done Right",
    heroSub: "Precision remodeling for SF's unique homes — Victorian updates, modern kitchens, and full renovations.",
    topServices: ["general-remodeling", "kitchen-bath-remodel", "painting", "windows-doors"],
    serviceNotes: {
      "general-remodeling": "Victorian & Edwardian renovations with modern upgrades.",
      "kitchen-bath-remodel": "Space-maximizing designs for SF's compact layouts.",
      "painting": "Period-accurate exteriors & fresh modern interiors.",
      "windows-doors": "Noise-reducing & energy-efficient window replacements.",
    },
  },
];
