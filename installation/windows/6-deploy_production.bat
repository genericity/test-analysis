echo Deploying in production mode.
cd ../../
pip3 install virtualenv
virtualenv flask_project_env
source flask_project_env/bin/activate

pip3 install flask --user
pip3 install tornado --user

python index.py