import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Paradigmas from './pages/Paradigmas'
import Documentacion from './pages/Documentacion'
import NotFound from './pages/NotFound'
import KnowledgeChat from './components/KnowledgeChat'

export default function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/paradigmas" element={<Paradigmas />} />
                <Route path="/documentacion" element={<Documentacion />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <KnowledgeChat />
        </>
    )
}
