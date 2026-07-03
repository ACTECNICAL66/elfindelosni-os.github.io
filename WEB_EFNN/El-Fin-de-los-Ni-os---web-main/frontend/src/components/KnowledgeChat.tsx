import React, { useState, useRef, useEffect } from 'react'
import { MessageSquare, Send, X, Bot, Sparkles, Database, Satellite } from 'lucide-react'

interface Message {
    id: number
    text: string
    sender: 'bot' | 'user'
    timestamp: Date
}

const KB: { keywords: string[]; answer: string }[] = [
    {
        keywords: ['cuenca', 'cuencas', 'basin', 'basins', 'territorio', 'sitios'],
        answer: `Analizamos **7 cuencas hidrográficas** en las Sierras de Córdoba:\n\n• **Cuenca Norte-Oeste** (125.5 km²) — Prioridad alta, ideal para recarga de acuíferos\n• **Cuenca Norte-Este** (98.3 km²) — Retención hídrica con bajo riesgo de erosión\n• **Cuenca Centro** (156.7 km²) — Microdiques para uso rural y agrícola\n• **Cuenca Centro-Sur** (134.2 km²) — Control de excedentes e inundaciones\n• **Cuenca Sur-Este** (187.4 km²) — Mayor área, mitigación de crecidas\n• **Cuenca Sur-Este Secundaria** (78.6 km²) — Captación estacional de bajo costo\n• **Dique San Roque** (16.5 km²) — Nodo central del sistema hídrico regional`
    },
    {
        keywords: ['nasa', 'satélite', 'satelite', 'landsat', 'modis', 'ecostress', 'data', 'earthdata', 'dato'],
        answer: `Utilizamos **4 datasets de NASA/NOAA**:\n\n📡 **Landsat 8/9** — Imágenes multiespectrales para calcular NDVI y cobertura vegetal\n🌡️ **MODIS** — Temperatura de superficie y evapotranspiración\n💧 **ECOSTRESS** — Estrés hídrico preciso en plantas\n📊 **VIIRS** — Reflectancia para índices de sequía (ESI)\n\nTodo disponible en NASA Earthdata (earthdata.nasa.gov)`
    },
    {
        keywords: ['ndvi', 'vegetación', 'vegetacion', 'indice', 'índice', 'verde'],
        answer: `El **NDVI (Índice de Vegetación de Diferencia Normalizada)** mide la salud de la vegetación:\n\n🟢 **NDVI > 0.65** → Saludable — monitoreo rutinario\n🟡 **NDVI 0.40-0.65** → Estrés leve — considerar riego\n🔴 **NDVI < 0.40** → Estrés severo — acción urgente\n\nNuestro algoritmo combina precipitación, temperatura y el fenómeno ENSO activo para predecir el NDVI con meses de antelación.`
    },
    {
        keywords: ['niño', 'niña', 'enso', 'clima', 'sequía', 'sequia', 'inundación', 'inundacion'],
        answer: `Los fenómenos **ENSO** son el desafío central del proyecto:\n\n⛈️ **El Niño** → Lluvias extremas, inundaciones en Córdoba. Sistema libera agua anticipadamente aguas abajo.\n🌵 **La Niña** → Sequías prolongadas. Sistema retiene agua capturada en épocas previas.\n⚖️ **Normal** → Monitoreo predictivo para anticipar anomalías.\n\nNuestro modelo puede predecir el impacto **3-6 meses** antes del evento climático.`
    },
    {
        keywords: ['costo', 'precio', 'economía', 'economia', 'presupuesto', 'dinero', 'ahorro'],
        answer: `Comparativa de costos del paradigma centralizado vs distribuido:\n\n🏗️ **Mega-represas (Siglo XX)**:\n• Proyecto "Segundo San Roque" → USD 2.000M+\n• Acueducto Río Paraná → USD 5.000M+\n• Ampliación Los Molinos → USD 800M+\n\n✅ **Micro-represas distribuidas (nuestro modelo)**:\n• **85% más económicas** por unidad de almacenamiento\n• Sin costos de relocalización de comunidades\n• Mantenimiento descentralizado y comunitario`
    },
    {
        keywords: ['esp32', 'iot', 'sensor', 'hardware', 'arduino', 'proteus', 'firmware'],
        answer: `La capa **IoT Edge** del sistema:\n\n🔧 **Microcontrolador**: ESP32 programado en C++\n📡 **Comunicación**: GSM/LoRa para zonas remotas\n🌊 **Sensores**: Nivel hidrostático, pluviómetro de balancín, humedad de suelo\n🖥️ **Simulación**: Proteus IDE para validación previa al campo\n\nCada nodo IoT reporta datos en tiempo real al gemelo digital hídrico.`
    },
    {
        keywords: ['qgis', 'gis', 'dem', 'mapa', 'geoespacial', 'sig', 'google earth', 'global mapper'],
        answer: `Herramientas **GIS y geoespaciales** utilizadas:\n\n🗺️ **QGIS** — Análisis de DEM, identificación de sumideros naturales (flow accumulation)\n🌍 **Google Earth Pro** — Reconocimiento visual de territorio y cuencas\n📊 **Global Mapper** — Procesamiento avanzado de modelos de elevación\n🛰️ **NASA WorldWind** — Visualización 3D de datos satelitales\n\nEste análisis permitió identificar los 7 sitios óptimos para micro-represas.`
    },
    {
        keywords: ['paradigma', 'centralizado', 'distribuido', 'diferencia', 'por qué', 'porque'],
        answer: `**Paradigma Centralizado (Siglo XX)** vs **Distribuido (Siglo XXI)**:\n\n❌ **Centralizado**: Costo 9/10 · Impacto ambiental 9/10 · Vulnerabilidad 8/10\n✅ **Distribuido**: Costo 3/10 · Impacto 2/10 · Vulnerabilidad 2/10\n\nEl principio clave: **"Atrapar el agua donde cae"** — reducir el escurrimiento en cuencas altas previene inundaciones aguas abajo sin infraestructura costosa.`
    },
    {
        keywords: ['proyecto', 'qué es', 'que es', 'objetivo', 'fin de los niños', 'nasa space apps'],
        answer: `**"El Fin de los Niños"** es un proyecto presentado en el NASA Space Apps Challenge 2025.\n\n🎯 **Objetivo**: Diseñar un sistema distribuido de micro-represas para gestionar el agua en Córdoba bajo eventos ENSO extremos.\n\n🧠 **Innovación**: Un "Gemelo Digital Hídrico" que combina datos satelitales + sensores IoT + modelos predictivos para actuar meses antes de cada emergencia climática.`
    },
    {
        keywords: ['san roque', 'dique', 'embalse', 'represa'],
        answer: `El **Dique San Roque** (inaugurado en 1891) es el nodo hídrico central de Córdoba. Capacidad: ~200 hm³. Problemas actuales: sedimentación, presión de demanda y vulnerabilidad ante eventos climáticos extremos.\n\nNuestro proyecto propone aliviar su carga regulando el agua **aguas arriba** mediante las 6 cuencas analizadas, extendiendo su vida útil y eficiencia.`
    },
]

function generateResponse(query: string): string {
    const q = query.toLowerCase()
    for (const item of KB) {
        if (item.keywords.some(kw => q.includes(kw))) {
            return item.answer
        }
    }
    return `Gracias por tu pregunta sobre **"${query}"**. Mi base de conocimiento cubre cuencas hidrográficas, datos NASA, tecnología ESP32/IoT, análisis NDVI, fenómenos El Niño/La Niña y la comparativa de paradigmas hídricos.\n\n¿Sobre cuál de estos temas te gustaría profundizar?`
}

export default function KnowledgeChat() {
    const [isOpen, setIsOpen] = useState(false)
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "¡Hola! Soy **GeoAssistant**, el asistente de inteligencia hídrica del proyecto 'El Fin de los Niños'. Puedo responder sobre cuencas analizadas, datos NASA, tecnología IoT y más. ¿En qué puedo ayudarte?",
            sender: 'bot',
            timestamp: new Date()
        }
    ])
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isTyping])

    const handleSend = async (text?: string) => {
        const msg = (text ?? input).trim()
        if (!msg) return

        const userMsg: Message = { id: Date.now(), text: msg, sender: 'user', timestamp: new Date() }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setIsTyping(true)

        setTimeout(() => {
            const botMsg: Message = { id: Date.now() + 1, text: generateResponse(msg), sender: 'bot', timestamp: new Date() }
            setMessages(prev => [...prev, botMsg])
            setIsTyping(false)
        }, Math.random() * 600 + 900)
    }

    return (
        <>
            {/* Pulsating Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-8 right-8 z-50 p-4 rounded-full bg-water-500 text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
            >
                <div className="absolute inset-0 rounded-full bg-water-400 animate-ping opacity-20" />
                <MessageSquare className="w-6 h-6 relative z-10" />
            </button>

            {/* Chat Window */}
            <div className={`fixed bottom-8 right-8 z-50 w-[380px] h-[550px] max-w-[90vw] max-h-[80vh] flex flex-col bg-nasa-dark border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-500 transform ${isOpen ? 'translate-y-0 opacity-100 visible' : 'translate-y-10 opacity-0 invisible pointer-events-none'}`}>

                {/* Header */}
                <div className="p-4 bg-gradient-to-r from-water-600/20 to-eco-600/20 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-water-500/20 flex items-center justify-center border border-water-500/30">
                            <Bot className="w-6 h-6 text-water-400" />
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-sm">GeoAssistant AI</h4>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] text-white/40 font-medium uppercase tracking-wider">Sistema Operativo</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-2 text-white/30 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                ? 'bg-water-500 text-white rounded-tr-none'
                                : 'bg-white/5 text-white/80 border border-white/10 rounded-tl-none'
                                }`}>
                                {msg.sender === 'bot'
                                    ? <div className="space-y-1 leading-relaxed">
                                        {msg.text.split('\n').map((line, li) => {
                                            const parts = line.split(/\*\*(.*?)\*\*/g)
                                            return (
                                                <p key={li}>
                                                    {parts.map((part, pi) =>
                                                        pi % 2 === 1
                                                            ? <strong key={pi} className="text-white font-semibold">{part}</strong>
                                                            : <span key={pi}>{part}</span>
                                                    )}
                                                </p>
                                            )
                                        })}
                                    </div>
                                    : msg.text
                                }
                                <div className={`text-[10px] mt-1 opacity-40 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-tl-none">
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce [animation-delay:0.2s]" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce [animation-delay:0.4s]" />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Suggestions */}
                <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar border-t border-white/5 bg-white/[0.02]">
                    {[
                        { icon: Database, label: 'Ver Cuencas' },
                        { icon: Satellite, label: 'Datos NASA' },
                        { icon: Sparkles, label: '¿Cómo funciona?' }
                    ].map((s, i) => (
                        <button
                            key={i}
                            onClick={() => setInput(s.label)}
                            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/60 hover:bg-white/10 hover:text-white transition-all"
                        >
                            <s.icon className="w-3 h-3" />
                            {s.label}
                        </button>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white/[0.02] border-t border-white/10">
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Haz una pregunta técnica..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-water-500/50 transition-colors"
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={!input.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-water-500 text-white rounded-lg disabled:opacity-50 hover:bg-water-400 transition-colors"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="text-[10px] text-center text-white/20 mt-3 uppercase tracking-wider font-medium">Powered by NASA Space Apps 2025 Intelligence</p>
                </div>
            </div>
        </>
    )
}
