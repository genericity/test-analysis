#!/bin/bash

echo Installing R.
sudo apt-get remove r-base-core
sudo add-apt-repository "deb http://cran.rstudio.com/bin/linux/ubuntu $(lsb_release -sc)/"
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys E084DAB9
sudo add-apt-repository ppa:marutter/rrutter
sudo apt update
sudo apt full-upgrade
sudo apt-get install r-base=3.5.1