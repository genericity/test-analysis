@echo on
setlocal enabledelayedexpansion
set _filename=%cd%\python.exe
set _url=https://www.python.org/ftp/python/3.7.4/python-3.7.4.exe
Powershell -Command "(New-Object Net.WebClient).DownloadFile('%_url%','%_filename%')"
endlocal