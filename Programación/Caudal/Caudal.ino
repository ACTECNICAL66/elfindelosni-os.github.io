int sensorPin = 4; // Pin de señal del sensor de caudal

volatile int pulsos = 0;
unsigned long tiempoAnterior = 0;
float factorCaudal = 7.5; // Valor típico del YF-S201: 7.5 pulsos por litro

void IRAM_ATTR contarPulsos() {
  pulsos++;
}

void setup() {
  Serial.begin(115200);
  pinMode(sensorPin, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(sensorPin), contarPulsos, RISING);
  Serial.println("Iniciando medición de caudal...");
}

void loop() {
  unsigned long tiempoActual = millis();
  if (tiempoActual - tiempoAnterior >= 1000) {
    detachInterrupt(digitalPinToInterrupt(sensorPin));

    float frecuencia = pulsos; // pulsos por segundo
    float caudal = frecuencia / factorCaudal; // litros por minuto

    Serial.print("Caudal: ");
    Serial.print(caudal);
    Serial.println(" L/min");

    pulsos = 0;
    tiempoAnterior = tiempoActual;

    attachInterrupt(digitalPinToInterrupt(sensorPin), contarPulsos, RISING);
  }
}
