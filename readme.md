# Raspberry Configuration

### Raspberry Pi Setup

After imaging 32-bit Raspberry Pi OS, SSH into the board and add this line to `/boot/config.txt`

```
arm_64bit=0
```

Then `sudo reboot`. 

*NOTE: Do not run `apt update` or `apt upgrade` yet!*

### Xbox Dongle Drivers

```
sudo apt install -y dkms cabextract
git clone https://github.com/dlundqvist/xone
cd xone
sudo ./install.sh --release
sudo xone-get-firmware.sh --skip-disclaimer
```

Plug in Xbox Wireless Dongle.
*NOTE: When plugging in 8BitDo controllers, set them to D-input.*

### Moto Radio Production

```
git clone https://github.com/mikedelcastillo/moto-radio.git
cd moto-radio
bash ./scripts/setup.sh
```

### Moto Radio Development

```
bash ./scripts/setup-dev.sh
```