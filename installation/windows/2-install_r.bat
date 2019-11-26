echo Downloading R.
setlocal enabledelayedexpansion
set _filename=%cd%\r.exe
set _url=https://cran.r-project.org/bin/windows/base/old/3.5.1/R-3.5.1-win.exe
Powershell -Command "(New-Object Net.WebClient).DownloadFile('%_url%','%_filename%')"
endlocal

echo Installing R.
start /wait "" %cd%\r.exe