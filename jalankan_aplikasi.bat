@echo off
title Sistem Pakar Troubleshooting Mesin (React + Express + MySQL)
cd /d "%~dp0"
echo ===================================================================
echo   SISTEM PAKAR TROUBLESHOOTING MESIN PRODUKSI
echo   PT VIVO MOBILE INDONESIA (REACT.JS + EXPRESS.JS + MYSQL)
echo ===================================================================
echo.

echo [1/3] Memeriksa layanan MySQL (XAMPP)...
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo       MySQL sudah aktif berjalan.
) else (
    if exist "C:\xampp\mysql\bin\mysqld.exe" (
        echo       Menjalankan MySQL XAMPP...
        start "" /B "C:\xampp\mysql\bin\mysqld.exe" --defaults-file="C:\xampp\mysql\bin\my.ini" --standalone
        timeout /t 3 /nobreak >nul
    ) else (
        echo       [PERINGATAN] Pastikan layanan MySQL di XAMPP/Laragon sudah dijalankan!
    )
)

echo [2/3] Menjalankan Backend API Express + MySQL (Port 5000)...
start "Backend API - Express MySQL" cmd /k "cd /d "%~dp0" && node server/index.js"

echo [3/3] Menjalankan Frontend React + Vite (Port 5173)...
echo       Buka browser di alamat: http://localhost:5173
echo.
npm run dev
pause
