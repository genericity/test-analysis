echo Installing MIRT.

pip3 install rpy2 --user
cd mirt
rename mirt-master mirt
Rscript ../4-install_packages.r
cd ../