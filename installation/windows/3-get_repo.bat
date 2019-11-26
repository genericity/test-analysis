echo Downloading and extracting MIRT for R.

setlocal enabledelayedexpansion
set _filename=%cd%\master.zip
set _url=https://github.com/genericity/mirt/archive/master.zip
Powershell -Command "(New-Object Net.WebClient).DownloadFile('%_url%','%_filename%')"
endlocal
powershell.exe -nologo -noprofile -command "& { Add-Type -A 'System.IO.Compression.FileSystem'; [IO.Compression.ZipFile]::ExtractToDirectory('master.zip', 'mirt'); }"