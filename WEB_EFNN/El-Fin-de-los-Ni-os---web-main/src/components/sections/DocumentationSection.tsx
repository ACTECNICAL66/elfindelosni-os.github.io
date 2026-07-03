import {
  BookOpen,
  ExternalLink,
  FileText,
  FileCode,
  Github,
  Globe,
  Download,
  Code,
  Map,
} from "lucide-react";
import { SectionHeading } from "./shared";

const DOCS_REPO = "https://github.com/ACTECNICAL66/elfindelosni-os.github.io";
const CODE_REPO = "https://github.com/ACTECNICAL66/El-Fin-de-los-Ni-os---web";

export default function DocumentationSection() {
  const resources = [
    {
      title: "Documentación Técnica",
      desc: "Informes, memorias y documentación completa del proyecto en GitHub Pages.",
      icon: BookOpen,
      color: "bg-water-600",
      url: DOCS_REPO,
    },
    {
      title: "Repositorio de Documentación",
      desc: "Código fuente de la documentación, informes en PDF y recursos técnicos.",
      icon: FileCode,
      color: "bg-eco-600",
      url: DOCS_REPO,
    },
    {
      title: "Código del Proyecto",
      desc: "Repositorio principal con el código fuente de la plataforma web y backend.",
      icon: Github,
      color: "bg-purple-600",
      url: CODE_REPO,
    },
    {
      title: "Recursos Open Source",
      desc: "Datos abiertos, metodologías y resultados bajo licencia open source.",
      icon: Globe,
      color: "bg-orange-600",
      url: CODE_REPO,
    },
  ];

  const downloads = [
    {
      title: "Informe del Proyecto",
      desc: "Documento completo en formato PDF.",
      icon: FileText,
      color: "bg-red-500",
      url: "https://docs.google.com/document/d/1pRI56umFZt0hpH3QrQ-g5AjqlIIeBPex7Y5YnKCGZpc/edit?usp=sharing",
    },
    {
      title: "Código del Prototipo",
      desc: "Archivo .INO para Arduino/ESP32.",
      icon: Code,
      color: "bg-eco-600",
      url: "https://drive.google.com/file/d/1gDedyEV_ftD4zLbC15I4TpdL7YI0SRrP/view?usp=drive_link",
    },
    {
      title: "Informe ENSO (Externo)",
      desc: "Diagnóstico oficial de NOAA/IRI.",
      icon: BookOpen,
      color: "bg-purple-600",
      url: "https://iri.columbia.edu/our-expertise/climate/forecasts/enso/current/?enso_tab=enso-cpc_update",
    },
    {
      title: "Mapa de Cuencas",
      desc: "Recurso cartográfico de Córdoba.",
      icon: Map,
      color: "bg-white/20",
      url: null,
    },
  ];

  return (
    <section className="section-alt py-20" id="documentacion">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeading
          icon={FileText}
          title="Documentación y Recursos Abiertos"
        />
        <p className="text-white/70 leading-relaxed mb-4 max-w-4xl">
          Toda la documentación técnica, informes, memorias y recursos del
          proyecto están disponibles en nuestro sitio de documentación dedicado.
        </p>
        <p className="text-white/50 text-sm mb-10 max-w-4xl">
          Documentación publicada en:{" "}
          <a
            href={DOCS_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="text-water-400 hover:text-water-300 underline underline-offset-2"
          >
            {DOCS_REPO}
          </a>
        </p>

        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {resources.map(item => (
            <a
              key={item.title}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col p-6 glass-card-light rounded-xl border border-white/10 transition-all hover:scale-[1.02] hover:shadow-lg group"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                >
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-white group-hover:text-water-400 transition-colors flex items-center gap-2">
                    {item.title}
                    <ExternalLink className="w-3.5 h-3.5 text-white/30 group-hover:text-water-400" />
                  </h4>
                  <p className="text-sm text-white/50 mt-1">{item.desc}</p>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="glass-card overflow-hidden p-8">
          <div className="text-center border-b border-white/10 pb-6 mb-8">
            <h3 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
              <Download className="w-6 h-6 text-water-400" />
              Datos y Recursos Abiertos
            </h3>
            <p className="text-white/50 mt-2 text-sm">
              En el espíritu de la ciencia abierta de la NASA, compartimos
              nuestros datos, metodologías y resultados.
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
                    className={`mt-6 block w-full text-center ${item.color} text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity`}
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

        <div className="mt-10 text-center">
          <a
            href={DOCS_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex"
          >
            <BookOpen className="w-5 h-5" />
            Explorar Documentación Completa
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
