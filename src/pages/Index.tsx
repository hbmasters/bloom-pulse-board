import ProductionHeader from "@/components/ProductionHeader";
import ActiveProduction from "@/components/ActiveProduction";
import CompletedProduction from "@/components/CompletedProduction";
import LinesOverview from "@/components/LinesOverview";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ProductionHeader />
      <main className="flex-1 px-8 py-6 space-y-8 max-w-[1920px] mx-auto w-full">
        <ActiveProduction />
        <CompletedProduction />
        <LinesOverview />
      </main>
    </div>
  );
};

export default Index;
