import { Link } from 'react-router-dom'

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center section-dark text-center px-6">
            <div className="glass-card p-12 max-w-md w-full relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-water-500/20 rounded-full blur-3xl"></div>
                <h1 className="text-8xl font-display font-bold gradient-text mb-4">404</h1>
                <h2 className="text-2xl font-bold text-white mb-4">Señal Perdida</h2>
                <p className="text-white/60 mb-8">
                    La coordenada satelital que buscas no se encuentra en nuestra base de datos climática.
                </p>
                <Link to="/" className="btn-primary w-full justify-center">
                    Volver al Centro de Control
                </Link>
            </div>
        </div>
    )
}
