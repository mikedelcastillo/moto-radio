#include <LiquidCrystal_I2C.h>
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

LiquidCrystal_I2C lcd(0x27, 20, 4);

void setup() {
  Serial.begin(115200);

  radio.begin();
  delay(1000);
  radio.setAutoAck(false);
  radio.setDataRate(RF24_250KBPS);
  radio.setPALevel(RF24_PA_MIN);
  radio.setPayloadSize(sizeof(RadioData));

  lcd.begin(20, 4);
  lcd.clear();
  lcd.backlight();
}

bool isSafeControllerIndex(uint8_t index) {
  return index >= 0 && index < MAX_CONTROLLERS;
}

void loop() {
  if (Serial.available()) {
    byte start = Serial.read();

    if (start == CONTROLLER_ADDRESS_BYTE) {
      uint8_t index = Serial.read() - INT_START_BYTE;
      uint8_t channel = Serial.read() - INT_START_BYTE;
      bool safeIndex = isSafeControllerIndex(index);
      bool safeChannel = channel >= 0 && channel < MAX_ADDRESSES;
      if (safeIndex && safeChannel) {
        CONTROLLERS[index].addressIndex = channel;
      }
    }

    if (start == CONTROLLER_INPUT_BYTE) {
      uint8_t index = Serial.read() - INT_START_BYTE;
      byte input = Serial.read();
      byte value = Serial.read();
      bool safeIndex = isSafeControllerIndex(index);
      if (safeIndex) {
        Controller controller = CONTROLLERS[index];
        radio.stopListening();
        radio.openWritingPipe(ADDRESSES[controller.addressIndex]);
        RadioData data;
        data.input = input;
        data.value = value;
        radio.write(&data, sizeof(RadioData));
        Serial.print("Sent ");
        Serial.print(data.input);
        Serial.print(data.value);
        Serial.print(" to ");
        Serial.println(index);
      }
    }
  }
  for (int i = 0; i < min(4, MAX_CONTROLLERS); i++) {
    lcd.setCursor(0, i);
    lcd.print("Input");
    lcd.print(i + 1);
    lcd.print(": CH#");
    lcd.print(CONTROLLERS[i].addressIndex);
  }
}