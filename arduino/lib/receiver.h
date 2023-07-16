#include "constants.h"
#include "radio.h"

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
    RadioData data;
    radio->read(&data, sizeof(RadioData));
    setControllerInputValue(cinput, data.input, data.value);
  }
}