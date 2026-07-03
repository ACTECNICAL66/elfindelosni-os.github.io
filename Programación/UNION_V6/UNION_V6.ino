#include <WiFi.h>
#include <WebServer.h>
#include <ESP32Servo.h> 
#include <OneWire.h>
#include <DallasTemperature.h>

// ---------- Definición de variables ----------

// --- Control de Ejes del Seguidor Solar ---
int ejeX_Pin = 21;
int ejeY_Pin = 22;
bool ejeX_Activo = false;
bool ejeY_Activo = false;

// --- Pines de Sensores ---
int botonPin = 16;
int ledPin = 2;

// --- Servo y estado ---
int servoPin = 17;
Servo miServo;
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
bool caudalError = false; // --- NUEVO: Bandera de error para el caudalímetro ---
unsigned long tiempoSinPulsos = 0; // --- NUEVO: Contador para detectar fallo de caudalímetro ---


// --- Variables de Temperatura ---
int oneWireBus = 15;
float temperaturaC = 0.0;
OneWire oneWire(oneWireBus);
DallasTemperature sensors(&oneWire);

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
        display: none; /* Oculto por defecto */
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
          <span>Eje Y</span>
           <div><span id="statusEjeY" class="status off"><i class="fas fa-times-circle"></i>INACTIVO</span></div>
          <button id="btnEjeY" class="btn-activar" onclick="toggleY()">Activar</button>
        </div>
      </div>
      
      <div class="card">
        <h2>Datos de Sensores</h2>
        <div class="sensor-item">
          <span><i class="fas fa-ruler-vertical"></i> Altura del agua:</span>
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
            errorMessages.push('¡Fallo en el sensor de distancia!');
          } else {
            distanciaSpan.innerHTML = data.distancia + " cm";
          }

          const tempSpan = document.getElementById("temp");
          if (data.temp < -200) {
            tempSpan.innerHTML = '<span class="status error">ERROR</span>';
            errorMessages.push('¡Fallo en el sensor de temperatura!');
          } else {
            tempSpan.innerHTML = data.temp + " &deg;C";
          }

          // --- NUEVO: Check de error del caudalímetro ---
          const caudalSpan = document.getElementById("caudal");
          if (data.caudalError) {
              caudalSpan.innerHTML = '<span class="status error">ERROR</span>';
              errorMessages.push('¡Fallo en el caudalímetro!');
          } else {
              caudalSpan.innerHTML = data.caudal + " L/min";
          }
          
          if (errorMessages.length > 0) {
            errorBar.innerHTML = errorMessages.join(' ');
            errorBar.style.display = 'block';
          } else {
            errorBar.style.display = 'none';
          }

          document.getElementById("volumen").innerHTML = data.volumenTotal.toFixed(2) + " L";

          // Actualizar controles (Compuerta, Eje X, Eje Y)
          const statusCompuerta = document.getElementById("statusCompuerta");
          const btnCompuerta = document.getElementById("btnCompuerta");
          if (data.compuertaAbierta) {
            statusCompuerta.innerHTML = '<i class="fas fa-check-circle"></i>ACTIVO';
            statusCompuerta.className = 'status on';
            btnCompuerta.innerHTML = 'Desactivar';
            btnCompuerta.className = 'btn-desactivar';
          } else {
            statusCompuerta.innerHTML = '<i class="fas fa-times-circle"></i>INACTIVO';
            statusCompuerta.className = 'status off';
            btnCompuerta.innerHTML = 'Activar';
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
          const statusEjeY = document.getElementById("statusEjeY");
          const btnEjeY = document.getElementById("btnEjeY");
          if (data.ejeY) {
            statusEjeY.innerHTML = '<i class="fas fa-check-circle"></i>ACTIVO';
            statusEjeY.className = 'status on';
            btnEjeY.innerHTML = 'Desactivar';
            btnEjeY.className = 'btn-desactivar';
          } else {
            statusEjeY.innerHTML = '<i class="fas fa-times-circle"></i>INACTIVO';
            statusEjeY.className = 'status off';
            btnEjeY.innerHTML = 'Activar';
            btnEjeY.className = 'btn-activar';
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
      function toggleY() { fetch('/toggleY').then(actualizar); }
      
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
  String json = "{";
  json += "\"distancia\":" + String(medirDistancia(), 1) + ",";
  json += "\"caudal\":" + String(caudal, 1) + ",";
  json += "\"temp\":" + String(temperaturaC, 1) + ",";
  json += "\"compuertaAbierta\":" + String(compuertaAbierta ? 1 : 0) + ",";
  json += "\"ejeX\":" + String(ejeX_Activo ? 1 : 0) + ",";
  json += "\"ejeY\":" + String(ejeY_Activo ? 1 : 0) + ",";
  json += "\"volumenTotal\":" + String(volumenTotal, 2) + ","; // MODIFICADO: Añadir coma
  json += "\"caudalError\":" + String(caudalError ? 1 : 0); // --- NUEVO ---
  json += "}";
  server.send(200, "application/json", json);
}

void handleToggleCompuerta() {
  compuertaAbierta = !compuertaAbierta;
  if (compuertaAbierta) {
    miServo.write(90);
    digitalWrite(ledPin, HIGH);
  } else {
    miServo.write(0);
    digitalWrite(ledPin, LOW);
  }
  server.send(200, "text/plain", "OK");
}

void handleToggleX() {
  ejeX_Activo = !ejeX_Activo;
  digitalWrite(ejeX_Pin, ejeX_Activo ? HIGH : LOW);
  server.send(200, "text/plain", "OK");
}

void handleToggleY() {
  ejeY_Activo = !ejeY_Activo;
  digitalWrite(ejeY_Pin, ejeY_Activo ? HIGH : LOW);
  server.send(200, "text/plain", "OK");
}


// -------------INICIO DEL TODO--------
void setup() {
  Serial.begin(115200);

  pinMode(ejeX_Pin, OUTPUT);
  pinMode(ejeY_Pin, OUTPUT);
  digitalWrite(ejeX_Pin, LOW);
  digitalWrite(ejeY_Pin, LOW);

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(sensorPin, INPUT_PULLUP);
  pinMode(botonPin, INPUT_PULLUP);
  pinMode(ledPin, OUTPUT);
  
  miServo.attach(servoPin);
  miServo.write(0);

  sensors.begin();
  attachInterrupt(digitalPinToInterrupt(sensorPin), contarPulsos, RISING);

  WiFi.softAP(ssid, password);
  Serial.println("WiFi AP Iniciado");
  Serial.println(WiFi.softAPIP());

  server.on("/", []() { server.send(200, "text/html", paginaHTML()); });
  server.on("/data", handleData);
  server.on("/toggleCompuerta", handleToggleCompuerta);
  server.on("/toggleX", handleToggleX);
  server.on("/toggleY", handleToggleY);
  
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
    
    // --- NUEVO: Lógica de detección de error del caudalímetro ---
    if (compuertaAbierta) {
        volumenTotal += caudal / 60.0;
        if (pulsos == 0) {
            tiempoSinPulsos++; // Incrementa el contador cada segundo sin pulsos
        } else {
            tiempoSinPulsos = 0; // Resetea si se detecta un pulso
        }

        if (tiempoSinPulsos > 10) { // Si no hay pulsos por más de 10 seg con la compuerta abierta
            caudalError = true;
        }
    } else {
        tiempoSinPulsos = 0; // Si la compuerta está cerrada, no hay error
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
    if (compuertaAbierta) {
      miServo.write(90);
      digitalWrite(ledPin, HIGH);
    } else {
      miServo.write(0);
      digitalWrite(ledPin, LOW);
    }
    while(digitalRead(botonPin) == LOW);
  }

  // Leer distancia y mostrar en Serial
  if (actual - tiempoSerial >= 2000) {
    tiempoSerial = actual;
    float distanciaActual = medirDistancia();
    float tempActual = leerTemperatura();

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

    Serial.print("Compuerta: "); Serial.println(compuertaAbierta ? "ACTIVO" : "INACTIVO");
    Serial.print("Eje X: "); Serial.println(ejeX_Activo ? "ACTIVO" : "INACTIVO");
    Serial.print("Eje Y: "); Serial.println(ejeY_Activo ? "ACTIVO" : "INACTIVO");
  }
}
