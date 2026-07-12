import { HomeComoFunciona } from "@/components/home/home-como-funciona";
import { HomeCta } from "@/components/home/home-cta";
import { HomeDepoimentos } from "@/components/home/home-depoimentos";
import { HomeFeatures } from "@/components/home/home-features";
import { HomeFooter } from "@/components/home/home-footer";
import { HomeHero } from "@/components/home/home-hero";
import { HomeLogos } from "@/components/home/home-logos";
import { HomeNav } from "@/components/home/home-nav";
import { HomePersonas } from "@/components/home/home-personas";
import { HomeStats } from "@/components/home/home-stats";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HomeNav />
      <HomeHero />
      <HomeStats />
      <HomeLogos />
      <HomeComoFunciona />
      <HomePersonas />
      <HomeFeatures />
      <HomeDepoimentos />
      <HomeCta />
      <HomeFooter />
    </div>
  );
}
