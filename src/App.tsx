import { Toaster } from "@/components/ui/toaster";
import ChatWidget from "./components/ChatWidget";import WhatsAppButton from "./components/WhatsAppButton";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/i18n/LanguageContext";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import GetQuote from "./pages/GetQuote";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import LocationDetail from "./pages/LocationDetail";
import LandingPage from "./pages/LandingPage";
import RenovationPreview from "./pages/RenovationPreview";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLeads from "./pages/admin/AdminLeads";
import AdminPipeline from "./pages/admin/AdminPipeline";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminContractors from "./pages/admin/AdminContractors";
import AdminDistributions from "./pages/admin/AdminDistributions";
import AdminPhotos from "./pages/admin/AdminPhotos";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import Disclaimer from "./pages/Disclaimer";
import LeadGenerationDisclosure from "./pages/LeadGenerationDisclosure";
import SmsConsent from "./pages/SmsConsent";
import CcpaNotice from "./pages/CcpaNotice";
import DataRights from "./pages/DataRights";

// React Query with sane defaults:
// staleTime 60s — prevents re-fetch on every navigation (was 0ms default).
// gcTime 5min — keeps data in memory between admin tab switches.
// retry 1 — one retry on network errors (was 3 by default).
// refetchOnWindowFocus false — no distracting re-fetches while typing notes.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <LanguageProvider>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/"                           element={<Index />} />
                <Route path="/get-a-quote"                element={<GetQuote />} />
                <Route path="/services"                   element={<Services />} />
                <Route path="/services/:slug"             element={<ServiceDetail />} />
                <Route path="/about"                      element={<About />} />
                <Route path="/contact"                    element={<Contact />} />
                <Route path="/renovation-preview"         element={<RenovationPreview />} />
                <Route path="/locations/:slug"            element={<LocationDetail />} />
                <Route path="/privacy-policy"             element={<PrivacyPolicy />} />
                <Route path="/terms-of-service"           element={<TermsOfService />} />
                <Route path="/cookie-policy"              element={<CookiePolicy />} />
                <Route path="/disclaimer"                 element={<Disclaimer />} />
                <Route path="/lead-generation-disclosure" element={<LeadGenerationDisclosure />} />
                <Route path="/sms-consent"                element={<SmsConsent />} />
                <Route path="/ccpa-notice"                element={<CcpaNotice />} />
                <Route path="/data-rights"                element={<DataRights />} />
                {/* SEO landing pages — must come after all explicit routes */}
                <Route path="/:slug"                      element={<LandingPage />} />
                {/* Admin */}
                <Route path="/admin/login"                element={<AdminLogin />} />
                <Route path="/admin"                      element={<AdminLayout />}>
                  <Route path="dashboard"                 element={<AdminDashboard />} />
                  <Route path="leads"                     element={<AdminLeads />} />
                  <Route path="pipeline"                  element={<AdminPipeline />} />
                  <Route path="contractors"               element={<AdminContractors />} />
                  <Route path="distributions"             element={<AdminDistributions />} />
                  <Route path="settings"                  element={<AdminSettings />} />
                  <Route path="photos"                    element={<AdminPhotos />} />
                </Route>
                <Route path="*"                           element={<NotFound />} />
              </Routes>
<ChatWidget /><WhatsAppButton />
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </LanguageProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
