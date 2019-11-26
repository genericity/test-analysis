echo Installing MIRT.

pip3 install rpy2 --user
cd mirt
Rscript -e 'install.packages("devtools")'
Rscript -e 'library("devtools")'
Rscript -e 'install_local("mirt-master")'
cd ../