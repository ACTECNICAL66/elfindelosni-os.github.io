import { useEffect, useState, useRef, type ReactNode } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { trpc } from "@/providers/trpc";
import { useScrollAnimation } from "@/hooks/useAnimations";
import {
  Sparkles,
  Leaf,
  ChevronRight,
  CloudSunRain,
  Globe,
  Shield,
  DollarSign,
  Users,
  Send,
  Loader2,
  ToggleLeft,
  ToggleRight,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const FALLBACK_PROJECTS = [
  {
    id: "1",
    name: "Aprovechamiento Múltiple del Río Paraná",
    number: 1,
    location: "Límite provincial Santa Fe – Corrientes",
    description:
      "Megaproyecto de infraestructura hidroeléctrica y de regulación de caudales sobre el Río Paraná. Incluye una presa principal de 3.5 km de longitud, un embalse de 120 km² y una central hidroeléctrica de 3.200 MW. El costo estimado supera los 8.000 millones de dólares.",
    inviabilityReason:
      "Costo excesivo (9/10), impacto ambiental devastador sobre el ecosistema del Paraná (9/10), desplazamiento de comunidades enteras, alta vulnerabilidad a eventos climáticos extremos (8/10) y conflictos interestatales por la distribución del agua.",
    costIndex: 92,
    impactIndex: 88,
    vulnerabilityIndex: 82,
  },
  {
    id: "2",
    name: "Trasvase del Río San Francisco",
    number: 2,
    location: "Córdoba – Santiago del Estero",
    description:
      "Proyecto de trasvase interprovincial para derivar agua del Río San Francisco hacia el norte de Córdoba y Santiago del Estero. Incluye 180 km de canales, 12 túneles y 5 estaciones de bombeo con un costo estimado de 3.500 millones de dólares.",
    inviabilityReason:
      "Conflicto interprovincial no resuelto (7/10), impacto ecológico severo sobre el río donante (8/10), costos de operación y mantenimiento prohibitivos (8/10), y dependencia de infraestructura única y centralizada vulnerable a sabotajes o desastres.",
    costIndex: 85,
    impactIndex: 82,
    vulnerabilityIndex: 78,
  },
  {
    id: "3",
    name: "Presa de Embalse Único en el Río Primero",
    number: 3,
    location: "Cuenca del Río Primero, Córdoba",
    description:
      "Proyecto de una gran presa de 80 m de altura sobre el Río Primero para crear un embalse de regulación plurianual de 450 hm³. Incluye obras de defensa contra inundaciones para la ciudad de Córdoba y un sistema de riego para 80.000 hectáreas.",
    inviabilityReason:
      "Inundación de 15.000 hectáreas de tierras productivas (8/10), alto costo de construcción en un período de restricción fiscal (7/10), sedimentación acelerada del embalse (8/10), y poca flexibilidad para adaptarse a distintos escenarios climáticos ENSO.",
    costIndex: 78,
    impactIndex: 75,
    vulnerabilityIndex: 72,
  },
  {
    id: "4",
    name: "Aprovechamiento Integral del Río Tercero",
    number: 4,
    location: "Río Tercero (Ctalamochita), Tercero Arriba",
    description:
      "Megaproyecto de aprovechamiento múltiple del Río Tercero que incluye una presa de 65 m de altura, un embalse de 280 hm³ y 150 km de canales para riego de 50.000 ha y abastecimiento a 12 localidades. Presupuesto estimado de 2.800 millones de dólares.",
    inviabilityReason:
      "Alto impacto sobre humedales del valle del Ctalamochita (7/10), conflicto por expropiaciones rurales (6/10), sedimentación acelerada del embalse (7/10), y vulnerabilidad a sequías prolongadas que dejarían el embalse inoperativo (7/10).",
    costIndex: 82,
    impactIndex: 74,
    vulnerabilityIndex: 68,
  },
  {
    id: "5",
    name: "Sistema de Riego del Noroeste - Dique Pichanas",
    number: 5,
    location: "Río Pichanas, noroeste de Córdoba",
    description:
      "Dique de 55 m con embalse de 180 hm³ para riego y agua potable en la región más árida del noroeste cordobés. Incluye 120 km de canales revestidos y 8 estaciones de bombeo. Costo estimado de 1.900 millones de dólares.",
    inviabilityReason:
      "Relación costo-beneficio desfavorable por baja densidad poblacional (7/10), pérdidas por evaporación en clima árido (8/10), escurrimiento insuficiente en años secos que compromete el llenado (8/10), y conflicto con comunidades originarias (5/10).",
    costIndex: 75,
    impactIndex: 70,
    vulnerabilityIndex: 82,
  },
  {
    id: "6",
    name: "Canal Madre del Sur Cordobés",
    number: 6,
    location: "Sur de Córdoba (Río Cuarto, Gral. Roca, Juárez Celman)",
    description:
      "Canal troncal de 200 km para conectar los principales ríos del sur y distribuir agua a 120.000 ha agrícolas. Incluye 4 embalses reguladores y un acueducto complementario de 80 km. Inversión de 4.200 millones de dólares.",
    inviabilityReason:
      "Inversión con retorno incierto (9/10), salinización progresiva de suelos por riego continuo (7/10), dependencia de caudales cada vez más erráticos por cambio climático (8/10), y fragmentación de ecosistemas del espinal (7/10).",
    costIndex: 88,
    impactIndex: 72,
    vulnerabilityIndex: 78,
  },
  {
    id: "7",
    name: "Trasvase Sistema Embalses del Sur",
    number: 7,
    location: "Embalse Los Molinos — Cuenca del Río Cuarto",
    description:
      "Trasvase intercuencas de 100 km desde el sistema Los Molinos hacia la cuenca del Río Cuarto, con 8 km de túneles y estaciones de bombeo de 300 m de altura. Costo estimado de 3.100 millones de dólares.",
    inviabilityReason:
      "Costo energético prohibitivo por bombeo de gran altura (9/10), impacto geológico en zona de fallas activas (6/10), reducción crítica del caudal ecológico en cuenca donante (8/10), y riesgo de dependencia total de un único sistema vulnerable a desastres (7/10).",
    costIndex: 90,
    impactIndex: 76,
    vulnerabilityIndex: 72,
  },
];

function SectionDivider() {
  return (
    <div className="relative h-24 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-water-500/5 to-transparent" />
      <div className="relative w-full max-w-4xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-water-500/30 to-transparent" />
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-water-500/40 animate-pulse" />
    </div>
  );
}

function ScrollReveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${isVisible ? "aos-visible" : "aos-hidden"} ${className}`}
    >
      {children}
    </div>
  );
}

const FALLBACK_COMPARISON = {
  dimensions: [
    "Costo",
    "Impacto Ambiental",
    "Vulnerabilidad Climática",
    "Tiempo de Implementación",
    "Escalabilidad",
    "Resiliencia Comunitaria",
  ],
  centralized: [9, 9, 8, 7, 3, 2],
  distributed: [3, 2, 9, 4, 9, 9],
};

function ParadigmaHero() {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const heroRef = useScrollAnimation();

  const generateSummary = async () => {
    setLoading(true);
    setShowSummary(true);
    setSummary("");
    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCow8qhRGzD9ABugrXzEQMdX_1EmD2PuHU",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Como experto en gestion hidrica, genera un resumen ejecutivo dirigido a autoridades provinciales sobre el proyecto "El Fin de los Ninos" para Cordoba Argentina. El proyecto propone micro-represas distribuidas monitoreadas con sensores ESP32 y datos satelitales NASA como alternativa a megaproyectos hidricos. Incluye datos de 7 cuencas analizadas, indices NDVI/ESI, y proyecciones a 2050 con demanda de 2600 Hm3. Genera un resumen profesional de 3 paragrafos.`,
                  },
                ],
              },
            ],
          }),
        }
      );
      const data = await response.json();
      setSummary(
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
          "No se pudo generar el resumen."
      );
    } catch {
      setSummary("Error al generar el resumen. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      ref={heroRef.ref}
      className={`pt-32 pb-16 section-dark relative overflow-hidden particles-bg grid-overlay ${heroRef.isVisible ? "aos-visible" : "aos-hidden"}`}
    >
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-water-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-eco-500/5 rounded-full blur-[100px] pointer-events-none animate-pulse-slow"
        style={{ animationDelay: "-2s" }}
      />
      <div className="absolute top-20 left-10 w-20 h-20 border border-water-500/10 rounded-full animate-float" />
      <div
        className="absolute bottom-20 right-16 w-32 h-32 border border-eco-500/5 rounded-full animate-float"
        style={{ animationDelay: "-3s" }}
      />
      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        <span className="inline-block tag-blue mb-6">
          NASA Space Apps Challenge 2025
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          Análisis Comparativo de Paradigmas en la{" "}
          <span className="gradient-text">Gestión de Recursos Hídricos</span>
        </h1>
        <p className="text-lg text-white/60 max-w-3xl mx-auto mb-8 leading-relaxed">
          Un estudio de caso en Córdoba, Argentina, que contrasta la ingeniería
          civil del siglo XX con la inteligencia geoespacial del siglo XXI para
          proponer un futuro hídrico sostenible y resiliente.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button onClick={generateSummary} className="btn-primary">
            <Sparkles className="w-5 h-5" />
            Generar Resumen Ejecutivo con IA
          </button>
        </div>

        {showSummary && (
          <div className="mt-8 text-left glass border-l-4 border-water-500 rounded-xl p-6 animate-fadeIn shadow-xl">
            {loading ? (
              <div className="flex items-center gap-3 text-white/60">
                <Loader2 className="w-5 h-5 animate-spin" />
                Generando resumen profesional...
              </div>
            ) : (
              <div className="prose prose-invert max-w-none">
                {summary.split("\n").map((p, i) => (
                  <p key={i} className="text-white/70 leading-relaxed mb-3">
                    {p}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function ParadigmaI() {
  const sectionRef = useScrollAnimation();
  const { data: trpcProjects } = trpc.paradigms.listProjects.useQuery({
    paradigm: "centralized",
  });
  const [selectedProject, setSelectedProject] = useState(0);

  const projectList = (trpcProjects ??
    FALLBACK_PROJECTS) as typeof FALLBACK_PROJECTS;
  const selected = projectList[selectedProject];

  const metrics = [
    {
      label: "Costo",
      value: selected?.costIndex ?? 0,
      color: "red",
      desc: "Inversión económica necesaria para su construcción y operación",
    },
    {
      label: "Impacto Ambiental",
      value: selected?.impactIndex ?? 0,
      color: "orange",
      desc: "Daño potencial sobre ecosistemas, biodiversidad y recursos naturales",
    },
    {
      label: "Vulnerabilidad",
      value: selected?.vulnerabilityIndex ?? 0,
      color: "purple",
      desc: "Exposición a fallos por eventos climáticos extremos o sabotaje",
    },
  ];

  return (
    <section
      ref={sectionRef.ref}
      className={`section-alt py-20 relative overflow-hidden particles-bg ${sectionRef.isVisible ? "aos-visible" : "aos-hidden"}`}
    >
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-500/3 rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-block text-sm font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-1.5 rounded-full mb-4">
            PARADIGMA I
          </span>
          <h2 className="text-3xl font-bold text-white">
            Infraestructura Hídrica Centralizada del Siglo XX
          </h2>
          <p className="mt-4 text-white/60 max-w-2xl mx-auto">
            Este enfoque tradicional se basa en{" "}
            <strong className="text-white">
              megaproyectos de gran escala y centralizados
            </strong>
            : grandes presas, canales masivos y trasvases interprovinciales. Si
            bien fueron el modelo dominante del siglo XX, en Córdoba han
            demostrado ser{" "}
            <strong className="text-red-400">
              inviables por su costo, impacto ambiental y vulnerabilidad
            </strong>{" "}
            ante el ENSO.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-1">
            <div className="glass-card p-6">
              <h4 className="font-bold text-lg mb-4 text-white flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-400" />
                Proyectos Evaluados
              </h4>
              <div className="flex items-baseline gap-2 mb-4">
                <p className="text-xs text-white/40">
                  {projectList.length} proyectos analizados
                </p>
                <span className="text-[10px] text-white/20">
                  — seleccioná uno
                </span>
              </div>
              <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
                {projectList.map((project, index) => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(index)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl transition-all text-sm ${
                      selectedProject === index
                        ? "bg-red-500/15 text-red-300 font-semibold border border-red-500/30 shadow-lg shadow-red-500/5"
                        : "hover:bg-white/5 text-white/60"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${selectedProject === index ? "bg-red-400 animate-pulse" : "bg-white/20"}`}
                      />
                      <span className="flex-1 truncate">{project.name}</span>
                      <span className="text-[10px] font-mono text-white/20">
                        {project.number}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 glass-card p-6 md:p-8 min-h-[450px]">
            {selected ? (
              <div className="animate-fadeIn space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <XCircle className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-white">
                      {selected.name}
                    </h4>
                    <p className="text-sm text-white/50 mt-1">
                      {selected.location}
                    </p>
                  </div>
                </div>

                <p className="text-white/70 leading-relaxed text-sm">
                  {selected.description}
                </p>

                <div className="glass border-l-4 border-red-500 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="font-semibold text-sm text-red-400">
                      ¿Por qué es inviable?
                    </span>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {selected.inviabilityReason}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-4">
                    Índices de Inviabilidad (mayor = peor)
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    {metrics.map(metric => (
                      <div key={metric.label} className="text-center group">
                        <div className="relative h-28 flex items-end justify-center mb-2">
                          <div
                            className={`w-full max-w-[60px] rounded-t-lg transition-all duration-700 ease-out group-hover:scale-105 ${
                              metric.color === "red"
                                ? "bg-gradient-to-t from-red-600 to-red-400"
                                : metric.color === "orange"
                                  ? "bg-gradient-to-t from-orange-600 to-orange-400"
                                  : "bg-gradient-to-t from-purple-600 to-purple-400"
                            }`}
                            style={{ height: `${metric.value}%` }}
                          />
                        </div>
                        <p
                          className={`text-lg font-bold ${
                            metric.color === "red"
                              ? "text-red-400"
                              : metric.color === "orange"
                                ? "text-orange-400"
                                : "text-purple-400"
                          }`}
                        >
                          {metric.value}/100
                        </p>
                        <p className="text-xs text-white/50">{metric.label}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-white/30 text-center mt-3">
                    Cada índice representa una escala conceptual de 0 (mínimo) a
                    100 (máximo)
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center h-full text-white/30">
                <ChevronRight className="w-12 h-12 mb-3 rotate-180" />
                <p>Seleccioná un proyecto de la lista para ver sus detalles.</p>
              </div>
            )}
          </div>
        </div>

        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <h4 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
              <BarChart3 className="w-6 h-6 text-red-400" />
              Comparación de Inviabilidad entre Proyectos
            </h4>
            <p className="text-white/50 mt-2 text-sm max-w-3xl mx-auto">
              Los gráficos de barras muestran por qué estos megaproyectos fueron
              consistentemente descartados en Córdoba:{" "}
              <strong className="text-white">
                altos costos, gran impacto ambiental y alta vulnerabilidad
              </strong>{" "}
              a eventos climáticos extremos como El Niño y La Niña.
            </p>
          </div>
          <div className="space-y-6">
            {projectList.map((project, idx) => (
              <div key={project.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white/80">
                    <span className="text-water-400 font-mono text-xs mr-2">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    {project.name}
                  </p>
                  <span className="text-xs text-white/40 font-mono">
                    Promedio:{" "}
                    {Math.round(
                      (project.costIndex +
                        project.impactIndex +
                        project.vulnerabilityIndex) /
                        3
                    )}
                    /100
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <div className="h-5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-700"
                        style={{ width: `${project.costIndex}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-white/40 mt-1 block">
                      Costo: {project.costIndex}/100
                    </span>
                  </div>
                  <div>
                    <div className="h-5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-700"
                        style={{ width: `${project.impactIndex}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-white/40 mt-1 block">
                      Impacto: {project.impactIndex}/100
                    </span>
                  </div>
                  <div>
                    <div className="h-5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-700"
                        style={{ width: `${project.vulnerabilityIndex}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-white/40 mt-1 block">
                      Vulnerabilidad: {project.vulnerabilityIndex}/100
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ParadigmaII() {
  const sectionRef = useScrollAnimation();
  const foundations = [
    {
      title: "Resiliencia Climática",
      desc: "Captura lluvias erráticas y localizadas, creando un sistema robusto y menos vulnerable que un único gran embalse.",
      icon: CloudSunRain,
    },
    {
      title: "Restauración Ecológica",
      desc: "Recarga acuíferos, reduce la erosión y restaura la humedad del suelo, combatiendo la desertificación.",
      icon: Leaf,
    },
    {
      title: "Viabilidad Económica",
      desc: "Implementación modular y escalable con costos de mantenimiento fraccionados y considerablemente inferiores.",
      icon: DollarSign,
    },
    {
      title: "Gobernanza Local",
      desc: "Fomenta un modelo adaptativo y policéntrico, empoderando a las comunidades en la gestión del recurso.",
      icon: Users,
    },
  ];

  const stages = [
    {
      title: "Etapa I: Caracterización y Selección de Emplazamientos",
      desc: "Se utilizan datos satelitales para encontrar miles de sitios óptimos para micro-represas, maximizando la eficiencia.",
      tags: [
        "DEM (SRTM, ALOS PALSAR)",
        "Imágenes Multiespectrales (Landsat, Sentinel)",
      ],
    },
    {
      title: "Etapa II: Monitoreo y Modelado Predictivo",
      desc: "La gestión deja de ser reactiva y se vuelve proactiva, anticipando el ingreso de agua al sistema con datos casi en tiempo real.",
      tags: ["Precipitación (GPM)", "Humedad del Suelo (SMAP)"],
    },
    {
      title: "Etapa III: Medición de Impacto y Gestión a Largo Plazo",
      desc: "Se cuantifica el éxito del sistema midiendo la mejora en la salud del ecosistema y la recarga real de los acuíferos.",
      tags: [
        "Índices de Vegetación (MODIS - NDVI)",
        "Datos Gravimétricos (GRACE/GRACE-FO)",
      ],
    },
  ];

  return (
    <section
      ref={sectionRef.ref}
      className={`section-dark py-20 relative overflow-hidden particles-bg grid-overlay ${sectionRef.isVisible ? "aos-visible" : "aos-hidden"}`}
    >
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-eco-500/3 rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-block text-sm font-semibold text-eco-400 bg-eco-500/10 border border-eco-500/20 px-4 py-1.5 rounded-full mb-4">
            PARADIGMA II
          </span>
          <h2 className="text-3xl font-bold text-white">
            Gestión Distribuida con{" "}
            <span className="gradient-text">Inteligencia Geoespacial</span>
          </h2>
          <p className="mt-4 text-white/60 max-w-2xl mx-auto">
            Este modelo propone un sistema descentralizado de micro-represas,
            planificado y gestionado con datos de observación de la Tierra de la
            NASA. A diferencia del paradigma centralizado, es{" "}
            <strong className="text-white">
              modular, escalable, de bajo impacto y adaptativo a la variabilidad
              climática del ENSO
            </strong>
            .
          </p>
        </div>

        <div className="mb-16">
          <h4 className="text-xl font-bold text-center mb-8 text-white flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-eco-400" />
            Los 4 Pilares del Modelo Distribuido
          </h4>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {foundations.map(f => (
              <div
                key={f.title}
                className="glass-card p-6 hover-lift group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-eco-500/5 rounded-full blur-[60px] pointer-events-none" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-eco-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <f.icon className="w-6 h-6 text-eco-400" />
                  </div>
                  <h5 className="font-bold text-lg mb-2 text-white">
                    {f.title}
                  </h5>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xl font-bold text-center mb-8 text-white flex items-center justify-center gap-2">
            <TrendingUp className="w-5 h-5 text-water-400" />
            Metodología: El Ecosistema de Datos de la NASA en Acción
          </h4>
          <p className="text-center text-white/50 text-sm mb-10 max-w-2xl mx-auto">
            El modelo se implementa en 3 etapas progresivas, utilizando datos
            satelitales públicos de la NASA para cada fase:
          </p>
          <div className="max-w-3xl mx-auto relative pl-10 lg:pl-12">
            <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-eco-500 via-water-500 to-eco-500 rounded-full" />
            {stages.map((stage, index) => (
              <div key={index} className="relative pb-12 last:pb-0">
                <div className="absolute -left-[34px] top-1 w-8 h-8 bg-nasa-dark border-2 border-eco-500 rounded-full flex items-center justify-center shadow-lg shadow-eco-500/20">
                  <span className="text-xs font-bold text-eco-400">
                    {index + 1}
                  </span>
                </div>
                <div className="glass-card p-6 ml-4">
                  <h5 className="text-lg font-bold text-white mb-2">
                    {stage.title}
                  </h5>
                  <p className="text-white/60 text-sm leading-relaxed mb-3">
                    {stage.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {stage.tags.map(tag => (
                      <span key={tag} className="tag-blue text-[11px]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ComparisonSection() {
  const sectionRef = useScrollAnimation();
  const { data: trpcComparison } = trpc.paradigms.getComparison.useQuery();
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const comparison = (trpcComparison ??
    FALLBACK_COMPARISON) as typeof FALLBACK_COMPARISON;

  const generateAnalysis = async () => {
    setLoading(true);
    setShowAnalysis(true);
    setAnalysis("");
    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCow8qhRGzD9ABugrXzEQMdX_1EmD2PuHU",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Como estratega en planificacion urbana y cambio climatico, analiza las implicaciones al 2050 para Cordoba Argentina. Datos: Poblacion 4.8M, demanda hidrica 2600 Hm3. Compara el paradigma centralizado (costo 9/10, impacto 9/10, vulnerabilidad 8/10) vs distribuido (resiliencia 9/10, sostenibilidad 9/10, escalabilidad 9/10). Proporciona recomendaciones de implementacion escalonada 2025-2050. Responde en 3 paragrafos.`,
                  },
                ],
              },
            ],
          }),
        }
      );
      const data = await response.json();
      setAnalysis(
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
          "No se pudo generar el analisis."
      );
    } catch {
      setAnalysis("Error al generar el analisis. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      ref={sectionRef.ref}
      className={`section-alt py-20 relative overflow-hidden grid-overlay ${sectionRef.isVisible ? "aos-visible" : "aos-hidden"}`}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-water-500/3 rounded-full blur-[150px] pointer-events-none" />
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-block tag-orange mb-4">
            COMPARACIÓN DIRECTA
          </span>
          <h2 className="text-3xl font-bold text-white">
            Centralizado vs{" "}
            <span className="gradient-text">Distribuido Geoespacial</span>
          </h2>
          <p className="mt-4 text-white/60 max-w-2xl mx-auto">
            Esta comparación contrasta ambas aproximaciones en 6 dimensiones
            clave.
            <strong className="text-white">
              {" "}
              Las barras más altas indican peor desempeño
            </strong>{" "}
            en centralizado (rojo) y
            <strong className="text-white"> mejor desempeño</strong> en
            distribuido (verde).
          </p>
        </div>

        <div className="glass-card p-6 md:p-8 relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-water-500/5 rounded-full blur-[60px]" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 relative z-10">
            {comparison.dimensions.map((dim, i) => {
              const cVal = comparison.centralized[i];
              const dVal = comparison.distributed[i];
              const maxVal = Math.max(cVal, dVal, 1);
              return (
                <div key={dim} className="text-center group">
                  <p className="text-xs font-medium text-white/50 mb-4 uppercase tracking-wider">
                    {dim}
                  </p>
                  <div className="flex items-end justify-center gap-3 h-40">
                    <div className="flex flex-col items-center gap-1 transition-transform group-hover:scale-105 duration-300">
                      <span className="text-xs font-bold text-red-400">
                        {cVal}
                      </span>
                      <div
                        className="w-10 rounded-t-lg bg-gradient-to-t from-red-600 to-red-400 transition-all duration-700 shadow-lg shadow-red-500/10 group-hover:shadow-red-500/30"
                        style={{
                          height: `${(cVal / maxVal) * 100}%`,
                          minHeight: "8px",
                        }}
                      />
                      <span className="text-[10px] text-white/30 uppercase leading-tight text-center">
                        Centralizado
                      </span>
                    </div>
                    <div
                      className="flex flex-col items-center gap-1 transition-transform group-hover:scale-105 duration-300"
                      style={{ transitionDelay: "0.1s" }}
                    >
                      <span className="text-xs font-bold text-eco-400">
                        {dVal}
                      </span>
                      <div
                        className="w-10 rounded-t-lg bg-gradient-to-t from-eco-600 to-eco-400 transition-all duration-700 shadow-lg shadow-eco-500/10 group-hover:shadow-eco-500/30"
                        style={{
                          height: `${(dVal / maxVal) * 100}%`,
                          minHeight: "8px",
                        }}
                      />
                      <span className="text-[10px] text-white/30 uppercase leading-tight text-center">
                        Geoespacial
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-white/30 mt-2">
                    Centralizado {cVal}/10 vs Distribuido {dVal}/10
                  </p>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center gap-8 mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gradient-to-br from-red-600 to-red-400" />
              <span className="text-sm text-white/60">
                Centralizado (peor desempeño)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gradient-to-br from-eco-600 to-eco-400" />
              <span className="text-sm text-white/60">
                Distribuido Geoespacial (mejor desempeño)
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <button onClick={generateAnalysis} className="btn-primary">
            <Sparkles className="w-5 h-5" />
            Analizar Implicaciones a Futuro con IA
          </button>
          {showAnalysis && (
            <div className="mt-6 text-left glass border-l-4 border-water-500 rounded-xl p-6 animate-fadeIn max-w-3xl mx-auto shadow-xl">
              {loading ? (
                <div className="flex items-center gap-3 text-white/60">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generando análisis...
                </div>
              ) : (
                <div className="prose prose-invert max-w-none">
                  {analysis.split("\n").map((p, i) => (
                    <p key={i} className="text-white/70 leading-relaxed mb-3">
                      {p}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function GlobalSection() {
  const sectionRef = useScrollAnimation();
  const cases = [
    {
      title: "California, EE.UU.",
      desc: "Enfrenta sequías prolongadas y sobreexplotación de acuíferos. Un sistema de micro-represas podría potenciar la recarga de acuíferos durante los escasos eventos de lluvia intensa.",
      impact: "Alto potencial",
      tag: "tag-orange",
    },
    {
      title: "Cuenca Murray-Darling, Australia",
      desc: "Sufre de una alta competencia por el agua entre agricultura y consumo humano. Una gestión distribuida mejoraría la eficiencia y reduciría la evaporación.",
      impact: "Potencial significativo",
      tag: "tag-blue",
    },
    {
      title: "Maharashtra, India",
      desc: "Experimenta monzones irregulares. La implementación masiva de pequeñas estructuras de contención es una estrategia clave para la seguridad hídrica local.",
      impact: "Alto potencial",
      tag: "tag-green",
    },
    {
      title: "Cuenca del Limarí, Chile",
      desc: "Región semiárida con embalses que no alcanzan a cubrir la demanda. Las micro-represas permitirían capturar escorrentías en quebradas andinas antes de que se pierdan en el océano.",
      impact: "Alto potencial",
      tag: "tag-orange",
    },
    {
      title: "Túnez Central, África",
      desc: "Las precipitaciones erráticas y la desertificación avanzan rápido. Un sistema descentralizado con monitoreo satelital podría revertir la pérdida de suelo fértil.",
      impact: "Potencial significativo",
      tag: "tag-green",
    },
    {
      title: "Nordeste de Brasil",
      desc: "Región del polígono de la sequía con grandes pérdidas por evaporación en embalses abiertos. Micro-represas sombreadas con sensores IoT optimizarían cada gota.",
      impact: "Alto potencial",
      tag: "tag-blue",
    },
  ];

  return (
    <section
      ref={sectionRef.ref}
      className={`section-dark py-20 relative overflow-hidden particles-bg ${sectionRef.isVisible ? "aos-visible" : "aos-hidden"}`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-block tag-blue mb-4">
            APLICABILIDAD GLOBAL
          </span>
          <h2 className="text-3xl font-bold text-white">
            Aplicabilidad Global del{" "}
            <span className="gradient-text">Modelo Geoespacial</span>
          </h2>
          <p className="mt-4 text-white/60 max-w-2xl mx-auto">
            La escasez hídrica no es exclusiva de Córdoba. El modelo de gestión
            distribuida, basado en datos satelitales públicos de la NASA, es una
            solución escalable y adaptable a cualquier región semiárida del
            mundo.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {cases.map(c => (
            <div
              key={c.title}
              className="glass-card p-6 hover-lift group relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-water-500/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-water-500/10 transition-all" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-water-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Globe className="w-6 h-6 text-water-400" />
                </div>
                <h4 className="font-bold text-lg mb-2 text-white group-hover:text-water-400 transition-colors">
                  {c.title}
                </h4>
                <p className="text-sm text-white/60 leading-relaxed mb-4">
                  {c.desc}
                </p>
                <span className={c.tag}>{c.impact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AIAssistant() {
  const sectionRef = useScrollAnimation();
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    {
      role: "model",
      text: "Hola! Soy tu asistente para el análisis de datos hídricos. Puedes subir archivos y darme instrucciones para mejorar. ¿En qué puedo ayudarte hoy?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [extendedKnowledge, setExtendedKnowledge] = useState(false);
  const [creatorInstructions, setCreatorInstructions] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(`session_${Date.now()}`);

  const sendMutation = trpc.chat.sendMessage.useMutation();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const result = await sendMutation.mutateAsync({
        sessionId: sessionId.current,
        message: userMsg,
        extendedKnowledge,
        creatorInstructions: creatorInstructions || undefined,
      });
      setMessages(prev => [...prev, { role: "model", text: result.response }]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: "model",
          text: "Lo siento, ocurrió un error. El backend podría no estar disponible en este momento. Por favor intentá de nuevo más tarde o consultá la documentación del proyecto.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      ref={sectionRef.ref}
      className={`section-alt py-20 relative overflow-hidden grid-overlay ${sectionRef.isVisible ? "aos-visible" : "aos-hidden"}`}
    >
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-eco-500/3 rounded-full blur-[100px] pointer-events-none" />
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
            Asistente de IA
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-eco-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-eco-500" />
            </span>
          </h2>
          <p className="mt-4 text-white/60 max-w-2xl mx-auto">
            Consultá los datos hídricos de Córdoba con inteligencia artificial.
            El asistente puede responder preguntas sobre cuencas, calidad de
            agua, tendencias climáticas y más.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {[
              "QGIS",
              "ESP32",
              "Micro-represas",
              "NASA",
              "NDVI",
              "Demografía",
            ].map(tag => (
              <span key={tag} className="tag-blue">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="p-6">
            <div className="glass border-l-4 border-water-500 pl-4 py-2 mb-4 rounded-r">
              <p className="text-sm text-white/70">
                Este asistente se conecta al backend del proyecto para responder
                con datos reales. Si el backend no está disponible, el mensaje
                de error te lo indicará.
              </p>
            </div>
            <div className="h-80 overflow-y-auto glass rounded-lg p-4 mb-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-md p-3 rounded-lg text-sm ${
                      msg.role === "user"
                        ? "bg-water-500/20 text-white"
                        : "glass-card-light text-white/70"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="glass-card-light p-3 rounded-lg">
                    <Loader2 className="w-5 h-5 animate-spin text-water-400" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                placeholder="Ej: ¿Cuál es la tendencia del embalse San Roque?"
                className="flex-1 p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-water-500 focus:border-transparent text-white placeholder:text-white/30"
              />
              <button
                onClick={handleSend}
                disabled={loading}
                className="bg-water-500/20 text-water-400 p-3 rounded-lg hover:bg-water-500/30 transition-colors disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="border-t border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Panel del Creador
            </h3>
            <div className="glass p-4 rounded-lg mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white/80">
                    Conocimiento Extendido
                  </p>
                  <p className="text-xs text-white/50">
                    Permite a la IA responder temas sobre hidrología, GIS, etc.
                  </p>
                </div>
                <button
                  onClick={() => setExtendedKnowledge(!extendedKnowledge)}
                >
                  {extendedKnowledge ? (
                    <ToggleRight className="w-10 h-10 text-eco-500" />
                  ) : (
                    <ToggleLeft className="w-10 h-10 text-white/30" />
                  )}
                </button>
              </div>
            </div>
            <div className="bg-yellow-500/10 border-l-4 border-yellow-400 p-3 rounded-r-lg mb-4">
              <p className="text-sm font-bold text-yellow-400">Mejora la IA</p>
              <p className="text-xs text-yellow-300/70">
                Usá este panel para darle nuevas instrucciones o contexto a la
                IA.
              </p>
            </div>
            <textarea
              value={creatorInstructions}
              onChange={e => setCreatorInstructions(e.target.value)}
              placeholder="Ej: A partir de ahora, cuando hablemos de calidad del agua, enfocate en los niveles de pH y turbidez."
              className="w-full h-24 bg-white/5 border border-white/10 rounded-lg p-3 focus:ring-2 focus:ring-eco-500 focus:border-transparent text-sm text-white placeholder:text-white/30"
            />
            <button
              onClick={() => {
                setMessages(prev => [
                  ...prev,
                  {
                    role: "model",
                    text: "Comportamiento de la IA actualizado con tus nuevas instrucciones.",
                  },
                ]);
                setCreatorInstructions("");
              }}
              className="mt-3 w-full bg-eco-500/20 text-eco-400 py-2 rounded-lg hover:bg-eco-500/30 transition-colors font-medium"
            >
              Actualizar Comportamiento de la IA
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ConclusionSection() {
  const sectionRef = useScrollAnimation();
  return (
    <section
      ref={sectionRef.ref}
      className={`section-alt py-20 relative overflow-hidden particles-bg ${sectionRef.isVisible ? "aos-visible" : "aos-hidden"}`}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-water-500/3 to-eco-500/3 rounded-full blur-[150px] pointer-events-none" />
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="glass-card p-10 md:p-14 text-center relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-water-500 via-eco-500 to-water-500 rounded-t-2xl" />
          <Shield className="w-14 h-14 text-water-400 mx-auto mb-6" />
          <span className="inline-block tag-green mb-4">CONCLUSIÓN</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
            Hacia un &ldquo;Gemelo Digital&rdquo; para la{" "}
            <span className="gradient-text">Gobernanza Hídrica</span>
          </h2>
          <p className="text-white/60 leading-relaxed max-w-3xl mx-auto text-lg">
            La propuesta final no es solo construir micro-represas, sino
            desarrollar un{" "}
            <strong className="text-white">"Gemelo Digital"</strong> de la
            cuenca: un modelo virtual dinámico, alimentado por datos de la NASA
            en tiempo real. Esta herramienta permite simular escenarios,
            optimizar la asignación del recurso y anticipar sequías,
            representando la transición de la era del hormigón a la era de la
            inteligencia geoespacial.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="tag-blue">Gemelo Digital</span>
            <span className="tag-green">NASA Earthdata</span>
            <span className="tag-orange">Gestión Adaptativa</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Paradigmas() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      <ParadigmaHero />
      <SectionDivider />
      <ParadigmaI />
      <SectionDivider />
      <ParadigmaII />
      <SectionDivider />
      <ComparisonSection />
      <SectionDivider />
      <GlobalSection />
      <SectionDivider />
      <AIAssistant />
      <SectionDivider />
      <ConclusionSection />
      <Footer />
      <ChatWidget />
    </div>
  );
}
