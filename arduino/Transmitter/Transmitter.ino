#include <LiquidCrystal_I2C.h>

#include "lib/constants.h"
#include "lib/radio.h"

typedef struct
{
  uint8_t addressIndex;
} Controller;

Controller CONTROLLERS[MAX_CONTROLLERS] = {{0}, {1}, {2}, {3}};

RF24 radio(8, 9);
LiquidCrystal_I2C lcd(0x27, 20, 4);

void setup()
{
  Serial.begin(115200);

  setupRadioTransmitter(radio);

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
  if (Serial.available())
  {
    byte start = Serial.read();

    if (start == CONTROLLER_ADDRESS_BYTE)
    {
      uint8_t index = parseIntFromChar(Serial.read());
      uint8_t channel = parseIntFromChar(Serial.read());
      bool safeIndex = isSafeControllerIndex(index);
      bool safeChannel = channel >= 0 && channel < MAX_RADIO_ADDRESSES;
      if (safeIndex && safeChannel)
      {
        CONTROLLERS[index].addressIndex = channel;
      }
    }

    if (start == CONTROLLER_INPUT_BYTE)
    {
      uint8_t index = parseIntFromChar(Serial.read());
      byte input = Serial.read();
      byte value = Serial.read();
      bool safeIndex = isSafeControllerIndex(index);
      if (safeIndex)
      {
        Controller controller = CONTROLLERS[index];
        radio.stopListening();
        radio.openWritingPipe(RADIO_ADDRESSES[controller.addressIndex]);
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
  for (int i = 0; i < min(4, MAX_CONTROLLERS); i++)
  {
    lcd.setCursor(0, i);
    lcd.print("Input");
    lcd.print(i + 1);
    lcd.print(": CH#");
    lcd.print(CONTROLLERS[i].addressIndex);
  }
}