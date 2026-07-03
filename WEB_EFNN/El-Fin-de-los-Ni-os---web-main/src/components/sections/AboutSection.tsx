import { Droplets, Target, Satellite, Globe, ChevronRight } from "lucide-react";
import { SectionHeading, InfoCard } from "./shared";

export default function AboutSection() {
  const techStack = [
    "C++",
    "ESP32",
    "Google Earth",
    "QGIS",
    "Python",
    "JavaScript",
    "NASA WorldWind",
    "Sensores IoT",
    "API REST",
    "GitHub",
    "Arduino IDE",
    "Global Mapper",
    "Proteus",
  ];

  return (
    <section className="section-dark py-20">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading icon={Droplets} title="Acerca del Proyecto" />
        <p className="text-white/70 leading-relaxed mb-4 max-w-4xl">
          "El Fin de los Ninos" es una solucion innovadora desarrollada por
          estudiantes del Instituto Jose Antonio Balseiro (IPET N 66) de Cordoba
          Capital, que aborda la vulnerabilidad hidrica de la provincia de
          Cordoba ante los fenomenos de El Nino y La Nina.
        </p>
        <p className="text-white/70 leading-relaxed mb-8 max-w-4xl">
          El proyecto integra datos climaticos de la NASA con tecnologias de
          vanguardia como <strong className="text-white">C++</strong> para
          programacion de sistemas embebidos,{" "}
          <strong className="text-white">ESP32</strong> para monitoreo en tiempo
          real, <strong className="text-white">Google Earth</strong> para
          visualizacion geoespacial, y{" "}
          <strong className="text-white">QGIS</strong> para analisis topografico
          y delimitacion de cuencas hidrograficas.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <InfoCard icon={Target} title="Objetivos Principales">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 mt-0.5 text-water-400 flex-shrink-0" />
                Analizar el impacto de El Nino/La Nina en recursos hidricos
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 mt-0.5 text-water-400 flex-shrink-0" />
                Identificar ubicaciones optimas para micro-represas
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 mt-0.5 text-water-400 flex-shrink-0" />
                Desarrollar estrategias de gestion adaptativa al clima
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 mt-0.5 text-water-400 flex-shrink-0" />
                Crear modelo predictivo para eventos extremos
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 mt-0.5 text-water-400 flex-shrink-0" />
                Implementar sistema de monitoreo con sensores ESP32
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 mt-0.5 text-water-400 flex-shrink-0" />
                Desarrollar interfaz web para visualizacion de datos
              </li>
            </ul>
          </InfoCard>

          <InfoCard icon={Satellite} title="Datos NASA Utilizados">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 mt-0.5 text-eco-400 flex-shrink-0" />
                Datos de temperatura superficial del mar (TSM)
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 mt-0.5 text-eco-400 flex-shrink-0" />
                Indice de Oscilacion del Sur (SOI)
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 mt-0.5 text-eco-400 flex-shrink-0" />
                Datos de precipitacion TRMM y GPM
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 mt-0.5 text-eco-400 flex-shrink-0" />
                Modelos climaticos para proyecciones
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 mt-0.5 text-eco-400 flex-shrink-0" />
                Imagenes satelitales multiespectrales
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 mt-0.5 text-eco-400 flex-shrink-0" />
                Modelos Digitales de Elevacion (MDE)
              </li>
            </ul>
          </InfoCard>

          <InfoCard icon={Globe} title="Impacto Regional">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 mt-0.5 text-water-400 flex-shrink-0" />
                Reduccion de vulnerabilidad ante sequias e inundaciones
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 mt-0.5 text-water-400 flex-shrink-0" />
                Optimizacion del uso del agua para agricultura
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 mt-0.5 text-water-400 flex-shrink-0" />
                Proteccion de ecosistemas acuaticos
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 mt-0.5 text-water-400 flex-shrink-0" />
                Fortalecimiento de la seguridad hidrica
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 mt-0.5 text-water-400 flex-shrink-0" />
                Capacitacion tecnica de estudiantes
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 mt-0.5 text-water-400 flex-shrink-0" />
                Generacion de datos para politicas publicas
              </li>
            </ul>
          </InfoCard>
        </div>

        <div className="flex flex-wrap gap-3">
          {techStack.map(tech => (
            <span key={tech} className="tag-blue">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
