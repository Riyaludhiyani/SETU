#!/bin/bash

echo "============================================"
echo "SETU Platform - Quick Deploy Script"
echo "============================================"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: SETU platform ready for deployment"
    echo "✓ Git repository initialized"
    echo ""
    echo "Next steps:"
    echo "1. Create a repository on GitHub"
    echo "2. Run: git remote add origin YOUR_GITHUB_URL"
    echo "3. Run: git push -u origin main"
    echo "4. Follow DEPLOYMENT_GUIDE.md for platform deployment"
else
    echo "✓ Git repository already initialized"
    echo ""
    echo "To deploy:"
    echo "1. Push to GitHub: git push origin main"
    echo "2. Deploy backend to Render"
    echo "3. Deploy frontend to Vercel"
    echo "4. See DEPLOYMENT_GUIDE.md for details"
fi

echo ""
echo "============================================"
echo "Installation Status"
echo "============================================"

# Check backend dependencies
if [ -d "backend/node_modules" ]; then
    echo "✓ Backend dependencies installed"
else
    echo "✗ Backend dependencies not installed"
    echo "  Run: cd backend && npm install"
fi

# Check frontend dependencies
if [ -d "frontend/node_modules" ]; then
    echo "✓ Frontend dependencies installed"
else
    echo "✗ Frontend dependencies not installed"
    echo "  Run: cd frontend && npm install"
fi

echo ""
echo "For detailed deployment instructions, see:"
echo "  - DEPLOYMENT_GUIDE.md (Full guide)"
echo "  - DEPLOYMENT_CHECKLIST.md (Step-by-step checklist)"
echo "  - README.md (Project overview)"
echo ""
