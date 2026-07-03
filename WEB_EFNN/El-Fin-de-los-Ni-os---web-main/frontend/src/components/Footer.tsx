import { Droplets, ExternalLink, Satellite, Github, Mail, ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="relative bg-nasa-dark border-t border-white/[0.05] overflow-hidden pt-20 pb-10">
            {/* Background elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-1 bg-gradient-to-r from-transparent via-water-500/50 to-transparent opacity-50" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-water-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-eco-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-water-400 to-water-600 flex items-center justify-center shadow-lg shadow-water-500/20">
                                <Droplets className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-display font-bold text-2xl text-white">
                                El Fin de los Niños
                            </span>
                        </Link>
                        <p className="text-white/60 leading-relaxed max-w-sm mb-6">
                            Sistema de gestión hídrica resiliente ante los fenómenos climáticos ENSO. Proyecto desarrollado para el NASA Space Apps Challenge 2025.
                        </p>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs font-medium">
                            <Satellite className="w-3.5 h-3.5 text-water-400" />
                            Powered by NASA Earthdata
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-display font-semibold text-white mb-6 uppercase tracking-wider text-sm">Explorar</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/" className="text-white/60 hover:text-water-400 transition-colors text-sm">
                                    Inicio
                                </Link>
                            </li>
                            <li>
                                <Link to="/paradigmas" className="text-white/60 hover:text-water-400 transition-colors text-sm">
                                    Análisis de Paradigmas
                                </Link>
                            </li>
                            <li>
                                <Link to="/documentacion" className="text-white/60 hover:text-water-400 transition-colors text-sm">
                                    Documentación Oficial
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-display font-semibold text-white mb-6 uppercase tracking-wider text-sm">Recursos</h4>
                        <ul className="space-y-4">
                            <li>
                                <a href="https://github.com/ACTECNICAL66/El-Fin-de-los-Ni-os---web" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
                                    <Github className="w-4 h-4 group-hover:text-water-400 transition-colors" />
                                    Repositorio GitHub
                                </a>
                            </li>
                            <li>
                                <a href="#" className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
                                    <ExternalLink className="w-4 h-4 group-hover:text-water-400 transition-colors" />
                                    Investigación NASA
                                </a>
                            </li>
                            <li>
                                <a href="#" className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
                                    <Mail className="w-4 h-4 group-hover:text-water-400 transition-colors" />
                                    Contacto Equipo
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Status bar */}
                <div className="flex flex-col md:flex-row items-center justify-between py-6 border-t border-white/10 gap-4">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-eco-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-eco-500"></span>
                            </span>
                            <span className="text-xs font-mono text-white/50">SISTEMA ONLINE</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldAlert className="w-3.5 h-3.5 text-white/30" />
                            <span className="text-xs font-mono text-white/50">OPEN SOURCE</span>
                        </div>
                    </div>
                    <p className="text-xs text-white/40 font-medium">
                        © 2025 IPET N°66 Juan Balseiro. Córdoba, Argentina.
                    </p>
                </div>
            </div>
        </footer>
    )
}
