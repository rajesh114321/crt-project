@echo off
title QueueLess - Smart Digital Token System
color 0B
echo ========================================================
echo        QueueLess - Smart Digital Token System
echo           "Skip the queue. Not your turn."
echo ========================================================
echo Checking dependencies...
if not exist "backend\node_modules" (
    echo [INFO] Backend node_modules not found. Installing backend dependencies...
    cd backend && npm install && cd ..
)
if not exist "frontend\node_modules" (
    echo [INFO] Frontend node_modules not found. Installing frontend dependencies...
    cd frontend && npm install && cd ..
)

echo Starting Backend API Server (Port 5000)...
start "QueueLess Backend API" cmd /k "cd backend && set PATH=C:\Program Files\nodejs;%PATH% && node server.js"

echo Waiting for backend initialization...
timeout /t 2 /nobreak >nul

echo Starting Frontend Web App (Port 3000)...
start "QueueLess Frontend App" cmd /k "cd frontend && set PATH=C:\Program Files\nodejs;%PATH% && npm run dev"

echo.
echo ========================================================
echo [SUCCESS] Both QueueLess services are launching!
echo.
echo   Frontend App:   http://localhost:3000
echo   Backend API:    http://localhost:5000/api
echo   Health Status:  http://localhost:5000/api/health
echo.
echo   Student Demo:   student@queueless.com / student123
echo   Admin Demo:     admin@queueless.com / admin123
echo ========================================================
echo.
pause
