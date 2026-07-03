import { Activity, Droplet, Sprout, Bell } from "lucide-react";
import { SectionHeading, InfoCard } from "./shared";

export default function ResultsSection() {
  return (
    <section className="section-dark py-20">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          icon={Activity}
          title="Resultados y Estrategias de Adaptacion"
        />
        <p className="text-white/70 leading-relaxed mb-8 max-w-4xl">
          Nuestro analisis ha permitido desarrollar estrategias especificas para
          aumentar la resiliencia hidrica de Cordoba ante la variabilidad
          climatica.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <InfoCard icon={Droplet} title="Gestion Adaptativa">
            Desarrollo de protocolos de operacion diferenciados para embalses
            segun las fases del ENSO, optimizando el almacenamiento durante El
            Nino y conservando agua durante La Nina. Implementacion de sistemas
            de alerta temprana con 3-6 meses de anticipacion.
          </InfoCard>
          <InfoCard icon={Sprout} title="Agricultura Resiliente">
            Recomendaciones de cultivos y practicas agricolas adaptadas a las
            diferentes fases climaticas, minimizando perdidas y maximizando
            productividad. Tecnificacion del 50% del riego agricola con sistemas
            de goteo y sensores.
          </InfoCard>
          <InfoCard icon={Bell} title="Sistema de Alerta Temprana">
            Propuesta de un sistema integrado que combine datos de la NASA con
            observaciones locales para anticipar eventos extremos. Monitoreo en
            tiempo real con sensores ESP32 y visualizacion web.
          </InfoCard>
        </div>

        <div className="bg-gradient-to-br from-water-600 to-nasa-deep rounded-2xl p-10 text-center border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">Nuestra Mision</h2>
          <p className="text-white/70 max-w-3xl mx-auto leading-relaxed">
            Transformar la vulnerabilidad climatica en oportunidad de desarrollo
            sostenible, utilizando ciencia de datos para construir comunidades
            mas resilientes ante el cambio climatico. Integrar conocimientos
            tecnicos con problematicas reales de la comunidad.
          </p>
        </div>
      </div>
    </section>
  );
}
