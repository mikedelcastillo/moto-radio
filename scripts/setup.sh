curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - &&\
sudo apt-get install -y nodejs

sudo apt update -y
sudo apt upgrade -y

sudo npm install -g yarn