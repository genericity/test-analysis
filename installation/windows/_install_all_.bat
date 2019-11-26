@echo off

echo Installing...

rem call 1-install_python.bat
rem call 2-install_r.bat

set /p answer=Where is your R installation's bin directory? (e.g. C:\Program Files\R\R-3.5.1\bin) 
set PATH=%PATH%;%answer%

call 3-get_repo.bat
call 4-install_packages.bat
python 5-setup_db.py

echo Installation complete.

call cleanup.bat

set /P c=Do you wish to deploy in development mode (1), production mode (2), or exit (any other key)? [1/2/e] 
if /I "%c%" EQU "1" call 6-deploy_development.bat
if /I "%c%" EQU "2" call 6-deploy_production.bat

exit /b