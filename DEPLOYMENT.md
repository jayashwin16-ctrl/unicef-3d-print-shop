# How to Host Your UNICEF 3D Print Shop

## Option 1: Vercel (Easiest - Recommended) ⭐

### Steps:

1. **Create a GitHub account** (if you don't have one):
   - Go to https://github.com
   - Sign up for free

2. **Push your code to GitHub**:
   ```bash
   # In your project folder
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

3. **Deploy to Vercel**:
   - Go to https://vercel.com
   - Sign up with GitHub (free)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite settings
   - Click "Deploy"
   - Your site will be live in ~2 minutes!

4. **Your site URL**:
   - Vercel gives you a free URL like: `your-project.vercel.app`
   - You can add a custom domain later

### Benefits:
- ✅ Free forever
- ✅ Automatic deployments when you push to GitHub
- ✅ Fast global CDN
- ✅ HTTPS included
- ✅ Easy to update

---

## Option 2: Netlify

### Steps:

1. **Push to GitHub** (same as Vercel step 1-2)

2. **Deploy to Netlify**:
   - Go to https://netlify.com
   - Sign up with GitHub
   - Click "Add new site" → "Import an existing project"
   - Select your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy site"

3. **Your site URL**:
   - Netlify gives you: `your-project.netlify.app`

### Benefits:
- ✅ Free tier available
- ✅ Easy drag-and-drop option too
- ✅ Form handling available

---

## Option 3: GitHub Pages

### Steps:

1. **Install gh-pages package**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**:
   Add to scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```
   Add homepage:
   ```json
   "homepage": "https://YOUR_USERNAME.github.io/unicef-3d-print-shop"
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

4. **Enable GitHub Pages**:
   - Go to your repo → Settings → Pages
   - Source: `gh-pages` branch
   - Your site: `YOUR_USERNAME.github.io/unicef-3d-print-shop`

### Benefits:
- ✅ Free
- ✅ Integrated with GitHub
- ⚠️ Requires React Router config (see below)

---

## Important: React Router Setup for Static Hosting

If using GitHub Pages or any static hosting, you need to update `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/unicef-3d-print-shop/", // Change to your repo name or "/" for root
});
```

For Vercel/Netlify, you don't need this - they handle routing automatically.

---

## Quick Comparison

| Platform | Ease | Free | Custom Domain | Best For |
|----------|------|------|---------------|----------|
| **Vercel** | ⭐⭐⭐⭐⭐ | Yes | Yes | React/Vite apps |
| **Netlify** | ⭐⭐⭐⭐ | Yes | Yes | General web apps |
| **GitHub Pages** | ⭐⭐⭐ | Yes | Yes | Open source projects |

---

## After Deployment

1. **Test your site**: Visit the URL and check all pages work
2. **Update images**: Make sure all photos in `/Photos/` are uploaded
3. **Custom domain** (optional): Add your own domain in platform settings
4. **Share**: Share your live URL!

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com
- GitHub Pages: https://pages.github.com
