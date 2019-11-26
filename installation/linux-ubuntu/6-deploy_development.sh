#!/bin/bash

echo Deploying in development mode.
cd ../../
export FLASK_APP=index.py
python -m flask run