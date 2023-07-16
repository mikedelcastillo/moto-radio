#include "lib/receiver.h"

#define RF24_CE_PIN 8
#define RF24_CSN_PIN 9

RF24 radio(RF24_CE_PIN, RF24_CSN_PIN);

uint8_t *RADIO_ADDRESS = RADIO_ADDRESSES[0];
ControllerInput CONTROLLER_INPUT;

void setup()
{
  setupRadioReceiver(&radio, RADIO_ADDRESS);
}

void loop()
{
  updateRadioInput(&radio, &CONTROLLER_INPUT);
}