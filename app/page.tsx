import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import ProjectHighlights from "@/components/sections/ProjectHighlights";
import BrochureCTA from "@/components/sections/BrochureCTA";
import LifestylePillars from "@/components/sections/LifestylePillars";
import VillaDesigns from "@/components/sections/VillaDesigns";
import LifeBeyondHome from "@/components/sections/LifeBeyondHome";
import QuickEnquiry from "@/components/sections/QuickEnquiry";
import Blogs from "@/components/sections/Blogs";
import EverythingWithinReach from "@/components/sections/EverythingWithinReach";
import SmoothScroll from "@/components/layout/SmoothScroll";
export default function Home() {
  return (
    <>
    <SmoothScroll>
      <Navbar />
      <main className="max-w-[1920px] mx-auto w-full">
        <Hero />
        <ProjectHighlights />
      
        <LifestylePillars />
        {/* <VillaDesigns /> */}
        <BrochureCTA />
        <LifeBeyondHome />
        <QuickEnquiry />
        <Blogs />
        <EverythingWithinReach />
      </main>
      <Footer />
      </SmoothScroll>
    </>
  );
}