# Create .env file with Gemini API key
$envContent = @"
# Google Gemini API Key
VITE_GEMINI_API_KEY=AIzaSyBb5y91IiI5uLZ6wC6cPAIjO-ooVhvWNk4

# Optional: Enable/disable features
VITE_ENABLE_VOICE=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_AI_INSIGHTS=true
"@

$envContent | Out-File -FilePath ".env" -Encoding UTF8
Write-Host "Environment file created successfully!" -ForegroundColor Green 