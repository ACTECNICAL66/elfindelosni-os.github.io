import { asset } from "@/lib/utils";
import { StatCard } from "./shared";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={asset("/hero-bg.jpg")}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-nasa-dark/80 via-nasa-dark/60 to-nasa-dark/90" />
      </div>
      <div className="absolute inset-0 particles-bg" />
      <div className="absolute inset-0 grid-overlay" />
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-water-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-eco-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center pt-32 pb-20">
        <span className="inline-block tag-blue mb-6">
          NASA Space Apps Challenge 2025
        </span>
        <h1 className="font-display font-bold text-5xl md:text-7xl text-white mb-4 leading-tight">
          El Fin de los <span className="gradient-text">Niños</span>
        </h1>
        <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto mb-12 leading-relaxed">
          Sistema de gestión hídrica resiliente ante los fenómenos de El Niño y
          La Niña en Córdoba, Argentina
        </p>
        <div className="flex flex-wrap justify-center gap-6 items-center">
          <div className="glass-card p-3 min-w-[180px] hover-lift group">
            <img
              src={asset("/mapa-cuencas.png")}
              alt="Mapa de Cuencas - Región de Córdoba"
              className="w-full h-auto rounded-lg"
            />
            <span className="text-xs font-medium uppercase tracking-wider text-white/50 mt-2 block text-center">
              Cuencas Analizadas
            </span>
          </div>
          <StatCard number={100} label="Codigo Abierto" suffix="%" />
          <StatCard number={15} label="Anos de Datos Climaticos" suffix="+" />
        </div>
      </div>
    </section>
  );
}
