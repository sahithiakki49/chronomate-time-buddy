# ChronoMate Deployment Script

Write-Host "🚀 ChronoMate Deployment Helper" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

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
Write-Host "`n🔨 Building application..." -ForegroundColor Yellow
C:\Users\prane\.bun\bin\bun.exe run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    Write-Host "`n📁 Build files are in the 'dist' folder" -ForegroundColor Cyan
    
    Write-Host "`n🌐 Deployment Options:" -ForegroundColor Yellow
    Write-Host "1. Vercel (Recommended):" -ForegroundColor White
    Write-Host "   npm install -g vercel" -ForegroundColor Gray
    Write-Host "   vercel" -ForegroundColor Gray
    
    Write-Host "`n2. Netlify:" -ForegroundColor White
    Write-Host "   npm install -g netlify-cli" -ForegroundColor Gray
    Write-Host "   netlify deploy --prod --dir=dist" -ForegroundColor Gray
    
    Write-Host "`n3. GitHub Pages:" -ForegroundColor White
    Write-Host "   Push to GitHub and enable Pages in settings" -ForegroundColor Gray
    
    Write-Host "`n⚠️  Remember to set environment variables in your hosting platform!" -ForegroundColor Red
    Write-Host "   VITE_GEMINI_API_KEY=AIzaSyBb5y91IiI5uLZ6wC6cPAIjO-ooVhvWNk4" -ForegroundColor Gray
    
} else {
    Write-Host "❌ Build failed. Check for errors above." -ForegroundColor Red
}

Write-Host "`n🎉 Ready for hackathon submission!" -ForegroundColor Green 