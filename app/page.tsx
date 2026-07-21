import { HomeCta } from "@/components/home/home-cta";
import { HomeDepoimentos } from "@/components/home/home-depoimentos";
import { HomeFeatures } from "@/components/home/home-features";
import { HomeFooter } from "@/components/home/home-footer";
import { HomeLogos } from "@/components/home/home-logos";
import { HomePersonas } from "@/components/home/home-personas";
import { HomeStats } from "@/components/home/home-stats";
import { Hero } from "@/components/ui/hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-fundo-pagina">
      <Hero />
      <HomeStats />
      <HomeLogos />
      <HomePersonas />
      <HomeFeatures />
      <HomeDepoimentos />
      <HomeCta />
      <HomeFooter />
    </div>
  );
}
