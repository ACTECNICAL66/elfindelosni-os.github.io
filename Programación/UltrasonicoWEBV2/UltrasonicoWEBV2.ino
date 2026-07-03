#include <WiFi.h> 
#include <WebServer.h>

// Pines del sensor ultrasónico
int TRIG_PIN = 5;
const int ECHO_PIN = 18;

// Dimensiones del tanque
const float ALTURA_MAXIMA_CM = 200.0;

// Wi-Fi (modo AP)
const char* ssid = "MedidorAguaESP32";
const char* password = "12345678";

WebServer server(80);

// Función para medir distancia con el sensor ultrasónico
long medirDistancia() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duracion = pulseIn(ECHO_PIN, HIGH, 30000);  // con timeout de 30ms
  long distancia_cm = duracion * 0.0343 / 2;
  return distancia_cm;
}

// Página web
String paginaHTML(float altura) {
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
        <h1>Medidor de Agua</h1>
        <p>Altura del agua: <strong>%ALTURA%</strong> cm</p>
        <p>Actualizando cada 5 segundos...</p>
      </div>
    </body>
    </html>
  )rawliteral";

  html.replace("%ALTURA%", String(altura, 1));
  return html;
}

// Manejador de la web
void handleRoot() {
  long distancia = medirDistancia();
  float altura = ALTURA_MAXIMA_CM - distancia;

  if (altura < 0) altura = 0;
  if (altura > ALTURA_MAXIMA_CM) altura = ALTURA_MAXIMA_CM;

  server.send(200, "text/html", paginaHTML(altura));
}

void setup() {
  Serial.begin(115200);

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

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
