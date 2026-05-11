import roofingImg from "@/assets/services/roofing.jpg";
import kitchenBathImg from "@/assets/services/kitchen-bath.jpg";
import flooringImg from "@/assets/services/flooring.jpg";
import paintingImg from "@/assets/services/painting.jpg";
import concreteImg from "@/assets/services/concrete.jpg";
import windowsDoorsImg from "@/assets/services/windows-doors.jpg";
import generalRemodelingImg from "@/assets/services/general-remodeling.jpg";

export interface ServiceContent {
  slug: string;
  heroTitle: string;
  heroSubtitle: string;
  image: string;
  sections: {
    title: string;
    body: string;
  }[];
  facts: string[];
  costRange: string;
  timeline: string;
  proTip: string;
}

export const SERVICE_CONTENT: Record<string, ServiceContent> = {
  roofing: {
    slug: "roofing",
    heroTitle: "Everything You Need to Know About Roof Repair & Replacement",
    heroSubtitle: "Your roof is one of the most important parts of your home — yet most people only notice it when something goes wrong.",
    image: roofingImg,
    sections: [
      {
        title: "Common Roofing Issues",
        body: "Leaks after heavy rain, missing or damaged shingles, mold or moisture inside ceilings, sagging roof decks, and granule loss are signs your roof needs attention. Ignoring these can lead to structural damage and costly interior repairs.",
      },
      {
        title: "Repair vs. Replacement",
        body: "Small issues like a single leak or a few missing shingles typically call for a targeted repair ($300–$1,500). However, if your roof is over 20 years old or has widespread damage, a full replacement ($5,000–$15,000) is usually the smarter long-term investment. Our experts can inspect your roof and recommend the most cost-effective option.",
      },
      {
        title: "Our Roofing Process",
        body: "We start with a free, no-obligation inspection to assess damage and recommend solutions. From there, we provide a detailed estimate with material options — asphalt shingles, metal roofing, or flat roof systems. Every installation is backed by manufacturer warranties and our workmanship guarantee.",
      },
    ],
    facts: [
      "A damaged roof can increase your energy bill by up to 20% due to poor insulation.",
      "Most asphalt shingle roofs last 20–30 years with proper maintenance.",
      "Homes with a new roof sell for an average of $12,000 more.",
    ],
    costRange: "$300–$1,500 (repair) · $5,000–$15,000 (replacement)",
    timeline: "1–3 days for repairs · 1–2 weeks for full replacement",
    proTip: "Fixing a small leak early can save thousands later. Schedule annual inspections to catch issues before they become emergencies.",
  },

  "kitchen-bath-remodel": {
    slug: "kitchen-bath-remodel",
    heroTitle: "Kitchen & Bathroom Remodeling: The Best ROI for Your Home",
    heroSubtitle: "If you want to upgrade your home and increase its value — kitchens and bathrooms are where to start.",
    image: kitchenBathImg,
    sections: [
      {
        title: "Why Kitchens & Bathrooms Matter Most",
        body: "These are the rooms buyers look at first — and the rooms you use most every day. A kitchen remodel can return up to 70% of your investment at resale, while bathroom upgrades return up to 60%. Beyond ROI, a modern kitchen and spa-style bathroom dramatically improve your daily quality of life.",
      },
      {
        title: "What's Trending",
        body: "Modern shaker cabinets, quartz countertops, walk-in showers with frameless glass, smart appliances, and warm neutral palettes are dominating 2024–2025 design. Open layouts that connect the kitchen to living spaces remain the most requested upgrade.",
      },
      {
        title: "Our Remodeling Approach",
        body: "We handle everything — design consultation, 3D rendering, demolition, plumbing, electrical, cabinetry, tile, and final finishes. Our project managers coordinate every trade so you get a seamless experience from start to finish.",
      },
    ],
    facts: [
      "Buyers decide within 10 seconds if they like a kitchen.",
      "Kitchen remodel ROI: up to 70%. Bathroom remodel ROI: up to 60%.",
      "The average kitchen remodel takes 6–10 weeks to complete.",
    ],
    costRange: "$15,000–$50,000 (kitchen) · $8,000–$25,000 (bathroom)",
    timeline: "6–10 weeks (kitchen) · 3–6 weeks (bathroom)",
    proTip: "Focus your budget on cabinets and countertops — they make the biggest visual impact for the money.",
  },

  flooring: {
    slug: "flooring",
    heroTitle: "Premium Flooring Installation: Hardwood, Tile & LVP",
    heroSubtitle: "New floors transform the entire look and feel of your home — and they're one of the most impactful upgrades you can make.",
    image: flooringImg,
    sections: [
      {
        title: "Choosing the Right Flooring",
        body: "Hardwood adds timeless warmth and value. Luxury vinyl plank (LVP) offers durability and water resistance at a lower price point. Natural stone tile creates an elegant, high-end look. Each material has ideal applications — we help you pick the perfect match for your lifestyle, traffic patterns, and budget.",
      },
      {
        title: "Installation Quality Matters",
        body: "Even the best flooring materials will fail with poor installation. Proper subfloor preparation, moisture barriers, and expansion gaps are critical. Our installers are trained and certified in every material we offer, ensuring a flawless result that lasts for decades.",
      },
      {
        title: "What to Expect",
        body: "We start with an in-home measurement and consultation. You'll choose from our curated material selection, and we'll provide a transparent estimate. Most rooms can be completed in 1–2 days, with minimal disruption to your daily routine.",
      },
    ],
    facts: [
      "Hardwood flooring can increase home value by 3–5%.",
      "LVP is now the fastest-growing flooring category in the US.",
      "Properly installed tile flooring can last 50+ years.",
    ],
    costRange: "$3–$12 per sq ft (materials) · $1,500–$8,000 per room (installed)",
    timeline: "1–2 days per room · 1–2 weeks for whole home",
    proTip: "LVP is the best value for families with kids and pets — it's waterproof, scratch-resistant, and looks like real wood.",
  },

  painting: {
    slug: "painting",
    heroTitle: "Why Professional Painting Makes a Huge Difference",
    heroSubtitle: "Paint is one of the cheapest upgrades — but one of the most impactful. A fresh coat transforms your entire home.",
    image: paintingImg,
    sections: [
      {
        title: "Interior vs. Exterior Painting",
        body: "Interior painting refreshes your living spaces and lets you personalize each room. Exterior painting protects your home from weather damage while boosting curb appeal. Both should be done with premium paints that offer better coverage, durability, and color retention.",
      },
      {
        title: "Quality Makes the Difference",
        body: "Cheap paint jobs fade quickly, show brush marks, and peel within a year. Professional painters use proper prep — sanding, priming, caulking, and taping — to ensure clean lines and lasting results. We use top-tier paints from trusted brands that stand up to Florida sun and California weather.",
      },
      {
        title: "Beyond Walls",
        body: "We also handle cabinet refinishing (a fraction of the cost of replacement), deck and fence staining, accent walls, and color consultation. Our designers can help you choose palettes that enhance your home's architecture and lighting.",
      },
    ],
    facts: [
      "Homes with fresh exterior paint sell faster and for more money.",
      "A professional interior paint job lasts 5–10 years vs. 1–2 years for DIY.",
      "Exterior paint protects against UV damage, moisture, and mold.",
    ],
    costRange: "$1,500–$4,000 (interior) · $2,500–$6,000 (exterior)",
    timeline: "2–4 days (interior) · 3–7 days (exterior)",
    proTip: "Cheap paint jobs fade quickly — quality matters. Investing in premium paint saves money in the long run.",
  },

  "concrete-driveway": {
    slug: "concrete-driveway",
    heroTitle: "Strong Foundations: Concrete & Driveway Upgrades",
    heroSubtitle: "Your driveway is the first thing people see — and it matters more than you think for curb appeal and home value.",
    image: concreteImg,
    sections: [
      {
        title: "Why Concrete Matters",
        body: "A cracked, stained driveway drags down your entire property's appearance. New concrete flatwork — driveways, patios, walkways — instantly boosts curb appeal and adds real value. Properly installed concrete is one of the most durable surfaces available, lasting 30+ years with minimal maintenance.",
      },
      {
        title: "Decorative Options",
        body: "Today's concrete goes far beyond plain gray slabs. Stamped concrete can mimic the look of brick, stone, or tile at a fraction of the cost. Colored concrete, exposed aggregate, and polished finishes create stunning outdoor living spaces that complement your home's architecture.",
      },
      {
        title: "Our Process",
        body: "We handle everything from site prep and grading to reinforcement, pouring, and finishing. Proper base preparation and control joints are critical for preventing future cracks — corners we never cut. Every project includes a detailed plan and transparent pricing.",
      },
    ],
    facts: [
      "Concrete can last over 30 years when installed properly.",
      "A new driveway can increase home value by $5,000–$10,000.",
      "Stamped concrete costs 30–40% less than natural stone but looks similar.",
    ],
    costRange: "$3,000–$10,000 (driveway) · $2,000–$8,000 (patio)",
    timeline: "2–5 days (pour & finish) · 7 days cure time",
    proTip: "Concrete needs proper curing time — don't drive on a new driveway for at least 7 days.",
  },

  "windows-doors": {
    slug: "windows-doors",
    heroTitle: "Upgrade Your Home with Energy-Efficient Windows & Doors",
    heroSubtitle: "Old windows can waste energy and money — modern replacements pay for themselves through savings and comfort.",
    image: windowsDoorsImg,
    sections: [
      {
        title: "Why Upgrade Your Windows",
        body: "Old, single-pane windows are one of the biggest sources of energy loss in any home. Upgrading to energy-efficient double or triple-pane windows can reduce your energy bills by up to 25%, improve insulation, reduce outside noise, and increase your home's security.",
      },
      {
        title: "Doors That Make a Statement",
        body: "Your front door is the focal point of your home's exterior. A new entry door improves security, insulation, and curb appeal. We install entry doors, sliding glass doors, French doors, and patio doors — all from top manufacturers with excellent warranties.",
      },
      {
        title: "Professional Installation",
        body: "Even the best windows and doors underperform with poor installation. Our certified installers ensure proper sealing, insulation, and finishing for maximum energy efficiency and a beautiful result. We handle measurement, ordering, installation, and trim — start to finish.",
      },
    ],
    facts: [
      "Upgrading windows can save up to 25% on energy costs.",
      "Impact-rated windows are required in many Florida counties.",
      "A new front door has one of the highest ROIs of any home improvement project (over 90%).",
    ],
    costRange: "$300–$1,200 per window · $1,500–$5,000 per door (installed)",
    timeline: "1 day per 5–8 windows · 1 day per door",
    proTip: "Impact-rated windows protect against storms AND reduce noise — worth the investment in coastal areas.",
  },

  "general-remodeling": {
    slug: "general-remodeling",
    heroTitle: "Full Home Remodeling: Transform Your Living Space",
    heroSubtitle: "Sometimes small fixes aren't enough — you need a full transformation to make your home work for your life.",
    image: generalRemodelingImg,
    sections: [
      {
        title: "When to Consider a Full Remodel",
        body: "If your home feels outdated, cramped, or no longer suits your lifestyle, a full remodel can be more cost-effective than moving. Open-concept conversions, room additions, basement finishing, and structural modifications can completely transform how you live — without leaving the neighborhood you love.",
      },
      {
        title: "What We Handle",
        body: "Our general remodeling services cover every trade — framing, electrical, plumbing, HVAC, drywall, flooring, painting, and finishes. We manage permits, inspections, and subcontractor coordination so you have a single point of contact throughout the entire project.",
      },
      {
        title: "Planning for Success",
        body: "Every successful remodel starts with a clear plan. We work with you on design, budgeting, and phasing to minimize disruption and maximize results. Our project managers provide weekly updates and ensure everything stays on schedule and within budget.",
      },
    ],
    facts: [
      "Remodeled homes sell up to 20% faster than non-remodeled ones.",
      "Open-concept conversions are the #1 most requested remodeling project.",
      "A finished basement adds an average of $40,000–$75,000 in home value.",
    ],
    costRange: "$20,000–$100,000+ depending on scope",
    timeline: "4–16 weeks depending on project size",
    proTip: "Start with a clear budget and add 10–15% for contingencies — unexpected issues are normal in remodeling.",
  },
};
