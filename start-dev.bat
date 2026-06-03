@echo off
setlocal

set "ROOT=%~dp0"

where pnpm >nul 2>nul
if errorlevel 1 (
  echo [Monceri] pnpm no esta disponible en PATH.
  echo Instala pnpm o habilitalo con Corepack antes de correr este script.
  pause
  exit /b 1
)

echo [Monceri] Levantando stack local...
echo.
echo API:   http://localhost:4000
echo Web:   http://localhost:3000
echo Admin: http://localhost:5173
echo.
echo Si la API falla, revisa que Postgres este corriendo en localhost:5432.
echo.

start "Monceri API - 4000" cmd /k "cd /d ""%ROOT%"" && pnpm --filter api dev"
timeout /t 2 /nobreak >nul

start "Monceri Web - 3000" cmd /k "cd /d ""%ROOT%"" && pnpm --filter web dev"
timeout /t 2 /nobreak >nul

start "Monceri Admin - 5173" cmd /k "cd /d ""%ROOT%"" && pnpm --filter admin dev"

echo Listo. Se abrieron tres terminales separadas.
echo Cierra cada ventana para detener su servicio.
pause
