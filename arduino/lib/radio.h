#ifndef MR_RADIO
#define MR_RADIO

#include <SPI.h>
#include <nRF24L01.h>
#include <RF24.h>

#include "constants.h"

void setupRadio(RF24 *radio)
{
  radio->begin();
  delay(1000);
  radio->setAutoAck(false);
  radio->setDataRate(RF24_250KBPS);
  radio->setPALevel(RF24_PA_MIN);
}

#endif