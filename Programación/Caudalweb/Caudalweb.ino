#include <WiFi.h>
#include <WebServer.h>

// Pines y variables
int sensorPin = 4;
volatile int pulsos = 0;
unsigned long tiempoAnterior = 0;
float caudal = 0;
float factorCaudal = 7.5;

WebServer server(80);

// Wi-Fi en modo AP
const char* ssid = "CaudalESP32";
const char* password = "123456";

void IRAM_ATTR contarPulsos() {
  pulsos++;
}

String paginaHTML() {
  String html = R"rawliteral(
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Medidor de Caudal</title>
      <meta http-equiv="refresh" content="3">
      <style>
        body { font-family: Arial; background: #eef; text-align: center; padding-top: 50px; }
        .card { background: white; border-radius: 10px; padding: 20px; margin: auto; width: 300px;
                box-shadow: 0 0 10px rgba(0,0,0,0.3); }
        h1 { color: #006; }
        p { font-size: 20px; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>💧 Medidor de Caudal</h1>
        <p>Caudal actual: <strong>%CAUDAL%</strong> L/min</p>
        <p>Actualizando cada 3 segundos...</p>
      </div>
    </body>
    </html>
  )rawliteral";

  html.replace("%CAUDAL%", String(caudal, 2));
  return html;
}

void handleRoot() {
  server.send(200, "text/html", paginaHTML());
}

void setup() {
  Serial.begin(115200);
  pinMode(sensorPin, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(sensorPin), contarPulsos, RISING);

  // Modo AP
  WiFi.softAP(ssid, password);
  Serial.print("Red WiFi: ");
  Serial.println(ssid);
  Serial.print("IP local: ");
  Serial.println(WiFi.softAPIP());

  server.on("/", handleRoot);
  server.begin();
}

void loop() {
  unsigned long actual = millis();
  if (actual - tiempoAnterior >= 1000) {
    detachInterrupt(digitalPinToInterrupt(sensorPin));
    float frecuencia = pulsos;
    caudal = frecuencia / factorCaudal;
    pulsos = 0;
    tiempoAnterior = actual;
    attachInterrupt(digitalPinToInterrupt(sensorPin), contarPulsos, RISING);

    Serial.print("Caudal: ");
    Serial.print(caudal);
    Serial.println(" L/min");
  }

  server.handleClient();
}
