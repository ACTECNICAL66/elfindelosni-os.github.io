#include <ESP32Servo.h>  
#include <WiFi.h>
#include <WebServer.h>
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
bool servoActivo = false;

// --- Ultrasonido ---
int trigPin = 5;
int echoPin = 18;
long duration;
float distance;

// --- Caudalímetro ---
int sensorPin = 4;
volatile int pulsos = 0;
float caudal = 0.0;
float factorCaudal = 7.5;
unsigned long tiempoAnterior = 0;
unsigned long tiempoSerial = 0;

// --- Temperatura ---
int oneWireBus = 15;
float temperaturaC = 0.0;
OneWire oneWire(oneWireBus);
DallasTemperature sensors(&oneWire);

// --- Wi-Fi AP ---
const char* ssid = "MedidorPRO";
const char* password = "123456";

// --- Servidor Web ---
WebServer server(80);

// ---------- FUNCIONES ----------

void IRAM_ATTR contarPulsos() {
  pulsos++;
}

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

float leerTemperatura() {
  sensors.requestTemperatures();
  return sensors.getTempCByIndex(0);
}

// ---------- Página web principal ----------
String paginaHTML() {
  return R"rawliteral(
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Medidor PRO</title>
    <style>
      body { font-family: Arial; text-align: center; background-color: #eef; padding-top: 30px; }
      .card { background: white; padding: 20px; border-radius: 10px; margin: 10px auto; width: 300px; box-shadow: 0 0 10px rgba(0,0,0,0.3); }
      button { padding: 15px 30px; font-size: 18px; margin-top: 10px; width: 100%; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Medidor PRO</h1>
      <p>Altura del agua: <span id="distancia">---</span> cm</p>
      <p>Caudal: <span id="caudal">---</span> L/min</p>
      <p>Temperatura: <span id="temp">---</span> °C</p>
      <p>Estado Servo: <span id="estado">---</span></p>
      <p>Estado Eje X: <span id="estadoEjeX">---</span></p>
      <p>Estado Eje Y: <span id="estadoEjeY">---</span></p>
      <button onclick="toggleServo()">Toggle Servo</button>
      <button onclick="toggleX()">Toggle Eje X</button>
      <button onclick="toggleY()">Toggle Eje Y</button>
    </div>

    <script>
      function actualizar() {
        fetch('/data').then(res => res.json()).then(data => {
          document.getElementById("distancia").innerHTML = data.distancia;
          document.getElementById("caudal").innerHTML = data.caudal;
          document.getElementById("temp").innerHTML = data.temp;
          document.getElementById("estado").innerHTML = data.servo ? "ACTIVO" : "INACTIVO";
          document.getElementById("estadoEjeX").innerHTML = data.ejeX ? "ACTIVO" : "INACTIVO";
          document.getElementById("estadoEjeY").innerHTML = data.ejeY ? "ACTIVO" : "INACTIVO";
        });
      }
      setInterval(actualizar, 1000);

      function toggleServo() { fetch('/toggle'); }
      function toggleX() { fetch('/toggleX'); }
      function toggleY() { fetch('/toggleY'); }

      window.onload = actualizar;
    </script>
  </body>
  </html>
  )rawliteral";
}

// ---------- Rutas del servidor ----------

void handleData() {
  temperaturaC = leerTemperatura();
  String json = "{";
  json += "\"distancia\":" + String(medirDistancia(), 1) + ",";
  json += "\"caudal\":" + String(caudal, 1) + ",";
  json += "\"temp\":" + String(temperaturaC, 1) + ",";
  json += "\"servo\":" + String(servoActivo ? 1 : 0) + ",";
  json += "\"ejeX\":" + String(ejeX_Activo ? 1 : 0) + ",";
  json += "\"ejeY\":" + String(ejeY_Activo ? 1 : 0);
  json += "}";
  server.send(200, "application/json", json);
}

void handleToggle() {
  servoActivo = !servoActivo;
  if (servoActivo) {
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

// ---------- SETUP ----------
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

  miServo.setPeriodHertz(50);  // ✅ RECOMENDADO: frec. típica servo
  miServo.attach(servoPin);
  miServo.write(0);

  attachInterrupt(digitalPinToInterrupt(sensorPin), contarPulsos, RISING);

  WiFi.softAP(ssid, password);
  Serial.println("WiFi AP Iniciado");
  Serial.println(WiFi.softAPIP());

  server.on("/", []() { server.send(200, "text/html", paginaHTML()); });
  server.on("/data", handleData);
  server.on("/toggle", handleToggle);
  server.on("/toggleX", handleToggleX);
  server.on("/toggleY", handleToggleY);
  
  server.begin();
}

// ---------- LOOP ----------
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

  if (digitalRead(botonPin) == LOW) {
    delay(50);
    servoActivo = !servoActivo;
    if (servoActivo) {
      miServo.write(90);
      digitalWrite(ledPin, HIGH);
    } else {
      miServo.write(0);
      digitalWrite(ledPin, LOW);
    }
    while (digitalRead(botonPin) == LOW);
  }

  if (actual - tiempoSerial >= 2000) {
    tiempoSerial = actual;
    float distanciaActual = medirDistancia();
    temperaturaC = leerTemperatura();

    Serial.println("-----------------------------");
    Serial.print("Distancia: "); Serial.print(distanciaActual); Serial.println(" cm");
    Serial.print("Caudal: "); Serial.print(caudal); Serial.println(" L/min");
    Serial.print("Temperatura: "); Serial.print(temperaturaC); Serial.println(" °C");
    Serial.print("Servo: "); Serial.println(servoActivo ? "ACTIVO" : "INACTIVO");
    Serial.print("Eje X: "); Serial.println(ejeX_Activo ? "ACTIVO" : "INACTIVO");
    Serial.print("Eje Y: "); Serial.println(ejeY_Activo ? "ACTIVO" : "INACTIVO");
  }
}

