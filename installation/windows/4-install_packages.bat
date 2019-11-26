echo Installing MIRT.

pip3 install rpy2 --user
cd mirt
rename mirt-master mirt
Rscript ../4-install_packages.r
cd ../

cd ../../

pip3 install virtualenv
virtualenv flask_project_env
source flask_project_env/bin/activate

pip3 install flask --user
pip3 install tornado --user

cd installation\windows