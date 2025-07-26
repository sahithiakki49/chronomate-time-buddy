# ChronoMate Live Deployment Guide
Write-Host "🚀 ChronoMate Live Deployment Guide" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Check if .env exists
if (Test-Path ".env") {
    Write-Host "✅ Environment file found" -ForegroundColor Green
} else {
    Write-Host "❌ Environment file not found. Creating..." -ForegroundColor Red
    $envContent = @"
# Google Gemini API Key
VITE_GEMINI_API_KEY=AIzaSyBb5y91IiI5uLZ6wC6cPAIjO-ooVhvWNk4

# Optional: Enable/disable features
VITE_ENABLE_VOICE=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_AI_INSIGHTS=true
"@
    $envContent | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✅ Environment file created" -ForegroundColor Green
}

# Build the application
Write-Host "`n🔨 Building application for production..." -ForegroundColor Yellow
C:\Users\prane\.bun\bin\bun.exe run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    Write-Host "`n📁 Build files are in the 'dist' folder" -ForegroundColor Cyan
    
    Write-Host "`n🌐 Choose your deployment method:" -ForegroundColor Yellow
    Write-Host "`n1️⃣ GITHUB PAGES (Recommended - Free & Easy):" -ForegroundColor White
    Write-Host "   Step 1: Create GitHub repository" -ForegroundColor Gray
    Write-Host "   Step 2: Push your code" -ForegroundColor Gray
    Write-Host "   Step 3: Add secret: VITE_GEMINI_API_KEY" -ForegroundColor Gray
    Write-Host "   Step 4: Enable GitHub Pages" -ForegroundColor Gray
    
    Write-Host "`n2️⃣ VERCEL (Professional - Free):" -ForegroundColor White
    Write-Host "   Step 1: Go to https://vercel.com" -ForegroundColor Gray
    Write-Host "   Step 2: Import your GitHub repository" -ForegroundColor Gray
    Write-Host "   Step 3: Add environment variable" -ForegroundColor Gray
    
    Write-Host "`n3️⃣ NETLIFY (Alternative - Free):" -ForegroundColor White
    Write-Host "   Step 1: Go to https://netlify.com" -ForegroundColor Gray
    Write-Host "   Step 2: Drag & drop 'dist' folder" -ForegroundColor Gray
    Write-Host "   Step 3: Add environment variable" -ForegroundColor Gray
    
    Write-Host "`n📋 QUICK GITHUB PAGES SETUP:" -ForegroundColor Yellow
    Write-Host "1. Create new repository on GitHub.com" -ForegroundColor White
    Write-Host "2. Run these commands:" -ForegroundColor White
    Write-Host "   git init" -ForegroundColor Gray
    Write-Host "   git add ." -ForegroundColor Gray
    Write-Host "   git commit -m 'Initial commit'" -ForegroundColor Gray
    Write-Host "   git branch -M main" -ForegroundColor Gray
    Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git" -ForegroundColor Gray
    Write-Host "   git push -u origin main" -ForegroundColor Gray
    Write-Host "3. Go to Settings > Pages > Source: Deploy from a branch > main" -ForegroundColor Gray
    Write-Host "4. Go to Settings > Secrets > Add VITE_GEMINI_API_KEY = AIzaSyBb5y91IiI5uLZ6wC6cPAIjO-ooVhvWNk4" -ForegroundColor Gray
    
    Write-Host "`n⚠️  IMPORTANT: Set environment variable in your hosting platform!" -ForegroundColor Red
    Write-Host "   VITE_GEMINI_API_KEY = AIzaSyBb5y91IiI5uLZ6wC6cPAIjO-ooVhvWNk4" -ForegroundColor Gray
    
    Write-Host "`n🎯 Your app will be live at: https://YOUR_USERNAME.github.io/YOUR_REPO" -ForegroundColor Green
    
} else {
    Write-Host "❌ Build failed. Check for errors above." -ForegroundColor Red
}

Write-Host "`n🎉 Ready for hackathon submission!" -ForegroundColor Green