#include "lib/radio.h"
#include "lib/test.h"

#define RF24_CE_PIN 8
#define RF24_CSN_PIN 9

RF24 radio(RF24_CE_PIN, RF24_CSN_PIN);
uint8_t *RADIO_ADDRESS = RADIO_ADDRESSES[0];

unsigned long count = 0;

void setup()
{
  Serial.begin(SERIAL_BAUDRATE);
  setupRadio(&radio);
  debugTest();
}

void loop()
{
  TestMessage message;
  message.a = count + 0;
  message.b = count + 1;
  message.c = count + 2;
  radio.stopListening();
  radio.openWritingPipe(RADIO_ADDRESS);
  radio.writeFast(&message, sizeof(TestMessage));
  Serial.print("Sent: ");
  Serial.println(count);
  count++;
  delay(1000);
}