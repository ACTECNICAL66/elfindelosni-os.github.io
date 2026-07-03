#include <WiFi.h>
#include <WebServer.h>
#include <ESP32Servo.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// ---------- Definición de variables ----------

// --- Control de Ejes del Seguidor Solar ---
int ejeX_Pin = 21; // GPIO para el transistor del Eje X. 
int ejeY_Pin = 22; // GPIO para el transistor del Eje Y. 
bool ejeX_Activo = false; // El Eje X empieza apagado
bool ejeY_Activo = false; // El Eje Y empieza apagado

// --- Pines de Sensores (Original) ---
int botonPin = 16;
int ledPin = 2;

// --- Servo y estado (NOMBRES ACTUALIZADOS) ---
int servoPin = 17;
Servo miServo; // TIPO DE SERVO ACTUALIZADO
bool compuertaAbierta = false; // VARIABLE RENOMBRADA

// --- Variables de Ultrasonido (Original) ---
int trigPin = 5;
int echoPin = 18;
long duration;
float distance;

// --- Variables de Caudal (Original) ---
int sensorPin = 4;
volatile int pulsos = 0;
float caudal = 0.0;
float factorCaudal = 7.5;
unsigned long tiempoAnterior = 0;
unsigned long tiempoSerial = 0; // Variable para temporizar la impresión en Serial

// --- Variables de Temperatura (Original) ---
int oneWireBus = 15;
float temperaturaC = 0.0;
OneWire oneWire(oneWireBus);
DallasTemperature sensors(&oneWire);

// --- Wi-Fi AP (Original) ---
const char* ssid = "MedidorPRO";
const char* password = "123456";

// --- Servidor Web (Original) ---
WebServer server(80);


// ---------- Funciones ----------

// Interrupción de caudal (Original)
void IRAM_ATTR contarPulsos() {
  pulsos++;
}

// Medir distancia (ultrasonido) (Original)
float medirDistancia() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  long duracion = pulseIn(echoPin, HIGH, 30000);
  float distancia_cm = duracion * 0.0343 / 2;
  return distancia_cm;
}

// Leer temperatura (Original)
float leerTemperatura() {
  sensors.requestTemperatures();
  return sensors.getTempCByIndex(0);
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
        font-family: 'Roboto', sans-serif;
        text-align: center;
        background-color: #f8f9fa;
        margin: 0;
        padding: 20px;
        color: #343a40;
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
      button {
        padding: 10px 20px; font-size: 1em; font-weight: 500; color: white;
        border: none; border-radius: 8px; cursor: pointer;
        transition: background-color 0.3s; width: 150px;
      }
      .btn-activar { background-color: #28a745; }
      .btn-activar:hover { background-color: #218838; }
      .btn-desactivar { background-color: #dc3545; }
      .btn-desactivar:hover { background-color: #c82333; }
      /* --- NUEVO: Estilo para la alerta personalizada --- */
      .alert-box {
        position: fixed; top: -100px; left: 50%; transform: translateX(-50%);
        background-color: #28a745; color: white; padding: 15px 25px;
        border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        font-size: 1.1em; font-weight: 500; z-index: 1000;
        transition: top 0.5s ease-in-out;
      }
      .alert-box.show { top: 20px; }
    </style>
  </head>
  <body>
    <!-- --- NUEVO: Contenedor para la alerta --- -->
    <div id="alert-box" class="alert-box"></div>

    <div class="container">
      <h1>Panel de Control</h1>

      <div class="card">
        <h2>Controles del Sistema</h2>
        <div class="control-item">
          <span>Compuerta</span>
          <div>
            <span id="statusCompuerta" class="status off"><i class="fas fa-times-circle"></i>INACTIVO</span>
          </div>
          <button id="btnCompuerta" class="btn-activar" onclick="toggleCompuerta()">Activar</button>
        </div>
      </div>
      
      <!-- --- NUEVO: Apartado para el Seguidor Solar --- -->
      <div class="card">
        <h2>Seguidor Solar</h2>
        <div class="control-item">
          <span>Eje X</span>
           <div>
            <span id="statusEjeX" class="status off"><i class="fas fa-times-circle"></i>INACTIVO</span>
          </div>
          <button id="btnEjeX" class="btn-activar" onclick="toggleX()">Activar</button>
        </div>
        <div class="control-item">
          <span>Eje Y</span>
           <div>
            <span id="statusEjeY" class="status off"><i class="fas fa-times-circle"></i>INACTIVO</span>
          </div>
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
    </div>

    <script>
      function actualizar() {
        fetch('/data').then(res => res.json()).then(data => {
          document.getElementById("distancia").innerHTML = data.distancia + " m";
          document.getElementById("caudal").innerHTML = data.caudal + " L/min";
          document.getElementById("temp").innerHTML = data.temp + " &deg;C";

          // Actualizar control de la Compuerta
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

          // Actualizar control del Eje X
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

          // Actualizar control del Eje Y
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
      
      // --- NUEVO: Función para mostrar la alerta personalizada ---
      function showAlert(message) {
        const alertBox = document.getElementById('alert-box');
        alertBox.innerHTML = message;
        alertBox.classList.add('show');
        setTimeout(() => {
          alertBox.classList.remove('show');
        }, 3000); // La alerta desaparecerá después de 3 segundos
      }
      
      function toggleCompuerta() {
        const statusCompuerta = document.getElementById("statusCompuerta");
        // Si la clase contiene 'off', significa que está inactivo y se va a activar
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

// Ruta para enviar los datos actualizados (JSON) (MODIFICADA)
void handleData() {
  temperaturaC = leerTemperatura();
  String json = "{";
  json += "\"distancia\":" + String(medirDistancia(), 1) + ",";
  json += "\"caudal\":" + String(caudal, 1) + ",";
  json += "\"temp\":" + String(temperaturaC, 1) + ",";
  json += "\"compuertaAbierta\":" + String(compuertaAbierta ? 1 : 0) + ","; // RENOMBRADO
  json += "\"ejeX\":" + String(ejeX_Activo ? 1 : 0) + ",";
  json += "\"ejeY\":" + String(ejeY_Activo ? 1 : 0);
  json += "}";
  server.send(200, "application/json", json);
}

// Ruta para manejar el botón web de la compuerta (MODIFICADA)
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

// --- Rutas de Ejes ---
// Ruta para manejar el botón del Eje X
void handleToggleX() {
  ejeX_Activo = !ejeX_Activo;
  digitalWrite(ejeX_Pin, ejeX_Activo ? HIGH : LOW);
  server.send(200, "text/plain", "OK");
}

// Ruta para manejar el botón del Eje Y
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
  digitalWrite(ejeX_Pin, LOW); // Empezar con ejes apagados
  digitalWrite(ejeY_Pin, LOW);

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(sensorPin, INPUT_PULLUP);
  pinMode(botonPin, INPUT_PULLUP);
  pinMode(ledPin, OUTPUT);
  
  miServo.attach(servoPin); // USA EL SERVO DE ESP32SERVO
  miServo.write(0);

  attachInterrupt(digitalPinToInterrupt(sensorPin), contarPulsos, RISING);

  WiFi.softAP(ssid, password);
  Serial.println("WiFi AP Iniciado");
  Serial.println(WiFi.softAPIP());

  server.on("/", []() { server.send(200, "text/html", paginaHTML()); });
  server.on("/data", handleData);
  server.on("/toggleCompuerta", handleToggleCompuerta); // RUTA ACTUALIZADA
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
    pulsos = 0;
    tiempoAnterior = actual;
    attachInterrupt(digitalPinToInterrupt(sensorPin), contarPulsos, RISING);
  }

  // Leer estado del botón físico (controla la compuerta)
  if (digitalRead(botonPin) == LOW) {
    delay(50); // Anti-rebote simple
    compuertaAbierta = !compuertaAbierta;
    if (compuertaAbierta) {
      miServo.write(90);
      digitalWrite(ledPin, HIGH);
    } else {
      miServo.write(0);
      digitalWrite(ledPin, LOW);
    }
    while(digitalRead(botonPin) == LOW); // Esperar a que se suelte
  }

  // Leer distancia y mostrar en Serial
  if (actual - tiempoSerial >= 2000) {
    tiempoSerial = actual;
    float distanciaActual = medirDistancia();
    temperaturaC = leerTemperatura();

    Serial.println("-----------------------------");
    Serial.print("Distancia: "); Serial.print(distanciaActual); Serial.println("m");
    Serial.print("Caudal: "); Serial.print(caudal); Serial.println(" L/min");
    Serial.print("Temperatura: "); Serial.print(temperaturaC); Serial.println(" °C");
    Serial.print("Compuerta: "); Serial.println(compuertaAbierta ? "ACTIVO" : "INACTIVO");
    Serial.print("Eje X: "); Serial.println(ejeX_Activo ? "ACTIVO" : "INACTIVO");
    Serial.print("Eje Y: "); Serial.println(ejeY_Activo ? "ACTIVO" : "INACTIVO");
  }
}