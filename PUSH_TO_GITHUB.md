# Quick Guide: Push to GitHub with PAT Token

## Step-by-Step Commands

### 1. Create Repository on GitHub First
- Go to: https://github.com/new
- Repository name: `unicef-3d-print-shop`
- Make it **Public** or **Private** (your choice)
- **Don't** check "Add a README file"
- Click "Create repository"

### 2. Push Your Code

Run these commands in your terminal:

```bash
# Navigate to your project
cd /Users/jay/Documents/code/cursorprojects/unicef-3d-print-shop

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit"

# Set main branch
git branch -M main

# Add remote (replace YOUR_USERNAME and YOUR_PAT_TOKEN)
git remote add origin https://YOUR_PAT_TOKEN@github.com/YOUR_USERNAME/unicef-3d-print-shop.git

# Push to GitHub
git push -u origin main
```

## Example

If your GitHub username is `johndoe` and your PAT token is `ghp_abc123xyz...`:

```bash
git remote add origin https://ghp_abc123xyz...@github.com/johndoe/unicef-3d-print-shop.git
git push -u origin main
```

## Alternative: Enter Token When Prompted

If you prefer not to put the token in the URL:

```bash
git remote add origin https://github.com/YOUR_USERNAME/unicef-3d-print-shop.git
git push -u origin main
```

When prompted:
- **Username**: Your GitHub username
- **Password**: Paste your PAT token (not your GitHub password)

## Troubleshooting

**Error: "remote origin already exists"**
```bash
git remote remove origin
# Then add it again with the command above
```

**Error: "Authentication failed"**
- Make sure your PAT token has `repo` scope
- Check that the token hasn't expired
- Verify your username is correct

**Error: "Repository not found"**
- Make sure you created the repository on GitHub first
- Check the repository name matches exactly
