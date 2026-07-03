# GitHub Deployment Guide
## Deploy Your Website to GitHub Pages

**Goal:** Host your website on GitHub Pages with free deployment and custom domain support

---

## PART 1: CREATE GITHUB ACCOUNT & REPOSITORY

### Step 1: Create GitHub Account (if you don't have one)

1. Go to **GitHub.com** → https://github.com/signup
2. Enter:
   - Username: `selflovesalon` (or your choice)
   - Email: Your Gmail account
   - Password: Strong password
3. Click **"Create account"**
4. Verify your email

### Step 2: Create Repository

1. After login, click **"New"** button (top left)
2. Name it: **`selflovesalon.github.io`** (EXACT - this is required for GitHub Pages)
3. Description: "Self-Love Beauty Salon booking website"
4. Select **"Public"** (required for free GitHub Pages)
5. Check **"Add a README file"**
6. Click **"Create repository"**

### Step 3: Important Repository Settings

1. Go to your repo → **Settings** tab
2. Scroll to **"GitHub Pages"** section
3. Source: Should show "Deploy from a branch"
4. Branch: Select **"main"** and **"/root"**
5. Click **"Save"**
6. Your site will be live at: `https://selflovesalon.github.io`

---

## PART 2: UPLOAD YOUR FILES

### Step 4: Add Your Website Files

**Option A: Upload via GitHub Web Interface (Easy)**

1. In your repo, click **"Add file"** → **"Upload files"**
2. Drag and drop these files:
   - ✅ `index.html` (your main website)
   - ✅ `testimonials.json` (testimonials data)
   - ✅ `assets/` folder (all images)
3. Scroll down and click **"Commit changes"**

**Option B: Use Git Command Line (Advanced)**

```bash
# On your computer, navigate to your project folder
cd C:\Users\lihlo\OneDrive\Desktop\SelfLoveSys

# Initialize git
git init

# Add GitHub as remote (replace username)
git remote add origin https://github.com/YOUR_USERNAME/selflovesalon.github.io.git

# Add all files
git add .

# Commit files
git commit -m "Initial commit: Self-Love Beauty Salon website"

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 5: Verify Files Are Uploaded

1. Go to your repo home page
2. You should see your files listed:
   - index.html
   - testimonials.json
   - assets/ folder
   - BACKEND_SETUP_GUIDE.md
   - GITHUB_DEPLOYMENT_GUIDE.md
   - etc.

---

## PART 3: CONFIGURE FOR GITHUB PAGES

### Step 6: Create a .gitignore file (Optional but recommended)

1. Click **"Add file"** → **"Create new file"**
2. Name: `.gitignore`
3. Paste this content:
```
# OS files
.DS_Store
Thumbs.db

# Editor files
.vscode/
.idea/
*.swp

# Logs
*.log

# Don't commit sensitive files
.env
secrets.json
```
4. Commit the file

### Step 7: Verify Website is Live

1. Wait 2-3 minutes for GitHub Pages to deploy
2. Visit: **`https://selflovesalon.github.io`**
3. Your website should be live! 🎉

---

## PART 4: UPDATE YOUR BACKEND ENDPOINT

### Step 8: Update the Apps Script URL in GitHub

1. Go back to your repo
2. Click on **`index.html`**
3. Click the **✏️ (Edit)** button
4. Find the line:
```javascript
const BACKEND_ENDPOINT = '/api/bookings';
```
5. Replace with your Google Apps Script URL (from Backend Setup Step 8):
```javascript
const BACKEND_ENDPOINT = 'https://script.googleapis.com/macros/s/YOUR_DEPLOYMENT_ID/useless';
```
6. Scroll down and click **"Commit changes"**
7. Wait 1 minute for GitHub Pages to redeploy

---

## PART 5: CUSTOM DOMAIN (OPTIONAL)

### Step 9: Use a Custom Domain

If you want `selflovesalon.com` instead of `selflovesalon.github.io`:

#### Buy a Domain
1. Go to **Namecheap**, **GoDaddy**, or **Google Domains**
2. Buy your domain: `selflovesalon.com`

#### Configure DNS
1. In your domain registrar, go to DNS settings
2. Add these DNS records:

| Type | Name | Value |
|------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | selflovesalon.github.io |

#### Configure GitHub
1. Go to your repo → **Settings**
2. Scroll to **"GitHub Pages"**
3. Under **"Custom domain"**, enter: `selflovesalon.com`
4. Check **"Enforce HTTPS"**
5. Click **"Save"**

Your site is now accessible at: `https://selflovesalon.com` ✅

---

## PART 6: MANAGE YOUR REPOSITORY

### Step 10: Update Files After Changes

Whenever you make changes to your website:

**Option A: Using GitHub Web Interface**
1. Click on the file you want to edit
2. Click **✏️ (Edit)**
3. Make changes
4. Click **"Commit changes"**

**Option B: Using Git Command Line**
```bash
cd C:\Users\lihlo\OneDrive\Desktop\SelfLoveSys

# Make your changes to files...

git add .
git commit -m "Update description here"
git push
```

GitHub Pages automatically redeploys with your changes within 1-2 minutes.

---

## PART 7: BACKUP YOUR FILES

### Step 11: Clone Your Repository (Backup)

To backup your files from GitHub:

```bash
git clone https://github.com/YOUR_USERNAME/selflovesalon.github.io.git
```

This creates a copy of everything on your computer.

---

## DEPLOYMENT CHECKLIST

- [ ] GitHub account created
- [ ] Repository created as `selflovesalon.github.io`
- [ ] Files uploaded (index.html, assets, etc.)
- [ ] Website live at `https://selflovesalon.github.io`
- [ ] Backend endpoint updated in index.html
- [ ] Google Apps Script backend working (test a booking)
- [ ] Booking appears in Google Sheets
- [ ] Calendar event created
- [ ] Confirmation email received
- [ ] (Optional) Custom domain configured

---

## TROUBLESHOOTING

### Problem: "404 - Page not found" on GitHub Pages
**Solution:**
1. Make sure repository name is exactly: `selflovesalon.github.io`
2. Make sure `index.html` is in the root directory (not in a subfolder)
3. Go to Settings → Pages → verify "Deploy from a branch" is selected with "main"
4. Wait 2-3 minutes and refresh

### Problem: Website loads but has no styling
**Solution:**
1. Check browser console (F12) for errors
2. Make sure all CSS is in the `<style>` tag in index.html
3. Make sure images path is correct (use relative paths like `assets/images/...`)

### Problem: Bookings not submitting
**Solution:**
1. Check the browser console (F12) for errors
2. Verify backend endpoint URL is correct in index.html
3. Make sure Google Apps Script deployment is "Anyone" access
4. Test the backend using the `testBackend()` function in Apps Script

### Problem: GitHub Pages says "Enforces HTTPS" but I'm getting SSL errors
**Solution:**
1. Go to repo Settings → Pages
2. Uncheck "Enforce HTTPS"
3. Wait 5 minutes
4. Check it again
5. GitHub will auto-provision SSL certificate
6. Check "Enforce HTTPS" again

---

## CONTINUOUS DEPLOYMENT WORKFLOW

Once everything is set up, here's your workflow:

1. **Make changes locally** - Edit files on your computer
2. **Test locally** - Open index.html in browser
3. **Push to GitHub** - Use git command or GitHub web interface
4. **Live update** - Website updates within 1-2 minutes
5. **Verify** - Visit `https://selflovesalon.github.io` to see changes

---

## NEXT STEPS

✅ **Backend Setup Complete** (from BACKEND_SETUP_GUIDE.md)
✅ **GitHub Deployment Complete** (this guide)

**Optional Enhancements:**
- [ ] Add a contact form
- [ ] Add testimonials section
- [ ] Add Instagram feed integration
- [ ] Add WhatsApp chat widget
- [ ] Add payment processing (Stripe/PayFast)

---

## USEFUL LINKS

- **GitHub:** https://github.com
- **Google Sheets:** https://sheets.google.com
- **Google Calendar:** https://calendar.google.com
- **Google Apps Script:** https://script.google.com
- **GitHub Pages Documentation:** https://pages.github.com
- **Git Documentation:** https://git-scm.com/doc

---

**Your website is now LIVE and AUTOMATED! 🎉**

Bookings → Website Form → Google Apps Script → Google Sheets + Google Calendar + Confirmation Email

All in one click!
