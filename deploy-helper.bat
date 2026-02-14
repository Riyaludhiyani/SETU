@echo off
echo ============================================
echo SETU Platform - Deployment Helper
echo ============================================
echo.

echo Checking prerequisites...
echo.

REM Check if Git is installed
git --version > nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed!
    echo Please install Git from: https://git-scm.com/download/win
    pause
    exit /b 1
)
echo [OK] Git is installed

REM Check if Node is installed
node --version > nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js is installed

echo.
echo ============================================
echo Deployment Options
echo ============================================
echo 1. Initialize Git repository
echo 2. Install dependencies (both frontend and backend)
echo 3. Test local setup
echo 4. View deployment guide
echo 5. Exit
echo.

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto init_git
if "%choice%"=="2" goto install_deps
if "%choice%"=="3" goto test_local
if "%choice%"=="4" goto view_guide
if "%choice%"=="5" goto end

:init_git
echo.
echo Initializing Git repository...
git init
git add .
git commit -m "Initial commit: SETU platform ready for deployment"
echo.
echo [SUCCESS] Git repository initialized!
echo.
echo Next steps:
echo 1. Create a repository on GitHub
echo 2. Run: git remote add origin YOUR_GITHUB_URL
echo 3. Run: git push -u origin main
echo.
pause
goto end

:install_deps
echo.
echo Installing backend dependencies...
cd backend
call npm install
cd ..
echo.
echo Installing frontend dependencies...
cd frontend
call npm install
cd ..
echo.
echo [SUCCESS] All dependencies installed!
echo.
pause
goto end

:test_local
echo.
echo Testing local setup...
echo.
echo Starting backend server...
start cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak > nul
echo.
echo Starting frontend server...
start cmd /k "cd frontend && npm run dev"
echo.
echo [INFO] Servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Close the server windows when done testing.
pause
goto end

:view_guide
echo.
echo Opening deployment guide...
start DEPLOYMENT_GUIDE.md
echo.
pause
goto end

:end
echo.
echo Thank you for using SETU Deployment Helper!
echo For detailed instructions, see DEPLOYMENT_GUIDE.md
echo.
pause
