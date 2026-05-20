import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import ChatWidget from "./components/ChatWidget";
import WhatsAppButton from "./components/WhatsAppButton";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/i18n/LanguageContext";
import ScrollToTop from "@/components/ScrollToTop";

// PERF-TODO (Sprint Task 11): route-level code splitting via React.lazy.
// Only Index (homepage LCP) and NotFound (cheap, always-reachable) are
// kept eager so the first paint of the most-trafficked route doesn't
// pay a network roundtrip. Every other public, admin, legal, and
// AI Preview route becomes its own JS chunk that Vercel can serve
// independently. When a visitor opens the homepage:
//   - the admin bundle never downloads at all
//   - the AI Preview (and its photo / before-after components) only
//     downloads when /renovation-preview is opened
//   - legal pages only download when their footer link is clicked
//
// Pre-Task-11 baseline was a single 1.44 MB bundle; the split moves
// admin/legal/landing/AI-Preview weight out of the critical path.
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Public — lazy
const GetQuote          = lazy(() => import("./pages/GetQuote"));
const Services          = lazy(() => import("./pages/Services"));
const ServiceDetail     = lazy(() => import("./pages/ServiceDetail"));
const About             = lazy(() => import("./pages/About"));
const Contact           = lazy(() => import("./pages/Contact"));
const LocationDetail    = lazy(() => import("./pages/LocationDetail"));
const LandingPage       = lazy(() => import("./pages/LandingPage"));
const RenovationPreview = lazy(() => import("./pages/RenovationPreview"));

// Admin — lazy. These pages contain CRM CRUD + admin-only deps; they
// must never download on a homeowner-visitor page paint.
const AdminLogin         = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout        = lazy(() => import("./components/admin/AdminLayout"));
const AdminDashboard     = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminLeads         = lazy(() => import("./pages/admin/AdminLeads"));
const AdminPipeline      = lazy(() => import("./pages/admin/AdminPipeline"));
const AdminSettings      = lazy(() => import("./pages/admin/AdminSettings"));
const AdminContractors   = lazy(() => import("./pages/admin/AdminContractors"));
const AdminDistributions = lazy(() => import("./pages/admin/AdminDistributions"));
const AdminPhotos        = lazy(() => import("./pages/admin/AdminPhotos"));

// Legal / regulatory — lazy
const PrivacyPolicy            = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService           = lazy(() => import("./pages/TermsOfService"));
const CookiePolicy             = lazy(() => import("./pages/CookiePolicy"));
const Disclaimer               = lazy(() => import("./pages/Disclaimer"));
const LeadGenerationDisclosure = lazy(() => import("./pages/LeadGenerationDisclosure"));
const SmsConsent               = lazy(() => import("./pages/SmsConsent"));
const CcpaNotice               = lazy(() => import("./pages/CcpaNotice"));
const DataRights               = lazy(() => import("./pages/DataRights"));

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

// PERF-TODO: route-suspense fallback is intentionally invisible (a 0-height
// div) — for a single 50-100 KB chunk on a fast connection it's barely
// perceptible. If a chunk grows large, swap this for a route-skeleton.
const RouteFallback = () => <div style={{ minHeight: "60vh" }} aria-hidden="true" />;

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
              <Suspense fallback={<RouteFallback />}>
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
              </Suspense>
              <ChatWidget />
              <WhatsAppButton />
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </LanguageProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
