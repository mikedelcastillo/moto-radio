#ifndef MR_RECEIVER
#define MR_RECEIVER

#include "constants.h"
#include "radio.h"
#include "timing.h"

Timing tTimeout(TIMING_MILLIS, TIMEOUT_INTERVAL);

void setupRadioReceiver(RF24 *radio, uint8_t *address)
{
  setupRadio(radio);
  radio->openReadingPipe(1, address);
  radio->startListening();
}

void updateRadioInput(RF24 *radio, ControllerInput *cinput)
{
  if (radio->available())
  {
    uint8_t serialBuffer[SERIAL_BUFFER_LENGTH];
    radio->read(&serialBuffer, sizeof(serialBuffer));
    controllerInputFromBuffer(serialBuffer, &cinput);
    tTimeout.reset();
  }
  else
  {
    if (tTimeout.poll())
    {
      resetControllerInput(cinput);
    }
  }
}

#endif