call 1-install_python.bat
call 2-install_r.bat
call 3-get_repo.bat
call 4-install_packages.bat
python 5-setup_db.py

@echo off
set /P c=Do you wish to deploy in development mode (1), production mode (2), or cancel (any other key)? [1/2/c]
if /I "%c%" EQU "1" call 6-deploy_development.bat
if /I "%c%" EQU "2" call 6-deploy_production.bat

call cleanup.bat