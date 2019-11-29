#!/bin/bash

echo Installing MIRT.

sudo -E apt-get install python3-rpy2
sudo -E apt-get install python-rpy2
sudo -E apt-get install python3-flask
sudo -E apt-get install libssl-dev
sudo -E apt-get install libcurl4-openssl-dev
sudo -E python3 -m pip install rpy2 --upgrade

cd mirt
mv mirt-master mirt
Rscript ../4-install_packages.r
cd ../

cd ../../
#pip3 install virtualenv
#virtualenv flask_project_env
#source flask_project_env/bin/activate

pip3 install flask
pip3 install tornado

pip3 install uwsgi flask
sudo apt-get install uwsgi-plugin-python
sudo apt-get install python3-pip python3-dev nginx

cd installation/linux-ubuntu