 int trigPin = 9;  // Pin del Trig del sensor ultrasónico
 int echoPin = 10; // Pin del Echo del sensor ultrasónico
 int ledPin = 13;  // Pin del LED W

long duration;  // Variable para el tiempo de retorno del pulso
int distance;   // Variable para la distancia medida en cm
int distanceThreshold = 300; // Umbral de distancia en cm para encender el LED

void setup() {
  pinMode(trigPin, OUTPUT);   // Configura el pin Trig como salida
  pinMode(echoPin, INPUT);    // Configura el pin Echo como entrada
  pinMode(ledPin, OUTPUT);    // Configura el pin del LED como salida
  Serial.begin(9600);         // Inicializa la comunicación serial
}

void loop() {
  // Envía un pulso de 10us para activar el sensor
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  // Lee el tiempo del eco en microsegundos
  duration = pulseIn(echoPin, HIGH);

  // Calcula la distancia en cm
  distance = duration * 0.034 / 2;

  // Imprime la distancia medida en el monitor serial
  Serial.print("Distancia: ");
  Serial.print(distance);
  Serial.println(" cm");

  // Enciende el LED si la distancia es menor al umbral
  if (distance < distanceThreshold) {
    digitalWrite(ledPin, HIGH);
  } else {
    digitalWrite(ledPin, LOW);
  }

  delay(100); // Pequeño retardo
}
