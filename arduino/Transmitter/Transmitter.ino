#include <LiquidCrystal_I2C.h>

#include "lib/constants.h"
#include "lib/radio.h"
#include "lib/timing.h"

#define RF24_CE_PIN 8
#define RF24_CSN_PIN 9

RF24 radio(RF24_CE_PIN, RF24_CSN_PIN);
LiquidCrystal_I2C lcd(0x27, 20, 4);

typedef struct
{
  uint8_t addressIndex;
} Controller;

Controller CONTROLLERS[MAX_CONTROLLERS] = {{0}, {1}, {2}, {3}};

uint8_t serialBuffer[SERIAL_BUFFER_LENGTH];
uint8_t serialBufferLength = 0;

Timing tLcd(TIMING_MILLIS, 250);

void setup()
{
  Serial.begin(SERIAL_BAUDRATE);

  setupRadio(&radio);

  lcd.begin(20, 4);
  lcd.clear();
  lcd.backlight();
}

bool isSafeControllerIndex(uint8_t index)
{
  return index >= 0 && index < MAX_CONTROLLERS;
}

void loop()
{
  updateSerial();
  processMessage();
  updateLcd();
}

void updateSerial()
{
  if (Serial.available())
  {
    uint8_t value = Serial.read();
    if (serialBufferLength == 0)
    {
      // Check if starting byte is valid
      if (value != CONTROLLER_INPUT_BYTE)
      {
        // Do not allow invalid start byte to enter buffer
        return;
      }
    }
    serialBuffer[serialBufferLength] = value;
    serialBufferLength++;
    // Overflow if buffer is not used
    if (serialBufferLength > SERIAL_BUFFER_LENGTH)
    {
      serialBufferLength = 0;
    }
  }
}

void processMessage()
{
  if (serialBuffer[0] == CONTROLLER_INPUT_BYTE && serialBufferLength == SERIAL_BUFFER_LENGTH)
  {
    serialBufferLength = 0;
    uint8_t index = parseIntFromChar(serialBuffer[1]);

    bool safeIndex = isSafeControllerIndex(index);
    if (safeIndex)
    {
      ControllerInput cinput;
      controllerInputFromBuffer(serialBuffer, &cinput);
      // Check if center button is pressed
      bool isPressingCenter = cinput.BUTTON_CENTER == MAX_INT_RADIO_VALUE;
      if (isPressingCenter)
      {
        // Update controller channel
        int nextIndex = CONTROLLERS[index].addressIndex + 1;
        CONTROLLERS[index].addressIndex = nextIndex >= MAX_RADIO_ADDRESSES ? 0 : nextIndex;
      }
      else
      {
        // Transmit data
        Controller controller = CONTROLLERS[index];
        radio.stopListening();
        radio.openWritingPipe(RADIO_ADDRESSES[controller.addressIndex]);
        radio.writeFast(&cinput, sizeof(ControllerInput));
      }
    }
  }
}

void updateLcd()
{
  if (tLcd.poll())
  {
    for (int i = 0; i < min(4, MAX_CONTROLLERS); i++)
    {
      lcd.setCursor(0, i);
      lcd.print("Input");
      lcd.print(i + 1);
      lcd.print(": CH#");
      lcd.print(CONTROLLERS[i].addressIndex);
    }
  }
}
