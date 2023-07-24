/* THIS FILE WAS AUTOGENERATED ON 2023-07-24T12:36:00.837Z */

// If you wish to make changes, edit /server/src/constants.ts
// then run "yarn sync-constants" to update this file.

#ifndef MR_CONSTS
#define MR_CONSTS

#define SERIAL_BAUDRATE 115200
#define SERIAL_BUFFER_LENGTH 27
#define MAX_INT_RADIO_VALUE 255
#define MAX_CONTROLLERS 4
#define MAX_RADIO_ADDRESSES 15
#define RADIO_MESSAGE_BUFFER_LENGTH 25
#define POLL_INTERVAL 25
#define TIMEOUT_INTERVAL 100
#define CONTROLLER_INPUT_BYTE 105
#define CONTROLLER_CLEAR_BYTE 99

int16_t parseIntFromChar(uint8_t value){
  if(value < 0) { return (int16_t) 0; }
  if(value > 255) { return (int16_t) 255; }
  return (int16_t) value - (int16_t) 0;
}

float parseFloatFromChar(uint8_t value){
  return ((float) parseIntFromChar(value)) / ((float) 255);
}

float intToFloat(uint8_t value){
  return ((float) value) / ((float) 255);
}

typedef __attribute__((packed, aligned(1))) struct {
  uint8_t BUTTON_A;
  uint8_t BUTTON_B;
  uint8_t BUTTON_X;
  uint8_t BUTTON_Y;
  uint8_t BUTTON_START;
  uint8_t BUTTON_SELECT;
  uint8_t AXIS_LT;
  uint8_t AXIS_RT;
  uint8_t BUTTON_LB;
  uint8_t BUTTON_RB;
  uint8_t BUTTON_DU;
  uint8_t BUTTON_DD;
  uint8_t BUTTON_DL;
  uint8_t BUTTON_DR;
  uint8_t BUTTON_LS;
  uint8_t BUTTON_RS;
  uint8_t BUTTON_CENTER;
  int16_t AXIS_LSX;
  int16_t AXIS_LSY;
  int16_t AXIS_RSX;
  int16_t AXIS_RSY;
} ControllerInput;

void resetControllerInput(ControllerInput *cinput){
  cinput->BUTTON_A = 0;
  cinput->BUTTON_B = 0;
  cinput->BUTTON_X = 0;
  cinput->BUTTON_Y = 0;
  cinput->BUTTON_START = 0;
  cinput->BUTTON_SELECT = 0;
  cinput->AXIS_LT = 0;
  cinput->AXIS_RT = 0;
  cinput->BUTTON_LB = 0;
  cinput->BUTTON_RB = 0;
  cinput->BUTTON_DU = 0;
  cinput->BUTTON_DD = 0;
  cinput->BUTTON_DL = 0;
  cinput->BUTTON_DR = 0;
  cinput->BUTTON_LS = 0;
  cinput->BUTTON_RS = 0;
  cinput->BUTTON_CENTER = 0;
  cinput->AXIS_LSX = 0;
  cinput->AXIS_LSY = 0;
  cinput->AXIS_RSX = 0;
  cinput->AXIS_RSY = 0;
}

void controllerInputFromBuffer(uint8_t buffer[SERIAL_BUFFER_LENGTH], ControllerInput *cinput){
  cinput->BUTTON_A = parseIntFromChar(buffer[2]);
  cinput->BUTTON_B = parseIntFromChar(buffer[3]);
  cinput->BUTTON_X = parseIntFromChar(buffer[4]);
  cinput->BUTTON_Y = parseIntFromChar(buffer[5]);
  cinput->BUTTON_START = parseIntFromChar(buffer[6]);
  cinput->BUTTON_SELECT = parseIntFromChar(buffer[7]);
  cinput->AXIS_LT = parseIntFromChar(buffer[8]);
  cinput->AXIS_RT = parseIntFromChar(buffer[9]);
  cinput->BUTTON_LB = parseIntFromChar(buffer[10]);
  cinput->BUTTON_RB = parseIntFromChar(buffer[11]);
  cinput->BUTTON_DU = parseIntFromChar(buffer[12]);
  cinput->BUTTON_DD = parseIntFromChar(buffer[13]);
  cinput->BUTTON_DL = parseIntFromChar(buffer[14]);
  cinput->BUTTON_DR = parseIntFromChar(buffer[15]);
  cinput->BUTTON_LS = parseIntFromChar(buffer[16]);
  cinput->BUTTON_RS = parseIntFromChar(buffer[17]);
  cinput->BUTTON_CENTER = parseIntFromChar(buffer[18]);
  cinput->AXIS_LSX = parseIntFromChar(buffer[19]) - parseIntFromChar(buffer[20]);
  cinput->AXIS_LSY = parseIntFromChar(buffer[21]) - parseIntFromChar(buffer[22]);
  cinput->AXIS_RSX = parseIntFromChar(buffer[23]) - parseIntFromChar(buffer[24]);
  cinput->AXIS_RSY = parseIntFromChar(buffer[25]) - parseIntFromChar(buffer[26]);
}

uint8_t RADIO_ADDRESSES[][15] = {
  "twig",
  "soy",
  "boni",
  "branch",
  "pizza",
  "drafj",
  "draft",
  "blu",
  "percy",
  "pasta",
  "rust",
  "jinx",
  "bambi",
  "fern",
  "matcha",
};

#endif