#include <WiFi.h>
#include <WebServer.h>

// Pines del sensor ultrasónico
 int TRIG_PIN = 5;
const int ECHO_PIN = 18;

// Dimensiones del tanque
const float ALTURA_MAXIMA = 200.0;
const float AREA_BASE_M2 = 0.25;  // m²

// Wi-Fi (modo AP)
const char* ssid = "MedidorAguaESP32";
const char* password = "12345678";

WebServer server(80);

long medirDistancia() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duracion = pulseIn(ECHO_PIN, HIGH);
  long distancia_cm = duracion * 0.034 / 2;
  return distancia_cm;
}

String paginaHTML(float altura, float volumen) {
  String html = R"rawliteral(
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Medidor de Agua</title>
      <meta http-equiv="refresh" content="5">
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
        <h1> Medidor de Agua</h1>
        <p>Altura del agua: <strong>%ALTURA%</strong> cm</p>
        <p>Volumen estimado: <strong>%VOLUMEN%</strong> litros</p>
        <p>Actualizando cada 5 segundos...</p>
      </div>
    </body>
    </html>
  )rawliteral";

  html.replace("%ALTURA%", String(altura, 1));
  html.replace("%VOLUMEN%", String(volumen, 1));
  return html;
}

void handleRoot() {
  long distancia = medirDistancia();
  float altura = ALTURA_MAXIMA - distancia;

  if (altura < 0) altura = 0;
  if (altura > ALTURA_MAXIMA) altura = ALTURA_MAXIMA;

  float volumen = (altura / 100.0) * AREA_BASE_M2 * 1000; // litros
  server.send(200, "text/html", paginaHTML(altura, volumen));
}

void setup() {
  Serial.begin(115200);

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  // Modo AP
  WiFi.softAP(ssid, password);
  Serial.print("Wi-Fi creado. Conectate a: ");
  Serial.println(ssid);
  Serial.print("IP local: ");
  Serial.println(WiFi.softAPIP());

  server.on("/", handleRoot);
  server.begin();
}

void loop() {
  server.handleClient();
}