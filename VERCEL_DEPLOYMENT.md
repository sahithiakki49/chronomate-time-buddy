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

## 🔧 **How to Fix: Use Direct Environment Variable Instead**

### **Option 1: Easiest Fix (Recommended)**
1. **Go to your Vercel project dashboard**
2. Click **Settings** → **Environment Variables**
3. **Add a new variable:**
   - **Name:** `VITE_GEMINI_API_KEY`
   - **Value:** `AIzaSyBb5y91IiI5uLZ6wC6cPAIjO-ooVhvWNk4`
   - **Environment:** Select all (Production, Preview, Development)
4. **Save**
5. **Remove or edit the `env` section in your `vercel.json`** so it looks like this:
   ```json
   "env": {
     "VITE_GEMINI_API_KEY": ""
   },
   ```
   Or you can **delete the `env` section entirely** from `vercel.json` (Vercel will use the dashboard value).

6. **Redeploy your project** on Vercel.

---

### **Option 2: Advanced (If you want to use Vercel Secrets)**
1. In your terminal, run:
   ```bash
   vercel env add VITE_GEMINI_API_KEY
   ```
   and follow the prompts to add the value.
2. Or, run:
   ```bash
   vercel secrets add vite_gemini_api_key AIzaSyBb5y91IiI5uLZ6wC6cPAIjO-ooVhvWNk4
   ```
   Then redeploy.

---

## **Summary**
- The error means Vercel is looking for a secret called `vite_gemini_api_key` but can't find it.
- The **easiest fix** is to set the environment variable directly in the Vercel dashboard and remove the reference to the secret in `vercel.json`.

---

**Would you like me to update your `vercel.json` for you?**  
Or do you want to try the dashboard method first? 