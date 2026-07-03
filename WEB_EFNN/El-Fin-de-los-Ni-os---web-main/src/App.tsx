import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import Paradigmas from "./pages/Paradigmas";
import Documentacion from "./pages/Documentacion";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/paradigmas" element={<Paradigmas />} />
      <Route path="/documentacion" element={<Documentacion />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
