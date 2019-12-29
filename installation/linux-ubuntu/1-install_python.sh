#!/bin/bash

echo Installing Python.

sudo -E apt-get install software-properties-common
sudo -E add-apt-repository ppa:deadsnakes/ppa
sudo -E apt-add-repository universe
sudo -E apt-get update
sudo -E apt-get install python3.5
sudo -E apt-get install python3-pip
