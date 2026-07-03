import { Download, FileText, Code, BookOpen, Map } from "lucide-react";
import { SectionHeading } from "./shared";

export default function DownloadsSection() {
  const downloads = [
    {
      title: "Informe del Proyecto",
      desc: "Documento completo en formato PDF.",
      icon: FileText,
      color: "bg-red-500",
      hoverColor: "hover:bg-red-600",
      url: "https://docs.google.com/document/d/1pRI56umFZt0hpH3QrQ-g5AjqlIIeBPex7Y5YnKCGZpc/edit?usp=sharing",
    },
    {
      title: "Codigo del Prototipo",
      desc: "Archivo .INO para Arduino/ESP32.",
      icon: Code,
      color: "bg-eco-600",
      hoverColor: "hover:bg-eco-700",
      url: "https://drive.google.com/file/d/1gDedyEV_ftD4zLbC15I4TpdL7YI0SRrP/view?usp=drive_link",
    },
    {
      title: "Informe ENSO (Externo)",
      desc: "Diagnostico oficial de NOAA/IRI.",
      icon: BookOpen,
      color: "bg-purple-600",
      hoverColor: "hover:bg-purple-700",
      url: "https://iri.columbia.edu/our-expertise/climate/forecasts/enso/current/?enso_tab=enso-cpc_update",
    },
    {
      title: "Mapa de Cuencas",
      desc: "Recurso cartografico de Cordoba.",
      icon: Map,
      color: "bg-white/20",
      hoverColor: "",
      url: null,
    },
  ];

  return (
    <section className="section-alt py-20">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeading icon={Download} title="Datos y Recursos Abiertos" />
        <p className="text-white/70 leading-relaxed mb-10 max-w-4xl">
          En el espiritu de la ciencia abierta de la NASA, compartimos todos
          nuestros datos, metodologias y resultados para que otros
          investigadores puedan replicar y mejorar nuestro trabajo.
        </p>

        <div className="glass-card overflow-hidden p-8">
          <div className="text-center border-b border-white/10 pb-6 mb-8">
            <h3 className="text-3xl font-bold text-white">
              El Fin de los Ninos
            </h3>
            <p className="text-lg text-white/50 mt-2">
              Recursos y Descargas del Proyecto
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {downloads.map(item => (
              <div
                key={item.title}
                className={`flex flex-col p-6 glass-card-light rounded-xl border border-white/10 transition-all ${item.url ? "hover:scale-105 hover:shadow-lg" : "opacity-60"}`}
              >
                <div className="flex-shrink-0 mx-auto">
                  <div
                    className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center`}
                  >
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-center mt-4 flex-grow">
                  <h4 className="text-lg font-semibold text-white/80">
                    {item.title}
                  </h4>
                  <p className="text-sm text-white/50 mt-1">{item.desc}</p>
                </div>
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-6 block w-full text-center ${item.color} text-white font-semibold py-3 px-6 rounded-lg ${item.hoverColor} transition-colors`}
                  >
                    {item.title.includes("Informe") ||
                    item.title.includes("ENSO")
                      ? "Ver Informe"
                      : "Descargar"}
                  </a>
                ) : (
                  <div className="mt-6 w-full text-center bg-white/10 text-white/40 font-semibold py-3 px-6 rounded-lg cursor-not-allowed">
                    No Disponible
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
