import BackToTop from "@/components/BackToTop";
import BrandSignature from "@/components/BrandSignature";
import BlogPreview from "@/components/BlogPreview";
import CTA from "@/components/CTA";
import CursorTrail from "@/components/CursorTrail";
import CursorSpotlight from "@/components/CursorSpotlight";
import CustomCursor from "@/components/CustomCursor";
import EasterEggOverlay from "@/components/EasterEggOverlay";
import FAQ from "@/components/FAQ";
import FeaturedWork from "@/components/FeaturedWork";
import FloatingCTA from "@/components/FloatingCTA";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import LeadMagnet from "@/components/LeadMagnet";
import MagneticButtons from "@/components/MagneticButtons";
import Navbar from "@/components/Navbar";
import PageTransitionOverlay from "@/components/PageTransitionOverlay";
import Preloader from "@/components/Preloader";
import Process from "@/components/Process";
import SectionAura from "@/components/SectionAura";
import SectionDots from "@/components/SectionDots";
import ScrollProgress from "@/components/ScrollProgress";
import Services from "@/components/Services";
import SocialProofToasts from "@/components/SocialProofToasts";
import SmoothScroll from "@/components/SmoothScroll";
import Testimonials from "@/components/Testimonials";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function HomePage() {
  return (
    <SmoothScroll>
      <SectionAura />
      <Preloader />
      <PageTransitionOverlay />
      <Navbar />
      <ScrollProgress />
      <SectionDots />
      <div className="site-grade" />
      <div className="ambient-noise" />
      <div className="site-vignette" />
      <BrandSignature />
      <MagneticButtons />
      <CustomCursor />
      <CursorSpotlight />
      <CursorTrail />
      <EasterEggOverlay />
      <FloatingCTA />
      <SocialProofToasts />
      <WhatsAppButton />
      <BackToTop />
      <main className="overflow-x-clip bg-bg pb-4 pt-14 md:pt-16">
        <Hero />
        <Services />
        <FeaturedWork />
        <Process />
        <Testimonials />
        <BlogPreview />
        <LeadMagnet />
        <FAQ />
        <CTA />
        <Footer />
      </main>
    </SmoothScroll>
  );
}
