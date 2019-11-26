@echo on
setlocal enabledelayedexpansion
set _filename=%cd%\r.exe
set _url=https://cran.r-project.org/bin/windows/base/R-3.6.1-win.exe
Powershell -Command "(New-Object Net.WebClient).DownloadFile('%_url%','%_filename%')"
endlocal
start "" %cd%\r.exe