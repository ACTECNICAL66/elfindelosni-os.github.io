// Detailed data for basins (cuencas)
export const cuencasData = [
    {
        id: 1, number: 1, name: "Cuenca Norte-Oeste",
        description: "Localizada en la franja de transición entre el relieve montañoso y las pendientes medias, esta cuenca presenta un patrón de drenaje de tipo dendrítico y un área de captación reducida. Su posición estratégica la hace apta para estructuras de almacenamiento de pequeña escala que pueden regular el flujo estacional y recargar acuíferos subterráneos.",
        lat: -31.35, lng: -64.85, area: "125.5 km²", potential: "high", status: "planned"
    },
    {
        id: 2, number: 2, name: "Cuenca Norte-Este",
        description: "Situada en altitudes intermedias, presenta forma alargada con orientación este-oeste. El relieve circundante es suave, lo que favorece la retención hídrica y reduce el riesgo de erosión acelerada. Ideal para la implementación de sistemas de captación que maximicen la infiltración y minimicen la evaporación.",
        lat: -31.15, lng: -64.35, area: "98.3 km²", potential: "high", status: "planned"
    },
    {
        id: 3, number: 3, name: "Cuenca Centro",
        description: "Ubicada en la zona media del área de estudio, corresponde a una cuenca de extensión moderada con escurrimiento predominantemente estacional. Su emplazamiento sobre laderas suaves ofrece condiciones óptimas para la implementación de microdiques reguladores que puedan abastecer a comunidades rurales y apoyar la agricultura de secano.",
        lat: -31.55, lng: -64.55, area: "156.7 km²", potential: "high", status: "planned"
    },
    {
        id: 4, number: 4, name: "Cuenca Centro-Sur",
        description: "Corresponde a una cuenca alargada ubicada entre áreas de pendiente moderada y zonas de acumulación natural. La morfología favorece la concentración de caudales y permite la regulación de excedentes hídricos durante eventos de lluvia intensa, reduciendo el riesgo de inundaciones aguas abajo.",
        lat: -31.75, lng: -64.45, area: "134.2 km²", potential: "medium", status: "planned"
    },
    {
        id: 5, number: 5, name: "Cuenca Sur-Este",
        description: "De morfología irregular y con una red de drenaje compleja, esta cuenca se encuentra próxima a un cuerpo de agua de gran tamaño, lo que facilita su integración a sistemas de almacenamiento ya existentes. Presenta potencial para la mitigación de crecidas y regulación de caudales, mejorando la resiliencia del sistema hídrico regional.",
        lat: -31.95, lng: -64.25, area: "187.4 km²", potential: "medium", status: "planned"
    },
    {
        id: 6, number: 6, name: "Cuenca Sur-Este Secundaria",
        description: "Ubicada inmediatamente al sur-este de la Cuenca Centro, de tamaño reducido y morfología algo alargada. Se observa un patrón de drenaje intermitente, por lo que su régimen es estacional. Presenta condiciones favorables para soluciones de captación de baja altura que requieren mínima intervención y ofrecen rápido retorno de inversión.",
        lat: -31.85, lng: -64.15, area: "78.6 km²", potential: "low", status: "planned"
    },
    {
        id: 7, number: 7, name: "Dique San Roque",
        description: "Constituye el cuerpo de agua principal de la región, actuando como referencia geográfica y nodo hídrico del sistema. Su interacción con las cuencas adyacentes es clave para el análisis del balance hídrico regional. Nuestro proyecto propone estrategias para optimizar su operación y reducir la sedimentación.",
        lat: -31.405, lng: -64.445, area: "16.5 km²", potential: "high", status: "active"
    },
]

// Centralized paradigm projects expanded
export const centralizedProjects = [
    {
        id: 1, name: 'Proyecto "Segundo San Roque"',
        location: "Cuenca del Rio Suquía",
        description: "Un dique de almacenamiento masivo aguas abajo del embalse San Roque existente.",
        inviabilityReason: "Costos de capital prohibitivos, graves repercusiones socioambientales (inundación de áreas pobladas) y alta complejidad geológica.",
        costIndex: 95, impactIndex: 90, vulnerabilityIndex: 70
    },
    {
        id: 2, name: "Ampliación Dique Los Laureles",
        location: "Cuenca del Arroyo La Cañada",
        description: "Propuestas para aumentar la capacidad del Dique Los Laureles, elevando el paredón o construyendo diques complementarios.",
        inviabilityReason: "Alto impacto en zonas ya urbanizadas de las Sierras Chicas, costos elevados para una ganancia de volumen marginal y no resuelve la dependencia de una única subcuenca.",
        costIndex: 75, impactIndex: 80, vulnerabilityIndex: 65
    },
    {
        id: 3, name: "Acueducto desde el Río Paraná",
        location: "Trasvase de Cuencas (Interprovincial)",
        description: "Un sistema de bombeo para transportar agua a lo largo de cientos de kilómetros desde el Río Paraná.",
        inviabilityReason: "Costos de construcción y operación astronómicos, alta vulnerabilidad estratégica, riesgo de bioinvasión y potenciales conflictos interjurisdiccionales.",
        costIndex: 100, impactIndex: 85, vulnerabilityIndex: 95
    },
    {
        id: 4, name: "Acueducto del Río Ctalamochita",
        location: "Trasvase de Cuencas (Provincial)",
        description: "Un proyecto para desviar agua del río más caudaloso de la provincia, el Río Tercero.",
        inviabilityReason: "Elevados costos de bombeo y el riesgo de comprometer el caudal ecológico y productivo de su propia cuenca.",
        costIndex: 80, impactIndex: 75, vulnerabilityIndex: 80
    },
]

// Data sources for technical transparency
export const dataSources = [
    { name: "Landsat 8/9", type: "Satélite", url: "https://landsat.gsfc.nasa.gov", description: "Imágenes multiespectrales para cálculo de NDVI y análisis de cobertura vegetal." },
    { name: "MODIS", type: "Satélite", url: "https://modis.gsfc.nasa.gov", description: "Datos de temperatura de superficie y evapotranspiración para balances hídricos." },
    { name: "ECOSTRESS", type: "Satélite", url: "https://ecostress.jpl.nasa.gov", description: "Mediciones precisas de estrés hídrico en plantas y transpiración." },
    { name: "VIIRS", type: "Satélite", url: "https://jpss.gsfc.nasa.gov/viirs.html", description: "Datos de reflectancia para cálculos de índices de sequía (ESI)." },
]

// NDVI prediction function
export function predictNDVI(precipitation: number, temperature: number, phenomenon: 'normal' | 'nino' | 'nina') {
    const phenomFactor = { nino: 0.08, nina: -0.08, normal: 0 }[phenomenon]
    const predictedNdvi = Math.max(0.1, Math.min(0.9, 0.55 + phenomFactor + (precipitation - 100) / 500 + (25 - temperature) / 80))

    let status: string, recommendation: string, color: string
    if (predictedNdvi > 0.65) {
        status = 'Saludable'; recommendation = 'Condiciones óptimas. Monitoreo regular recomendado.'; color = 'text-eco-400'
    } else if (predictedNdvi > 0.4) {
        status = 'Estrés Leve'; recommendation = 'Riesgo moderado. Considerar riego suplementario.'; color = 'text-yellow-400'
    } else {
        status = 'Estrés Severo'; recommendation = 'Alto riesgo. Medidas de riego urgentes requeridas.'; color = 'text-red-400'
    }
    return { ndvi: predictedNdvi, status, recommendation, color }
}

// Paradigm comparison data
export const paradigmComparison = {
    dimensions: ['Costo', 'Impacto Ambiental', 'Vulnerabilidad', 'Resiliencia Climática', 'Sostenibilidad', 'Escalabilidad'],
    centralized: [9, 9, 8, 2, 3, 2],
    distributed: [3, 2, 2, 9, 9, 9],
}

// Tech stack data
export const techStack = [
    { name: 'C++', category: 'firmware' },
    { name: 'ESP32', category: 'hardware' },
    { name: 'Arduino IDE', category: 'tools' },
    { name: 'Proteus', category: 'tools' },
    { name: 'Google Earth', category: 'geo' },
    { name: 'QGIS', category: 'geo' },
    { name: 'Global Mapper', category: 'geo' },
    { name: 'NASA WorldWind', category: 'geo' },
    { name: 'Python', category: 'programming' },
    { name: 'JavaScript', category: 'programming' },
    { name: 'TypeScript', category: 'programming' },
    { name: 'React', category: 'programming' },
    { name: 'API REST', category: 'programming' },
    { name: 'Sensores IoT', category: 'hardware' },
    { name: 'GitHub', category: 'tools' },
]

// Project efficiency metrics
export const efficiencyMetrics = [
    { label: 'Reducción de Costo vs Centralizado', value: 85, suffix: '%', description: 'Las micro-represas distribuidas cuestan hasta un 85% menos que las mega-represas centralizadas' },
    { label: 'Cobertura Territorial', value: 7, suffix: ' cuencas', description: '7 cuencas hidrográficas monitoreadas simultáneamente con sensores ESP32' },
    { label: 'Anticipación a Eventos', value: 6, suffix: ' meses', description: 'Capacidad de predicción de sequías e inundaciones con 3-6 meses de anticipación' },
    { label: 'Datos Procesados', value: 15, suffix: '+ años', description: 'Más de 15 años de datos climáticos históricos analizados con herramientas SIG' },
]

// Timeline data for project milestones
export const projectTimeline = [
    { year: '2024', title: 'Investigación Inicial', description: 'Análisis de datos NASA, estudio de cuencas con QGIS, identificación de problemáticas hídricas en Córdoba.' },
    { year: '2025 Q1', title: 'Desarrollo de Prototipo', description: 'Diseño y programación del sistema de monitoreo con ESP32. Simulación en Proteus.' },
    { year: '2025 Q2', title: 'NASA Space Apps', description: 'Presentación del proyecto en el NASA Space Apps Challenge 2025. Desarrollo de plataforma web.' },
    { year: '2025-2030', title: 'Implementación Piloto', description: 'Instalación de micro-represas piloto en cuencas prioritarias con monitoreo continuo.' },
    { year: '2030-2050', title: 'Escalamiento Regional', description: 'Expansión del modelo a toda la provincia. Gemelo digital completo del sistema hídrico.' },
]

// Knowledge base for AI
export const knowledgeBase = {
    general: [
        "El proyecto 'El Fin de los Niños' propone una red distribuida de micro-represas para gestionar el agua en Córdoba.",
        "Utilizamos datos de la NASA para predecir sequías (La Niña) e inundaciones (El Niño).",
        "El sistema es un 85% más económico que construir una mega-represa centralizada.",
    ],
    basins: cuencasData.map(c => `${c.name}: ${c.description}`),
    technology: techStack.map(t => `${t.name} (${t.category})`),
    centralized: centralizedProjects.map(p => `${p.name}: ${p.inviabilityReason}`),
}
