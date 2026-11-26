@echo off

cd /d "%~dp0"

rem Obtenemos la fecha 
for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd"') do set FECHA=%%i

mkdir "resguardos_tpi\%FECHA%" 2>nul

rem Connection String de Atlas
set URI=mongodb+srv://gabrielvaldeztupad_db:Gv426301@tpi.fj0z7fw.mongodb.net/

rem mongodump se conecta a Atlas y descarga la base dentro de esa carpeta
mongodump --uri="%URI%" --db=Tienda_Ropa --out="resguardos_tpi\%FECHA%"

echo Backup terminado en resguardos_tpi\%FECHA%
pause