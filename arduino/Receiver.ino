#include <SPI.h>
#include <nRF24L01.h>
#include <RF24.h>

byte CONTROLLER_INPUT_BYTE = 'i';
byte CONTROLLER_ADDRESS_BYTE = 'a';
byte INT_START_BYTE = '0';
byte ADDRESSES[][12] = {
  "twig0",
  "soy00",
  "boni0",
  "branc",
  "pizza",
  "draft",
  "blu00",
  "percy",
  "pasta",
  "rust0",
  "jinx0",
  "bambi",
};
uint8_t MAX_ADDRESSES = sizeof(ADDRESSES);
uint8_t* address = "twig0";

typedef struct {
  uint8_t addressIndex;
} Controller;

typedef struct {
  byte input;
  byte value;
} RadioData;

Controller CONTROLLERS[] = { { 0 }, { 1 }, { 2 }, { 3 } };
uint8_t MAX_CONTROLLERS = sizeof(CONTROLLERS);

RF24 radio(8, 9);

void setup() {
  Serial.begin(115200);

  Serial.println("NRF OFF");
  // pinMode(8, OUTPUT);
  // digitalWrite(8, HIGH);
  // pinMode(9, OUTPUT);
  // digitalWrite(9, HIGH);
  // radio.stopListening();
  // radio.powerDown();
  radio.begin();
  delay(1000);
  // radio.setChannel(100);
  radio.setAutoAck(false);
  radio.setDataRate(RF24_250KBPS);
  radio.setPALevel(RF24_PA_MIN);
  radio.setPayloadSize(sizeof(RadioData));
  radio.openReadingPipe(1, address);
  radio.startListening();
  // radio.powerUp();
  Serial.println("NRF ON");

  Serial.println("Listening...");
}


void loop() {
  if (radio.available()) {
    Serial.println("reading...");
    RadioData data;
    radio.read(&data, sizeof(RadioData));
    Serial.print(data.input);
    Serial.println(data.value);
  }
}