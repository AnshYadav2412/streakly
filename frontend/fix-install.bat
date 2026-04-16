@echo off
echo 🧹 Cleaning up corrupted files...

if exist "node_modules" (
    echo Removing node_modules...
    rmdir /s /q node_modules 2>nul
)

if exist "package-lock.json" (
    echo Removing package-lock.json...
    del /f /q package-lock.json 2>nul
)

if exist "dev-dist" (
    echo Removing dev-dist...
    rmdir /s /q dev-dist 2>nul
)

echo.
echo Clearing npm cache...
call npm cache clean --force

echo.
echo 📦 Installing fresh dependencies...
call npm install --legacy-peer-deps

echo.
echo ✅ Done! You can now run: npm run dev
pause
