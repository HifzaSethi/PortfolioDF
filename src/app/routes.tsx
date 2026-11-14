import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Skeleton } from '../components/ui/Skeleton';
import HomePage from '../pages/HomePage';
const AboutPage = lazy(() => import('../pages/AboutPage'));
const ServicesPage = lazy(() => import('../pages/ServicesPage'));
const IntelligencePage = lazy(() => import('../pages/IntelligencePage'));
const PerformanceMarketingPage = lazy(() => import('../pages/PerformanceMarketingPage'));
const SearchIntelligencePage = lazy(() => import('../pages/SearchIntelligencePage'));
const GrowthMarketingPage = lazy(() => import('../pages/GrowthMarketingPage'));
const DigitalTransformationPage = lazy(() => import('../pages/DigitalTransformationPage'));
const StudioPage = lazy(() => import('../pages/StudioPage'));
const IndustriesPage = lazy(() => import('../pages/IndustriesPage'));
const HospitalityPage = lazy(() => import('../pages/HospitalityPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

export function AppRoutes() {
  return (
    <Suspense fallback={<Skeleton />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/intelligence" element={<IntelligencePage />} />
        <Route path="/services/performance-marketing" element={<PerformanceMarketingPage />} />
        <Route path="/services/search-intelligence" element={<SearchIntelligencePage />} />
        <Route path="/services/growth-marketing" element={<GrowthMarketingPage />} />
        <Route path="/services/digital-transformation" element={<DigitalTransformationPage />} />
        <Route path="/studio" element={<StudioPage />} />
        <Route path="/industries" element={<IndustriesPage />} />
        <Route path="/hospitality" element={<HospitalityPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
