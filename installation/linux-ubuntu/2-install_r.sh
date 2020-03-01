#!/bin/bash

echo Downloading R.
sudo apt-get remove r-base-core

sudo -E apt install openjdk-8-jdk
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk
export PATH=$PATH:$JAVA_HOME/bin

sudo -E apt-get install libxml2-dev
sudo echo "deb http://cran.rstudio.com/bin/linux/ubuntu xenial/" | sudo tee -a /etc/apt/sources.list
gpg --keyserver keyserver.ubuntu.com --recv-key E298A3A825C0D65DFD57CBB651716619E084DAB9 --honor-http-proxy http-proxy=http://squid.auckland.ac.nz:3128/
gpg -a --export E084DAB9 | sudo apt-key add -
sudo -E apt-get update
sudo -E apt-get install r-base-core=3.4.3-1xenial0

sudo apt-get -y build-dep libcurl4-gnutls-dev
sudo apt-get -y install libcurl4-gnutls-dev

echo "What is the directory of your R installation? (If on Ubuntu, this is /usr/lib/R) "
read answer
export PATH=$answer:$answer/bin:$PATH
export RHOME=$answer:$answer/bin
export R_HOME=$answer:$answer/bin
export R_HOME_DIR=$answer:$answer/bin
