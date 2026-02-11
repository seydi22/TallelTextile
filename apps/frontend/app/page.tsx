import { CategoryMenu, Incentives, IntroducingSection, Newsletter, ProductsSection } from "@/components";
import HeroZuma from "@/components/HeroZuma";

// Force le rendu dynamique : les produits sont récupérés à chaque visite, pas au build
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
    <HeroZuma />
    <IntroducingSection />
    <CategoryMenu />
    <ProductsSection />
    </>
  );
}
