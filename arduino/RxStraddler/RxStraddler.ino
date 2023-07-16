#include <Servo.h>

#include "lib/receiver.h"
#include "lib/timing.h"

#define RF24_CE_PIN 8
#define RF24_CSN_PIN 9

#define SERVO_STEER_PIN 1

#define MOTOR_RPWM_PIN 5
#define MOTOR_LPWM_PIN 6
#define MOTOR_LEN_PIN 7
#define MOTOR_REN_PIN 8

#define MAX_STEER_ANGLE 60
#define STEER_MIDDLE 90
#define STEER_SIGN 1
#define STEER_LEFT (STEER_MIDDLE - MAX_STEER_ANGLE / 2) * STEER_SIGN
#define STEER_RIGHT (STEER_MIDDLE + MAX_STEER_ANGLE / 2) * STEER_SIGN

#define THROTTLE_MIN 8

#define MAX_PWM_VALUE 255

RF24 radio(RF24_CE_PIN, RF24_CSN_PIN);
Servo steerServo;
uint8_t *RADIO_ADDRESS = RADIO_ADDRESSES[0];
ControllerInput CONTROLLER_INPUT;

Timing tUpdate(TIMING_MILLIS, 50);

void setup()
{
  setupRadioReceiver(&radio, RADIO_ADDRESS);
  steerServo.attach(SERVO_STEER_PIN);
  pinMode(MOTOR_RPWM_PIN, OUTPUT);
  pinMode(MOTOR_LPWM_PIN, OUTPUT);
  pinMode(MOTOR_LEN_PIN, OUTPUT);
  pinMode(MOTOR_REN_PIN, OUTPUT);
}

void loop()
{
  updateRadioInput(&radio, &CONTROLLER_INPUT);
  if (tUpdate.poll())
  {
    // Update steering
    int steerSum = CONTROLLER_INPUT.AXIS_LXR - CONTROLLER_INPUT.AXIS_LXL;
    int steerValue = map(steerSum, -INT_MAX_VALUE, INT_MAX_VALUE, STEER_LEFT, STEER_RIGHT);
    steerServo.write(steerValue);

    // Update throttle
    int throttleSum = CONTROLLER_INPUT.AXIS_RT - CONTROLLER_INPUT.AXIS_LT;
    if (abs(throttleSum) > THROTTLE_MIN)
    {
      digitalWrite(MOTOR_LEN_PIN, HIGH);
      digitalWrite(MOTOR_REN_PIN, HIGH);
      int power = intToFloat(abs(throttleSum)) * MAX_PWM_VALUE;
      if (throttleSum > 0)
      {
        analogWrite(MOTOR_RPWM_PIN, power);
        analogWrite(MOTOR_LPWM_PIN, 0);
      }
      if (throttleSum < 0)
      {
        analogWrite(MOTOR_RPWM_PIN, 0);
        analogWrite(MOTOR_LPWM_PIN, power);
      }
    }
    else
    {
      digitalWrite(MOTOR_RPWM_PIN, LOW);
      digitalWrite(MOTOR_LPWM_PIN, LOW);
      digitalWrite(MOTOR_LEN_PIN, LOW);
      digitalWrite(MOTOR_REN_PIN, LOW);
    }
  }
}