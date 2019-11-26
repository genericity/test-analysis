#!/bin/bash

echo Downloading R.
sudo apt-get remove r-base-core
sudo apt-get install gfortran
sudo apt-get install build-essential
sudo apt-get install xorg-dev
wget http://cran.r-project.org/src/base/R-3/R-3.5.1.tar.gz
tar -xzf R-3.5.1.tar.gz
cd R-3.5.1

sudo apt install openjdk-8-jdk
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk
export PATH=$PATH:$JAVA_HOME/bin

echo Installing R.
./configure --enable-R-shlib # --prefix=...
make
sudo make install
sudo chown -R $USER:$USER /usr/local/bin
sudo chown -R $USER:$USER /usr/local/lib/R
export PATH=$PATH:/usr/local/bin

cd ../