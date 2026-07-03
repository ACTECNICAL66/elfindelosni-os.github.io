#include <WiFi.h>
#include <WebServer.h>
#include <Servo32.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// ---------- Definición de variables ----------
// Pines sensores
 int botonPin = 16;
 int ledPin = 2;

// Servo y estado
int servoPin = 17;
Servo32 miServo;
bool servoActivo = false;

// Variables de ultrasonico
int trigPin = 5;
int echoPin = 18;
long duration;
float distance;

// Variables de caudal
int sensorPin = 4;  
volatile int pulsos = 0;
float caudal = 0.0;
float factorCaudal = 7.5;
unsigned long tiempoAnterior = 0;

// Variables de temperatura 
int oneWireBus = 15; 
float temperaturaC = 0.0;

// DS18B20
OneWire oneWire(oneWireBus);
DallasTemperature sensors(&oneWire);


// Wi-Fi AP
const char* ssid = "MedidorPRO";
const char* password = "123456";


WebServer server(80);

// Interrupción de caudal
void IRAM_ATTR contarPulsos() {
  pulsos++;
}
 

// Medir distancia (ultrasonico)
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

// Leer temperatura
float leerTemperatura() {
  sensors.requestTemperatures();
  return sensors.getTempCByIndex(0);
}


// ---------- Página web principal (con AJAX)(Nueva implementación)----------
String paginaHTML() {
  return R"rawliteral(
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Medidor PRO</title>
    <style>
      body { font-family: Arial; text-align: center; background-color: #eef; padding-top: 30px; }
      .card { background: white; padding: 20px; border-radius: 10px; margin: auto; width: 300px; box-shadow: 0 0 10px rgba(0,0,0,0.3); }
      button { padding: 15px 30px; font-size: 18px; margin-top: 20px; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Medidor PRO</h1>
      <p>Altura del agua: <span id="distancia">---</span> cm</p>
      <p>Caudal: <span id="caudal">---</span> L/min</p>
      <p>Temperatura: <span id="temp">---</span> °C</p>
      <p>Estado Servo: <span id="estado">---</span></p>
      <button onclick="toggleServo()">Toggle Servo</button>
    </div>

    <script>
      setInterval(function() {
        fetch('/data').then(res => res.json()).then(data => {
          document.getElementById("distancia").innerHTML = data.distancia;
          document.getElementById("caudal").innerHTML = data.caudal;
          document.getElementById("temp").innerHTML = data.temp;
          document.getElementById("estado").innerHTML = data.servo ? "ACTIVO" : "INACTIVO";
        });
      }, 1000);

      function toggleServo() {
        fetch('/toggle');
      }
    </script>
  </body>
  </html>
  )rawliteral";
}

// Ruta para enviar los datos actualizados (JSON)
void handleData() {

  float distanciaActual = medirDistancia();

  temperaturaC = leerTemperatura();

String json = "{";
  json += "\"distancia\":" + String(distanciaActual, 1) + ",";
  json += "\"caudal\":" + String(caudal, 1) + ",";
  json += "\"temp\":" + String(temperaturaC, 1) + ",";
  json += "\"servo\":" + String(servoActivo ? 1 : 0);
  json += "}";
  server.send(200, "application/json", json);

}

// Ruta para manejar el botón web
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

// -------------INICIO DEL TODO--------
void setup() {

  Serial.begin(115200);

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(sensorPin, INPUT_PULLUP);
  pinMode(botonPin, INPUT_PULLUP);
  pinMode(ledPin, OUTPUT);
  
  miServo.attach(servoPin);
  miServo.write(0);

  attachInterrupt(digitalPinToInterrupt(sensorPin), contarPulsos, RISING);

  WiFi.softAP(ssid, password);
  Serial.println("WiFi AP Iniciado");
  Serial.println(WiFi.softAPIP());

  server.on("/", []() { server.send(200, "text/html", paginaHTML()); });
  server.on("/data", handleData);
  server.on("/toggle", handleToggle);
  server.begin();
}

void loop() {

  server.handleClient();


  // Medir caudal cada 1 segundo sin bloquear
  unsigned long actual = millis();
  if (actual - tiempoAnterior >= 1000) {
    detachInterrupt(digitalPinToInterrupt(sensorPin));
    float frecuencia = pulsos;
    caudal = frecuencia / factorCaudal;
    pulsos = 0;
    tiempoAnterior = actual;

    attachInterrupt(digitalPinToInterrupt(sensorPin), contarPulsos, RISING);

 
  }

  // Leer estado del botón físico
  int estadoBoton = digitalRead(botonPin);
  if (estadoBoton == LOW) {
    if (!servoActivo) {
      miServo.write(90);
      digitalWrite(ledPin, HIGH);
      servoActivo = true;
      
    }
    if (servoActivo) {
      miServo.write(0);
      digitalWrite(ledPin, LOW);
      servoActivo = false;
     
    }
  }

// Leer distancia y mostrar en Serial
  if (actual - tiempoSerial >= 2000) {
    tiempoSerial = actual;

    float distanciaActual = medirDistancia();
    temperaturaC = leerTemperatura();


    Serial.print("Distancia: ");
    Serial.print(distanciaActual);
    Serial.println(" cm");

    Serial.print("Caudal: ");
    Serial.print(caudal);
    Serial.println(" L/min");

    Serial.print("Temperatura: ");
    Serial.print(temperaturaC);
    Serial.println(" °C");


    Serial.print("Servo: ");
    Serial.println(servoActivo ? "ACTIVO desde físico " : "INACTIVO desde físico");
    Serial.println("-----------------------------");

}


