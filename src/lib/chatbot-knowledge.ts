/**
 * Chatbot Knowledge Base
 * Detailed service information, personality config, and conversation logic.
 */

// ─── Personality & System Prompt ───

export const CHATBOT_PERSONALITY = {
  name: "Build Right USA Assistant",
  tone: "friendly, confident, helpful — like a knowledgeable neighbor who happens to be a contractor",
  rules: [
    "Keep answers short and clear — 2-3 sentences max unless asked for detail",
    "Sound like a real person, not a robot",
    "Be slightly sales-oriented but never pushy",
    "Always guide toward requesting a free quote",
    "Use casual language but stay professional",
    "If unsure, offer to connect them with the team",
  ],
};

// ─── Service Knowledge Base ───

export interface ServiceKnowledge {
  keywords: string[];
  title: string;
  includes: string[];
  timeline: string;
  priceRange: string;
  whenNeeded: string[];
  commonProblems: string[];
  quickAnswer: string;
}

export const SERVICE_KNOWLEDGE: Record<string, ServiceKnowledge> = {
  roofing: {
    keywords: ["roof", "roofing", "shingle", "leak", "gutter", "attic", "ceiling stain", "missing shingles"],
    title: "Roofing",
    includes: [
      "Full roof replacement (asphalt, metal, tile, flat)",
      "Roof repairs & patching",
      "Leak detection & waterproofing",
      "Storm damage assessment & insurance support",
      "Gutter installation & repair",
      "Roof inspections",
    ],
    timeline: "Minor repairs: 1–2 days. Full replacement: 3–7 days depending on size.",
    priceRange: "$5,000–$15,000 for repairs; $8,000–$25,000+ for full replacement.",
    whenNeeded: [
      "Your roof is 15–25+ years old",
      "You see missing, curling, or cracked shingles",
      "There are water stains on ceilings or walls",
      "After a major storm (hail, wind, hurricanes)",
      "Your energy bills are spiking (poor insulation)",
    ],
    commonProblems: [
      "Leaks around flashing and vents",
      "Storm damage from hail or wind",
      "Sagging roof deck",
      "Mold or rot in the attic",
      "Clogged or damaged gutters causing water backup",
    ],
    quickAnswer:
      "We handle everything from small leak repairs to full roof replacements. Most repairs take 1–2 days, and full replacements usually wrap up in under a week. We also help with insurance claims for storm damage. Want a free inspection? 🏠",
  },

  solar: {
    keywords: ["solar", "solar panel", "solar installation", "energy", "electric bill", "panels"],
    title: "Solar Installation",
    includes: [
      "Solar panel system design & installation",
      "Roof-mounted & ground-mounted options",
      "Battery storage solutions",
      "Net metering setup",
      "Permit handling & utility coordination",
      "System monitoring & maintenance",
    ],
    timeline: "Design & permits: 2–4 weeks. Installation: 1–3 days. Utility approval: 1–2 weeks.",
    priceRange: "$12,000–$30,000 before incentives. Federal tax credit can save 30%.",
    whenNeeded: [
      "Your electricity bill is over $150/month",
      "You want to increase home value",
      "You're planning to stay in your home 5+ years",
      "You want energy independence",
      "Your roof is in good condition and gets good sunlight",
    ],
    commonProblems: [
      "High electricity costs",
      "Outdated or inefficient electrical systems",
      "Concerns about power outages",
      "Not knowing about available tax credits & incentives",
    ],
    quickAnswer:
      "Solar is a smart investment — most homeowners save 40–70% on electricity. We handle everything from design to permits to install, usually done in a few days. Plus, the 30% federal tax credit makes it more affordable than you'd think! Want a free solar assessment? ☀️",
  },

  kitchen: {
    keywords: ["kitchen", "cabinet", "countertop", "backsplash", "kitchen remodel", "island", "appliance"],
    title: "Kitchen Remodeling",
    includes: [
      "Custom cabinetry & refacing",
      "Countertop installation (granite, quartz, marble)",
      "Backsplash & tile work",
      "Flooring replacement",
      "Plumbing & fixture upgrades",
      "Lighting & electrical",
      "Full layout redesign",
    ],
    timeline: "Minor updates: 1–2 weeks. Full remodel: 4–8 weeks.",
    priceRange: "$8,000–$15,000 for updates; $18,000–$50,000+ for full remodel.",
    whenNeeded: [
      "Cabinets are worn, damaged, or outdated",
      "Countertops are cracked or stained",
      "Layout doesn't work for your family",
      "You're preparing to sell your home",
      "Appliances are old and inefficient",
    ],
    commonProblems: [
      "Lack of counter space or storage",
      "Poor lighting",
      "Outdated appliances raising utility costs",
      "Water damage around sinks",
      "Worn-out flooring",
    ],
    quickAnswer:
      "Kitchen remodels are the #1 way to boost your home's value. Whether it's new countertops and cabinets or a full redesign, we work with you on a plan that fits your budget and timeline. Most kitchens take 4–8 weeks. Want to get a free design consultation? 🍳",
  },

  bathroom: {
    keywords: ["bathroom", "shower", "tub", "bathtub", "vanity", "toilet", "tile", "bath remodel"],
    title: "Bathroom Remodeling",
    includes: [
      "Shower & tub installation or conversion",
      "Vanity & countertop replacement",
      "Tile work (floor, walls, shower)",
      "Plumbing upgrades",
      "Lighting & ventilation",
      "Accessibility modifications (grab bars, walk-in showers)",
    ],
    timeline: "Small updates: 3–5 days. Full remodel: 2–4 weeks.",
    priceRange: "$6,000–$12,000 for updates; $15,000–$35,000+ for full remodel.",
    whenNeeded: [
      "Mold or mildew is growing",
      "Fixtures are leaking or outdated",
      "You want a tub-to-shower conversion",
      "Tile is cracked or grout is failing",
      "You need accessibility features",
    ],
    commonProblems: [
      "Mold and water damage behind walls",
      "Poor ventilation causing humidity issues",
      "Outdated plumbing causing low water pressure",
      "Cracked tiles and failing grout",
      "Small, inefficient layout",
    ],
    quickAnswer:
      "From quick fixture upgrades to full bathroom transformations, we've got you covered. Walk-in showers, custom tile, modern vanities — we do it all. Most bathrooms take 2–4 weeks. Ready for a fresh start? Let's get you a free estimate! 🚿",
  },

  storm: {
    keywords: ["storm", "hurricane", "hail", "wind damage", "flood", "insurance", "emergency", "tree", "fallen tree"],
    title: "Storm Damage Restoration",
    includes: [
      "Emergency tarping & board-up",
      "Roof damage repair & replacement",
      "Siding & exterior repair",
      "Water extraction & drying",
      "Insurance claim assistance",
      "Full structural restoration",
    ],
    timeline: "Emergency response: same day. Full restoration: 1–6 weeks depending on scope.",
    priceRange: "Varies widely — often covered by insurance. We help with claims.",
    whenNeeded: [
      "After a hurricane, tornado, or severe storm",
      "You see visible damage to roof, siding, or windows",
      "There's water intrusion or flooding",
      "Trees or debris hit your home",
      "Your insurance company needs a contractor estimate",
    ],
    commonProblems: [
      "Hidden water damage behind walls",
      "Delayed insurance claims",
      "Temporary fixes that don't hold up",
      "Mold growth after water damage",
      "Structural weakening from wind",
    ],
    quickAnswer:
      "Storm damage is stressful — we make it easier. We respond fast, handle emergency repairs, and work directly with your insurance company. Most homeowners pay little to nothing out of pocket. Let us assess the damage for free! ⛈️",
  },

  windows: {
    keywords: ["window", "door", "glass", "drafty", "draft", "entry door", "sliding door", "patio door", "french door"],
    title: "Windows & Doors",
    includes: [
      "Window replacement (single, double, bay, picture)",
      "Entry door installation",
      "Sliding & French patio doors",
      "Energy-efficient upgrades (Low-E, argon)",
      "Custom trim & finishing",
      "Security doors & impact windows",
    ],
    timeline: "Window replacement: 1–3 days. Door install: 1 day. Full-home windows: 1–2 weeks.",
    priceRange: "$300–$1,200 per window installed; $1,500–$5,000 per door.",
    whenNeeded: [
      "You feel drafts near windows or doors",
      "Your energy bills are higher than normal",
      "Windows are foggy, cracked, or hard to open",
      "You want to upgrade curb appeal",
      "Your home needs impact-rated windows (hurricane zones)",
    ],
    commonProblems: [
      "Energy loss from old single-pane windows",
      "Condensation between glass panes (seal failure)",
      "Difficulty opening/closing",
      "Poor sound insulation",
      "Security concerns with old doors/locks",
    ],
    quickAnswer:
      "New windows and doors can cut your energy bills by 20–30% and completely transform your home's look. We carry top brands and handle everything from measurement to install. Most jobs finish in just a few days. Want a free estimate? 🪟",
  },

  renovation: {
    keywords: ["renovation", "remodel", "general", "home improvement", "update", "upgrade", "fixer", "full remodel", "whole house"],
    title: "General Home Renovation",
    includes: [
      "Full home remodeling",
      "Room additions & conversions",
      "Flooring installation",
      "Interior & exterior painting",
      "Drywall, trim & finishing",
      "Structural modifications",
      "Aging-in-place modifications",
    ],
    timeline: "Small projects: 1–2 weeks. Full renovations: 4–12 weeks.",
    priceRange: "$10,000–$50,000+ depending on scope.",
    whenNeeded: [
      "Your home feels outdated",
      "You're preparing to sell",
      "You need more space or better flow",
      "You recently purchased a fixer-upper",
      "Wear and tear has built up over years",
    ],
    commonProblems: [
      "Outdated finishes lowering home value",
      "Poor layout and wasted space",
      "Aging systems (electrical, plumbing)",
      "Cosmetic damage (drywall, paint, flooring)",
      "Not sure where to start",
    ],
    quickAnswer:
      "Whether it's a single room or a whole-house makeover, we bring your vision to life. We handle design, demo, and build — all under one roof. Every project starts with a free consultation so we can understand exactly what you need. Let's talk! 🔨",
  },
};

// ─── Smart Matching ───

export function matchServiceKnowledge(input: string): ServiceKnowledge | null {
  const lower = input.toLowerCase();
  for (const service of Object.values(SERVICE_KNOWLEDGE)) {
    if (service.keywords.some((kw) => lower.includes(kw))) {
      return service;
    }
  }
  return null;
}

// ─── Detailed Answer Builder ───

type DetailType = "includes" | "timeline" | "price" | "when" | "problems";

const DETAIL_KEYWORDS: Record<DetailType, string[]> = {
  includes: ["include", "what do you do", "scope", "cover", "involve", "part of"],
  timeline: ["how long", "timeline", "time", "duration", "days", "weeks", "fast"],
  price: ["price", "cost", "how much", "expensive", "cheap", "budget", "afford", "rate", "pricing", "range"],
  when: ["when", "should i", "do i need", "signs", "need"],
  problems: ["problem", "issue", "wrong", "common", "trouble"],
};

export function detectDetailType(input: string): DetailType | null {
  const lower = input.toLowerCase();
  for (const [type, keywords] of Object.entries(DETAIL_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return type as DetailType;
    }
  }
  return null;
}

export function buildDetailedAnswer(service: ServiceKnowledge, detailType: DetailType | null): string {
  if (!detailType) return service.quickAnswer;

  switch (detailType) {
    case "includes":
      return `Our **${service.title}** service includes:\n${service.includes.map((i) => `• ${i}`).join("\n")}\n\nWant a free estimate? Just say **"get an estimate"**!`;
    case "timeline":
      return `**${service.title} timeline:** ${service.timeline}\n\nWe always give you exact dates after the initial consultation. Want to schedule one?`;
    case "price":
      return `**${service.title} pricing:** ${service.priceRange}\n\nEvery project is different — we provide free, no-obligation estimates so you know exactly what to expect. Want one?`;
    case "when":
      return `You might need **${service.title}** if:\n${service.whenNeeded.map((w) => `• ${w}`).join("\n")}\n\nSound familiar? Let's set up a free inspection!`;
    case "problems":
      return `Common **${service.title}** problems we fix:\n${service.commonProblems.map((p) => `• ${p}`).join("\n")}\n\nDealing with any of these? We can help — just say **"get an estimate"**!`;
  }
}
