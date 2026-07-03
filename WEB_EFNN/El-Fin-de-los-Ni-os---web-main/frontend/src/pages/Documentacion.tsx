import { useEffect } from 'react'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import { FileText, Cpu, Map as MapIcon, Link as LinkIcon, Download, Github, Satellite, ExternalLink, BookOpen } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useAnimations'
import { dataSources } from '../data/projectData'

export default function Documentacion() {
    const { ref, isVisible } = useScrollAnimation()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="min-h-screen bg-nasa-dark selection:bg-water-500/30">
            <Navigation />

            {/* HEADER */}
            <section className="pt-40 pb-20 relative overflow-hidden section-dark border-b border-white/[0.05]">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-water-500/10 via-eco-500/5 to-transparent rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/5 text-white/80 mb-6 border border-white/10">
                        <FileText className="w-6 h-6" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-6 tracking-tight">
                        Documentación <br />
                        <span className="gradient-text">Técnica y Eficiencia</span>
                    </h1>
                    <p className="text-xl text-white/60 leading-relaxed max-w-2xl mx-auto">
                        Detalles arquitectónicos, justificación técnica y métricas de eficiencia del sistema distribuido de gestión hídrica.
                    </p>
                </div>
            </section>

            {/* CONTENT */}
            <section className="py-24 relative section-alt">
                <div className="max-w-4xl mx-auto px-6 space-y-24">

                    {/* Intro */}
                    <div ref={ref} className={`space-y-6 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
                        <h2 className="text-3xl font-display font-bold text-white border-b border-white/10 pb-4">Introducción al Sistema</h2>
                        <p className="text-white/70 leading-relaxed text-lg">
                            "El Fin de los Niños" es una arquitectura de ingeniería civil y software diseñada para contrarrestar los efectos extremos de los fenómenos El Niño y La Niña (ENSO) en la provincia de Córdoba. Se aleja deliberadamente de los grandes embalses centralizados para apostar por una red distribuida de micro-represas conectadas.
                        </p>
                        <div className="glass-card p-6 border-l-4 border-l-water-400 bg-water-500/5">
                            <h4 className="font-bold text-white mb-2">Concepto Core: El "Gemelo Digital" Hídrico</h4>
                            <p className="text-white/60 text-sm leading-relaxed">
                                El sistema utiliza una réplica virtual alimentada por datos satelitales y sensores IoT en terreno para modelar el comportamiento del agua y la vegetación, permitiendo retener o liberar agua aguas arriba antes de que el problema llegue a los núcleos urbanos.
                            </p>
                        </div>
                    </div>

                    {/* Efficiency Details */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-3xl font-display font-bold text-white">Análisis de Eficiencia</h2>
                            <span className="tag-green">Validado</span>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="glass-card border-eco-500/20 p-6 flex flex-col items-center text-center">
                                <span className="text-4xl font-bold text-eco-400 mb-2">~80%</span>
                                <h4 className="font-bold text-white mb-2">Reducción de Costos</h4>
                                <p className="text-white/50 text-sm">Frente al mantenimiento y construcción de una mega-represa tradicional, una red capilar de micro-represas representa una fracción del costo.</p>
                            </div>
                            <div className="glass-card border-water-500/20 p-6 flex flex-col items-center text-center">
                                <span className="text-4xl font-bold text-water-400 mb-2">100%</span>
                                <h4 className="font-bold text-white mb-2">Redundancia Hídrica</h4>
                                <p className="text-white/50 text-sm">Al estar el agua almacenada en múltiples nodos independientes, el fallo de uno no compromete el abastecimiento o la seguridad general.</p>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-8 border border-white/10 mt-8">
                            <h4 className="text-white font-bold mb-4">¿Por qué es más eficiente?</h4>
                            <ul className="space-y-4 text-white/70">
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-water-500 shrink-0" />
                                    <p><strong>Evaporación Mitigada:</strong> Los grandes espejos de agua pierden volúmenes inmensos por evaporación. Espejos más pequeños y protegidos topográficamente retienen mejor el líquido.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-water-500 shrink-0" />
                                    <p><strong>Impacto Ecológico Nulo:</strong> No requiere el desplazamiento de comunidades ni la anegación de valles enteros. La topografía natural se aprovecha mínimamente.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-water-500 shrink-0" />
                                    <p><strong>Control de Crecientes:</strong> "Atrapar el agua donde cae". Ralentizar el escurrimiento en las cuencas altas previene inundaciones repentinas en las cuencas bajas (ej. ciudad de Córdoba).</p>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Architecture */}
                    <div className="space-y-8">
                        <h2 className="text-3xl font-display font-bold text-white border-b border-white/10 pb-4">Arquitectura Tecnológica</h2>

                        <div className="space-y-6">
                            {[
                                {
                                    icon: Cpu, title: 'Capa 1: Hardware Edge (IoT) y Firmware',
                                    content: 'Firmware desarrollado en C++ para microcontroladores ESP32 y simulado en Proteus. El hardware supervisa en terreno sensores de nivel hidrostático, pluviómetros de balancín y humedad del suelo, reportando datos vía GSM/LoRa.'
                                },
                                {
                                    icon: MapIcon, title: 'Capa 2: Inteligencia Espacial (GIS)',
                                    content: 'Modelado intensivo de elevación digital (DEM) utilizando QGIS y Global Mapper. Identificación de sumideros naturales e integración con los modelos predictivos de la NASA WorldWind.'
                                },
                                {
                                    icon: LinkIcon, title: 'Capa 3: Integración Web',
                                    content: 'El backend ha sido modernizado a una Arquitectura Estática (Frontend-Only) alojada en GitHub Pages para máxima resiliencia. Desarrollada con React, TypeScript, y TailwindCSS, consume los modelos matemáticos directamente en el navegador sin requerir servidores intermedios.'
                                }
                            ].map((layer, i) => (
                                <div key={i} className="flex gap-6 items-start bg-white/[0.02] p-6 rounded-xl border border-white/5 hover:bg-white/[0.04] transition-colors">
                                    <div className="p-3 bg-white/5 rounded-lg shrink-0">
                                        <layer.icon className="w-6 h-6 text-water-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white mb-2">{layer.title}</h3>
                                        <p className="text-white/60 text-sm leading-relaxed">{layer.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* BASIN ANALYSIS */}
                    <div className="space-y-8">
                        <h2 className="text-3xl font-display font-bold text-white border-b border-white/10 pb-4">Sitios de Cuencas Analizadas</h2>
                        <div className="grid gap-6">
                            {[
                                { name: "Cuencas Norte (N-Oeste y N-Este)", desc: "Zonas de transición con pendientes medias. Ideales para recarga de acuíferos y regulación estacional.", tag: "Prioridad Alta" },
                                { name: "Cuencas Centro y Centro-Sur", desc: "Escurrimiento estacional sobre laderas suaves. Óptimas para microdiques reguladores de uso rural.", tag: "Uso Agrícola" },
                                { name: "Cuenca Sur-Este y Secundaria", desc: "Morfología compleja con red de drenaje intermitente. Enfocadas en mitigación de crecidas repentinas.", tag: "Resiliencia" },
                                { name: "Dique San Roque (Nodo Central)", desc: "Referencia geográfica y punto de confluencia. El estudio propone optimizar su balance hídrico mediante regulación aguas arriba.", tag: "Sistema Core" }
                            ].map((c, i) => (
                                <div key={i} className="glass-card p-6 border-white/5 hover:border-water-500/30 transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold text-white group-hover:text-water-400 transition-colors">{c.name}</h3>
                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-white/5 px-2 py-1 rounded border border-white/10 text-white/50">{c.tag}</span>
                                    </div>
                                    <p className="text-white/60 text-sm leading-relaxed">{c.desc}</p>
                                </div>
                            ))}
                        </div>
                        <div className="bg-eco-500/5 border border-eco-500/20 rounded-2xl p-6 flex items-start gap-4">
                            <div className="p-2 bg-eco-500/20 rounded-lg shrink-0">
                                <MapIcon className="w-5 h-5 text-eco-400" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-1">Metodología de Selección</h4>
                                <p className="text-white/60 text-xs leading-relaxed">
                                    Los sitios fueron identificados mediante el análisis de Modelos Digitales de Elevación (DEM) y mapas de acumulación de flujo, priorizando sumideros naturales donde la intervención estructural sea mínima pero el impacto en el retardo del flujo sea máximo.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* SATELLITE DATA SOURCES */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <h2 className="text-3xl font-display font-bold text-white">Fuentes de Datos Satelitales</h2>
                            <span className="tag-blue">NASA &amp; NOAA</span>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {dataSources.map((ds, i) => (
                                <a
                                    key={i}
                                    href={ds.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="glass-card p-6 flex items-start gap-4 hover:border-water-500/40 transition-all group"
                                >
                                    <div className="p-2.5 bg-water-500/10 rounded-lg border border-water-500/20 shrink-0">
                                        <Satellite className="w-5 h-5 text-water-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="text-white font-bold">{ds.name}</h4>
                                            <span className="text-[10px] bg-white/5 text-white/40 px-2 py-0.5 rounded border border-white/10">{ds.type}</span>
                                        </div>
                                        <p className="text-white/50 text-xs leading-relaxed">{ds.description}</p>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-water-400 transition-colors shrink-0 mt-0.5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* NASA DATA */}
                    <div className="glass-card p-8 text-center sm:text-left flex flex-col sm:flex-row items-center gap-8 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-nasa-deep transition-opacity opacity-0 group-hover:opacity-100 duration-500" />
                        <div className="relative z-10 w-20 h-20 shrink-0 bg-gradient-to-br from-white/10 to-transparent rounded-full flex items-center justify-center p-4 shadow-xl">
                            <div className="w-full h-full rounded-full bg-blue-600 relative overflow-hidden">
                                <div className="absolute top-1/2 left-0 right-0 h-1 bg-red-500 -rotate-45" />
                                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white">EARTH</div>
                            </div>
                        </div>
                        <div className="relative z-10 flex-1">
                            <h3 className="text-2xl font-display font-bold text-white mb-2">Acceso a Datasets</h3>
                            <p className="text-white/60 mb-6">
                                Todos los datos climáticos y topográficos utilizados en el proyecto son abiertos y accesibles mediante el portal NASA Earthdata. También puedes explorar el código fuente completo en GitHub.
                            </p>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                                <a href="https://earthdata.nasa.gov/" target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm px-4 py-2">
                                    <Download className="w-4 h-4 mr-2" /> Portal Earthdata
                                </a>
                                <a href="https://github.com/ACTECNICAL66/El-Fin-de-los-Ni-os---web" target="_blank" rel="noopener noreferrer" className="btn-primary text-sm px-4 py-2">
                                    <Github className="w-4 h-4 mr-2" /> Repositorio del Proyecto
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* REPORT DOWNLOAD */}
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 p-8 bg-gradient-to-br from-water-500/10 via-transparent to-eco-500/10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-water-500/5 rounded-full blur-3xl pointer-events-none" />
                        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
                            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                                <BookOpen className="w-10 h-10 text-water-400" />
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="text-2xl font-display font-bold text-white mb-2">Informe Técnico Completo</h3>
                                <p className="text-white/60 text-sm">
                                    Descarga el informe técnico completo del proyecto con metodología, análisis de cuencas, modelos predictivos y resultados.
                                </p>
                            </div>
                            <a
                                href="/El-Fin-de-los-Ni-os---web/Proyecto_El_Fin_de_los_Ninos.pdf"
                                download
                                className="shrink-0 btn-primary px-6 py-3"
                            >
                                <Download className="w-4 h-4 mr-2" /> Descargar PDF
                            </a>
                        </div>
                    </div>

                </div>
            </section>

            <Footer />
        </div>
    )
}
