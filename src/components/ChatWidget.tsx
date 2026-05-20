import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageCircle, X, Send, ArrowLeft,
  Phone, Hammer, ChevronDown,
} from "lucide-react";
import { LEAD_SUBMISSION_ENABLED } from "@/lib/lead-submission-gate";
import { useIsMobile } from "@/hooks/use-mobile";

// ─── Config ──────────────────────────────────────────────────────────────────
const AI_TIMEOUT_MS  = 10_000;
const RETRY_DELAY_MS = 1_500;
const CHAT_URL       = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

// ─── Types ───────────────────────────────────────────────────────────────────
type Message = {
  id: string;
  from: "bot" | "user";
  text: string;
  quickReplies?: string[];
  isError?: boolean;
};

type LeadData = {
  name: string; phone: string; email: string; zip: string;
  location_text: string; service: string; service_area: string; description: string;
};

type LeadField = keyof Pick<LeadData, "name" | "phone" | "email" | "zip">;

type LeadFieldDef = {
  key: LeadField;
  prompt: string;
  validate: (v: string) => string | null;
};

type AiMsg = { role: "user" | "assistant"; content: string };

// ─── Lead Fields ─────────────────────────────────────────────────────────────
const EMPTY_LEAD: LeadData = {
  name: "", phone: "", email: "", zip: "",
  location_text: "", service: "", service_area: "", description: "",
};

const LEAD_FIELDS: LeadFieldDef[] = [
  {
    key: "zip",
    prompt: "Let me find who's available near you — what **ZIP code** is the property in?",
    validate: () => null,
  },
  {
    key: "name",
    prompt: "Got it 👍 And how should the contractor address you?",
    validate: (v) => (v.length >= 2 ? null : "Even a first name works 😊"),
  },
  {
    key: "phone",
    prompt: "What's the best number to reach you on?",
    validate: (v) =>
      v.replace(/\D/g, "").length >= 10
        ? null
        : "That doesn't look quite right — can you try a 10-digit number?",
  },
  {
    key: "email",
    prompt: "Email too? Contractors often send over their estimate details. (or type **skip**)",
    validate: (v) => {
      if (v.toLowerCase() === "skip" || v.toLowerCase() === "no") return null;
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
        ? null
        : "That doesn't look like a valid email — try again or type **skip**.";
    },
  },
];

// ─── Quick Replies by category ───────────────────────────────────────────────
const QUICK_REPLIES_HOME = ["Roof Repair", "Kitchen Remodel", "Solar Panel", "Storm Damage", "More Services"];

const SERVICE_QUICK_REPLIES: Record<string, string[]> = {
  roof: [
    "Roof leak",
    "Storm damage",
    "Full replacement",
    "Price range",
    "Insurance help",
    "How long does it take?",
  ],
  kitchen: [
    "Full remodel",
    "Cabinets & countertops",
    "Improve layout",
    "Price range",
    "Timeline",
    "AI Preview",
  ],
  bathroom: [
    "Walk-in shower",
    "Full bathroom remodel",
    "Fix water damage",
    "Price range",
    "Timeline",
    "AI Preview",
  ],
  solar: [
    "Lower my energy bill",
    "Battery backup",
    "Roof suitability",
    "Price range",
    "Savings estimate",
    "Timeline",
  ],
  windows: [
    "Energy savings",
    "Hurricane windows",
    "Noise reduction",
    "Replace doors",
    "Price range",
    "Timeline",
  ],
  storm: [
    "Active leak",
    "Insurance claim",
    "Emergency repair",
    "Roof damage",
    "Water damage",
    "What should I do first?",
  ],
  exterior: [
    "Siding options",
    "Curb appeal",
    "Low maintenance",
    "Insulation",
    "Price range",
    "AI Preview",
  ],
  general: [
    "Full renovation",
    "Compare options",
    "Budget range",
    "Timeline",
    "AI Preview",
    "Get Free Quote",
  ],
};

// ─── Helper Functions ─────────────────────────────────────────────────────────
function looksLikeLocation(t: string): boolean {
  return /[a-z]{2,}/i.test(t.trim()) && !/^\d{5}$/.test(t.replace(/\s/g, ""));
}

function isUnsureResponse(t: string): boolean {
  return ["don't know", "dont know", "not sure", "no idea", "idk", "unsure", "no clue", "i'm not sure", "im not sure"]
    .some((p) => t.toLowerCase().includes(p));
}

function extractZip(t: string): string | null {
  const m = t.match(/\b(\d{5})\b/);
  return m ? m[1] : null;
}

function detectServiceContext(text: string): string | null {
  const lower = text.toLowerCase();
  if (/roof|shingle|leak|gutter|attic/.test(lower)) return "roof";
  if (/kitchen|cabinet|countertop|backsplash/.test(lower)) return "kitchen";
  if (/bathroom|shower|tub|vanity|toilet/.test(lower)) return "bathroom";
  if (/solar|panel|electric bill|energy/.test(lower)) return "solar";
  if (/window|door|draft|glass/.test(lower)) return "windows";
  if (/storm|hurricane|hail|wind damage|insurance claim/.test(lower)) return "storm";
  if (/siding|exterior|paint|stucco|curb appeal/.test(lower)) return "exterior";
  if (/renovation|remodel|upgrade|contractor|home project/.test(lower)) return "general";
  return null;
}

function randomTypingPhrase(): string {
  return ["Checking on that…", "One sec…", "Let me think…", "On it…", "Looking into that…"][
    Math.floor(Math.random() * 5)
  ];
}

// ─── Sub-Components ───────────────────────────────────────────────────────────

function TypingIndicator({ phrase }: { phrase: string }) {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2.5 flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{phrase}</span>
        <span className="flex gap-0.5">
          {[0, 0.2, 0.4].map((d, i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"
              style={{ animation: `bounce 1.4s ease-in-out ${d}s infinite` }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}

function ErrorCTA() {
  return (
    <div className="flex justify-start mt-2">
      <div className="bg-amber-50 border border-amber-200 rounded-2xl rounded-bl-md px-4 py-3 max-w-[85%] space-y-2">
        <p className="text-xs font-semibold text-amber-900">Trouble connecting right now</p>
        <p className="text-xs text-amber-800 leading-relaxed">
          You can still reach us through the contact page.
        </p>
        <div className="flex gap-2 pt-0.5">
          {/* PHONE-TODO: this fallback used to render a "Call Now" button
              linking to an Israeli WhatsApp number (wa.me/972…). Removed for
              Task 3. Re-introduce a tel: link to a real US callback line
              once provisioned (COMPANY_PHONE in src/lib/constants.ts). */}
          <a
            href="/contact"
            className="flex-1 flex items-center justify-center gap-1 bg-muted text-foreground rounded-lg py-1.5 text-xs font-medium hover:bg-muted/80"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ text }: { text: string }) {
  // Parse **bold** markdown inline
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
      )}
    </>
  );
}

// ─── Streaming helper ─────────────────────────────────────────────────────────
async function callAI(messages: AiMsg[]): Promise<string> {
  const message = messages[messages.length - 1]?.content || "";

  const { data, error } = await supabase.functions.invoke("chat", {
    body: { messages },
  });

  if (error) {
    throw new Error(error.message || "Function invoke failed");
  }

  return data?.reply || "No response";
}
// ─── Welcome message ──────────────────────────────────────────────────────────
const INITIAL_MESSAGE: Message = {
  id:           "welcome",
  from:         "bot",
  // AI-DISCLOSURE-TODO: opening message now identifies as an AI assistant
  // up-front and avoids implying a human is on the other side or that a
  // contractor is being "connected" in real time.
  text:         "👋 Welcome to **Build Right USA**.\n\nI'm the **Build Right USA AI Assistant** — automated software, not a human. I can answer questions about roofing, remodeling, solar, and storm damage, and point you to the right next step if you'd like a free quote.\n\nWhat's going on with your home?",
  quickReplies: QUICK_REPLIES_HOME,
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ChatWidget() {
  const [open,           setOpen]           = useState(false);
  const [enabled,        setEnabled]        = useState<boolean>(true);
  const [messages,       setMessages]       = useState<Message[]>([INITIAL_MESSAGE]);
  const [input,          setInput]          = useState("");
  const [isStreaming,    setIsStreaming]     = useState(false);
  const [showTyping,     setShowTyping]     = useState(false);
  const [typingPhrase,   setTypingPhrase]   = useState("");
  const [aiHistory,      setAiHistory]      = useState<AiMsg[]>([]);
  const [collectingLead, setCollectingLead] = useState(false);
  const [leadFieldIdx,   setLeadFieldIdx]   = useState(0);
  const [leadData,       setLeadData]       = useState<LeadData>({ ...EMPTY_LEAD });
  const [leadSubmitted,  setLeadSubmitted]  = useState(false);
  const [zipAttempts,    setZipAttempts]    = useState(0);
  const [mobileH,        setMobileH]        = useState<number | null>(null);
  const [mobileW,        setMobileW]        = useState<number | null>(null);
  const [mobileTop,      setMobileTop]      = useState(0);
  const [mobileLeft,     setMobileLeft]     = useState(0);
  const [unreadCount,    setUnreadCount]    = useState(0);
  const [showScrollDown, setShowScrollDown] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);
  const isMobile  = useIsMobile();

  // ── focus management ──
  const focusInput = useCallback(() => {
    if (isMobile) return;
    requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
  }, [isMobile]);

  useEffect(() => {
    if (open && !isMobile) focusInput();
  }, [messages, open, isStreaming, showTyping, collectingLead, focusInput, isMobile]);

  // ── mobile viewport ──
  useEffect(() => {
    if (!open || !isMobile) {
      setMobileH(null); setMobileW(null); setMobileTop(0); setMobileLeft(0);
      return;
    }
    const upd = () => {
      const vp = window.visualViewport;
      setMobileH(Math.round(vp?.height ?? window.innerHeight));
      setMobileW(Math.round(vp?.width  ?? window.innerWidth));
      setMobileTop(Math.round(vp?.offsetTop  ?? 0));
      setMobileLeft(Math.round(vp?.offsetLeft ?? 0));
    };
    const pb = document.body.style.overflow;
    const ph = document.documentElement.style.overflow;
    upd();
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    window.visualViewport?.addEventListener("resize", upd);
    window.visualViewport?.addEventListener("scroll", upd);
    window.addEventListener("resize", upd);
    return () => {
      document.body.style.overflow = pb;
      document.documentElement.style.overflow = ph;
      window.visualViewport?.removeEventListener("resize", upd);
      window.visualViewport?.removeEventListener("scroll", upd);
      window.removeEventListener("resize", upd);
    };
  }, [open, isMobile]);

  // ── feature flag ──
  useEffect(() => {
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "CHAT_ENABLED")
      .maybeSingle()
.then(({ data, error }) => {
  if (error || !data) {
    console.warn("CHAT_ENABLED fallback to true");
    setEnabled(true);
    return;
  }

 setEnabled(String(data.value) === "true");
});
}, []);
    
  // ── auto scroll ──
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    if (atBottom) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      setShowScrollDown(false);
    } else {
      setShowScrollDown(true);
    }
  }, [messages, showTyping]);

  // ── unread badge ──
  useEffect(() => {
    if (!open) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg?.from === "bot" && lastMsg.id !== "welcome") {
        setUnreadCount((n) => n + 1);
      }
    }
  }, [messages]);

  useEffect(() => {
    if (open) setUnreadCount(0);
  }, [open]);

  // ── helpers ──────────────────────────────────────────────────────────────────
  const addMsg = useCallback((from: "bot" | "user", text: string, quickReplies?: string[], isError?: boolean) => {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), from, text, quickReplies, isError }]);
  }, []);

  const showBotWithDelay = useCallback(
    (text: string, quickReplies?: string[]) => {
      const delay = Math.min(600 + text.length * 10, 2200);
      setTypingPhrase(randomTypingPhrase());
      setShowTyping(true);
      setTimeout(() => {
        setShowTyping(false);
        addMsg("bot", text, quickReplies);
      }, delay);
    },
    [addMsg]
  );

  const buildSummary = (): string => {
    const u = messages.filter((m) => m.from === "user").slice(-5).map((m) => m.text);
    return `Source: chatbot. Conversation: ${u.join(" → ")}`;
  };

  // ── lead submission ───────────────────────────────────────────────────────────
  const submitLead = async (data: LeadData) => {
    // ─────────────────────────────────────────────────────────────────────
    // LEAD-GATE-TODO: Liability Containment Sprint — chatbot lead capture is
    // temporarily disabled. While LEAD_SUBMISSION_ENABLED is false we do not
    // write to Supabase, invoke notify-lead, or invoke distribute-lead — we
    // just acknowledge in chat and stop collecting. Re-enable by replacing
    // the disabled writes below with a single call to the new server-side
    // submit edge function. See src/lib/lead-submission-gate.ts.
    // ─────────────────────────────────────────────────────────────────────
    if (!LEAD_SUBMISSION_ENABLED) {
      showBotWithDelay(
        `Thanks, **${data.name}** — but we're temporarily not accepting new requests while we upgrade our contractor network. Please check back soon.`
      );
      setLeadSubmitted(true);
      setCollectingLead(false);
      setLeadFieldIdx(0);
      return;
    }

    const leadId  = crypto.randomUUID();
    const phone   = data.phone.replace(/\D/g, "").slice(-10);
    const email   = data.email.toLowerCase() === "skip" || !data.email ? null : data.email;
    const zipVal  = data.zip.replace(/\D/g, "").slice(0, 5);
    const locFb   = data.location_text || data.service_area || null;

    // LEAD-GATE-TODO: replace this insert + notify-lead + distribute-lead
    // trio with a single server-side submit call.
    const { error } = await supabase.from("leads").insert({
      id:           leadId,
      name:         data.name,
      phone,
      email,
      zip:          zipVal || "00000",
      service:      data.service || "General",
      service_area: locFb,
      source:       "website" as const,
      message:      buildSummary() + (locFb && !zipVal ? ` | Location: ${locFb}` : ""),
    });

    if (error) {
      showBotWithDelay("Sorry, something went wrong saving your info. Please try again or call us!");
      console.error("Lead insert error:", error);
    } else {
      // PHONE-TODO: the success message used to invite the user to "call us
      // anytime at ${COMPANY_PHONE}" — that constant pointed at a fictional
      // (555) number. The call-to-call line is removed until a real US line
      // exists. Re-add a sentence here once COMPANY_PHONE is populated in
      // src/lib/constants.ts.
      showBotWithDelay(
        `You're all set, **${data.name}**! ✅\n\nA local contractor will reach out soon with a free, no-obligation estimate.`
      );
      setLeadSubmitted(true);
      supabase.functions.invoke("notify-lead",     { body: { lead_id: leadId } }).catch(() => {});
      supabase.functions.invoke("distribute-lead", { body: { lead_id: leadId } }).catch(() => {});
    }
    setCollectingLead(false);
    setLeadFieldIdx(0);
  };

  const findNextMissingField = (data: LeadData, startIdx: number): number => {
    for (let i = startIdx; i < LEAD_FIELDS.length; i++) {
      const key = LEAD_FIELDS[i].key;
      if (key === "zip" && (data.zip || data.location_text)) continue;
      if (key !== "zip" && data[key]) continue;
      return i;
    }
    return LEAD_FIELDS.length;
  };

  const startLeadCollection = () => {
    if (leadSubmitted) {
      showBotWithDelay("You've already submitted a request! Our team will be in touch soon 😊");
      return;
    }
    const pre = { ...leadData };
    if (!pre.zip) {
      const allText = messages.filter((m) => m.from === "user").map((m) => m.text).join(" ");
      const zip = extractZip(allText);
      if (zip) pre.zip = zip;
    }
    // Try to infer service from conversation
    if (!pre.service) {
      const allText = messages.map((m) => m.text).join(" ");
      const ctx = detectServiceContext(allText);
      if (ctx) pre.service = ctx;
    }
    setLeadData(pre);
    const ni = findNextMissingField(pre, 0);
    if (ni >= LEAD_FIELDS.length) {
      submitLead(pre);
      return;
    }
    setCollectingLead(true);
    setLeadFieldIdx(ni);
    showBotWithDelay(LEAD_FIELDS[ni].prompt);
  };

  // ── message processing ────────────────────────────────────────────────────────
  const handleQuickReply = (text: string) => {
    setInput("");
    addMsg("user", text);
    processMessage(text);
  };

  const processMessage = async (trimmed: string) => {
    const lower = trimmed.toLowerCase();

    // ── lead collection mode ──
    if (collectingLead) {
      const bail = ["no", "no thanks", "not now", "later", "nah", "maybe later"];
      if (bail.some((d) => lower === d || lower === d + ".")) {
        setCollectingLead(false);
        showBotWithDelay("No problem! Just say **\"free quote\"** whenever you're ready 😊");
        return;
      }

      const field = LEAD_FIELDS[leadFieldIdx];

      if (field.key === "zip") {
        const digits  = trimmed.replace(/\D/g, "");
        const updated = { ...leadData };

        if (/^\d{5}$/.test(digits.slice(0, 5))) {
          updated.zip = digits.slice(0, 5);
          setLeadData(updated);
          setZipAttempts(0);
        } else if (isUnsureResponse(trimmed)) {
          updated.location_text = "";
          setLeadData(updated);
          setZipAttempts(0);
          showBotWithDelay("No worries — that's totally fine 👍");
          const ni = findNextMissingField(updated, leadFieldIdx + 1);
          if (ni >= LEAD_FIELDS.length) { setTimeout(() => submitLead(updated), 1200); return; }
          setTimeout(() => { setLeadFieldIdx(ni); showBotWithDelay(LEAD_FIELDS[ni].prompt); }, 1500);
          return;
        } else if (looksLikeLocation(trimmed)) {
          updated.location_text = trimmed;
          updated.service_area  = trimmed;
          setLeadData(updated);
          setZipAttempts(0);
          showBotWithDelay(`Got it — **${trimmed}** area 👍`);
          const ni = findNextMissingField(updated, leadFieldIdx + 1);
          if (ni >= LEAD_FIELDS.length) { setTimeout(() => submitLead(updated), 1200); return; }
          setTimeout(() => { setLeadFieldIdx(ni); showBotWithDelay(LEAD_FIELDS[ni].prompt); }, 1500);
          return;
        } else {
          const att = zipAttempts + 1;
          setZipAttempts(att);
          if (att >= 2) {
            setZipAttempts(0);
            showBotWithDelay("No worries — we can sort that out later 👍");
            const ni = findNextMissingField(updated, leadFieldIdx + 1);
            if (ni >= LEAD_FIELDS.length) { setTimeout(() => submitLead(updated), 1200); return; }
            setTimeout(() => { setLeadFieldIdx(ni); showBotWithDelay(LEAD_FIELDS[ni].prompt); }, 1500);
            return;
          }
          showBotWithDelay("A ZIP code helps me find the closest pros — but a city or town works too!");
          return;
        }

        const ni = findNextMissingField(updated, leadFieldIdx + 1);
        if (ni >= LEAD_FIELDS.length) { submitLead(updated); return; }
        setLeadFieldIdx(ni);
        showBotWithDelay(LEAD_FIELDS[ni].prompt);
        return;
      }

      const err = field.validate(trimmed);
      if (err) { showBotWithDelay(err); return; }

      const updated = { ...leadData };
      if (field.key === "phone") updated.phone = trimmed.replace(/\D/g, "").slice(-10);
      else if (field.key === "email") updated.email = lower === "skip" || lower === "no" ? "" : trimmed;
      else updated[field.key] = trimmed;

      setLeadData(updated);
      const ni = findNextMissingField(updated, leadFieldIdx + 1);
      if (ni >= LEAD_FIELDS.length) { submitLead(updated); return; }
      setLeadFieldIdx(ni);
      showBotWithDelay(LEAD_FIELDS[ni].prompt);
      return;
    }

    // ── AI mode ──
    const newHistory: AiMsg[] = [...aiHistory, { role: "user", content: trimmed }];
    setAiHistory(newHistory);
    setTypingPhrase(randomTypingPhrase());
    setShowTyping(true);
    setIsStreaming(true);
    
try {
  const reply = await callAI(newHistory);

  setIsStreaming(false);
  setShowTyping(false);

  const ctx = detectServiceContext(trimmed + " " + reply);
  const qr = ctx ? SERVICE_QUICK_REPLIES[ctx] : undefined;

 const cleanReply = reply.replace(/COLLECT_LEAD/g, "").trim();
addMsg("bot", cleanReply, qr);
 setAiHistory((prev) => [...prev, { role: "assistant", content: cleanReply }]);
  
    } catch (e: any) {
      console.error("Chat stream error after retry:", e);
      setIsStreaming(false);
      setShowTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id:      crypto.randomUUID(),
          from:    "bot",
          // PHONE-TODO: previously offered "${COMPANY_PHONE}" (a fictional
          // (555) number) as the fallback contact path. Restore a real US
          // number here once provisioned.
          text:    `Having trouble connecting right now. Please use the contact form or email us.`,
          isError: true,
        },
      ]);
    }
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming || showTyping) return;
    addMsg("user", trimmed);
    setInput("");
    processMessage(trimmed);
    focusInput();
  };

  // ── render guard ──
  // if (enabled === false) return null;

  const mobileChatStyle = isMobile
    ? {
        top:       `${mobileTop}px`,
        left:      `${mobileLeft}px`,
        height:    `${mobileH ?? window.innerHeight}px`,
        maxHeight: `${mobileH ?? window.innerHeight}px`,
        width:     `${mobileW ?? window.innerWidth}px`,
        maxWidth:  `${mobileW ?? window.innerWidth}px`,
      }
    : undefined;

  return (
    <>
      {/* ── Launcher Button ── */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-[76px] md:bottom-6 left-4 z-[60] flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-accent-foreground shadow-lg hover:brightness-110 transition-all"
          aria-label="Open chat"
        >
          {/* AI-DISCLOSURE-TODO: launcher label now identifies this as an
              AI assistant rather than a person named "Alex". When real human
              support is wired, replace the label with a "Talk to a person"
              variant that routes to a different conversation path. */}
          <Hammer size={18} />
          <span className="text-sm font-semibold hidden sm:inline">Ask the AI assistant</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      )}

      {/* ── Chat Panel ── */}
      {open && (
        <div
          className="fixed left-0 top-0 z-[10000] flex w-screen max-w-full touch-pan-y flex-col bg-card border border-border shadow-2xl overflow-hidden h-[100dvh] md:inset-auto md:bottom-6 md:left-4 md:top-auto md:w-[390px] md:h-[560px] md:rounded-2xl"
          style={mobileChatStyle}
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-primary px-4 py-3 pt-[calc(0.75rem+env(safe-area-inset-top))] shrink-0">
            <div className="flex items-center gap-2.5">
              <button onClick={() => setOpen(false)} className="md:hidden text-primary-foreground mr-1">
                <ArrowLeft size={20} />
              </button>
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0">
                <Hammer size={16} className="text-accent-foreground" />
              </div>
              {/* AI-DISCLOSURE-TODO: header now identifies the surface as an
                  AI assistant rather than a person named "Alex". When real
                  human support ships, swap this for the human team-mate's
                  name + an "AI assistant" tag for clearly-AI conversations. */}
              <div>
                <p className="font-bold text-primary-foreground text-sm leading-tight">Build Right USA AI Assistant</p>
                <p className="text-primary-foreground/60 text-[10px] leading-tight">Automated · Responses are AI-generated</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-1 text-[10px] text-primary-foreground/60">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Online
              </span>
              <button onClick={() => setOpen(false)} className="text-primary-foreground/70 hover:text-primary-foreground ml-2">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            onScroll={() => {
              const el = scrollRef.current;
              if (!el) return;
              const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
              setShowScrollDown(!atBottom);
            }}
            className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden p-4 space-y-3 bg-background overscroll-contain"
          >
            {messages.map((m, idx) => (
              <div key={m.id} className={m.from === "bot" ? "animate-fade-in min-w-0" : "min-w-0"}>
                <div className={`flex min-w-0 ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`min-w-0 max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line break-words [overflow-wrap:anywhere] md:max-w-[80%] ${
                      m.from === "user"
                        ? "bg-accent text-accent-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    }`}
                  >
                    <MessageBubble text={m.text} />
                  </div>
                </div>

                {m.isError && <ErrorCTA />}

                {/* Quick replies — only on last bot message */}
                {m.from === "bot" && m.quickReplies?.length && idx === messages.length - 1 && (
                  <div className="mt-2 ml-1 flex flex-wrap gap-1.5">
                    {m.quickReplies.map((qr) => (
                      <button
                        key={qr}
                        onClick={() => handleQuickReply(qr)}
                        className="text-xs px-3 py-1.5 rounded-full border border-accent/30 bg-accent/5 text-accent hover:bg-accent/15 transition-colors font-medium"
                      >
                        {qr}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {showTyping && <TypingIndicator phrase={typingPhrase} />}
          </div>

          {/* Scroll-down indicator */}
          {showScrollDown && (
            <button
              onClick={() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })}
              className="absolute bottom-20 right-4 bg-accent text-accent-foreground rounded-full p-1.5 shadow-md z-10"
            >
              <ChevronDown size={16} />
            </button>
          )}

          {/* Input */}
          <div className="border-t border-border bg-card p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shrink-0">
            <div className="flex min-w-0 gap-2">
              <Input
                ref={inputRef}
                id="chat-input"
                name="chat_message"
                aria-label="Chat message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={collectingLead ? "Type your answer…" : "Ask about your project…"}
                className="min-w-0 flex-1 text-base md:text-sm"
                autoFocus={!isMobile}
                disabled={isStreaming || showTyping}
              />
              <Button
                size="icon"
                variant="default"
                onClick={handleSend}
                className="shrink-0 bg-accent hover:bg-accent/90 text-accent-foreground"
                disabled={isStreaming || showTyping || !input.trim()}
                aria-label="Send"
              >
                <Send size={16} />
              </Button>
            </div>
            {/* AI-DISCLOSURE-TODO: persistent under-input disclosure so the
                AI label is always visible while the user is typing. When real
                human chat is introduced, swap copy per conversation mode. */}
            <p className="mt-1.5 text-[10px] leading-snug text-muted-foreground text-center">
              Responses are AI-generated and may be inaccurate. For emergencies, call 911.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
