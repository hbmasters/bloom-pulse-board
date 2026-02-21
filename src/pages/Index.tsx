import ProductionHeader from "@/components/ProductionHeader";
import ActiveProduction from "@/components/ActiveProduction";
import DailyStats from "@/components/DailyStats";
import CompletedProduction from "@/components/CompletedProduction";
import MotivationBanner from "@/components/MotivationBanner";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ProductionHeader />
      <main className="flex-1 px-8 py-6 space-y-6 max-w-[1920px] mx-auto w-full">
        <MotivationBanner />
        <DailyStats />
        <ActiveProduction />
        <CompletedProduction />
      </main>
    </div>
  );
};

export default Index;
