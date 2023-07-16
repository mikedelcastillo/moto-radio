#ifndef RR_TIMING
#define RR_TIMING

#include <Arduino.h>
enum TimingType
{
  TIMING_MILLIS,
  TIMING_MICROS,
};

class Timing
{
private:
  unsigned long lastUpdate;
  unsigned long duration;
  TimingType type;
  unsigned long getNow()
  {
    if (type == TIMING_MILLIS)
    {
      return millis();
    }
    else if (type == TIMING_MICROS)
    {
      return micros();
    }
  };

public:
  Timing(TimingType timingType, unsigned long timingDuration)
  {
    duration = timingDuration;
    type = timingType;
    reset();
  };
  void reset()
  {
    lastUpdate = getNow();
  };
  bool poll()
  {
    unsigned long now = getNow();
    bool result = (now - lastUpdate) >= duration;
    if (result)
      reset();
    return result;
  }
};

#endif