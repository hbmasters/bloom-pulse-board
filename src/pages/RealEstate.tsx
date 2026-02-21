import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import REHeader from "@/components/real-estate/REHeader";
import REHero from "@/components/real-estate/REHero";
import REPlaces from "@/components/real-estate/REPlaces";
import REMaintenance from "@/components/real-estate/REMaintenance";
import RECertificates from "@/components/real-estate/RECertificates";
import REPartners from "@/components/real-estate/REPartners";
import REContact from "@/components/real-estate/REContact";
import REFooter from "@/components/real-estate/REFooter";
import REBackToTop from "@/components/real-estate/REBackToTop";
import HBMasterWidget from "@/components/hbmaster-widget/HBMasterWidget";
import type { HBMasterWidgetConfig } from "@/components/hbmaster-widget/types";

const RealEstate = () => {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase.from("profiles").select("full_name").eq("id", session.user.id).single().then(({ data }) => {
          setUserName(data?.full_name || session.user.email?.split("@")[0] || null);
        });
      }
    });
  }, []);

  const config: HBMasterWidgetConfig = {
    theme: "realestate",
    contextLabel: "Vastgoedbeheer",
    insightText: "Alle woningen SNF-gecertificeerd. 4 regio's actief.",
    position: "bottom-left",
  };

  return (
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
      <HBMasterWidget config={config} status="online" userName={userName || undefined} />
      <REBackToTop />
    </div>
  );
};

export default RealEstate;
