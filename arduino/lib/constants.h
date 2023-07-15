/* THIS FILE WAS AUTOGENERATED ON 2023-07-15T09:47:23.908Z */

// If you wish to make changes, edit /server/src/constants.ts
// then run "yarn sync-constants" to update this file.

#define MAX_CONTROLLERS 4
#define CONTROLLER_INPUT_BYTE 105
#define CONTROLLER_ADDRESS_BYTE 97
#define BUTTON_A_BYTE 48
#define BUTTON_B_BYTE 49
#define BUTTON_X_BYTE 50
#define BUTTON_Y_BYTE 51
#define BUTTON_START_BYTE 52
#define BUTTON_SELECT_BYTE 53
#define BUTTON_LT_BYTE 54
#define BUTTON_LB_BYTE 55
#define BUTTON_RT_BYTE 56
#define BUTTON_RB_BYTE 57
#define BUTTON_DU_BYTE 58
#define BUTTON_DD_BYTE 59
#define BUTTON_DL_BYTE 60
#define BUTTON_DR_BYTE 61
#define AXIS_LXL_BYTE 62
#define AXIS_LXR_BYTE 63
#define AXIS_LYU_BYTE 64
#define AXIS_LYD_BYTE 65
#define AXIS_RXL_BYTE 66
#define AXIS_RXR_BYTE 67
#define AXIS_RYU_BYTE 68
#define AXIS_RYD_BYTE 69

enum ControllerInputType {
  CI_BUTTON_A,
  CI_BUTTON_B,
  CI_BUTTON_X,
  CI_BUTTON_Y,
  CI_BUTTON_START,
  CI_BUTTON_SELECT,
  CI_BUTTON_LT,
  CI_BUTTON_LB,
  CI_BUTTON_RT,
  CI_BUTTON_RB,
  CI_BUTTON_DU,
  CI_BUTTON_DD,
  CI_BUTTON_DL,
  CI_BUTTON_DR,
  CI_AXIS_LXL,
  CI_AXIS_LXR,
  CI_AXIS_LYU,
  CI_AXIS_LYD,
  CI_AXIS_RXL,
  CI_AXIS_RXR,
  CI_AXIS_RYU,
  CI_AXIS_RYD,
};

ControllerInputType getControllerInputType(char value){
  if(value == 48) { return CI_BUTTON_A; }
  if(value == 49) { return CI_BUTTON_B; }
  if(value == 50) { return CI_BUTTON_X; }
  if(value == 51) { return CI_BUTTON_Y; }
  if(value == 52) { return CI_BUTTON_START; }
  if(value == 53) { return CI_BUTTON_SELECT; }
  if(value == 54) { return CI_BUTTON_LT; }
  if(value == 55) { return CI_BUTTON_LB; }
  if(value == 56) { return CI_BUTTON_RT; }
  if(value == 57) { return CI_BUTTON_RB; }
  if(value == 58) { return CI_BUTTON_DU; }
  if(value == 59) { return CI_BUTTON_DD; }
  if(value == 60) { return CI_BUTTON_DL; }
  if(value == 61) { return CI_BUTTON_DR; }
  if(value == 62) { return CI_AXIS_LXL; }
  if(value == 63) { return CI_AXIS_LXR; }
  if(value == 64) { return CI_AXIS_LYU; }
  if(value == 65) { return CI_AXIS_LYD; }
  if(value == 66) { return CI_AXIS_RXL; }
  if(value == 67) { return CI_AXIS_RXR; }
  if(value == 68) { return CI_AXIS_RYU; }
  if(value == 69) { return CI_AXIS_RYD; }
}

int parseIntFromChar(char value){
  if(value < 48) { return 0; }
  if(value > 176) { return 128; }
  return value - 48;
}

float parseFloatFromChar(char value){
  return ((float) parseIntFromChar(value)) / ((float) 48);
}

byte RADIO_ADDRESSES[][13] = {
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
};