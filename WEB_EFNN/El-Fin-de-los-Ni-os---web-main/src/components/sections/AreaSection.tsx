import { Map, Droplets } from "lucide-react";
import { SectionHeading } from "./shared";
import { asset } from "@/lib/utils";

interface Cuenca {
  id: number;
  number: number;
  name: string;
  description: string;
}

const cuencasData: Cuenca[] = [
  {
    id: 1,
    number: 1,
    name: "Cuenca Norte",
    description:
      "Localizada en la franja de transicion entre el relieve montanoso y las pendientes medias, esta cuenca presenta un patron de drenaje de tipo dendritico y un area de captacion reducida.",
  },
  {
    id: 2,
    number: 2,
    name: "Cuenca Noreste",
    description:
      "Situada en altitudes intermedias, presenta forma alargada con orientacion este-oeste. El relieve circundante es suave, lo que favorece la retencion hidrica.",
  },
  {
    id: 3,
    number: 3,
    name: "Cuenca Centro",
    description:
      "Ubicada en la zona media del area de estudio, corresponde a una cuenca de extension moderada con escurrimiento predominantemente estacional.",
  },
  {
    id: 4,
    number: 4,
    name: "Cuenca Oeste",
    description:
      "Corresponde a una cuenca alargada ubicada entre areas de pendiente moderada y zonas de acumulacion natural.",
  },
  {
    id: 5,
    number: 5,
    name: "Cuenca Sur",
    description:
      "De morfologia irregular y con una red de drenaje compleja, esta cuenca se encuentra proxima a un cuerpo de agua de gran tamano.",
  },
  {
    id: 6,
    number: 6,
    name: "Cuenca Sureste",
    description:
      "Ubicada inmediatamente al sur-este de la Cuenca Centro, de tamano reducido y morfologia algo alargada.",
  },
  {
    id: 7,
    number: 7,
    name: "Embalse Principal",
    description:
      "Constituye el cuerpo de agua principal de la region, actuando como referencia geografica y nodo hidrico del sistema.",
  },
];

export default function AreaSection() {
  return (
    <section className="section-alt py-20">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading icon={Map} title="Area de Estudio" />
        <p className="text-white/70 leading-relaxed mb-8 max-w-4xl">
          La region de Cordoba, Argentina, representa un caso de estudio ideal
          para analizar los impactos de El Nino y La Nina debido a su
          vulnerabilidad hidrica y la importancia economica de sus actividades
          agricolas.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="rounded-xl overflow-hidden shadow-lg border border-white/10">
            <img
              src={asset("/study-area.jpg")}
              alt="Area de Estudio - Region de Cordoba"
              className="w-full h-full object-cover"
            />
            <p className="text-center text-sm text-white/50 italic py-3 bg-white/5">
              Figura 1. Area de estudio - Region de Cordoba, Argentina.
            </p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Map className="w-5 h-5 text-water-400" />
              Mapa de Cuencas
            </h3>
            <p className="text-sm text-white/60 mb-4">
              Distribucion espacial de las 7 cuencas identificadas mediante
              analisis SIG con datos SRTM de la NASA.
            </p>
            <div className="rounded-xl overflow-hidden border border-white/10 bg-nasa-deep/50">
              <img
                src={asset("/mapa-cuencas.png")}
                alt="Mapa de Cuencas - Region de Cordoba"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 border-l-4 border-water-500 mb-8">
          <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <Droplets className="w-5 h-5 text-water-400" />
            Cuencas Hidrograficas Identificadas
          </h3>
          <p className="text-white/60 text-sm mb-6">
            Mediante el analisis de datos topograficos y climaticos utilizando
            QGIS, hemos identificado 7 cuencas principales con potencial para la
            implementacion de sistemas de gestion hidrica resilientes:
          </p>

          <div className="space-y-4">
            {cuencasData.map(cuenca => (
              <div
                key={cuenca.id}
                className="glass-card-light rounded-lg p-5 border-l-4 border-eco-500 shadow-sm hover:translate-x-1 transition-transform"
              >
                <h4 className="font-bold text-white mb-2 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-water-500 text-white flex items-center justify-center text-sm font-bold">
                    {cuenca.number}
                  </span>
                  {cuenca.name}
                </h4>
                <p className="text-white/60 text-sm">{cuenca.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
