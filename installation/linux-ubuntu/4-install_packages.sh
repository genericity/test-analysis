#!/bin/bash

echo Installing MIRT.

sudo -E python -m pip3 install rpy2==2.9.4
echo "If rpy2 installed successfully in the last step, please decline to upgrade rpy2 in the next step."
read -n 1 -s -r -p "Press any key to continue"

sudo -E apt-get install python3-rpy2
sudo -E apt-get install python3-flask
sudo -E apt-get install libssl-dev
sudo -E apt-get install libcurl4-openssl-dev

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