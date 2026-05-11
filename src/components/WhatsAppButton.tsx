import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "972503721520";
const PREFILLED_MESSAGE = "Hi BuildRight USA, I would like to get a free estimate.";

export default function WhatsAppButton() {
    const href = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(PREFILLED_MESSAGE);
    return (
          <a href={href} target="_blank" rel="noopener noreferrer" aria-label="Chat with BuildRight USA on WhatsApp" className="fixed bottom-[76px] md:bottom-5 right-5 z-50 flex items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:scale-105 transition-transform duration-200 w-14 h-14 md:w-16 md:h-16">
                <MessageCircle className="w-7 h-7 md:w-8 md:h-8" aria-hidden="true" />
              </a>
        );
}
