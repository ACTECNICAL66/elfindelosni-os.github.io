#include <WiFi.h>
#include <WebServer.h>
#include <ESP32Servo.h>

// Configura tu red Wi-Fi (modo AP)
char* ssid = "Dique_Control";
char* password = "123456";


int servoPin = 13;
int botonPin = 12;
int ledPin = 14;

bool servoActivo = false;
bool botonAnterior = HIGH;
Servo miServo;
WebServer server(80);

// HTML simple
String htmlPage() {
  String html = R"rawliteral(
    <!DOCTYPE html>
    <html>
    <head>
      <title>Control de Servo</title>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial; text-align: center; margin-top: 50px; }
        button {
          padding: 15px 30px;
          font-size: 20px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
        }
      </style>
    </head>
    <body>
      <h1>Control de Servo y LED</h1>
      <p>Estado actual: %ESTADO%</p>
      <form action="/toggle" method="get">
        <button type="submit">Cambiar estado</button>
      </form>
    </body>
    </html>
  )rawliteral";

  html.replace("%ESTADO%", (servoActivo ? "ACTIVADO" : "DESACTIVADO"));
  return html;
}

// Acción desde la web
void toggleEstado() {
  servoActivo = !servoActivo;

  if (servoActivo) {
    miServo.write(90);
    digitalWrite(ledPin, HIGH);
    Serial.println("Activado desde la web");
  } else {
    miServo.write(0);
    digitalWrite(ledPin, LOW);
    Serial.println("Desactivado desde la web");
  }

  server.send(200, "text/html", htmlPage());
}

void setup() {
  Serial.begin(115200);
  pinMode(botonPin, INPUT_PULLUP);
  pinMode(ledPin, OUTPUT);
  miServo.attach(servoPin);
  miServo.write(0); // Posición inicial

  // WiFi como punto de acceso
  WiFi.softAP(ssid, password);
  Serial.println("WiFi AP iniciado");
  Serial.println(WiFi.softAPIP());

  // Rutas
  server.on("/", []() {
    server.send(200, "text/html", htmlPage());
  });

  server.on("/toggle", toggleEstado);

  server.begin();
  Serial.println("Servidor web iniciado");
}

void loop() {
  server.handleClient();

  // Leer estado del botón físico
 int estadoBoton = digitalRead(botonPin); {
    
   if (estadoBoton == 1) { // Botón presionado
    Serial.println("Interruptor PRESIONADO(Activado desde botón físico)");
    miServo.write(90);      // Gira 90°
    digitalWrite(ledPin, HIGH); // Enciende LED
    
  } else {
    Serial.println("Interruptor SUELTO (Desactivado desde botón físico)");
    miServo.write(0);       // Se queda en 0°
    digitalWrite(ledPin, LOW);  // Apaga LED
  }
}
    delay(300); // Evita rebotes
  }

}
