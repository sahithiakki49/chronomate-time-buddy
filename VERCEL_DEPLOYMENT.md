# 🚀 ChronoMate Vercel Deployment Guide

## Quick Deploy to Vercel

### Step 1: Create GitHub Repository
1. Go to [GitHub.com](https://github.com)
2. Click "New repository"
3. Name: `chronomate-time-buddy`
4. Make it **Public**
5. Click "Create repository"

### Step 2: Push Code to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/chronomate-time-buddy.git
git push -u origin main
```

### Step 3: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your `chronomate-time-buddy` repository
5. Click "Deploy"

### Step 4: Add Environment Variable
1. Go to your Vercel project dashboard
2. Click "Settings" tab
3. Go to "Environment Variables"
4. Add new variable:
   - **Name**: `VITE_GEMINI_API_KEY`
   - **Value**: `AIzaSyBb5y91IiI5uLZ6wC6cPAIjO-ooVhvWNk4`
   - **Environment**: Production, Preview, Development
5. Click "Save"
6. Go to "Deployments" and click "Redeploy"

### Step 5: Your Live URL
Your app will be live at: `https://chronomate-time-buddy.vercel.app`

## Features You'll Have Live:
✅ AI Assistant with Gemini integration  
✅ Interactive Calendar with multiple views  
✅ Smart Todo List with AI suggestions  
✅ Push Notifications and voice alerts  
✅ Modern glassmorphism UI  
✅ Mobile responsive design  
✅ Professional domain  

## Troubleshooting:
- If build fails, check that `bun` is available in Vercel
- Ensure environment variable is set correctly
- Check Vercel logs for any errors

## Custom Domain (Optional):
1. Go to Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS settings as instructed

🎉 **Your ChronoMate AI Assistant will be live and ready for hackathon submission!** 