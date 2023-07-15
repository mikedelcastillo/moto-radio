#include <SPI.h>
#include <nRF24L01.h>
#include <RF24.h>

typedef struct
{
  uint8_t addressIndex;
} Controller;

typedef struct
{
  byte input;
  byte value;
} RadioData;

Controller CONTROLLERS[] = {{0}, {1}, {2}, {3}};
uint8_t MAX_CONTROLLERS = sizeof(CONTROLLERS);

RF24 radio(8, 9);

void setup()
{
  Serial.begin(115200);

  // setupRadio(&radio);

  Serial.println("Listening...");
}

void loop()
{
  if (radio.available())
  {
    Serial.println("reading...");
    RadioData data;
    radio.read(&data, sizeof(RadioData));
    Serial.print(data.input);
    Serial.println(data.value);
  }
}