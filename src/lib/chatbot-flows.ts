/**
 * Guided Conversation Flow
 * When a user expresses a service need, the bot asks smart follow-up
 * questions to qualify the lead before offering to connect them.
 */

import { matchServiceKnowledge, type ServiceKnowledge } from "@/lib/chatbot-knowledge";
import { SERVICE_AREAS } from "@/lib/constants";

// ─── Pre-defined Q&A (common questions with clear answers + CTA) ───

interface PredefinedQA {
  triggers: string[];
  answer: string;
}

export const PREDEFINED_QA: PredefinedQA[] = [
  {
    triggers: ["how much does roof", "roof repair cost", "roofing cost", "cost of roof", "roof price", "roof replacement cost"],
    answer:
      "Roof repair typically ranges between **$300–$1,500** depending on the issue. Small fixes like leaks are cheaper, but structural damage can cost more.\n\nFull replacements range from **$5,000–$15,000** depending on size and materials — and it adds a lot of value to your home.\n\nWant me to connect you with a local contractor to get an exact quote for **free**? Just share your ZIP code 👍",
  },
  {
    triggers: ["leak", "leaking", "water coming in", "dripping", "ceiling stain", "water damage"],
    answer:
      "That's definitely something you want to fix quickly ⚠️\n\nLeaks can lead to interior damage and mold if not handled fast. I can connect you with a **local roofing expert** who can take a look ASAP.\n\nWhat's your **ZIP code** and how urgent is it — today or within a few days?",
  },
  {
    triggers: ["replace roof", "roof replacement", "new roof", "full roof", "reroof", "old roof"],
    answer:
      "Understood — roof replacement is a bigger project, but it adds a lot of value to your home 🏠\n\nMost replacements range from **$5,000 to $15,000** depending on size and materials.\n\nWant me to match you with a **licensed contractor** near you for a free estimate? Just share your ZIP code 👍",
  },
  {
    triggers: ["small repair", "missing shingle", "patch", "minor repair", "fix shingle", "few shingles"],
    answer:
      "Got it — small repairs like missing shingles or minor leaks usually run **$300–$1,500** and can often be done in a day.\n\nIs it a small repair (like a leak or missing shingles), or something more serious?\n\nIf you want, I can connect you with a local contractor to get an exact quote for **free** — what's your ZIP code?",
  },
  {
    triggers: ["how fast", "how soon", "how quickly", "someone come", "come out", "emergency", "urgent", "asap", "right away"],
    // AI-DISCLOSURE-TODO: previously claimed "we can often respond same day"
    // — an availability promise the platform cannot substantiate. Now
    // explicitly redirects active emergencies to 911 / local emergency
    // services and offers the free-quote path for non-urgent requests
    // without a time-window guarantee.
    answer:
      "If this is an active emergency (water actively flooding, structural collapse, gas, fire, or sparks), please call **911** or a local emergency service right away — this chat is automated and can't dispatch help.\n\nFor non-emergencies, I can add you to the **free quote** list and the Build Right USA team will reach out as soon as quote requests reopen.",
  },
  {
    triggers: ["do you work in", "my area", "serve my", "available in", "come to my", "your area", "do you cover"],
    answer:
      `Great question! We serve **Tampa FL**, all of **Florida**, **Los Angeles**, **San Jose**, and the **San Francisco Bay Area**.\n\nAre you in one of those areas? Tell me your **ZIP code** and I'll confirm! Or say **"get an estimate"** to get started.`,
  },
  {
    triggers: ["is it free", "free estimate", "does it cost to", "charge for estimate", "free consultation", "obligation"],
    answer:
      "**100% free, no obligation.** We provide free estimates for every project — no hidden fees, no pressure. We'll come out, assess the work, and give you a clear, honest price.\n\nI can get you a free quote from a trusted local contractor in your area. It only takes a few seconds — want me to set that up for you?",
  },
  {
    triggers: ["do you do financing", "payment plan", "can i pay monthly", "afford", "financing options"],
    answer:
      "Yes! We offer **flexible financing options** for qualifying projects. We also accept cash, check, and all major credit cards.\n\nWant to discuss options? Let me get you a **free estimate** and we can go over financing details!",
  },
  {
    triggers: ["insurance", "claim", "does insurance cover", "file a claim", "insurance help"],
    answer:
      "We work with insurance companies all the time — especially for **storm damage, roof repairs, and water damage**. We'll help you document the damage and can even meet with your adjuster.\n\nWant us to take a look? Say **\"get an estimate\"** and we'll assess what's covered!",
  },
  {
    triggers: ["warranty", "guarantee", "how long does it last", "stand behind"],
    answer:
      "Absolutely. We stand behind our work with **industry-leading warranties**. Materials are covered by manufacturer warranties (often 25–50 years for roofing), and our **labor is fully guaranteed**.\n\nWant details for a specific project? Just ask, or say **\"get an estimate\"**!",
  },
  // ── Solar-specific Q&A ──
  {
    triggers: ["solar save", "save money solar", "reduce bill", "electricity bill", "lower bill", "save on electric", "worth it solar"],
    answer:
      "In most cases — yes 👍\n\nSolar can reduce your electricity bill by **50–90%** depending on your setup. Plus, many states offer incentives that make it even more affordable.\n\nIf you want, I can connect you with a **local solar expert** to see exactly how much you'd save.\n\nWhat's your **ZIP code**?",
  },
  {
    triggers: ["solar install time", "how long solar", "solar timeline", "solar how fast", "solar installation time"],
    answer:
      "Installation usually takes **1–3 days**, but the full process (permits + utility approval) can take a few weeks.\n\nA local installer can give you a precise timeline for your home.\n\nWant me to connect you with one nearby for a **free consultation**?",
  },
  {
    triggers: ["solar cost", "solar price", "how much solar", "solar panel cost", "cost of solar"],
    answer:
      "Most residential solar systems cost **$12,000–$30,000** before incentives. The **30% federal tax credit** can save you thousands!\n\nPayback period is usually **5–8 years**, and panels last 25+ years.\n\nI can match you with a licensed solar installer in your area for a **free consultation**. No obligation — just to see your options.\n\nWant me to set that up?",
  },
  {
    triggers: ["energy independent", "off grid", "battery", "power outage", "blackout", "backup power"],
    answer:
      "Great goal! With solar panels + a **battery storage system**, you can keep your lights on even during outages 🔋\n\nFull energy independence is achievable — a local solar expert can design a system tailored to your home.\n\nWant me to connect you with one for a **free consultation**? What's your ZIP code?",
  },
];

export function matchPredefinedQA(input: string): string | null {
  const lower = input.toLowerCase();
  for (const qa of PREDEFINED_QA) {
    if (qa.triggers.some((t) => lower.includes(t))) {
      return qa.answer;
    }
  }
  return null;
}

// ─── Guided Conversation Flow ───

export interface GuidedFlowState {
  active: boolean;
  service: ServiceKnowledge | null;
  step: number; // 0=location, 1=urgency, 2=issue detail, 3=offer quote
  answers: {
    location?: string;
    urgency?: string;
    issueDetail?: string;
  };
}

export const INITIAL_GUIDED_STATE: GuidedFlowState = {
  active: false,
  service: null,
  step: 0,
  answers: {},
};

// Intent detection — does the user want/need a service?
const NEED_TRIGGERS = [
  "i need", "i want", "looking for", "can you help", "i have a",
  "my roof", "my kitchen", "my bathroom", "my window", "my door",
  "need help", "need repair", "need replace", "broken", "damaged",
  "leaking", "cracked", "old", "falling apart", "fix my",
];

export function detectServiceNeed(input: string): ServiceKnowledge | null {
  const lower = input.toLowerCase();
  const hasNeed = NEED_TRIGGERS.some((t) => lower.includes(t));
  if (!hasNeed) return null;
  return matchServiceKnowledge(input);
}

// Guided flow questions & responses
export function getGuidedPrompt(state: GuidedFlowState): string {
  const serviceName = state.service?.title || "this project";
  const isRoofing = state.service?.title?.toLowerCase().includes("roof");
  const isSolar = state.service?.title?.toLowerCase().includes("solar");

  switch (state.step) {
    case 0:
      if (isRoofing) {
        return `Got it — I can help with that 👍\n\nIs it a small repair (like a leak or missing shingles), or something more serious?\n\nAlso, what **ZIP code** is the property in?`;
      }
      if (isSolar) {
        return `Nice — solar is a great investment 💡\n\nAre you looking to **reduce your electricity bill**, or go fully **energy independent**?\n\nAlso, what **ZIP code** are you in?`;
      }
      return `Got it — **${serviceName}**! I can definitely help with that 👍\n\nWhat's your **ZIP code** so I can find contractors near you?`;
    case 1:
      return "Thanks! How **urgent** is this?\n• 🔴 Emergency — needs attention ASAP\n• 🟡 Soon — within the next few weeks\n• 🟢 Planning ahead — no rush";
    case 2:
      return `Can you tell me a bit more about the **issue**? For example:\n${(state.service?.commonProblems || []).slice(0, 3).map((p) => `• ${p}`).join("\n")}\n\nOr just describe what's going on in your own words!`;
    case 3: {
      const urgencyLabel = state.answers.urgency || "";
      const isUrgent = urgencyLabel.toLowerCase().includes("emergency") || urgencyLabel.toLowerCase().includes("asap") || urgencyLabel.toLowerCase().includes("red") || urgencyLabel.toLowerCase().includes("today");
      if (isUrgent) {
        // PHONE-TODO: the urgent branch used to append
        // "Or call us directly: ${COMPANY_PHONE}" — that constant pointed at
        // a fictional (555) number, which was dangerous in an emergency
        // context (active leak, structural damage). Re-add a real US line
        // once COMPANY_PHONE is populated in src/lib/constants.ts.
        return `That's definitely something you want to fix quickly ⚠️\n\nI can connect you with a **local ${serviceName.toLowerCase()} expert** who can take a look ASAP.\n\nWant me to set up a **free quote**? It only takes 30 seconds!`;
      }
      return `I can get you a **free quote** from a trusted local contractor in your area.\n\nIt only takes a few seconds — want me to set that up for you? 😊\n\nJust say **"yes"** or **"get an estimate"**!`;
    }
    default:
      return "I can get you a **free quote** from a trusted local contractor in your area. It only takes a few seconds — want me to set that up for you?";
  }
}

export function processGuidedAnswer(
  state: GuidedFlowState,
  input: string
): { newState: GuidedFlowState; botResponse: string } {
  const updated = { ...state, answers: { ...state.answers } };

  switch (state.step) {
    case 0:
      updated.answers.location = input;
      updated.step = 1;
      return { newState: updated, botResponse: getGuidedPrompt(updated) };
    case 1:
      updated.answers.urgency = input;
      updated.step = 2;
      return { newState: updated, botResponse: getGuidedPrompt(updated) };
    case 2:
      updated.answers.issueDetail = input;
      updated.step = 3;
      return { newState: updated, botResponse: getGuidedPrompt(updated) };
    case 3:
      // User responded to the final offer — check if they want a quote
      updated.active = false;
      updated.step = 0;
      return { newState: updated, botResponse: "" }; // handled by estimate trigger in main flow
    default:
      updated.active = false;
      return { newState: updated, botResponse: "" };
  }
}
