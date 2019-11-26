#!/bin/bash

chmod -R 755 ./

echo Installing...

sh ./1-install_python.sh
sh ./2-install_r.sh

echo "What is the bin directory of your R installation? (If on Ubuntu, this is /usr/lib/R/bin) "
read answer
export PATH=$answer:$PATH
export RHOME=$answer
export R_HOME=$answer
export LD_LIBRARY_PATH=$answer

sh ./3-get_repo.sh
sh ./4-install_packages.sh
python3 5-setup_db.py

echo Installation complete.

sh ./cleanup.sh

echo "Do you wish to deploy in development mode (1), production mode (2), or exit (any other key)? [1/2/e]"
select yn in "1" "2"; do
    case $yn in
        1 ) sh ./6-deploy_development.py; break;;
        2 ) sh ./6-deploy_production.py; break;;
        * ) exit;;
    esac
done

exit 0