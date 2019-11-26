#!/bin/bash

echo Installing MIRT.

sudo apt-get install python3-rpy2

cd mirt
rename mirt-master mirt
Rscript ../4-install_packages.r
cd ../