import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { DocumentationSection } from "@/components/sections";

export default function Documentacion() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-20" />
      <DocumentationSection />
      <Footer />
      <ChatWidget />
    </div>
  );
}
