echo Deploying in production mode.
cd ../../
pip3 install virtualenv
virtualenv testenv
source testenv/bin/activate

pip3 install flask --user
pip3 install tornado --user

python index.py