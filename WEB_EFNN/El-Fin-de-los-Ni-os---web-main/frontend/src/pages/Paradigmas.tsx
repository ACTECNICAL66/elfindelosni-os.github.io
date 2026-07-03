import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import { useScrollAnimation } from '../hooks/useAnimations'
import {
    Building2, Database, ShieldAlert, Cpu, Sparkles, AlertTriangle, CloudSun, Sprout, ArrowRight
} from 'lucide-react'
import { paradigmComparison, centralizedProjects } from '../data/projectData'

function ComparativeBars() {
    const { ref, isVisible } = useScrollAnimation()

    if (!paradigmComparison) return null

    return (
        <div ref={ref} className={`glass-card p-8 md:p-12 mb-24 max-w-5xl mx-auto transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h3 className="text-2xl font-display font-bold text-center mb-12 text-white">Análisis Multidimensional</h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
                {paradigmComparison.dimensions.map((dim, i) => (
                    <div key={dim} className="space-y-4">
                        <h4 className="text-sm font-semibold text-white/50 uppercase tracking-widest text-center">{dim}</h4>
                        <div className="flex items-end justify-center h-40 gap-6">
                            <div className="flex flex-col items-center group relative w-12">
                                <span className="absolute -top-8 text-sm font-bold text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {paradigmComparison.centralized[i]}/10
                                </span>
                                <div
                                    className="w-full bg-gradient-to-t from-red-600/20 to-red-500 rounded-t-lg transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                                    style={{ height: isVisible ? `${paradigmComparison.centralized[i] * 10}%` : '0%' }}
                                />
                            </div>
                            <div className="flex flex-col items-center group relative w-12">
                                <span className="absolute -top-8 text-sm font-bold text-eco-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {paradigmComparison.distributed[i]}/10
                                </span>
                                <div
                                    className="w-full bg-gradient-to-t from-eco-600/20 to-eco-400 rounded-t-lg transition-all duration-1000 ease-out delay-300 shadow-[0_0_15px_rgba(74,222,128,0.3)]"
                                    style={{ height: isVisible ? `${paradigmComparison.distributed[i] * 10}%` : '0%' }}
                                />
                            </div>
                        </div>
                        <div className="flex justify-center gap-6 text-[10px] uppercase font-bold text-white/30 text-center">
                            <span className="w-12">Siglo XX</span>
                            <span className="w-12">Siglo XXI</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function Paradigmas() {
    const [selectedProject, setSelectedProject] = useState(0)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="min-h-screen bg-nasa-dark selection:bg-water-500/30">
            <Navigation />

            <section className="pt-40 pb-20 relative overflow-hidden section-dark border-b border-white/[0.05]">
                <div className="grid-overlay absolute inset-0 opacity-[0.05]" />
                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-orange-500/10 text-orange-400 mb-6">
                        <Building2 className="w-6 h-6" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-6 tracking-tight">
                        Análisis de <span className="gradient-text-warm">Paradigmas</span>
                    </h1>
                    <p className="text-xl text-white/60 leading-relaxed max-w-2xl mx-auto">
                        Por qué la ingeniería civil masiva del siglo XX es geológica y financieramente inviable ante extremos climáticos.
                    </p>
                </div>
            </section>

            <section className="py-24 relative section-alt">
                <div className="max-w-7xl mx-auto px-6">
                    <ComparativeBars />
                </div>
            </section>

            <section className="py-24 relative section-dark border-y border-white/[0.05]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="tag-red inline-block mb-4">PARADIGMA I - OBSOLETO</span>
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">Mega-Obras Históricas</h2>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="space-y-4">
                            {centralizedProjects.map((project, i) => (
                                <button
                                    key={project.id}
                                    onClick={() => setSelectedProject(i)}
                                    className={`w-full text-left p-5 rounded-xl border transition-all duration-300 ${selectedProject === i
                                        ? 'bg-red-500/10 border-red-500/30 text-white'
                                        : 'bg-white/5 border-white/10 text-white/60'
                                        }`}
                                >
                                    <h4 className="font-bold font-display mb-1">{project.name}</h4>
                                    <p className="text-xs opacity-70 flex items-center gap-1">
                                        <CloudSun className="w-3 h-3" /> {project.location}
                                    </p>
                                </button>
                            ))}
                        </div>

                        <div className="lg:col-span-2 glass-card border-red-500/20 p-8 relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-8 pb-6 border-b border-white/10">
                                    <div>
                                        <h3 className="text-2xl font-display font-bold text-white mb-2">
                                            {centralizedProjects[selectedProject]?.name || 'Proyecto'}
                                        </h3>
                                        <span className="tag-orange">Riesgo Sistémico Elevado</span>
                                    </div>
                                    <AlertTriangle className="w-10 h-10 text-red-500 opacity-80" />
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <h4 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-3">Descripción Técnica</h4>
                                        <p className="text-white/80 leading-relaxed">
                                            {centralizedProjects[selectedProject]?.description}
                                        </p>
                                    </div>

                                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
                                        <h4 className="text-sm font-semibold text-red-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <ShieldAlert className="w-4 h-4" />
                                            Argumento de Inviabilidad
                                        </h4>
                                        <p className="text-white/90 leading-relaxed font-medium">
                                            {centralizedProjects[selectedProject]?.inviabilityReason}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-32 relative text-center overflow-hidden">
                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <span className="tag-blue inline-flex mb-8">PARADIGMA II - LA SOLUCIÓN</span>
                    <h2 className="text-5xl md:text-7xl font-display font-black text-white mb-8">
                        La Inteligencia <br />
                        <span className="gradient-text inline-block mt-2">Geoespacial Distribuida</span>
                    </h2>

                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-left">
                        {[
                            { icon: Database, title: 'Datos Abiertos', desc: 'Satélites NASA / ESA' },
                            { icon: Cpu, title: 'IoT Edge', desc: 'Telemetry con ESP32' },
                            { icon: Sprout, title: 'Geomanejo', desc: 'Análisis QGIS/NDVI' },
                            { icon: ShieldAlert, title: 'Resiliencia', desc: 'Baja vulnerabilidad' },
                        ].map((f, i) => (
                            <div key={i} className="bg-white/[0.03] border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
                                <f.icon className="w-6 h-6 text-water-400 mb-3" />
                                <h4 className="text-white font-bold text-sm mb-1">{f.title}</h4>
                                <p className="text-white/40 text-xs">{f.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16">
                        <Link to="/documentacion" className="btn-primary">
                            <Sparkles className="w-5 h-5 mr-1" />
                            Explorar la Documentación Completa
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
