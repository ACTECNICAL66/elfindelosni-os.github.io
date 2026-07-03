import { useState } from "react";
import { CloudSunRain, AlertTriangle, Leaf, TrendingUp } from "lucide-react";
import { asset } from "@/lib/utils";
import { SectionHeading } from "./shared";

export default function ClimateSection() {
  const [activeTab, setActiveTab] = useState<"elnino" | "lanina" | "impactos">(
    "elnino"
  );

  return (
    <section className="section-dark py-20">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          icon={CloudSunRain}
          title="Impacto de El Nino y La Nina en Cordoba"
        />
        <p className="text-white/70 leading-relaxed mb-8 max-w-4xl">
          El fenomeno de El Nino/Oscilacion del Sur (ENSO) tiene impactos
          significativos en el regimen de precipitaciones de Cordoba, afectando
          la disponibilidad hidrica y la vulnerabilidad ante eventos extremos.
        </p>

        <div className="flex flex-wrap justify-center gap-8 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-red-500" />
            <span className="text-sm text-white/60">
              El Nino (Lluvias intensas)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-water-500" />
            <span className="text-sm text-white/60">La Nina (Sequia)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-orange-500" />
            <span className="text-sm text-white/60">Condiciones Neutrales</span>
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="flex border-b border-white/10">
            {[
              {
                key: "elnino" as const,
                label: "Fenomeno El Nino",
                color: "#EF4444",
              },
              {
                key: "lanina" as const,
                label: "Fenomeno La Nina",
                color: "#1EB8FF",
              },
              {
                key: "impactos" as const,
                label: "Impactos en Cordoba",
                color: "#F59E0B",
              },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-all border-b-3 ${
                  activeTab === tab.key
                    ? "text-white bg-white/5"
                    : "text-white/40 hover:text-white/70 hover:bg-white/5"
                }`}
                style={
                  activeTab === tab.key
                    ? { borderBottomColor: tab.color, borderBottomWidth: 3 }
                    : {}
                }
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === "elnino" && (
              <div className="animate-fadeIn">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">
                      El Nino y sus Efectos en Cordoba
                    </h3>
                    <p className="text-white/70 mb-4">
                      Durante los eventos de El Nino, Cordoba experimenta
                      tipicamente condiciones mas humedas de lo normal, con
                      aumento en las precipitaciones entre un 20-40%.
                    </p>
                    <ul className="space-y-2 text-white/70 text-sm">
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                        Aumento del riesgo de inundaciones
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                        Incremento en la sedimentacion de embalses
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                        Mayor escorrentia superficial
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                        Posibilidad de crecidas repentinas
                      </li>
                      <li className="flex items-start gap-2">
                        <Leaf className="w-4 h-4 text-eco-400 mt-0.5 flex-shrink-0" />
                        Recarga mejorada de acuiferos
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-xl overflow-hidden shadow-md border border-white/10">
                    <img
                      src={asset("/el-nino-satellite.jpg")}
                      alt="El Nino satellite image"
                      className="w-full h-64 object-cover"
                    />
                    <p className="text-xs text-white/50 italic p-3 bg-white/5">
                      Imagen satelital de anomalias de temperatura durante El
                      Nino. Fuente: NASA
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "lanina" && (
              <div className="animate-fadeIn">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">
                      La Nina y sus Efectos en Cordoba
                    </h3>
                    <p className="text-white/70 mb-4">
                      Los eventos de La Nina suelen traer condiciones mas secas
                      a Cordoba, con reduccion en las precipitaciones que pueden
                      superar el 30% bajo lo normal.
                    </p>
                    <ul className="space-y-2 text-white/70 text-sm">
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-water-400 mt-0.5 flex-shrink-0" />
                        Disminucion del caudal en rios y arroyos
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-water-400 mt-0.5 flex-shrink-0" />
                        Reduccion de los niveles en embalses y diques
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-water-400 mt-0.5 flex-shrink-0" />
                        Mayor estres hidrico para la agricultura
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-water-400 mt-0.5 flex-shrink-0" />
                        Aumento del riesgo de incendios forestales
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-water-400 mt-0.5 flex-shrink-0" />
                        Disminucion de la recarga de acuiferos
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-xl overflow-hidden shadow-md border border-white/10">
                    <img
                      src={asset("/la-nina-satellite.jpg")}
                      alt="La Nina satellite image"
                      className="w-full h-64 object-cover"
                    />
                    <p className="text-xs text-white/50 italic p-3 bg-white/5">
                      Imagen satelital de anomalias de temperatura durante La
                      Nina. Fuente: NASA
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "impactos" && (
              <div className="animate-fadeIn">
                <h3 className="text-xl font-bold text-white mb-4">
                  Impactos Socioeconomicos del ENSO en Cordoba
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3 text-white/70 text-sm">
                    <p>
                      <strong className="text-water-400">Agricultura:</strong>{" "}
                      Perdidas de cosechas durante sequias (La Nina) y danos por
                      inundaciones (El Nino)
                    </p>
                    <p>
                      <strong className="text-water-400">
                        Infraestructura:
                      </strong>{" "}
                      Danos en caminos y puentes durante eventos extremos de
                      lluvia
                    </p>
                    <p>
                      <strong className="text-water-400">Salud Publica:</strong>{" "}
                      Aumento de enfermedades vectoriales durante periodos
                      humedos
                    </p>
                    <p>
                      <strong className="text-water-400">Energia:</strong>{" "}
                      Reduccion en la generacion hidroelectrica durante sequias
                    </p>
                    <p>
                      <strong className="text-water-400">Ecosistemas:</strong>{" "}
                      Alteracion de habitats acuaticos y terrestres
                    </p>
                  </div>
                  <div className="glass-card-light rounded-lg p-5 border-l-4 border-orange-500">
                    <h4 className="font-bold text-white mb-3">
                      Proyecciones Futuras (2050)
                    </h4>
                    <ul className="space-y-2 text-white/70 text-sm">
                      <li className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                        Poblacion: 4.8 millones de habitantes
                      </li>
                      <li className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                        Demanda de agua: 1,800 a 2,600 Hm3 anuales
                      </li>
                      <li className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                        Intensificacion de fenomenos ENSO
                      </li>
                      <li className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                        Micro-represas clave para seguridad hidrica
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
