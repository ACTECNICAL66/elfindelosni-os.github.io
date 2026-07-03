#include <WiFi.h>
#include <WebServer.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// ---------- Definición de variables ----------

// --- Control de Ejes del Seguidor Solar ---
int ejeX_Pin = 21;
int ejeZ_Pin = 22; 
bool ejeX_Activo = false;
bool ejeZ_Activo = false; 

// --- Pines de Sensores ---
int botonPin = 16;
int ledPin = 2;

// --- Compuerta y estado (controlada por relé/transistor) ---
int compuertaPin = 17;
bool compuertaAbierta = false;

// --- Variables de Ultrasonido ---
int trigPin = 5;
int echoPin = 18;

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
int oneWireBus = 15;
float temperaturaC = 0.0;
OneWire oneWire(oneWireBus);
DallasTemperature sensors(&oneWire);

// --- Variables de Calidad de Agua (Sensor TDS) ---
int tdsSensorPin = 34;
float calidadAguaPPM = 0.0;

// --- Variables del Sensor de Turbidez ---
int turbidezSensorPin = 35; // Usar un pin ADC1 (32, 33, 34, 35, 36, 39)
float turbidezNTU = 0.0;

#define VREF 3.3 // Voltaje de referencia de tu ESP32. Usualmente 3.3V.

// --- Wi-Fi AP ---
const char* ssid = "MedidorPRO";
const char* password = "123456";

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
    // Esta fórmula es genérica y debe ser calibrada con tu sensor específico.
    // Un ejemplo común es una relación lineal inversa.
    float ntu = -1120.4 * pow(voltaje, 2) + 5742.3 * voltaje - 4352.9;
    return (ntu < 0) ? 0 : ntu; // No devolver valores negativos
}


// ---------- Página web principal (con AJAX) (INTERFAZ MEJORADA) ----------
String paginaHTML() {
  return R"rawliteral(
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Medidor PRO - Panel de Control</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
      body {
        font-family: 'Roboto', sans-serif; text-align: center;
        background-color: #f8f9fa; margin: 0; padding: 20px; color: #343a40;
      }
      .container { max-width: 500px; margin: auto; }
      .card {
        background: #ffffff; padding: 25px; border-radius: 12px;
        margin-bottom: 20px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); text-align: left;
      }
      h1 { margin-bottom: 30px; }
      h2 {
        margin-top: 0; margin-bottom: 20px; border-bottom: 1px solid #dee2e6;
        padding-bottom: 10px; font-weight: 500;
      }
      .control-item, .sensor-item {
        display: flex; justify-content: space-between; align-items: center;
        margin-bottom: 15px; font-size: 1.1em;
      }
      .status { font-weight: 700; display: flex; align-items: center; }
      .status .fas { margin-right: 8px; }
      .status.on { color: #28a745; }
      .status.off { color: #dc3545; }
      .status.error { color: #ffc107; }
      button {
        padding: 10px 20px; font-size: 1em; font-weight: 500; color: white;
        border: none; border-radius: 8px; cursor: pointer;
        transition: background-color 0.3s; width: 150px;
      }
      .btn-activar { background-color: #28a745; }
      .btn-activar:hover { background-color: #218838; }
      .btn-desactivar { background-color: #dc3545; }
      .btn-desactivar:hover { background-color: #c82333; }
      .alert-box {
        position: fixed; top: -100px; left: 50%; transform: translateX(-50%);
        background-color: #28a745; color: white; padding: 15px 25px;
        border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        font-size: 1.1em; font-weight: 500; z-index: 1000;
        transition: top 0.5s ease-in-out;
      }
      .alert-box.show { top: 20px; }
      .error-bar {
        position: fixed; top: 0; left: 0; width: 100%;
        background-color: #e44c55; color: white; text-align: center;
        padding: 10px 0; font-weight: 500; z-index: 1001;
        display: none; // Oculto por defecto 
      }
      .quality-indicator {
        text-align: center;
      }
      #qualityLevel, #turbidityLevel {
        font-size: 1.8em;
        font-weight: 700;
        margin-bottom: 5px;
      }
      #qualityText, #turbidityText {
        font-size: 1.2em;
        font-weight: 500;
      }
    </style>
  </head>
  <body>
    <div id="error-bar" class="error-bar"></div>
    <div id="alert-box" class="alert-box"></div>

    <div class="container">
      <h1>Panel de Control</h1>

      <div class="card">
        <h2>Controles del Sistema</h2>
        <div class="control-item">
          <span>Compuerta</span>
          <div><span id="statusCompuerta" class="status off"><i class="fas fa-times-circle"></i>INACTIVO</span></div>
          <button id="btnCompuerta" class="btn-activar" onclick="toggleCompuerta()">Activar</button>
        </div>
      </div>
      
      <div class="card">
        <h2>Seguidor Solar</h2>
        <div class="control-item">
          <span>Eje X</span>
           <div><span id="statusEjeX" class="status off"><i class="fas fa-times-circle"></i>INACTIVO</span></div>
          <button id="btnEjeX" class="btn-activar" onclick="toggleX()">Activar</button>
        </div>
        <div class="control-item">
          <span>Eje Z</span>
           <div><span id="statusEjeZ" class="status off"><i class="fas fa-times-circle"></i>INACTIVO</span></div>
          <button id="btnEjeZ" class="btn-activar" onclick="toggleZ()">Activar</button>
        </div>
      </div>
      
      <div class="card">
        <h2>Datos de Sensores</h2>
        <div class="sensor-item">
          <span><i class="fas fa-ruler-vertical"></i> Nivel del agua:</span>
          <span id="distancia">---</span>
        </div>
        <div class="sensor-item">
          <span><i class="fas fa-water"></i> Caudal:</span>
          <span id="caudal">---</span>
        </div>
        <div class="sensor-item">
          <span><i class="fas fa-thermometer-half"></i> Temperatura:</span>
          <span id="temp">---</span>
        </div>
        <div class="sensor-item">
          <span><i class="fas fa-vial"></i> Calidad del Agua (TDS):</span>
          <span id="calidadAgua">---</span>
        </div>
        <div class="sensor-item">
          <span><i class="fas fa-smog"></i> Turbidez:</span>
          <span id="turbidez">---</span>
        </div>
      </div>

      <div class="card">
        <h2>Nivel de Calidad del Agua (TDS)</h2>
        <div class="quality-indicator">
          <div id="qualityLevel">---</div>
          <div id="qualityText">Esperando datos...</div>
        </div>
      </div>

      <div class="card">
        <h2>Nivel de Turbidez del Agua</h2>
        <div class="quality-indicator">
          <div id="turbidityLevel">---</div>
          <div id="turbidityText">Esperando datos...</div>
        </div>
      </div>

      <div class="card">
        <h2>Registro de Caudal</h2>
        <div class="sensor-item">
          <span><i class="fas fa-history"></i> Volumen Total Evacuado:</span>
          <span id="volumen">---</span>
        </div>
      </div>
    </div>

    <script>
      function actualizar() {
        fetch('/data').then(res => res.json()).then(data => {
          const errorBar = document.getElementById('error-bar');
          let errorMessages = [];
          
          // Actualizar datos de sensores con manejo de errores
          const distanciaSpan = document.getElementById("distancia");
          if (data.distancia < 0) {
            distanciaSpan.innerHTML = '<span class="status error">ERROR</span>';
            errorMessages.push('¡Fallo en sensor de distancia!');
          } else {
            distanciaSpan.innerHTML = data.distancia + " cm";
          }

          const tempSpan = document.getElementById("temp");
          if (data.temp < -200) {
            tempSpan.innerHTML = '<span class="status error">ERROR</span>';
            errorMessages.push('¡Fallo en sensor de temperatura!');
          } else {
            tempSpan.innerHTML = data.temp + " &deg;C";
          }

          const caudalSpan = document.getElementById("caudal");
          if (data.caudalError) {
              caudalSpan.innerHTML = '<span class="status error">ERROR</span>';
              errorMessages.push('¡Fallo en caudalímetro!');
          } else {
              caudalSpan.innerHTML = data.caudal + " L/min";
          }
          
          const calidadSpan = document.getElementById("calidadAgua");
          if (data.calidadAgua < 0) {
            calidadSpan.innerHTML = '<span class="status error">ERROR</span>';
            errorMessages.push('¡Fallo en sensor de calidad!');
          } else {
            calidadSpan.innerHTML = data.calidadAgua.toFixed(0) + " PPM";
          }

          const turbidezSpan = document.getElementById("turbidez");
          if (data.turbidez < 0) {
            turbidezSpan.innerHTML = '<span class="status error">ERROR</span>';
            errorMessages.push('¡Fallo en sensor de turbidez!');
          } else {
            turbidezSpan.innerHTML = data.turbidez.toFixed(1) + " NTU";
          }

          // ESCALA TDS 
          const qualityLevel = document.getElementById('qualityLevel');
          const qualityText = document.getElementById('qualityText');
          const ppm = data.calidadAgua;
          let levelText = '---';
          let levelColor = '#343a40'; 
          if (ppm < 0) {
            levelText = 'ERROR';
            levelColor = '#ffc107';
          } else if (ppm <= 25) {
            levelText = 'Agua Pura (Destilada)';
            levelColor = '#2980b9';
          } else if (ppm <= 50) {
            levelText = 'Ideal para Beber';
            levelColor = '#34C7D9';
          } else if (ppm <= 100) {
            levelText = 'Agua de Manantial';
            levelColor = '#5B9BD5';
          } else if (ppm <= 170) {
            levelText = 'Agua de Glaciar';
            levelColor = '#27ae60';
          } else if (ppm <= 250) {
            levelText = 'Agua Dura';
            levelColor = '#7030A0';
          } else if (ppm <= 320) {
            levelText = 'Agua Ligeramente Dura';
            levelColor = '#92D050';
          } else if (ppm <= 400) {
            levelText = 'Agua de Grifo Común';
            levelColor = '#F79646';
          } else if (ppm <= 500) {
            levelText = 'Agua Mineral';
            levelColor = '#C0504D';
          } else if (ppm <= 1000) {
            levelText = 'No Recomendada para Beber';
            levelColor = '#d93434';
          } else {
            levelText = 'Agua Salobre';
            levelColor = '#7f8c8d';
          }
          qualityLevel.textContent = levelText;
          qualityLevel.style.color = levelColor;
          qualityText.textContent = `(Lectura TDS: ${ppm.toFixed(0)} PPM)`;
          if (ppm < 0) { qualityText.textContent = 'Revisar conexión del sensor'; }

          // --- ESCALA DE TURBIDEZ ---
          const turbidityLevel = document.getElementById('turbidityLevel');
          const turbidityText = document.getElementById('turbidityText');
          const ntu = data.turbidez;
          let ntuLevelText = '---';
          let ntuLevelColor = '#343a40';
          if (ntu < 0) {
            ntuLevelText = 'ERROR';
            ntuLevelColor = '#ffc107';
          } else if (ntu <= 10) {
            ntuLevelText = 'Cristalina';
            ntuLevelColor = '#87CEEB'; // SkyBlue
          } else if (ntu <= 20) {
            ntuLevelText = 'Casi Clara';
            ntuLevelColor = '#ADD8E6'; // LightBlue
          } else if (ntu <= 50) {
            ntuLevelText = 'Ligeramente Opaca';
            ntuLevelColor = '#B0E0E6'; // PowderBlue
          } else if (ntu <= 100) {
            ntuLevelText = 'Opaca';
            ntuLevelColor = '#AFEEEE'; // PaleTurquoise
          } else if (ntu <= 200) {
            ntuLevelText = 'Turbia';
            ntuLevelColor = '#E0FFFF'; // LightCyan
          } else if (ntu <= 500) {
            ntuLevelText = 'Muy Turbia';
            ntuLevelColor = '#F0FFFF'; // Azure
          } else if (ntu <= 1000) {
            ntuLevelText = 'Lechosa';
            ntuLevelColor = '#F5F5F5'; // WhiteSmoke
          } else if (ntu <= 2000) {
            ntuLevelText = 'Nivel de Sedimento';
            ntuLevelColor = '#DCDCDC'; // Gainsboro
          } else if (ntu <= 3000) {
            ntuLevelText = 'Nivel de Lodo';
            ntuLevelColor = '#D3D3D3'; // LightGray
          } else {
            ntuLevelText = 'Extremadamente Densa';
            ntuLevelColor = '#C0C0C0'; // Silver
          }
          turbidityLevel.textContent = ntuLevelText;
          turbidityLevel.style.color = ntuLevelColor;
          turbidityText.textContent = `(Lectura: ${ntu.toFixed(1)} NTU)`;
          if (ntu < <strong>0</strong>) { turbidityText.textContent = 'Revisar conexión del sensor'; }


          if (errorMessages.length > 0) {
            errorBar.innerHTML = errorMessages.join(' ');
            errorBar.style.display = 'block';
          } else {
            errorBar.style.display = 'none';
          }

          document.getElementById("volumen").innerHTML = data.volumenTotal.toFixed(2) + " L";

          // Actualizar controles
          const statusCompuerta = document.getElementById("statusCompuerta");
          const btnCompuerta = document.getElementById("btnCompuerta");
          if (data.compuertaAbierta) {
            statusCompuerta.innerHTML = '<i class="fas fa-check-circle"></i>ABIERTA';
            statusCompuerta.className = 'status on';
            btnCompuerta.innerHTML = 'Cerrar';
            btnCompuerta.className = 'btn-desactivar';
          } else {
            statusCompuerta.innerHTML = '<i class="fas fa-times-circle"></i>CERRADA';
            statusCompuerta.className = 'status off';
            btnCompuerta.innerHTML = 'Abrir';
            btnCompuerta.className = 'btn-activar';
          }
          const statusEjeX = document.getElementById("statusEjeX");
          const btnEjeX = document.getElementById("btnEjeX");
          if (data.ejeX) {
            statusEjeX.innerHTML = '<i class="fas fa-check-circle"></i>ACTIVO';
            statusEjeX.className = 'status on';
            btnEjeX.innerHTML = 'Desactivar';
            btnEjeX.className = 'btn-desactivar';
          } else {
            statusEjeX.innerHTML = '<i class="fas fa-times-circle"></i>INACTIVO';
            statusEjeX.className = 'status off';
            btnEjeX.innerHTML = 'Activar';
            btnEjeX.className = 'btn-activar';
          }
          const statusEjeZ = document.getElementById("statusEjeZ");
          const btnEjeZ = document.getElementById("btnEjeZ");
          if (data.ejeZ) {
            statusEjeZ.innerHTML = '<i class="fas fa-check-circle"></i>ACTIVO';
            statusEjeZ.className = 'status on';
            btnEjeZ.innerHTML = 'Desactivar';
            btnEjeZ.className = 'btn-desactivar';
          } else {
            statusEjeZ.innerHTML = '<i class="fas fa-times-circle"></i>INACTIVO';
            statusEjeZ.className = 'status off';
            btnEjeZ.innerHTML = 'Activar';
            btnEjeZ.className = 'btn-activar';
          }
        });
      }
      
      function showAlert(message) {
        const alertBox = document.getElementById('alert-box');
        alertBox.innerHTML = message;
        alertBox.classList.add('show');
        setTimeout(() => { alertBox.classList.remove('show'); }, 3000);
      }
      
      function toggleCompuerta() {
        const statusCompuerta = document.getElementById("statusCompuerta");
        if (statusCompuerta.classList.contains('off')) {
          showAlert("COMPUERTA ABIERTA");
        }
        fetch('/toggleCompuerta').then(actualizar); 
      }

      function toggleX() { fetch('/toggleX').then(actualizar); }
      function toggleZ() { fetch('/toggleZ').then(actualizar); }
      
      setInterval(actualizar, 2000);
      window.onload = actualizar;
    </script>
  </body>
  </html>
  )rawliteral";
}

// --- Rutas del Servidor ---

void handleData() {
  temperaturaC = leerTemperatura();
  calidadAguaPPM = leerCalidadAgua();
  turbidezNTU = leerTurbidez();

  String json = "{";
  json += "\"distancia\":" + String(medirDistancia(), 1) + ",";
  json += "\"caudal\":" + String(caudal, 1) + ",";
  json += "\"temp\":" + String(temperaturaC, 1) + ",";
  json += "\"compuertaAbierta\":" + String(compuertaAbierta ? 1 : 0) + ",";
  json += "\"ejeX\":" + String(ejeX_Activo ? 1 : 0) + ",";
  json += "\"ejeZ\":" + String(ejeZ_Activo ? 1 : 0) + ",";
  json += "\"volumenTotal\":" + String(volumenTotal, 2) + ",";
  json += "\"caudalError\":" + String(caudalError ? 1 : 0) + ",";
  json += "\"calidadAgua\":" + String(calidadAguaPPM, 1) + ",";
  json += "\"turbidez\":" + String(turbidezNTU, 1);
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
  digitalWrite(ejeX_Pin, LOW);
  digitalWrite(ejeZ_Pin, LOW);

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(sensorPin, INPUT_PULLUP);
  pinMode(botonPin, INPUT_PULLUP);
  pinMode(ledPin, OUTPUT);
  pinMode(tdsSensorPin, INPUT);
  pinMode(turbidezSensorPin, INPUT);
  pinMode(compuertaPin, OUTPUT);
  digitalWrite(compuertaPin, LOW);
  
  sensors.begin();
  attachInterrupt(digitalPinToInterrupt(sensorPin), contarPulsos, RISING);

  WiFi.softAP(ssid, password);
  Serial.println("WiFi AP Iniciado");
  Serial.println(WiFi.softAPIP());

  server.on("/", []() { server.send(200, "text/html", paginaHTML()); });
  server.on("/data", handleData);
  server.on("/toggleCompuerta", handleToggleCompuerta);
  server.on("/toggleX", handleToggleX);
  server.on("/toggleZ", handleToggleZ);
  
  server.begin();
}

// ------------- BUCLE PRINCIPAL --------
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

    Serial.println("-----------------------------");
    Serial.print("Distancia: "); 
    if(distanciaActual < 0) Serial.print("ERROR"); else Serial.print(distanciaActual);
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
    Serial.println(" PPM");

    Serial.print("Turbidez: ");
    if(turbidezActual < 0) Serial.print("ERROR"); else Serial.print(turbidezActual);
    Serial.println(" NTU");

    Serial.print("Compuerta: "); Serial.println(compuertaAbierta ? "ABIERTA" : "CERRADA");
    Serial.print("Eje X: "); Serial.println(ejeX_Activo ? "ACTIVO" : "INACTIVO");
    Serial.print("Eje Z: "); Serial.println(ejeZ_Activo ? "ACTIVO" : "INACTIVO");
  }
}
