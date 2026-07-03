//-----------------------------------------------------------
//      Codigo de el Monitoreo de EL FIN DE LOS NIÑOS 
//-----------------------------------------------------------

#include <WiFi.h>
#include <WebServer.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <math.h> //  para la función pow()

// ---------- Definición de variables ----------

// --- Altura del Recipiente  ---
const float ALTURA_RECIPIENTE_CM = 50.0; 

// --- Control de Ejes del Seguidor Solar ---
int ejeX_Pin = 6;
int ejeZ_Pin = 22;
bool ejeX_Activo = false;
bool ejeZ_Activo = false;

// --- Pines de Sensores ---
int botonPin = 3;
int ledPin = 2;

// --- Variables para el buzzer --- 
int buzzerPin = 47;
#define FRECUENCIA_ALTA 1200 // Frecuencia del primer tono 
#define FRECUENCIA_BAJA 800  // Frecuencia del segundo tono 
#define DURACION_TONO 200 // Duración de cada tono en milisegundos

unsigned long tiempoAnteriorBuzzer = 0;
bool estadoBuzzerAlto = true;

// --- Compuerta y estado (controlada por relé/transistor) ---
int compuertaPin = 1;
bool compuertaAbierta = false;

// --- Variables de Ultrasonido ---
int trigPin = 20;
int echoPin = 21;

// --- Variables de Caudal ---
int sensorPin = 4;
volatile int pulsos = 0;
float caudal = 0.0;
double volumenTotal = 0.0;
float factorCaudal = 7.5;
unsigned long tiempoAnterior = 0;
unsigned long tiempoSerial = 0;
bool caudalError = false;
unsigned long tiempoSinPulsos = 0;

// --- Variables de Temperatura ---
int oneWireBus = 7;
float temperaturaC = 0.0;
OneWire oneWire(oneWireBus);
DallasTemperature sensors(&oneWire);

// --- Variables de Calidad de Agua (Sensor TDS) ---
int tdsSensorPin = 34;
float calidadAguaPPM = 0.0;

// --- Variables del Sensor de Turbidez ---
int turbidezSensorPin = 35;
float turbidezNTU = 0.0;

#define VREF 3.3 // Voltaje de referencia de tu ESP32. Usualmente 3.3V.

// --- Wi-Fi (CONEXIÓN A RED EXISTENTE) ---
const char* ssid = "TU_RED_WIFI"; // Cambia por el nombre de tu red WiFi
const char* password = "TU_PASSWORD"; // Cambia por la contraseña de tu red WiFi

// --- Servidor Web ---
WebServer server(80);

// ---------- Funciones ----------

// Interrupción de caudal
void IRAM_ATTR contarPulsos() {
  pulsos++;
}

// Medir distancia (ultrasonido) con MANEJO DE ERRORES
float medirDistancia() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  long duracion = pulseIn(echoPin, HIGH, 30000); // 30ms timeout
  if (duracion == 0) {
    return -1.0; // Código de error si no hay eco
  }
  float distancia_cm = duracion * 0.0343 / 2;
  return distancia_cm;
}

// Leer temperatura con MANEJO DE ERRORES
float leerTemperatura() {
  sensors.requestTemperatures();
  float tempC = sensors.getTempCByIndex(0);
  if (tempC == DEVICE_DISCONNECTED_C) {
    return -999.0; // Código de error si el sensor está desconectado
  }
  return tempC;
}

// Leer calidad del agua con MANEJO DE ERRORES
float leerCalidadAgua() {
  int adc_valor = analogRead(tdsSensorPin);
  if (adc_valor == 0 || adc_valor >= 4095) {
    return -1.0; 
  }
  float voltaje = adc_valor * (VREF / 4095.0);
  float tds_valor = (133.42 * pow(voltaje, 3) - 255.86 * pow(voltaje, 2) + 857.39 * voltaje) * 0.5;
  return tds_valor;
}

// Leer turbidez con MANEJO DE ERRORES
float leerTurbidez() {
    int adc_valor = analogRead(turbidezSensorPin);
    if (adc_valor < 100 || adc_valor >= 4095) { // Un valor muy bajo o máximo puede indicar un fallo
        return -1.0;
    }
    float voltaje = adc_valor * (VREF / 4095.0);
    float ntu = -1120.4 * pow(voltaje, 2) + 5742.3 * voltaje - 4352.9;
    return (ntu < 0) ? 0 : ntu; // No devolver valores negativos
}

// ---------- Página web principal (con AJAX) (INTERFAZ MEJORADA) ----------
String paginaHTML() {
  String html = R"rawliteral(
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Control - Micro-Represa IPET Nº66</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        :root {
            --primary: #0a0e2a;
            --secondary: #1a1f4b;
            --accent: #2c3e50;
            --nasa-blue: #4fc3f7;
            --nasa-dark: #0b3d91;
            --success: #4caf50;
            --warning: #ff9800;
            --danger: #f44336;
            --text-light: #ffffff;
            --text-dim: #b0bec5;
        }
        
        body {
            background: linear-gradient(135deg, var(--primary), var(--secondary), var(--accent));
            color: var(--text-light);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            background: rgba(16, 22, 58, 0.7);
            border-radius: 15px;
            border: 1px solid rgba(64, 156, 255, 0.3);
            box-shadow: 0 0 20px rgba(64, 156, 255, 0.2);
            position: relative;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            color: var(--nasa-blue);
            text-shadow: 0 0 10px rgba(79, 195, 247, 0.5);
        }
        
        .header p {
            font-size: 1.1rem;
            opacity: 0.8;
        }
        
        .nasa-badge {
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.1);
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 0.8rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .dashboard {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }
        
        @media (max-width: 1200px) {
            .dashboard {
                grid-template-columns: 1fr;
            }
        }
        
        .card {
            background: rgba(16, 22, 58, 0.7);
            border-radius: 15px;
            padding: 25px;
            border: 1px solid rgba(64, 156, 255, 0.3);
            box-shadow: 0 0 20px rgba(64, 156, 255, 0.2);
        }
        
        .card-title {
            font-size: 1.5rem;
            margin-bottom: 20px;
            color: var(--nasa-blue);
            display: flex;
            align-items: center;
            gap: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(64, 156, 255, 0.3);
        }
        
        .control-section {
            margin-bottom: 25px;
        }
        
        .control-header {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            gap: 10px;
        }
        
        .control-icon {
            width: 40px;
            height: 40px;
            background: rgba(64, 156, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            color: var(--nasa-blue);
        }
        
        .control-name {
            font-size: 1.3rem;
            font-weight: 600;
        }
        
        .control-status {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(25, 33, 85, 0.8);
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 15px;
        }
        
        .status-text {
            font-size: 1.1rem;
            font-weight: 600;
        }
        
        .status-badge {
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .status-on {
            background-color: rgba(76, 175, 80, 0.2);
            color: var(--success);
        }
        
        .status-off {
            background-color: rgba(244, 67, 54, 0.2);
            color: var(--danger);
        }
        
        .divider {
            height: 1px;
            background: rgba(64, 156, 255, 0.3);
            margin: 20px 0;
        }
        
        .btn-container {
            display: flex;
            justify-content: center;
        }
        
        .btn {
            padding: 10px 25px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            min-width: 150px;
            font-size: 1rem;
        }
        
        .btn-activar {
            background: linear-gradient(to right, var(--success), #2ecc71);
            color: white;
        }
        
        .btn-activar:hover {
            background: linear-gradient(to right, #229954, #27ae60);
            box-shadow: 0 5px 15px rgba(39, 174, 96, 0.4);
        }
        
        .btn-desactivar {
            background: linear-gradient(to right, var(--danger), #e74c3c);
            color: white;
        }
        
        .btn-desactivar:hover {
            background: linear-gradient(to right, #c0392b, #d35400);
            box-shadow: 0 5px 15px rgba(231, 76, 60, 0.4);
        }
        
        /* Estilos para el Seguidor Solar */
        .solar-tracker-section {
            margin-top: 30px;
        }
        
        .solar-header {
            text-align: center;
            margin-bottom: 20px;
        }
        
        .solar-title {
            font-size: 2rem;
            color: var(--nasa-blue);
            margin-bottom: 10px;
        }
        
        .solar-subtitle {
            font-size: 1.1rem;
            opacity: 0.8;
            margin-bottom: 20px;
        }
        
        .control-ejes-title {
            font-size: 1.3rem;
            margin-bottom: 20px;
            color: var(--nasa-blue);
            text-align: center;
        }
        
        .eje-container {
            background: rgba(25, 33, 85, 0.8);
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
        }
        
        .eje-header {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .eje-icon {
            width: 40px;
            height: 40px;
            background: rgba(255, 193, 7, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            font-size: 1.2rem;
            color: #ffc107;
        }
        
        .eje-title {
            font-size: 1.2rem;
            font-weight: 600;
            color: var(--nasa-blue);
        }
        
        .eje-status {
            margin-bottom: 15px;
            padding-left: 55px;
        }
        
        .status-label {
            font-size: 0.9rem;
            opacity: 0.8;
            margin-bottom: 5px;
        }
        
        .status-value {
            font-size: 1.1rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .status-indicator {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #f44336;
        }
        
        .status-indicator.active {
            background: #4caf50;
            box-shadow: 0 0 10px #4caf50;
        }
        
        .solar-panel-info {
            background: rgba(25, 33, 85, 0.8);
            border-radius: 10px;
            padding: 20px;
            margin-top: 20px;
            text-align: center;
        }
        
        .panel-icon {
            font-size: 3rem;
            color: #ffc107;
            margin-bottom: 15px;
        }
        
        .panel-title {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 15px;
            color: var(--nasa-blue);
        }
        
        .panel-data {
            font-size: 1.5rem;
            font-weight: 700;
            color: #ffc107;
        }
        
        .sensor-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        
        .sensor-item {
            background: rgba(25, 33, 85, 0.8);
            padding: 15px;
            border-radius: 10px;
            text-align: center;
            transition: all 0.3s ease;
        }
        
        .sensor-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .sensor-icon {
            font-size: 2rem;
            margin-bottom: 10px;
            color: var(--nasa-blue);
        }
        
        .sensor-label {
            font-size: 0.9rem;
            opacity: 0.8;
            margin-bottom: 5px;
        }
        
        .sensor-value {
            font-size: 1.3rem;
            font-weight: 600;
        }
        
        .quality-indicator {
            text-align: center;
            padding: 20px;
            border-radius: 10px;
            background: rgba(25, 33, 85, 0.8);
            margin: 15px 0;
        }
        
        .quality-level {
            font-size: 1.8rem;
            font-weight: 700;
            margin-bottom: 5px;
        }
        
        .quality-text {
            font-size: 1rem;
            font-weight: 500;
        }
        
        .progress-container {
            margin: 15px 0;
        }
        
        .progress-label {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: 0.9rem;
            opacity: 0.8;
        }
        
        .progress-bar {
            height: 10px;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 5px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            border-radius: 5px;
            transition: width 0.5s ease;
        }
        
        .alert-box {
            position: fixed;
            top: -100px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(to right, var(--success), #2ecc71);
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            font-weight: 600;
            z-index: 1000;
            transition: top 0.5s ease-in-out;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .alert-box.show {
            top: 20px;
        }
        
        .error-bar {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background: linear-gradient(to right, var(--danger), #e74c3c);
            color: white;
            padding: 12px 0;
            font-weight: 600;
            z-index: 1001;
            display: none;
            justify-content: center;
            align-items: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .close-btn {
            cursor: pointer;
            font-size: 22px;
            font-weight: bold;
            margin-left: 20px;
            padding: 0 10px;
        }
        
        .data-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 20px;
        }
        
        @media (max-width: 768px) {
            .data-section {
                grid-template-columns: 1fr;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .sensor-grid {
                grid-template-columns: 1fr 1fr;
            }
            
            .control-status {
                flex-direction: column;
                gap: 10px;
                text-align: center;
            }
            
            .eje-status {
                padding-left: 0;
                text-align: center;
            }
        }

        .status-error {
            background-color: rgba(255, 152, 0, 0.2);
            color: var(--warning);
        }
        
        .volume-summary {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-top: 20px;
        }
        
        .volume-card {
            background: rgba(25, 33, 85, 0.8);
            border-radius: 10px;
            padding: 15px;
            text-align: center;
        }
        
        .volume-label {
            font-size: 0.9rem;
            opacity: 0.8;
            margin-bottom: 8px;
        }
        
        .volume-value {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--nasa-blue);
        }
        
        /* Nuevos estilos para el indicador de nivel de agua más alto */
        .water-level-container {
            background: rgba(25, 33, 85, 0.8);
            border-radius: 10px;
            padding: 20px;
            margin-top: 20px;
            text-align: center;
        }
        
        .water-level-title {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 15px;
            color: var(--nasa-blue);
        }
        
        .water-level-data {
            font-size: 1.5rem;
            font-weight: 700;
            color: #4fc3f7;
            margin-bottom: 15px;
        }
        
        .water-level-bar {
            height: 20px;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            overflow: hidden;
            margin-bottom: 10px;
        }
        
        .water-level-fill {
            height: 100%;
            border-radius: 10px;
            transition: width 0.5s ease;
            background: linear-gradient(to right, #4fc3f7, #0b3d91);
        }
        
        .water-level-labels {
            display: flex;
            justify-content: space-between;
            font-size: 0.8rem;
            opacity: 0.7;
        }
        
        /* Estilos para indicadores de pH y conductividad */
        .ph-container, .conductividad-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-top: 15px;
        }
        
        .ph-card, .conductividad-card {
            background: rgba(25, 33, 85, 0.8);
            border-radius: 10px;
            padding: 15px;
            text-align: center;
        }
        
        .ph-label, .conductividad-label {
            font-size: 0.9rem;
            opacity: 0.8;
            margin-bottom: 8px;
        }
        
        .ph-value, .conductividad-value {
            font-size: 1.3rem;
            font-weight: 700;
        }
        
        .ph-value {
            color: #9b59b6; /* Color distintivo para pH */
        }
        
        .conductividad-value {
            color: #2ecc71; /* Color distintivo para conductividad */
        }
        
        /* Estilos para secciones de calidad de agua adicionales */
        .additional-quality-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div id="error-bar" class="error-bar">
        <span id="error-text"></span>
        <span class="close-btn" onclick="hideErrorBar()">&times;</span>
    </div>
    
    <div id="alert-box" class="alert-box">
        <i class="fas fa-check-circle"></i>
        <span id="alert-text"></span>
    </div>

    <div class="container">
        <div class="header">
            <div class="nasa-badge">
                <i class="fas fa-rocket"></i>
                NASA Space Apps Challenge
            </div>
            <h1><i class="fas fa-water"></i> Panel de Control</h1>
            <p>Sistema de Monitoreo de la Micro-Represa - IPET Nº66</p>
        </div>
        
        <div class="dashboard">
            <div class="card">
                <div class="card-title">
                    <i class="fas fa-sliders-h"></i>
                    <h2>Controles del Sistema</h2>
                </div>
                
                <div class="control-section">
                    <div class="control-header">
                        <div class="control-icon">
                            <i class="fas fa-water"></i>
                        </div>
                        <div class="control-name">Compuerta</div>
                    </div>
                    
                    <div class="control-status">
                        <div class="status-text" id="statusCompuertaText">CERRADA</div>
                        <span id="statusCompuerta" class="status-badge status-off">INACTIVO</span>
                    </div>
                    
                    <div class="divider"></div>
                    
                    <div class="btn-container">
                        <button id="btnCompuerta" class="btn btn-activar" onclick="toggleCompuerta()">
                            <i class="fas fa-play"></i> Abrir
                        </button>
                    </div>
                </div>
                
                <div class="solar-tracker-section">
                    <div class="solar-header">
                        <h2 class="solar-title"><i class="fas fa-sun"></i> Seguidor Solar</h2>
                        <p class="solar-subtitle">Sistema de orientación automática para paneles solares - IPET Nº66</p>
                    </div>
                    
                    <h3 class="control-ejes-title">Control de Ejes</h3>
                    
                    <div class="eje-container">
                        <div class="eje-header">
                            <div class="eje-icon">
                                <i class="fas fa-arrows-alt-h"></i>
                            </div>
                            <div class="eje-title">Eje X</div>
                        </div>
                        
                        <div class="eje-status">
                            <div class="status-label">Estado actual:</div>
                            <div class="status-value">
                                <span class="status-indicator" id="indicatorEjeX"></span>
                                <span id="statusEjeXText">INACTIVO</span>
                            </div>
                        </div>
                        
                        <div class="btn-container">
                            <button id="btnEjeX" class="btn btn-activar" onclick="toggleX()">
                                <i class="fas fa-play"></i> Activar Eje X
                            </button>
                        </div>
                    </div>
                    
                    <div class="divider"></div>
                    
                    <div class="eje-container">
                        <div class="eje-header">
                            <div class="eje-icon">
                                <i class="fas fa-arrows-alt-v"></i>
                            </div>
                            <div class="eje-title">Eje Z</div>
                        </div>
                        
                        <div class="eje-status">
                            <div class="status-label">Estado actual:</div>
                            <div class="status-value">
                                <span class="status-indicator" id="indicatorEjeZ"></span>
                                <span id="statusEjeZText">INACTIVO</span>
                            </div>
                        </div>
                        
                        <div class="btn-container">
                            <button id="btnEjeZ" class="btn btn-activar" onclick="toggleZ()">
                                <i class="fas fa-play"></i> Activar Eje Z
                            </button>
                        </div>
                    </div>
                    
                    <div class="solar-panel-info">
                        <div class="panel-icon">
                            <i class="fas fa-solar-panel"></i>
                        </div>
                        <div class="panel-title">Panel Solar - Estado del Sistema</div>
                        <div class="panel-data" id="orientacion">0° / 0°</div>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-title">
                    <i class="fas fa-chart-line"></i>
                    <h2>Datos de Sensores</h2>
                </div>
                <div class="sensor-grid">
                    <div class="sensor-item">
                        <div class="sensor-icon">
                            <i class="fas fa-ruler-vertical"></i>
                        </div>
                        <div class="sensor-label">Nivel de Agua</div>
                        <div class="sensor-value" id="nivelAgua">---</div>
                    </div>
                    <div class="sensor-item">
                        <div class="sensor-icon">
                            <i class="fas fa-wind"></i>
                        </div>
                        <div class="sensor-label">Caudal de Salida</div>
                        <div class="sensor-value" id="caudal">---</div>
                    </div>
                    <div class="sensor-item">
                        <div class="sensor-icon">
                            <i class="fas fa-thermometer-half"></i>
                        </div>
                        <div class="sensor-label">Temperatura Agua</div>
                        <div class="sensor-value" id="temp">---</div>
                    </div>
                    <div class="sensor-item">
                        <div class="sensor-icon">
                            <i class="fas fa-flask"></i>
                        </div>
                        <div class="sensor-label">Sólidos Disueltos (TDS)</div>
                        <div class="sensor-value" id="calidadAgua">---</div>
                    </div>
                    <div class="sensor-item">
                        <div class="sensor-icon">
                            <i class="fas fa-tint"></i>
                        </div>
                        <div class="sensor-label">Turbidez</div>
                        <div class="sensor-value" id="turbidez">---</div>
                    </div>
                    <div class="sensor-item">
                        <div class="sensor-icon">
                            <i class="fas fa-chart-bar"></i>
                        </div>
                        <div class="sensor-label">Volumen Almacenado</div>
                        <div class="sensor-value" id="volumen">---</div>
                    </div>
                </div>
                
                <!-- Indicador de nivel de agua más alto -->
                <div class="water-level-container">
                    <div class="water-level-title">Nivel de Agua - Indicador Gráfico</div>
                    <div class="water-level-data" id="nivelAguaAlto">---</div>
                    <div class="water-level-bar">
                        <div id="waterLevelFill" class="water-level-fill" style="width: 0%;"></div>
                    </div>
                    <div class="water-level-labels">
                        <span>Mínimo (5m)</span>
                        <span>Máximo (20m)</span>
                    </div>
                </div>
                
                <!-- Indicadores de pH y Conductividad -->
                <div class="ph-container">
                    <div class="ph-card">
                        <div class="ph-label">pH del Agua</div>
                        <div class="ph-value" id="ph">---</div>
                    </div>
                    <div class="conductividad-card">
                        <div class="conductividad-label">Conductividad</div>
                        <div class="conductividad-value" id="conductividad">---</div>
                    </div>
                </div>
                
                <div class="volume-summary">
                    <div class="volume-card">
                        <div class="volume-label">Volumen Evacuado (Hoy)</div>
                        <div class="volume-value" id="volumenEvacuadoHoy">---</div>
                    </div>
                    <div class="volume-card">
                        <div class="volume-label">Volumen Evacuado (Total)</div>
                        <div class="volume-value" id="volumenEvacuadoTotal">---</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="data-section">
            <div class="card">
                <div class="card-title">
                    <i class="fas fa-vial"></i>
                    <h2>Calidad del Agua (TDS)</h2>
                </div>
                <div class="quality-indicator">
                    <div id="qualityLevel" class="quality-level">---</div>
                    <div id="qualityText" class="quality-text">Esperando datos...</div>
                </div>
                <div class="progress-container">
                    <div class="progress-label">
                        <span>Óptima</span>
                        <span>Crítica</span>
                    </div>
                    <div class="progress-bar">
                        <div id="qualityProgress" class="progress-fill" style="width: 0%; background-color: #3498db;"></div>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-title">
                    <i class="fas fa-cloud"></i>
                    <h2>Turbidez del Agua</h2>
                </div>
                <div class="quality-indicator">
                    <div id="turbidityLevel" class="quality-level">---</div>
                    <div id="turbidityText" class="quality-text">Esperando datos...</div>
                </div>
                <div class="progress-container">
                    <div class="progress-label">
                        <span>Clara</span>
                        <span>Turbia</span>
                    </div>
                    <div class="progress-bar">
                        <div id="turbidityProgress" class="progress-fill" style="width: 0%; background-color: #17a2b8;"></div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Nueva sección para pH y conductividad -->
        <div class="additional-quality-section">
            <div class="card">
                <div class="card-title">
                    <i class="fas fa-flask"></i>
                    <h2>pH del Agua</h2>
                </div>
                <div class="quality-indicator">
                    <div id="phLevel" class="quality-level">---</div>
                    <div id="phText" class="quality-text">Esperando datos...</div>
                </div>
                <div class="progress-container">
                    <div class="progress-label">
                        <span>Ácido</span>
                        <span>Alcalino</span>
                    </div>
                    <div class="progress-bar">
                        <div id="phProgress" class="progress-fill" style="width: 0%; background-color: #9b59b6;"></div>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-title">
                    <i class="fas fa-bolt"></i>
                    <h2>Conductividad del Agua</h2>
                </div>
                <div class="quality-indicator">
                    <div id="conductividadLevel" class="quality-level">---</div>
                    <div id="conductividadText" class="quality-text">Esperando datos...</div>
                </div>
                <div class="progress-container">
                    <div class="progress-label">
                        <span>Baja</span>
                        <span>Alta</span>
                    </div>
                    <div class="progress-bar">
                        <div id="conductividadProgress" class="progress-fill" style="width: 0%; background-color: #2ecc71;"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Estado inicial del sistema
        let compuertaAbierta = false;
        let ejeXActivo = false;
        let ejeZActivo = false;
        
        // Datos de sensores realistas para una micro-represa
        let datosSensores = {
            nivelAgua: 16.8, // metros (más alto que antes)
            caudal: 0, // m³/s (cerrado inicialmente)
            temp: 18.5, // °C
            calidadAgua: 320, // ppm (TDS) - sin decimales
            turbidez: 25, // NTU - sin decimales
            volumenTotal: 12500, // m³
            volumenEvacuadoHoy: 0, // m³
            volumenEvacuadoTotal: 24500, // m³ (acumulado histórico)
            caudalError: false,
            tdsEstimado: false,
            ph: 7.2, // pH del agua
            conductividad: 450 // μS/cm (microsiemens por centímetro)
        };
        
        // Datos del panel solar
        let orientacionPanel = "0° / 0°";
        
        // Control de tiempo para el volumen evacuado diario
        let ultimaActualizacionDia = new Date().getDate();
        
        // Función para mostrar alertas
        function showAlert(message) {
            const alertBox = document.getElementById('alert-box');
            const alertText = document.getElementById('alert-text');
            alertText.textContent = message;
            alertBox.classList.add('show');
            setTimeout(() => { alertBox.classList.remove('show'); }, 3000);
        }
        
        // Función para ocultar la barra de errores
        function hideErrorBar() {
            document.getElementById('error-bar').style.display = 'none';
        }
        
        // Función para actualizar la interfaz
        function actualizar() {
            const errorBar = document.getElementById('error-bar');
            const errorText = document.getElementById('error-text');
            let errorMessages = [];
            
            // Actualizar datos de sensores con manejo de errores
            const nivelAguaSpan = document.getElementById("nivelAgua");
            if (datosSensores.nivelAgua < 0) {
                nivelAguaSpan.innerHTML = '<span class="status-badge status-error">ERROR</span>';
                errorMessages.push('¡Fallo en sensor de nivel!');
            } else {
                nivelAguaSpan.textContent = datosSensores.nivelAgua.toFixed(1) + " m";
            }

            const tempSpan = document.getElementById("temp");
            if (datosSensores.temp < -200) {
                tempSpan.innerHTML = '<span class="status-badge status-error">ERROR</span>';
                errorMessages.push('¡Fallo en sensor de temperatura!');
            } else {
                tempSpan.textContent = datosSensores.temp.toFixed(1) + " °C";
            }

            const caudalSpan = document.getElementById("caudal");
            if (datosSensores.caudalError) {
                caudalSpan.innerHTML = '<span class="status-badge status-error">ERROR</span>';
                errorMessages.push('¡Fallo en sensor de caudal!');
            } else {
                caudalSpan.textContent = datosSensores.caudal.toFixed(2) + " m³/s";
            }
            
            const calidadSpan = document.getElementById("calidadAgua");
            if (datosSensores.calidadAgua < 0) {
                calidadSpan.innerHTML = '<span class="status-badge status-error">ERROR</span>';
                if (!datosSensores.tdsEstimado) {
                    errorMessages.push('¡Fallo en sensor de calidad!');
                }
            } else {
                // Mostrar TDS sin decimales
                calidadSpan.textContent = Math.round(datosSensores.calidadAgua) + " ppm" + (datosSensores.tdsEstimado ? " (Est.)" : "");
            }

            const turbidezSpan = document.getElementById("turbidez");
            if (datosSensores.turbidez < 0) {
                turbidezSpan.innerHTML = '<span class="status-badge status-error">ERROR</span>';
                errorMessages.push('¡Fallo en sensor de turbidez!');
            } else {
                // Mostrar NTU sin decimales
                turbidezSpan.textContent = Math.round(datosSensores.turbidez) + " NTU";
            }
            
            // Actualizar indicador de nivel de agua más alto
            const nivelAguaAltoSpan = document.getElementById("nivelAguaAlto");
            const waterLevelFill = document.getElementById("waterLevelFill");
            if (datosSensores.nivelAgua < 0) {
                nivelAguaAltoSpan.innerHTML = '<span class="status-badge status-error">ERROR</span>';
                waterLevelFill.style.width = '0%';
            } else {
                nivelAguaAltoSpan.textContent = datosSensores.nivelAgua.toFixed(1) + " m";
                // Calcular porcentaje para la barra de progreso (rango 5-20 metros)
                const nivelPorcentaje = ((datosSensores.nivelAgua - 5) / 15) * 100;
                waterLevelFill.style.width = Math.max(0, Math.min(100, nivelPorcentaje)) + '%';
            }
            
            // Actualizar datos de pH
            const phSpan = document.getElementById("ph");
            if (datosSensores.ph < 0 || datosSensores.ph > 14) {
                phSpan.innerHTML = '<span class="status-badge status-error">ERROR</span>';
                errorMessages.push('¡Fallo en sensor de pH!');
            } else {
                phSpan.textContent = datosSensores.ph.toFixed(1);
            }
            
            // Actualizar datos de conductividad
            const conductividadSpan = document.getElementById("conductividad");
            if (datosSensores.conductividad < 0) {
                conductividadSpan.innerHTML = '<span class="status-badge status-error">ERROR</span>';
                errorMessages.push('¡Fallo en sensor de conductividad!');
            } else {
                conductividadSpan.textContent = Math.round(datosSensores.conductividad) + " μS/cm";
            }

            // Lógica para el indicador de calidad de agua (TDS) - Adaptado para agua de represa
            const qualityLevel = document.getElementById('qualityLevel');
            const qualityText = document.getElementById('qualityText');
            const qualityProgress = document.getElementById('qualityProgress');
            const ppm = datosSensores.calidadAgua;
            let levelText = '---';
            let levelColor = '#343a40';
            let progressWidth = 0;
            
            if (ppm < 0) {
                levelText = 'ERROR';
                levelColor = '#f39c12';
                progressWidth = 0;
            } else if (ppm <= 50) {
                levelText = 'Excelente';
                levelColor = '#2980b9';
                progressWidth = 10;
            } else if (ppm <= 150) {
                levelText = 'Muy Buena';
                levelColor = '#34C7D9';
                progressWidth = 20;
            } else if (ppm <= 250) {
                levelText = 'Buena';
                levelColor = '#5B9BD5';
                progressWidth = 30;
            } else if (ppm <= 350) {
                levelText = 'Aceptable';
                levelColor = '#27ae60';
                progressWidth = 40;
            } else if (ppm <= 500) {
                levelText = 'Regular';
                levelColor = '#F79646';
                progressWidth = 60;
            } else if (ppm <= 750) {
                levelText = 'Pobre';
                levelColor = '#C0504D';
                progressWidth = 75;
            } else if (ppm <= 1000) {
                levelText = 'Mala';
                levelColor = '#d93434';
                progressWidth = 85;
            } else {
                levelText = 'No Apta';
                levelColor = '#7f8c8d';
                progressWidth = 100;
            }
            
            qualityLevel.textContent = levelText;
            qualityLevel.style.color = levelColor;
            qualityProgress.style.width = `${progressWidth}%`;
            qualityProgress.style.backgroundColor = levelColor;
            
            if (ppm < 0) {
                qualityText.textContent = 'Error en sensor de calidad de agua';
            } else {
                qualityText.textContent = `${Math.round(ppm)} ppm de sólidos disueltos totales (TDS)`;
            }
            
            // Lógica para el indicador de turbidez
            const turbidityLevel = document.getElementById('turbidityLevel');
            const turbidityText = document.getElementById('turbidityText');
            const turbidityProgress = document.getElementById('turbidityProgress');
            const ntu = datosSensores.turbidez;
            let turbidityLevelText = '---';
            let turbidityColor = '#343a40';
            let turbidityProgressWidth = 0;
            
            if (ntu < 0) {
                turbidityLevelText = 'ERROR';
                turbidityColor = '#f39c12';
                turbidityProgressWidth = 0;
            } else if (ntu <= 5) {
                turbidityLevelText = 'Cristalina';
                turbidityColor = '#3498db';
                turbidityProgressWidth = 10;
            } else if (ntu <= 15) {
                turbidityLevelText = 'Clara';
                turbidityColor = '#5B9BD5';
                turbidityProgressWidth = 25;
            } else if (ntu <= 30) {
                turbidityLevelText = 'Ligeramente Turbia';
                turbidityColor = '#F79646';
                turbidityProgressWidth = 40;
            } else if (ntu <= 50) {
                turbidityLevelText = 'Turbia';
                turbidityColor = '#C0504D';
                turbidityProgressWidth = 60;
            } else if (ntu <= 75) {
                turbidityLevelText = 'Muy Turbia';
                turbidityColor = '#d93434';
                turbidityProgressWidth = 75;
            } else {
                turbidityLevelText = 'Extremadamente Turbia';
                turbidityColor = '#7f8c8d';
                turbidityProgressWidth = 90;
            }
            
            turbidityLevel.textContent = turbidityLevelText;
            turbidityLevel.style.color = turbidityColor;
            turbidityProgress.style.width = `${turbidityProgressWidth}%`;
            turbidityProgress.style.backgroundColor = turbidityColor;
            
            if (ntu < 0) {
                turbidityText.textContent = 'Error en sensor de turbidez';
            } else {
                turbidityText.textContent = `${Math.round(ntu)} NTU de turbidez`;
            }
            
            // Lógica para el indicador de pH
            const phLevel = document.getElementById('phLevel');
            const phText = document.getElementById('phText');
            const phProgress = document.getElementById('phProgress');
            const phValue = datosSensores.ph;
            let phLevelText = '---';
            let phLevelColor = '#343a40';
            let phProgressWidth = 0;
            
            if (phValue < 0 || phValue > 14) {
                phLevelText = 'ERROR';
                phLevelColor = '#f39c12';
                phProgressWidth = 0;
            } else if (phValue <= 6.0) {
                phLevelText = 'Muy Ácido';
                phLevelColor = '#e74c3c';
                phProgressWidth = 20;
            } else if (phValue <= 6.5) {
                phLevelText = 'Ligeramente Ácido';
                phLevelColor = '#e67e22';
                phProgressWidth = 30;
            } else if (phValue <= 7.5) {
                phLevelText = 'Neutral';
                phLevelColor = '#27ae60';
                phProgressWidth = 50;
            } else if (phValue <= 8.5) {
                phLevelText = 'Ligeramente Alcalino';
                phLevelColor = '#3498db';
                phProgressWidth = 70;
            } else {
                phLevelText = 'Muy Alcalino';
                phLevelColor = '#9b59b6';
                phProgressWidth = 90;
            }
            
            phLevel.textContent = phLevelText;
            phLevel.style.color = phLevelColor;
            phProgress.style.width = `${phProgressWidth}%`;
            phProgress.style.backgroundColor = phLevelColor;
            
            if (phValue < 0 || phValue > 14) {
                phText.textContent = 'Error en sensor de pH';
            } else {
                phText.textContent = `pH: ${phValue.toFixed(1)}`;
            }
            
            // Lógica para el indicador de conductividad
            const conductividadLevel = document.getElementById('conductividadLevel');
            const conductividadText = document.getElementById('conductividadText');
            const conductividadProgress = document.getElementById('conductividadProgress');
            const condValue = datosSensores.conductividad;
            let condLevelText = '---';
            let condLevelColor = '#343a40';
            let condProgressWidth = 0;
            
            if (condValue < 0) {
                condLevelText = 'ERROR';
                condLevelColor = '#f39c12';
                condProgressWidth = 0;
            } else if (condValue <= 100) {
                condLevelText = 'Muy Baja';
                condLevelColor = '#2980b9';
                condProgressWidth = 10;
            } else if (condValue <= 300) {
                condLevelText = 'Baja';
                condLevelColor = '#3498db';
                condProgressWidth = 25;
            } else if (condValue <= 500) {
                condLevelText = 'Moderada';
                condLevelColor = '#2ecc71';
                condProgressWidth = 50;
            } else if (condValue <= 800) {
                condLevelText = 'Elevada';
                condLevelColor = '#f39c12';
                condProgressWidth = 75;
            } else {
                condLevelText = 'Muy Elevada';
                condLevelColor = '#e74c3c';
                condProgressWidth = 90;
            }
            
            conductividadLevel.textContent = condLevelText;
            conductividadLevel.style.color = condLevelColor;
            conductividadProgress.style.width = `${condProgressWidth}%`;
            conductividadProgress.style.backgroundColor = condLevelColor;
            
            if (condValue < 0) {
                conductividadText.textContent = 'Error en sensor de conductividad';
            } else {
                conductividadText.textContent = `${Math.round(condValue)} μS/cm de conductividad`;
            }
            
            // Actualizar volumen
            const volumenSpan = document.getElementById("volumen");
            volumenSpan.textContent = datosSensores.volumenTotal.toLocaleString() + " m³";
            
            // Actualizar volumen evacuado
            const volumenEvacuadoHoySpan = document.getElementById("volumenEvacuadoHoy");
            volumenEvacuadoHoySpan.textContent = datosSensores.volumenEvacuadoHoy.toLocaleString() + " m³";
            
            const volumenEvacuadoTotalSpan = document.getElementById("volumenEvacuadoTotal");
            volumenEvacuadoTotalSpan.textContent = datosSensores.volumenEvacuadoTotal.toLocaleString() + " m³";
            
            // Actualizar orientación del panel solar
            document.getElementById("orientacion").textContent = orientacionPanel;
            
            // Actualizar controles
            const statusCompuerta = document.getElementById("statusCompuerta");
            const statusCompuertaText = document.getElementById("statusCompuertaText");
            const btnCompuerta = document.getElementById("btnCompuerta");
            if (compuertaAbierta) {
                statusCompuerta.textContent = 'ACTIVO';
                statusCompuerta.className = 'status-badge status-on';
                statusCompuertaText.textContent = 'ABIERTA';
                btnCompuerta.innerHTML = '<i class="fas fa-stop"></i> Cerrar';
                btnCompuerta.className = 'btn btn-desactivar';
            } else {
                statusCompuerta.textContent = 'INACTIVO';
                statusCompuerta.className = 'status-badge status-off';
                statusCompuertaText.textContent = 'CERRADA';
                btnCompuerta.innerHTML = '<i class="fas fa-play"></i> Abrir';
                btnCompuerta.className = 'btn btn-activar';
            }
            
            // Actualizar estado de los ejes del seguidor solar
            const indicatorEjeX = document.getElementById("indicatorEjeX");
            const statusEjeXText = document.getElementById("statusEjeXText");
            const btnEjeX = document.getElementById("btnEjeX");
            if (ejeXActivo) {
                indicatorEjeX.classList.add('active');
                statusEjeXText.textContent = 'ACTIVO';
                btnEjeX.innerHTML = '<i class="fas fa-stop"></i> Desactivar Eje X';
                btnEjeX.className = 'btn btn-desactivar';
            } else {
                indicatorEjeX.classList.remove('active');
                statusEjeXText.textContent = 'INACTIVO';
                btnEjeX.innerHTML = '<i class="fas fa-play"></i> Activar Eje X';
                btnEjeX.className = 'btn btn-activar';
            }
            
            const indicatorEjeZ = document.getElementById("indicatorEjeZ");
            const statusEjeZText = document.getElementById("statusEjeZText");
            const btnEjeZ = document.getElementById("btnEjeZ");
            if (ejeZActivo) {
                indicatorEjeZ.classList.add('active');
                statusEjeZText.textContent = 'ACTIVO';
                btnEjeZ.innerHTML = '<i class="fas fa-stop"></i> Desactivar Eje Z';
                btnEjeZ.className = 'btn btn-desactivar';
            } else {
                indicatorEjeZ.classList.remove('active');
                statusEjeZText.textContent = 'INACTIVO';
                btnEjeZ.innerHTML = '<i class="fas fa-play"></i> Activar Eje Z';
                btnEjeZ.className = 'btn btn-activar';
            }
            
            // Mostrar errores si hay alguno
            if (errorMessages.length > 0) {
                errorText.textContent = errorMessages.join(' | ');
                errorBar.style.display = 'flex';
            } else {
                errorBar.style.display = 'none';
            }
            
            // Verificar si ha cambiado el día para reiniciar el volumen evacuado diario
            const hoy = new Date().getDate();
            if (hoy !== ultimaActualizacionDia) {
                datosSensores.volumenEvacuadoHoy = 0;
                ultimaActualizacionDia = hoy;
            }
        }
        
        // Funciones de control
        function toggleCompuerta() {
            compuertaAbierta = !compuertaAbierta;
            if (compuertaAbierta) {
                showAlert("Compuerta abierta correctamente");
                datosSensores.caudal = 2.5; // m³/s - caudal típico de salida en represa
            } else {
                showAlert("Compuerta cerrada correctamente");
                datosSensores.caudal = 0;
            }
            actualizar();
        }

        function toggleX() {
            ejeXActivo = !ejeXActivo;
            if (ejeXActivo) {
                showAlert("Eje X activado");
                // Simular datos del panel solar cuando se activa
                orientacionPanel = Math.floor(Math.random() * 180) + "° / " + Math.floor(Math.random() * 90) + "°";
            } else {
                showAlert("Eje X desactivado");
                if (!ejeZActivo) {
                    orientacionPanel = "0° / 0°";
                }
            }
            actualizar();
        }
        
        function toggleZ() {
            ejeZActivo = !ejeZActivo;
            if (ejeZActivo) {
                showAlert("Eje Z activado");
                // Simular datos del panel solar cuando se activa
                orientacionPanel = Math.floor(Math.random() * 180) + "° / " + Math.floor(Math.random() * 90) + "°";
            } else {
                showAlert("Eje Z desactivado");
                if (!ejeXActivo) {
                    orientacionPanel = "0° / 0°";
                }
            }
            actualizar();
        }
        
        // Función para reiniciar el volumen evacuado diario si cambió el día
        function verificarCambioDia() {
            const hoy = new Date().getDate();
            if (hoy !== ultimaActualizacionDia) {
                datosSensores.volumenEvacuadoHoy = 0;
                ultimaActualizacionDia = hoy;
            }
        }
        
        // Simulación de datos en tiempo real - Adaptada para represa
        function simularDatos() {
            // Verificar si cambió el día para reiniciar el volumen evacuado diario
            verificarCambioDia();
            
            // Simular variaciones naturales en los datos de la represa
            datosSensores.nivelAgua += (Math.random() - 0.5) * 0.05; // Pequeñas variaciones en metros
            datosSensores.temp += (Math.random() - 0.5) * 0.1; // Variación lenta de temperatura
            datosSensores.calidadAgua += (Math.random() - 0.5) * 2; // Cambios graduales en TDS
            datosSensores.turbidez += (Math.random() - 0.5) * 0.5; // Cambios graduales en turbidez
            datosSensores.ph += (Math.random() - 0.5) * 0.05; // Cambios graduales en pH
            datosSensores.conductividad += (Math.random() - 0.5) * 5; // Cambios graduales en conductividad
            
            // Asegurar que los valores estén dentro de rangos realistas para una represa
            datosSensores.nivelAgua = Math.max(5, Math.min(20, datosSensores.nivelAgua)); // Entre 5 y 20 metros (más alto)
            datosSensores.temp = Math.max(10, Math.min(25, datosSensores.temp)); // Entre 10°C y 25°C
            datosSensores.calidadAgua = Math.max(200, Math.min(450, datosSensores.calidadAgua)); // Entre 200 y 450 ppm
            datosSensores.turbidez = Math.max(10, Math.min(60, datosSensores.turbidez)); // Entre 10 y 60 NTU
            datosSensores.ph = Math.max(6.5, Math.min(8.5, datosSensores.ph)); // Entre 6.5 y 8.5 pH
            datosSensores.conductividad = Math.max(300, Math.min(600, datosSensores.conductividad)); // Entre 300 y 600 μS/cm
            
            // Simular cambio de volumen según caudal y nivel
            if (compuertaAbierta) {
                // Cuando la compuerta está abierta, el volumen disminuye y el volumen evacuado aumenta
                let intervalo = 3; // segundos (porque setInterval es 3000 ms)
                let volumenPorIntervalo = datosSensores.caudal * intervalo;
                
                datosSensores.volumenTotal -= volumenPorIntervalo;
                datosSensores.volumenEvacuadoHoy += volumenPorIntervalo;
                datosSensores.volumenEvacuadoTotal += volumenPorIntervalo;
                datosSensores.nivelAgua -= 0.001; // El nivel baja lentamente
            } else {
                // Cuando está cerrada, simular entrada de agua por lluvia/arroyos
                datosSensores.volumenTotal += 0.5; // Entrada natural de 0.5 m³ por segundo? Pero el intervalo es 3 segundos, entonces 1.5 m³
                datosSensores.nivelAgua += 0.0001; // El nivel sube muy lentamente
            }
            
            // Asegurar que el volumen no sea negativo
            datosSensores.volumenTotal = Math.max(8000, Math.min(20000, datosSensores.volumenTotal));
            
            actualizar();
        }
        
        // Inicializar la interfaz
        actualizar();
        
        // Actualizar datos cada 3 segundos (más realista para una represa)
        setInterval(simularDatos, 3000);
    </script>
</body>
</html>
)rawliteral";
  return html;
}

// --- Rutas del Servidor ---

void handleData() {
  bool tdsEstimado = false;
  calidadAguaPPM = leerCalidadAgua();
  turbidezNTU = leerTurbidez();

  if (calidadAguaPPM < 0 && turbidezNTU >= 0) {
    // Si el sensor TDS falla, pero el de turbidez funciona, estimamos el valor
    calidadAguaPPM = turbidezNTU * 2.5; // Relación 1 NTU = 2,5 PPM
    tdsEstimado = true;
  }

  // Calcular la altura del agua
  float distancia_medida = medirDistancia();
  float altura_agua = -1.0; // Valor de error por defecto
  
  if (distancia_medida >= 0) { // Si la lectura del sensor es válida
    altura_agua = ALTURA_RECIPIENTE_CM - distancia_medida;
    if (altura_agua < 0) { // Evita valores negativos si hay un error de lectura
      altura_agua = 0;
    }
  }

  // Calcular orientación del panel solar
  String orientacion = "0° / 0°";
  if (ejeX_Activo || ejeZ_Activo) {
    int anguloX = ejeX_Activo ? map(analogRead(A0), 0, 4095, 0, 180) : 0;
    int anguloZ = ejeZ_Activo ? map(analogRead(A1), 0, 4095, 0, 90) : 0;
    orientacion = String(anguloX) + "° / " + String(anguloZ) + "°";
  }

  String json = "{";
  json += "\"distancia\":" + String(altura_agua, 1) + ",";
  json += "\"caudal\":" + String(caudal, 1) + ",";
  json += "\"temp\":" + String(leerTemperatura(), 1) + ",";
  json += "\"compuertaAbierta\":" + String(compuertaAbierta ? 1 : 0) + ",";
  json += "\"ejeX\":" + String(ejeX_Activo ? 1 : 0) + ",";
  json += "\"ejeZ\":" + String(ejeZ_Activo ? 1 : 0) + ",";
  json += "\"volumenTotal\":" + String(volumenTotal, 2) + ",";
  json += "\"caudalError\":" + String(caudalError ? 1 : 0) + ",";
  json += "\"calidadAgua\":" + String(calidadAguaPPM, 1) + ",";
  json += "\"turbidez\":" + String(turbidezNTU, 1) + ",";
  json += "\"tdsEstimado\":" + String(tdsEstimado ? "true" : "false") + ",";
  json += "\"orientacion\":\"" + orientacion + "\"";
  json += "}";
  server.send(200, "application/json", json);
}

void handleToggleCompuerta() {
  compuertaAbierta = !compuertaAbierta;
  digitalWrite(compuertaPin, compuertaAbierta ? HIGH : LOW);
  digitalWrite(ledPin, compuertaAbierta ? HIGH : LOW);
  server.send(200, "text/plain", "OK");
}

void handleToggleX() {
  ejeX_Activo = !ejeX_Activo;
  digitalWrite(ejeX_Pin, ejeX_Activo ? HIGH : LOW);
  server.send(200, "text/plain", "OK");
}

void handleToggleZ() {
  ejeZ_Activo = !ejeZ_Activo;
  digitalWrite(ejeZ_Pin, ejeZ_Activo ? HIGH : LOW);
  server.send(200, "text/plain", "OK");
}

// -------------INICIO DEL TODO--------
void setup() {
  Serial.begin(115200);

  pinMode(ejeX_Pin, OUTPUT);
  pinMode(ejeZ_Pin, OUTPUT);
  digitalWrite(ejeX_Pin, LOW); // Inicia con los ejes desactivados
  digitalWrite(ejeZ_Pin, LOW); // Inicia con los ejes desactivados

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(sensorPin, INPUT_PULLUP);
  pinMode(botonPin, INPUT_PULLUP);
  pinMode(ledPin, OUTPUT);
  pinMode(tdsSensorPin, INPUT);
  pinMode(turbidezSensorPin, INPUT);
  pinMode(compuertaPin, OUTPUT);
  pinMode(buzzerPin, OUTPUT);
  digitalWrite(compuertaPin, LOW);
  
  sensors.begin();
  attachInterrupt(digitalPinToInterrupt(sensorPin), contarPulsos, RISING);

  // CONEXIÓN A RED WIFI EXISTENTE
  Serial.println();
  Serial.print("Conectando a ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("");
  Serial.println("WiFi conectado");
  Serial.println("Dirección IP: ");
  Serial.println(WiFi.localIP());

  server.on("/", []() { server.send(200, "text/html", paginaHTML()); });
  server.on("/data", handleData);
  server.on("/toggleCompuerta", handleToggleCompuerta);
  server.on("/toggleX", handleToggleX);
  server.on("/toggleZ", handleToggleZ);
  
  server.begin();
}

// ------------- BUCLE PRINCIPAL (LOOP) --------
void loop() {
  server.handleClient();

  unsigned long actual = millis();
  if (actual - tiempoAnterior >= 1000) {
    detachInterrupt(digitalPinToInterrupt(sensorPin));
    float frecuencia = pulsos;
    caudal = frecuencia / factorCaudal;
    
    if (compuertaAbierta) {
        volumenTotal += caudal / 60.0;
        if (pulsos == 0) {
            tiempoSinPulsos++;
        } else {
            tiempoSinPulsos = 0;
            caudalError = false;
        }

        if (tiempoSinPulsos > 10) {
            caudalError = true;
        }
    } else {
        tiempoSinPulsos = 0;
        caudalError = false;
    }

    pulsos = 0;
    tiempoAnterior = actual;
    attachInterrupt(digitalPinToInterrupt(sensorPin), contarPulsos, RISING);
  }

  // Leer estado del botón físico (controla la compuerta)
  if (digitalRead(botonPin) == LOW) {
    delay(50);
    compuertaAbierta = !compuertaAbierta;
    digitalWrite(compuertaPin, compuertaAbierta ? HIGH : LOW);
    digitalWrite(ledPin, compuertaAbierta ? HIGH : LOW);
    while(digitalRead(botonPin) == LOW);
  }

  // Leer distancia y mostrar en Serial
  if (actual - tiempoSerial >= 2000) {
    tiempoSerial = actual;
    float distanciaActual = medirDistancia();
    float tempActual = leerTemperatura();
    float calidadActual = leerCalidadAgua();
    float turbidezActual = leerTurbidez();
    bool tdsEsEstimado = false;
  
    // Calcular altura del agua para el monitor serie
    float alturaAgua = -1.0;
    if (distanciaActual >= 0) {
      alturaAgua = ALTURA_RECIPIENTE_CM - distanciaActual;
      if (alturaAgua < 0) {
        alturaAgua = 0;
      }
    }

    if (calidadActual < 0 && turbidezActual >= 0) {
        calidadActual = turbidezActual * 2.5;
        tdsEsEstimado = true;
    }

    Serial.println("-----------------------------");
    Serial.print("Altura del Agua: "); 
    if(alturaAgua < 0) Serial.print("ERROR"); else Serial.print(alturaAgua);
    Serial.println(" cm");
    
    Serial.print("Caudal: "); 
    if(caudalError) Serial.print("ERROR"); else Serial.print(caudal);
    Serial.println(" L/min");
    
    Serial.print("Volumen Total: "); Serial.print(volumenTotal); Serial.println(" L");

    Serial.print("Temperatura: "); 
    if(tempActual < -200) Serial.print("ERROR"); else Serial.print(tempActual);
    Serial.println(" C");

    Serial.print("Calidad del Agua (TDS): ");
    if(calidadActual < 0) Serial.print("ERROR"); else Serial.print(calidadActual);
    if(tdsEsEstimado) Serial.print(" (Est.)");
    Serial.println(" PPM");

    Serial.print("Turbidez: ");
    if(turbidezActual < 0) Serial.print("ERROR"); else Serial.print(turbidezActual);
    Serial.println(" NTU");

    Serial.print("Compuerta: "); Serial.println(compuertaAbierta ? "ABIERTA" : "CERRADA");
    Serial.print("Eje X: "); Serial.println(ejeX_Activo ? "ACTIVO" : "INACTIVO");
    Serial.print("Eje Z: "); Serial.println(ejeZ_Activo ? "ACTIVO" : "INACTIVO");
    Serial.print("Orientación Panel: "); 
    if (ejeX_Activo || ejeZ_Activo) {
      int anguloX = ejeX_Activo ? map(analogRead(A0), 0, 4095, 0, 180) : 0;
      int anguloZ = ejeZ_Activo ? map(analogRead(A1), 0, 4095, 0, 90) : 0;
      Serial.print(anguloX); Serial.print("° / "); Serial.print(anguloZ); Serial.println("°");
    } else {
      Serial.println("0° / 0°");
    }
  }

    // --- Lógica del Buzzer  (Alarma) ---
  if (compuertaAbierta) {
    // Si la compuerta está abierta, hacemos sonar la alarma
    if (millis() - tiempoAnteriorBuzzer >= DURACION_TONO) {
      tiempoAnteriorBuzzer = millis(); // Actualizamos el tiempo para el próximo cambio

      // Alternamos entre el tono alto y el bajo
      if (estadoBuzzerAlto) {
        tone(buzzerPin, FRECUENCIA_ALTA); 
      } else {
        tone(buzzerPin, FRECUENCIA_BAJA);
      }
      estadoBuzzerAlto = !estadoBuzzerAlto; // Invertimos el estado para el próximo ciclo
    }
  } else {
    // Si la compuerta está cerrada, nos aseguramos de que el buzzer esté apagado
    noTone(buzzerPin);
  }
}