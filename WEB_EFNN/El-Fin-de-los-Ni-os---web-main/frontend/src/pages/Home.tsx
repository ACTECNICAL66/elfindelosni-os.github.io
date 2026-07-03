import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { useScrollAnimation, useCountUp } from "../hooks/useAnimations";
import {
  Droplets,
  Satellite,
  Target,
  Globe,
  Map as MapIcon,
  ChevronRight,
  Activity,
  Download,
  BarChart3,
  Building2,
  Database,
  ShieldAlert,
  Cpu,
  Sparkles,
  AlertTriangle,
  CloudSun,
  Sprout,
  ArrowRight,
} from "lucide-react";
import {
  cuencasData,
  predictNDVI,
  techStack,
  efficiencyMetrics,
  paradigmComparison,
} from "../data/projectData";

function SectionHeader({
  title,
  subtitle,
  icon: Icon,
}: {
  title: string;
  subtitle?: string;
  icon: any;
}) {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div
      ref={ref}
      className={`text-center mb-16 ${isVisible ? "animate-slide-up" : "opacity-0"}`}
    >
      <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-water-500/10 text-water-400 mb-6 shadow-[0_0_30px_rgba(30,184,255,0.2)]">
        <Icon className="w-8 h-8" />
      </div>
      <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function StatBox({ metric, index }: { metric: any; index: number }) {
  const { count, ref } = useCountUp(metric.value);
  const { ref: scrollRef, isVisible } = useScrollAnimation();

  return (
    <div
      ref={el => {
        ref.current = el;
        // @ts-ignore
        scrollRef.current = el;
      }}
      className={`glass-card p-6 relative overflow-hidden group hover-lift ${isVisible ? "animate-slide-up" : "opacity-0"}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-water-500/10 rounded-full blur-2xl group-hover:bg-water-500/20 transition-colors" />
      <span className="stat-number block mb-2">
        {count}
        {metric.suffix}
      </span>
      <h3 className="text-white/90 font-medium mb-2">{metric.label}</h3>
      <p className="text-white/50 text-sm leading-relaxed">
        {metric.description}
      </p>
    </div>
  );
}

export default function Home() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const [phenomenon, setPhenomenon] = useState<"normal" | "nino" | "nina">(
    "normal"
  );
  const [precipitation, setPrecipitation] = useState(100);
  const [temperature, setTemperature] = useState(25);
  const prediction = predictNDVI(precipitation, temperature, phenomenon);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-nasa-dark selection:bg-water-500/30">
      <Navigation />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden particles-bg section-dark">
        {/* Abstract animated glowing shapes */}
        <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-water-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-pulse-slow pointer-events-none" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] bg-eco-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse-slow pointer-events-none"
          style={{ animationDelay: "2s" }}
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid lg:grid-cols-2 gap-16 items-center">
          <div
            ref={heroRef}
            className={`${heroVisible ? "animate-slide-up" : "opacity-0"}`}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-water-500/10 border border-water-500/20 text-water-300 text-xs font-semibold uppercase tracking-widest mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-water-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-water-500"></span>
              </span>
              NASA Space Apps 2025
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-extrabold text-white leading-[1.1] tracking-tight mb-6">
              Escudo Hídrico <br />
              <span className="gradient-text">Inteligente</span>
            </h1>

            <p className="text-xl text-white/70 leading-relaxed mb-10 max-w-xl">
              Sistema geoespacial de micro-represas IoT para proteger la
              provincia de Córdoba de los extremos climáticos de El Niño y La
              Niña.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link to="/paradigmas" className="btn-primary">
                Ver Análisis Paradigmas
                <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
              <a href="#demo" className="btn-secondary">
                Simulador NDVI
              </a>
            </div>

            <div className="mt-12 flex items-center gap-6 border-t border-white/10 pt-8">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-nasa-dark bg-white/10 backdrop-blur-md flex items-center justify-center text-xs font-bold text-white/70"
                  >
                    U{i}
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/50">
                Investigación abierta liderada por estudiantes del IPET 66
              </p>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-water-500/30 to-transparent rounded-full blur-[80px]" />
            <div className="glass-card relative z-10 p-8 border-water-500/30 animate-float">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-water-500/20 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-water-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">
                      Monitoreo Satelital
                    </h3>
                    <p className="text-xs text-white/50">
                      Estado de Cuencas en Tiempo Real
                    </p>
                  </div>
                </div>
                <div className="tag-green animate-pulse">ESTABLE</div>
              </div>

              <div className="rounded-xl overflow-hidden border border-white/10">
                <img
                  src="/El-Fin-de-los-Ni-os---web/mapa-cuencas.png"
                  alt="Mapa de Cuencas - Región de Córdoba"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center text-xs text-white/40 font-mono">
                <span>CONEXIÓN OWM: ACTIVA</span>
                <span>LAT: -31.42 LON: -64.18</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT METRICS */}
      <section className="py-24 relative section-alt border-y border-white/[0.05]">
        <div className="grid-overlay absolute inset-0 opacity-[0.15]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionHeader
            title="Eficiencia Demostrada"
            subtitle="El impacto medible de cambiar el paradigma de macro a micro-gestión hídrica."
            icon={Target}
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {efficiencyMetrics.map((metric, i) => (
              <StatBox key={i} metric={metric} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ANALYZED TERRITORY */}
      <section className="py-24 relative overflow-hidden section-dark">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionHeader
            title="Territorio Analizado"
            subtitle="Mapeo estratégico de cuencas en las Sierras de Córdoba utilizando inteligencia geoespacial."
            icon={Globe}
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cuencasData.slice(0, 6).map((cuenca, i) => (
              <div
                key={i}
                className="glass-card hover:border-water-500/30 transition-all p-6 relative overflow-hidden group"
              >
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-water-500/10 transition-colors" />
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-water-500/10 flex items-center justify-center text-water-400 font-black text-xs border border-water-500/20">
                      {cuenca.number}
                    </div>
                    <h4 className="text-white font-bold">{cuenca.name}</h4>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded border ${
                      cuenca.potential === "high"
                        ? "bg-eco-500/10 border-eco-500/20 text-eco-400"
                        : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    POTENCIAL: {cuenca.potential === "high" ? "ALTO" : "MEDIO"}
                  </span>
                </div>
                <p className="text-white/50 text-xs leading-relaxed line-clamp-3 mb-4">
                  {cuenca.description}
                </p>
                <div className="flex items-center gap-4 text-[10px] font-bold text-white/30 uppercase tracking-tighter">
                  <span>Área: {cuenca.area}</span>
                  <span>•</span>
                  <span>
                    Coords: {cuenca.lat}, {cuenca.lng}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARADIGM COMPARISON SECTION - NEW */}
      <section className="py-32 relative overflow-hidden section-dark">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-eco-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionHeader
            title="Cambio de Paradigma"
            subtitle="Superando la ingeniería civil centralizada mediante inteligencia geoespacial capilar."
            icon={Building2}
          />

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="glass-card p-8 border-l-4 border-l-red-500/50 bg-red-500/5">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-xl font-bold text-white">
                    Siglo XX: Centralizado
                  </h3>
                  <span className="tag-red">RIESGO ALTO</span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-4">
                  Mega-represas costosas, alto impacto ambiental y
                  vulnerabilidad total ante extremos sísmicos o climáticos
                  severos.
                </p>
                <div className="flex items-center gap-4 text-xs font-mono text-red-400">
                  <span>VULNERABILIDAD: 85%</span>
                  <span>COSTO: USD 2B+</span>
                </div>
              </div>

              <div className="glass-card p-8 border-l-4 border-l-eco-500/50 bg-eco-500/5 translate-x-4 md:translate-x-8">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-xl font-bold text-white">
                    Siglo XXI: Distribuido
                  </h3>
                  <span className="tag-green">RESILIENTE</span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-4">
                  Red capilar de micro-represas IoT que "atrapan el agua donde
                  cae", minimizando costos y maximizando la resiliencia
                  territorial.
                </p>
                <div className="flex items-center gap-4 text-xs font-mono text-eco-400">
                  <span>RESILIENCIA: 92%</span>
                  <span>COSTO: -80%</span>
                </div>
              </div>

              <div className="pt-6">
                <Link to="/paradigmas" className="btn-secondary group">
                  Explorar Análisis Detallado
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-water-500/20 to-eco-500/20 rounded-3xl blur-2xl opacity-50" />
              <div className="glass-card overflow-hidden border-white/10 aspect-video relative">
                <img
                  src="/El-Fin-de-los-Ni-os---web/nasa_water_basins_satellite_visualization_1779314876453.png"
                  alt="Visualización NASA Earthdata"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-nasa-dark via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-eco-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-white/50 tracking-wider">
                      MAPA DE FLUJO CAPILAR v.2.4
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                    Earthdata Dataset
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="py-32 relative section-dark">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            title="Tecnología Aplicada"
            subtitle="Arquitectura de software y hardware basada en open-source y datos abiertos de agencias espaciales."
            icon={Satellite}
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Tech cards */}
            {[
              {
                title: "IoT & Firmware",
                tags: techStack.filter(
                  t => t.category === "hardware" || t.category === "firmware"
                ),
                icon: Droplets,
                color: "text-blue-400",
                bg: "bg-blue-400/10",
              },
              {
                title: "Inteligencia Geoespacial",
                tags: techStack.filter(t => t.category === "geo"),
                icon: MapIcon,
                color: "text-eco-400",
                bg: "bg-eco-400/10",
              },
              {
                title: "Software Ecosystem",
                tags: techStack.filter(
                  t => t.category === "programming" || t.category === "tools"
                ),
                icon: Globe,
                color: "text-purple-400",
                bg: "bg-purple-400/10",
              },
            ].map((col, i) => (
              <div
                key={i}
                className="glass-card p-8 hover-lift border-t border-t-white/10 relative overflow-hidden"
              >
                <div
                  className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full ${col.bg} blur-2xl opacity-50`}
                />
                <div
                  className={`w-12 h-12 rounded-xl ${col.bg} flex items-center justify-center mb-6`}
                >
                  <col.icon className={`w-6 h-6 ${col.color}`} />
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-6">
                  {col.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {col.tags.map(tag => (
                    <span
                      key={tag.name}
                      className="px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-white/70 text-sm font-medium hover:bg-white/10 transition-colors"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO / SIMULATOR SECTION */}
      <section
        id="demo"
        className="py-32 relative section-alt border-y border-white/[0.05]"
      >
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-water-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionHeader
            title="Simulador de Índice de Vegetación (NDVI)"
            subtitle="Modelo interactivo que simula el impacto de la temperatura y precipitación en la salud de la vegetación según los fenómenos climáticos."
            icon={Sprout}
          />

          <div className="glass-card-light overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
              {/* Controls */}
              <div className="p-10 space-y-8">
                <div>
                  <label className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4 block">
                    Fenómeno Climático Global
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      {
                        id: "normal",
                        label: "Neutral",
                        bg: "bg-white/5 hover:bg-white/10",
                        border: "border-white/10",
                      },
                      {
                        id: "nino",
                        label: "El Niño",
                        bg: "bg-red-500/10 hover:bg-red-500/20",
                        border: "border-red-500/30",
                      },
                      {
                        id: "nina",
                        label: "La Niña",
                        bg: "bg-water-500/10 hover:bg-water-500/20",
                        border: "border-water-500/30",
                      },
                    ].map(mode => (
                      <button
                        key={mode.id}
                        onClick={() => setPhenomenon(mode.id as any)}
                        className={`py-3 px-4 rounded-xl text-sm font-medium transition-all border ${
                          phenomenon === mode.id
                            ? mode.border +
                              " " +
                              mode.bg.split(" ")[0] +
                              " text-white shadow-lg"
                            : "border-white/5 bg-white/5 text-white/50"
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-4">
                    <label className="text-sm font-semibold text-white/50 uppercase tracking-wider">
                      Precipitación Anual Estimada
                    </label>
                    <span className="text-water-400 font-mono font-bold">
                      {precipitation} mm
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="250"
                    value={precipitation}
                    onChange={e => setPrecipitation(Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-water-500"
                  />
                  <div className="flex justify-between mt-2 text-xs text-white/30">
                    <span>Sequía Severa</span>
                    <span>Inundación</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-4">
                    <label className="text-sm font-semibold text-white/50 uppercase tracking-wider">
                      Temperatura Promedio
                    </label>
                    <span className="text-orange-400 font-mono font-bold">
                      {temperature} °C
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="45"
                    value={temperature}
                    onChange={e => setTemperature(Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                </div>
              </div>

              {/* Display Result */}
              <div className="p-10 flex flex-col justify-center items-center relative overflow-hidden">
                <div
                  className={`absolute inset-0 bg-gradient-to-br opacity-5 ${
                    prediction.status.includes("Saludable")
                      ? "from-green-500 to-transparent"
                      : prediction.status.includes("Leve")
                        ? "from-yellow-500 to-transparent"
                        : "from-red-500 to-transparent"
                  }`}
                />

                <h3 className="text-white/50 uppercase tracking-widest text-sm font-bold mb-4 relative z-10">
                  Valor Predicho (NDVI)
                </h3>

                <div className="relative mb-8 text-center z-10">
                  <span
                    className={`text-[6rem] font-display font-black leading-none bg-clip-text text-transparent bg-gradient-to-b ${
                      prediction.status.includes("Saludable")
                        ? "from-eco-400 to-eco-600"
                        : prediction.status.includes("Leve")
                          ? "from-yellow-400 to-yellow-600"
                          : "from-red-400 to-red-600"
                    }`}
                  >
                    {prediction.ndvi.toFixed(2)}
                  </span>
                </div>

                <div
                  className={`tag ${
                    prediction.status.includes("Saludable")
                      ? "tag-green"
                      : prediction.status.includes("Leve")
                        ? "tag-orange"
                        : "tag-red"
                  } px-6 py-2 text-sm mb-6 z-10`}
                >
                  ESTADO: {prediction.status}
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center max-w-sm w-full z-10 backdrop-blur-md">
                  <p className="text-sm text-white/40 uppercase font-semibold mb-2">
                    Recomendación del Sistema
                  </p>
                  <p className={`text-base font-medium ${prediction.color}`}>
                    {prediction.recommendation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 relative overflow-hidden section-dark">
        <div className="absolute inset-0 bg-hero-pattern opacity-50 mix-blend-color-dodge" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-water-500/20 backdrop-blur-md mb-8">
            <ShieldAlert className="w-10 h-10 text-water-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            La infraestructura del ayer no resistirá el clima del mañana.
          </h2>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            Descubre nuestro estudio comparativo detallado y la documentación de
            la arquitectura tecnológica.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/paradigmas" className="btn-primary">
              Comparativa de Paradigmas
            </Link>
            <Link to="/documentacion" className="btn-secondary">
              Leer Documentación
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
