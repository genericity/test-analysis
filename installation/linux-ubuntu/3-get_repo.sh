#!/bin/bash

echo Downloading and extracting MIRT for R.

wget --no-check-certificate -O master.zip https://github.com/genericity/mirt/archive/master.zip
sudo apt-get install unzip
unzip master.zip -d mirt