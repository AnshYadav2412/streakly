# Force Fix Script for Windows PowerShell
# Run this if fix-install.bat doesn't work

Write-Host "🔧 Force Fixing Frontend Installation..." -ForegroundColor Cyan
Write-Host ""

# Kill any running Node processes
Write-Host "Stopping Node.js processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Remove package-lock.json
Write-Host "Removing package-lock.json..." -ForegroundColor Yellow
if (Test-Path "package-lock.json") {
    Remove-Item "package-lock.json" -Force -ErrorAction SilentlyContinue
}

# Remove dev-dist
Write-Host "Removing dev-dist..." -ForegroundColor Yellow
if (Test-Path "dev-dist") {
    Remove-Item "dev-dist" -Recurse -Force -ErrorAction SilentlyContinue
}

# Try to remove node_modules
Write-Host "Attempting to remove node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    # Try normal removal first
    Remove-Item "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
    
    # If it still exists, try robocopy method (Windows)
    if (Test-Path "node_modules") {
        Write-Host "Using alternative removal method..." -ForegroundColor Yellow
        $emptyDir = New-Item -ItemType Directory -Path "empty_temp_dir" -Force
        robocopy $emptyDir.FullName "node_modules" /MIR /R:0 /W:0 | Out-Null
        Remove-Item "node_modules" -Force -ErrorAction SilentlyContinue
        Remove-Item $emptyDir.FullName -Force -ErrorAction SilentlyContinue
    }
}

# Clear npm cache
Write-Host ""
Write-Host "Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force

# Install dependencies
Write-Host ""
Write-Host "📦 Installing fresh dependencies..." -ForegroundColor Green
npm install --legacy-peer-deps

Write-Host ""
Write-Host "✅ Done! Now run: npm run dev" -ForegroundColor Green
Write-Host ""
