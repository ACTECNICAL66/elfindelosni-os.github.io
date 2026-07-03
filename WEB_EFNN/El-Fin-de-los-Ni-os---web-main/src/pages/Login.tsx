import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { asset } from "@/lib/utils";
import { Droplets, Shield } from "lucide-react";
import { Link } from "react-router";

function getOAuthUrl() {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

export default function Login() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0B3D91] to-[#1a237e] relative">
        <img
          src={asset("/cordoba-landscape.jpg")}
          alt="Cordoba"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 flex flex-col justify-center items-center text-center p-12 w-full">
          <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 border border-white/20">
            NASA Space Apps Challenge 2025
          </span>
          <h1 className="text-4xl font-bold text-white mb-4">
            El Fin de los Ninos
          </h1>
          <p className="text-white/80 text-lg max-w-md">
            Gestion hidrica resiliente para Cordoba
          </p>
          <div className="mt-8 flex items-center gap-2 text-white/60 text-sm">
            <Droplets className="w-5 h-5" />
            <span>Panel de Administracion</span>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center bg-[#F5F7FA] p-6">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-14 h-14 bg-[#0B3D91] rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800">
              Iniciar Sesion
            </CardTitle>
            <p className="text-sm text-slate-500 mt-1">
              Accede al panel de administracion del sistema
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              className="w-full bg-[#0B3D91] hover:bg-[#082567] text-white py-6 text-base font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
              size="lg"
              onClick={() => {
                window.location.href = getOAuthUrl();
              }}
            >
              <Droplets className="w-5 h-5 mr-2" />
              Continuar con Kimi
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400">
                  Seguro y protegido
                </span>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="/"
                className="text-sm text-[#0B3D91] hover:text-[#FC3D21] font-medium transition-colors"
              >
                Volver a la pagina principal
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
