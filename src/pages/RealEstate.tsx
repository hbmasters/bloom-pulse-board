import REHeader from "@/components/real-estate/REHeader";
import REHero from "@/components/real-estate/REHero";
import REPlaces from "@/components/real-estate/REPlaces";
import REMaintenance from "@/components/real-estate/REMaintenance";
import RECertificates from "@/components/real-estate/RECertificates";
import REPartners from "@/components/real-estate/REPartners";
import REContact from "@/components/real-estate/REContact";
import REFooter from "@/components/real-estate/REFooter";
import REWeetjes from "@/components/real-estate/REWeetjes";
import REBackToTop from "@/components/real-estate/REBackToTop";

const RealEstate = () => (
  <div className="min-h-screen bg-[#0d1b2e]">
    <REHeader />
    <main>
      <REHero />
      <REPlaces />
      <REMaintenance />
      <RECertificates />
      <REPartners />
      <REContact />
    </main>
    <REFooter />
    <REWeetjes />
    <REBackToTop />
  </div>
);

export default RealEstate;
