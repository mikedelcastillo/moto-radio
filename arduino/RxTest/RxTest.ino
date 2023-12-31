#include "lib/receiver.h"
#include "lib/test.h"

#define RF24_CE_PIN 7
#define RF24_CSN_PIN 8

RF24 radio(RF24_CE_PIN, RF24_CSN_PIN);
uint8_t *RADIO_ADDRESS = RADIO_ADDRESSES[0];

void setup()
{
  Serial.begin(SERIAL_BAUDRATE);
  setupRadioReceiver(&radio, RADIO_ADDRESS);
  debugTest();
}

void loop()
{
  if (radio.available())
  {
    TestMessage message;
    radio.read(&message, sizeof(TestMessage));
    Serial.print(message.a);
    Serial.print(" ");
    Serial.print(message.b);
    Serial.print(" ");
    Serial.print(message.c);
    Serial.print("\n");
  }
}