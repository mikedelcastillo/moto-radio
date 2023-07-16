sudo apt update -y
sudo apt upgrade -y
sudo apt-get install -y build-essential gdb

# Install arduino deps
rm -rf ./bin
curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | sh
# https://www.arduino.cc/reference/en/libraries/rf24/
./bin/arduino-cli lib install "RF24@1.4.6"

# https://www.arduino.cc/reference/en/libraries/liquidcrystal-i2c/
./bin/arduino-cli lib install "LiquidCrystal I2C@1.1.2"

bash scripts/link.sh