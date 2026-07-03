import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useScrollProgress } from '@/hooks/useAnimations'
import { Droplets, Menu, X, ExternalLink } from 'lucide-react'

export default function Navigation() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const location = useLocation()
    const progress = useScrollProgress()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 30)
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        setMobileOpen(false)
    }, [location])

    const navLinks = [
        { label: 'Inicio', href: '/' },
        { label: 'Paradigmas', href: '/paradigmas' },
        { label: 'Documentación', href: '/documentacion' },
    ]

    return (
        <>
            {/* Scroll progress bar */}
            <div className="fixed top-0 left-0 right-0 z-[60] h-[2px]">
                <div
                    className="h-full bg-gradient-to-r from-water-400 via-water-500 to-eco-400 transition-all duration-150 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <header
                className={`fixed top-[2px] left-0 right-0 z-50 transition-all duration-500 ${scrolled
                        ? 'bg-nasa-dark/80 backdrop-blur-2xl border-b border-white/[0.06] shadow-2xl shadow-black/20'
                        : 'bg-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-water-400 to-water-600 flex items-center justify-center shadow-lg shadow-water-500/20 group-hover:shadow-water-500/40 transition-shadow">
                                <Droplets className="w-5 h-5 text-white" />
                            </div>
                            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-eco-400 rounded-full border-2 border-nasa-dark animate-pulse-slow" />
                        </div>
                        <div>
                            <span className="font-display font-bold text-lg text-white block leading-tight">
                                El Fin de los Niños
                            </span>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-water-400/80 font-medium">
                                NASA Space Apps
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.href
                            return (
                                <Link
                                    key={link.href}
                                    to={link.href}
                                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${isActive
                                            ? 'text-water-300'
                                            : 'text-white/60 hover:text-white/90 hover:bg-white/5'
                                        }`}
                                >
                                    {link.label}
                                    {isActive && (
                                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-water-400 rounded-full" />
                                    )}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        <a
                            href="https://github.com/ACTECNICAL66/El-Fin-de-los-Ni-os---web"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/80 text-sm font-medium hover:bg-white/10 hover:text-white transition-all"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            GitHub
                        </a>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden p-2 text-white/80 hover:text-white"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="md:hidden bg-nasa-dark/95 backdrop-blur-2xl border-t border-white/5 animate-fade-in">
                        <div className="px-6 py-6 space-y-2">
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.href
                                return (
                                    <Link
                                        key={link.href}
                                        to={link.href}
                                        className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                                ? 'bg-water-500/10 text-water-300 border border-water-500/20'
                                                : 'text-white/60 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                )
                            })}
                            <a
                                href="https://github.com/ACTECNICAL66/El-Fin-de-los-Ni-os---web"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-3 text-sm text-white/60 hover:text-white"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Ver en GitHub
                            </a>
                        </div>
                    </div>
                )}
            </header>
        </>
    )
}
