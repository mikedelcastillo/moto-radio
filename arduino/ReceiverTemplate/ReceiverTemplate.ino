#include "lib/receiver.h"

RF24 radio(8, 9);
uint8_t *RADIO_ADDRESS = RADIO_ADDRESSES[0];
ControllerInput CONTROLLER_INPUT;

void setup()
{
  setupRadioReceiver(&radio, RADIO_ADDRESS);

  Serial.begin(SERIAL_BAUDRATE);
  Serial.println("Listening...");
}

void loop()
{
  updateRadioInput(&radio, &CONTROLLER_INPUT);
}