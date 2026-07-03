import { getDb } from "../api/queries/connection";
import {
  climateData,
  satelliteIndices,
  cuencas,
  paradigmProjects,
  dataSources,
} from "./schema";

async function seed() {
  const db = getDb();
  console.log("Seeding database...");

  // Seed cuencas
  const cuencasData = [
    {
      number: 1,
      name: "Cuenca Norte-Oeste",
      description: "Localizada en la franja de transicion entre el relieve montanoso y las pendientes medias, esta cuenca presenta un patron de drenaje de tipo dendritico y un area de captacion reducida. Su posicion estrategica la hace apta para estructuras de almacenamiento de pequena escala que pueden regular el flujo estacional y recargar acuiferos subterraneos.",
      centerLat: "-31.35",
      centerLng: "-64.85",
      area: "125.5",
      potential: "high" as const,
      status: "planned" as const,
    },
    {
      number: 2,
      name: "Cuenca Norte-Este",
      description: "Situada en altitudes intermedias, presenta forma alargada con orientacion este-oeste. El relieve circundante es suave, lo que favorece la retencion hidrica y reduce el riesgo de erosion acelerada. Ideal para la implementacion de sistemas de captacion que maximicen la infiltracion y minimicen la evaporacion.",
      centerLat: "-31.15",
      centerLng: "-64.35",
      area: "98.3",
      potential: "high" as const,
      status: "planned" as const,
    },
    {
      number: 3,
      name: "Cuenca Centro",
      description: "Ubicada en la zona media del area de estudio, corresponde a una cuenca de extension moderada con escurrimiento predominantemente estacional. Su emplazamiento sobre laderas suaves ofrece condiciones optimas para la implementacion de microdiques reguladores que puedan abastecer a comunidades rurales y apoyar la agricultura de secano.",
      centerLat: "-31.55",
      centerLng: "-64.55",
      area: "156.7",
      potential: "high" as const,
      status: "planned" as const,
    },
    {
      number: 4,
      name: "Cuenca Centro-Sur",
      description: "Corresponde a una cuenca alargada ubicada entre areas de pendiente moderada y zonas de acumulacion natural. La morfologia favorece la concentracion de caudales y permite la regulacion de excedentes hidricos durante eventos de lluvia intensa, reduciendo el riesgo de inundaciones aguas abajo.",
      centerLat: "-31.75",
      centerLng: "-64.45",
      area: "134.2",
      potential: "medium" as const,
      status: "planned" as const,
    },
    {
      number: 5,
      name: "Cuenca Sur-Este",
      description: "De morfologia irregular y con una red de drenaje compleja, esta cuenca se encuentra proxima a un cuerpo de agua de gran tamano, lo que facilita su integracion a sistemas de almacenamiento ya existentes. Presenta potencial para la mitigacion de crecidas y regulacion de caudales, mejorando la resiliencia del sistema hidrico regional.",
      centerLat: "-31.95",
      centerLng: "-64.25",
      area: "187.4",
      potential: "medium" as const,
      status: "planned" as const,
    },
    {
      number: 6,
      name: "Cuenca Sur-Este Secundaria",
      description: "Ubicada inmediatamente al sur-este de la Cuenca Centro, de tamano reducido y morfologia algo alargada. Se observa un patron de drenaje intermitente, por lo que su regimen es estacional. Presenta condiciones favorables para soluciones de captacion de baja altura que requieren minima intervencion y ofrecen rapido retorno de inversion.",
      centerLat: "-31.85",
      centerLng: "-64.15",
      area: "78.6",
      potential: "low" as const,
      status: "planned" as const,
    },
    {
      number: 7,
      name: "Dique San Roque",
      description: "Constituye el cuerpo de agua principal de la region, actuando como referencia geografica y nodo hidrico del sistema. Su interaccion con las cuencas adyacentes es clave para el analisis del balance hidrico regional. Nuestro proyecto propone estrategias para optimizar su operacion y reducir la sedimentacion.",
      centerLat: "-31.405",
      centerLng: "-64.445",
      area: "16.5",
      potential: "high" as const,
      status: "active" as const,
    },
  ];

  for (const cuenca of cuencasData) {
    await db.insert(cuencas).values(cuenca);
  }
  console.log("Cuencas seeded");

  // Seed climate data (12 months)
  const months = [
    { date: "2024-06-01", temp: 12.5, precip: 5.2, humidity: 55, wind: 14, pressure: 1015.2, phenomenon: "normal" as const },
    { date: "2024-07-01", temp: 10.8, precip: 8.1, humidity: 62, wind: 16, pressure: 1018.5, phenomenon: "normal" as const },
    { date: "2024-08-01", temp: 14.2, precip: 12.5, humidity: 58, wind: 12, pressure: 1014.3, phenomenon: "nina" as const },
    { date: "2024-09-01", temp: 18.5, precip: 35.8, humidity: 65, wind: 10, pressure: 1012.1, phenomenon: "nina" as const },
    { date: "2024-10-01", temp: 22.3, precip: 78.5, humidity: 72, wind: 8, pressure: 1009.8, phenomenon: "nina" as const },
    { date: "2024-11-01", temp: 25.8, precip: 125.3, humidity: 78, wind: 9, pressure: 1008.2, phenomenon: "nino" as const },
    { date: "2024-12-01", temp: 28.5, precip: 142.8, humidity: 82, wind: 11, pressure: 1006.5, phenomenon: "nino" as const },
    { date: "2025-01-01", temp: 30.2, precip: 138.5, humidity: 80, wind: 13, pressure: 1005.8, phenomenon: "nino" as const },
    { date: "2025-02-01", temp: 28.8, precip: 98.2, humidity: 75, wind: 10, pressure: 1008.4, phenomenon: "normal" as const },
    { date: "2025-03-01", temp: 24.5, precip: 45.6, humidity: 68, wind: 9, pressure: 1011.2, phenomenon: "normal" as const },
    { date: "2025-04-01", temp: 19.8, precip: 22.4, humidity: 60, wind: 11, pressure: 1014.6, phenomenon: "normal" as const },
    { date: "2025-05-01", temp: 15.2, precip: 8.5, humidity: 56, wind: 14, pressure: 1016.8, phenomenon: "normal" as const },
  ];

  for (const m of months) {
    await db.insert(climateData).values({
      date: new Date(m.date),
      region: "Cordoba Capital",
      latitude: "-31.4201",
      longitude: "-64.1888",
      temperature: m.temp.toString(),
      humidity: m.humidity.toString(),
      precipitation: m.precip.toString(),
      windSpeed: m.wind.toString(),
      windDirection: Math.floor(Math.random() * 360),
      pressure: m.pressure.toString(),
      phenomenon: m.phenomenon,
    });
  }
  console.log("Climate data seeded");

  // Seed satellite indices
  const satelliteData = [
    { date: "2024-06-01", ndvi: "0.35", esi: "0.72", lst: "18.5", precip: "5.2", stressArea: "25.00", recoveryRate: "68.00", dataSource: "MODIS" },
    { date: "2024-07-01", ndvi: "0.32", esi: "0.68", lst: "16.2", precip: "8.1", stressArea: "28.00", recoveryRate: "65.00", dataSource: "MODIS" },
    { date: "2024-08-01", ndvi: "0.38", esi: "0.75", lst: "19.8", precip: "12.5", stressArea: "22.00", recoveryRate: "70.00", dataSource: "MODIS" },
    { date: "2024-09-01", ndvi: "0.45", esi: "0.82", lst: "23.5", precip: "35.8", stressArea: "18.00", recoveryRate: "72.00", dataSource: "Landsat 9" },
    { date: "2024-10-01", ndvi: "0.55", esi: "0.88", lst: "26.8", precip: "78.5", stressArea: "12.00", recoveryRate: "75.00", dataSource: "Landsat 9" },
    { date: "2024-11-01", ndvi: "0.62", esi: "0.92", lst: "29.5", precip: "125.3", stressArea: "8.00", recoveryRate: "78.00", dataSource: "Landsat 9" },
    { date: "2024-12-01", ndvi: "0.68", esi: "0.95", lst: "32.2", precip: "142.8", stressArea: "5.00", recoveryRate: "82.00", dataSource: "MODIS" },
    { date: "2025-01-01", ndvi: "0.65", esi: "0.90", lst: "31.5", precip: "138.5", stressArea: "7.00", recoveryRate: "80.00", dataSource: "MODIS" },
    { date: "2025-02-01", ndvi: "0.58", esi: "0.85", lst: "28.2", precip: "98.2", stressArea: "10.00", recoveryRate: "76.00", dataSource: "MODIS" },
    { date: "2025-03-01", ndvi: "0.52", esi: "0.80", lst: "25.5", precip: "45.6", stressArea: "15.00", recoveryRate: "73.00", dataSource: "Landsat 9" },
    { date: "2025-04-01", ndvi: "0.48", esi: "0.76", lst: "22.1", precip: "22.4", stressArea: "20.00", recoveryRate: "70.00", dataSource: "Landsat 9" },
    { date: "2025-05-01", ndvi: "0.42", esi: "0.70", lst: "19.5", precip: "8.5", stressArea: "24.00", recoveryRate: "67.00", dataSource: "MODIS" },
  ];

  for (const s of satelliteData) {
    await db.insert(satelliteIndices).values({
      date: new Date(s.date),
      region: "Cordoba",
      ndvi: s.ndvi,
      esi: s.esi,
      lst: s.lst,
      precipitation: s.precip,
      stressArea: s.stressArea,
      recoveryRate: s.recoveryRate,
      dataSource: s.dataSource,
    });
  }
  console.log("Satellite indices seeded");

  // Seed paradigm projects
  const projectsData = [
    {
      name: 'Proyecto "Segundo San Roque"',
      location: "Cuenca del Rio Suquia",
      description: "Un dique de almacenamiento masivo aguas abajo del embalse San Roque existente.",
      inviabilityReason: "Costos de capital prohibitivos, graves repercusiones socioambientales (inundacion de areas pobladas) y alta complejidad geologica.",
      costIndex: 95,
      impactIndex: 90,
      vulnerabilityIndex: 70,
      paradigm: "centralized" as const,
    },
    {
      name: "Ampliacion Dique Los Laureles",
      location: "Cuenca del Arroyo La Canada",
      description: "Propuestas para aumentar la capacidad del Dique Los Laureles, elevando el paredon o construyendo diques complementarios.",
      inviabilityReason: "Alto impacto en zonas ya urbanizadas de las Sierras Chicas, costos elevados para una ganancia de volumen marginal y no resuelve la dependencia de una unica subcuenca.",
      costIndex: 75,
      impactIndex: 80,
      vulnerabilityIndex: 65,
      paradigm: "centralized" as const,
    },
    {
      name: "Acueducto desde el Rio Parana",
      location: "Trasvase de Cuencas (Interprovincial)",
      description: "Un sistema de bombeo para transportar agua a lo largo de cientos de kilometros desde el Rio Parana.",
      inviabilityReason: "Costos de construccion y operacion astronomicos, alta vulnerabilidad estrategica, riesgo de bioinvasion y potenciales conflictos interjurisdiccionales.",
      costIndex: 100,
      impactIndex: 85,
      vulnerabilityIndex: 95,
      paradigm: "centralized" as const,
    },
    {
      name: "Acueducto del Rio Ctalamochita",
      location: "Trasvase de Cuencas (Provincial)",
      description: "Un proyecto para desviar agua del rio mas caudaloso de la provincia, el Rio Tercero.",
      inviabilityReason: "Elevados costos de bombeo y el riesgo de comprometer el caudal ecologico y productivo de su propia cuenca.",
      costIndex: 80,
      impactIndex: 75,
      vulnerabilityIndex: 80,
      paradigm: "centralized" as const,
    },
    {
      name: "Dique en Rio Xanaes",
      location: "Cuenca del Rio Segundo (Xanaes)",
      description: "Embalse para regulacion de riego, con potencial uso secundario para consumo humano.",
      inviabilityReason: "Calidad de agua comprometida por alta salinidad, elevado costo para potabilizacion y lejania de los grandes centros urbanos.",
      costIndex: 70,
      impactIndex: 60,
      vulnerabilityIndex: 50,
      paradigm: "centralized" as const,
    },
    {
      name: "Proyectos en Rio Anisacate",
      location: "Cuenca del Rio Anisacate",
      description: "Nuevos embalses para abastecer a la region de Paravachasca y potencialmente bombear excedente a Cordoba.",
      inviabilityReason: "La creciente demanda de la propia cuenca limita el excedente real que podria trasvasarse, generando competencia por el recurso.",
      costIndex: 65,
      impactIndex: 70,
      vulnerabilityIndex: 60,
      paradigm: "centralized" as const,
    },
    {
      name: "Otros Proyectos Regionales",
      location: "Cuencas del Rio Quinto y de los Sauces",
      description: "Proyectos como el Dique Achiras o nuevos diques en Traslasierra, enfocados en necesidades locales de riego y control de crecidas.",
      inviabilityReason: "Su aporte al sistema de la capital es marginal y logisticamente ineficiente; no resuelven el problema a gran escala.",
      costIndex: 55,
      impactIndex: 50,
      vulnerabilityIndex: 40,
      paradigm: "centralized" as const,
    },
  ];

  for (const project of projectsData) {
    await db.insert(paradigmProjects).values(project);
  }
  console.log("Paradigm projects seeded");

  // Seed data sources
  const sourcesData = [
    { name: "Landsat 8/9", type: "satellite", url: "https://landsat.gsfc.nasa.gov", description: "Imagenes multiespectrales para NDVI" },
    { name: "MODIS", type: "satellite", url: "https://modis.gsfc.nasa.gov", description: "Datos de temperatura y evapotranspiracion" },
    { name: "ECOSTRESS", type: "satellite", url: "https://ecostress.jpl.nasa.gov", description: "Mediciones precisas de estres hidrico" },
    { name: "VIIRS", type: "satellite", url: "https://jpss.gsfc.nasa.gov/viirs.html", description: "Datos de reflectancia para calculos ESI" },
  ];

  for (const source of sourcesData) {
    await db.insert(dataSources).values(source);
  }
  console.log("Data sources seeded");

  console.log("Database seeded successfully!");
}

seed().catch((error) => {
  console.error("Seed error:", error);
  process.exit(1);
});
