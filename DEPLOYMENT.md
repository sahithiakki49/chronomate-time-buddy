# ChronoMate Deployment Guide

## 🚀 Quick Start

Your ChronoMate application is now running locally! Here's how to access and deploy it:

### Local Development
- **URL**: http://localhost:5173 (or the port shown in your terminal)
- **Status**: ✅ Running with Gemini AI integration
- **API Key**: ✅ Configured and ready

## 🌐 Deployment Options

### Option 1: Deploy to Vercel (Recommended)

#### Step 1: Prepare for Deployment
```bash
# Build the application
C:\Users\prane\.bun\bin\bun.exe run build
```

#### Step 2: Deploy to Vercel
1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Set Environment Variables in Vercel Dashboard**:
   - Go to your project in Vercel dashboard
   - Navigate to Settings → Environment Variables
   - Add: `VITE_GEMINI_API_KEY` = `AIzaSyBb5y91IiI5uLZ6wC6cPAIjO-ooVhvWNk4`

### Option 2: Deploy to Netlify

#### Step 1: Build
```bash
C:\Users\prane\.bun\bin\bun.exe run build
```

#### Step 2: Deploy
1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy**:
   ```bash
   netlify deploy --prod --dir=dist
   ```

3. **Set Environment Variables**:
   - Go to Netlify dashboard → Site settings → Environment variables
   - Add: `VITE_GEMINI_API_KEY` = `AIzaSyBb5y91IiI5uLZ6wC6cPAIjO-ooVhvWNk4`

### Option 3: Deploy to GitHub Pages

#### Step 1: Create GitHub Repository
1. Create a new repository on GitHub
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/chronomate.git
   git push -u origin main
   ```

#### Step 2: Configure GitHub Pages
1. Go to repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: main, folder: / (root)
4. Add GitHub Actions workflow for build

#### Step 3: Create GitHub Actions Workflow
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Bun
      uses: oven-sh/setup-bun@v1
      with:
        bun-version: latest
    
    - name: Install dependencies
      run: bun install
    
    - name: Build
      run: bun run build
      env:
        VITE_GEMINI_API_KEY: ${{ secrets.VITE_GEMINI_API_KEY }}
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

4. **Add Secret**: Go to repository Settings → Secrets → Add `VITE_GEMINI_API_KEY`

## 🔧 Environment Variables

### Required for Production
```env
VITE_GEMINI_API_KEY=AIzaSyBb5y91IiI5uLZ6wC6cPAIjO-ooVhvWNk4
```

### Optional
```env
VITE_ENABLE_VOICE=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_AI_INSIGHTS=true
```

## 📱 Testing Your Deployment

### Local Testing
1. Open http://localhost:5173
2. Test AI Assistant: "Remind me to drink water every 2 hours"
3. Test Calendar: Click on any date to add events
4. Test Todo List: Add a new task
5. Test Notifications: Allow browser notifications

### Production Testing
1. Visit your deployed URL
2. Test all features as above
3. Check browser console for any errors
4. Verify API key is working

## 🐛 Troubleshooting

### Common Issues

#### 1. API Key Not Working
- **Symptom**: AI assistant not responding
- **Solution**: 
  - Check environment variable is set correctly
  - Verify API key has proper permissions
  - Check browser console for errors

#### 2. Build Errors
- **Symptom**: Build fails during deployment
- **Solution**:
  - Run `bun install` to ensure all dependencies are installed
  - Check for TypeScript errors: `bun run lint`
  - Verify all imports are correct

#### 3. Notifications Not Working
- **Symptom**: No browser notifications
- **Solution**:
  - Check browser notification permissions
  - Ensure HTTPS is enabled (required for notifications)
  - Test in Chrome/Edge for best compatibility

#### 4. Voice Not Working
- **Symptom**: Voice input/output not functioning
- **Solution**:
  - Check microphone permissions
  - Ensure HTTPS is enabled
  - Test in Chrome/Edge

### Performance Optimization

#### 1. Bundle Size
- Current bundle size should be optimized
- Consider code splitting for large components
- Use lazy loading for non-critical features

#### 2. Loading Speed
- Enable gzip compression on your hosting provider
- Use CDN for static assets
- Optimize images and animations

## 🎯 Hackathon Submission Checklist

### ✅ Technical Requirements
- [x] AI Integration (Gemini API)
- [x] Interactive Calendar
- [x] Smart Todo List
- [x] Push Notifications
- [x] Voice Input/Output
- [x] Responsive Design
- [x] Modern UI/UX

### ✅ Documentation
- [x] README with setup instructions
- [x] API documentation
- [x] Deployment guide
- [x] Troubleshooting guide

### ✅ Demo Preparation
- [ ] Record demo video showing all features
- [ ] Prepare live demo environment
- [ ] Test all features thoroughly
- [ ] Prepare presentation slides

## 🚀 Final Steps

1. **Test Everything**: Ensure all features work in production
2. **Record Demo**: Create a compelling demo video
3. **Prepare Pitch**: Highlight the AI capabilities and innovation
4. **Submit**: Follow hackathon submission guidelines

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section
2. Review browser console for errors
3. Verify environment variables are set
4. Test in different browsers

---

**Your ChronoMate application is ready for hackathon submission!** 🎉

**Live URL**: [Your deployed URL here]
**Features**: AI Assistant, Visual Calendar, Smart Todo List, Notifications, Voice Support
**Innovation**: Context-aware AI with emotional intelligence and proactive assistance 