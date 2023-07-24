#ifndef MR_TEST
#define MR_TEST

#include <Arduino.h>

typedef struct
{
  uint8_t a;
  int16_t b;
  byte c;
} TestMessage;

void debugTest()
{
  Serial.print("sizeof(TestMessage): ");
  Serial.println(sizeof(TestMessage));
}

#endif