#!/bin/bash

echo Deploying in production mode.
cd ../../
pip3 install virtualenv
virtualenv flask_project_env
source flask_project_env/bin/activate

pip3 install flask --user
pip3 install tornado --user

pip3 install uwsgi flask
sudo apt-get install uwsgi-plugin-python
sudo apt-get install python3-pip python3-dev nginx

# Edit the config file here.

chmod +x run.sh
./run.sh