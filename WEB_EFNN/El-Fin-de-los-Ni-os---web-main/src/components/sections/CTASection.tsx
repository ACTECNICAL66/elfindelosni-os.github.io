import { Link } from "react-router";
import { Shield } from "lucide-react";

export default function CTASection() {
  return (
    <section className="bg-gradient-to-r from-water-700 to-nasa-deep py-16 border-t border-white/5">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Explora el Analisis de Paradigmas
        </h2>
        <p className="text-white/60 mb-8 max-w-2xl mx-auto">
          Descubre la comparacion entre la infraestructura hidrica centralizada
          del siglo XX y la gestion distribuida con inteligencia geoespacial del
          siglo XXI.
        </p>
        <Link to="/paradigmas" className="btn-primary inline-flex">
          <Shield className="w-5 h-5" />
          Ver Analisis de Paradigmas
        </Link>
      </div>
    </section>
  );
}
