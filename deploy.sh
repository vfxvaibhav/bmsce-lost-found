#!/bin/bash

# BMSCE Lost & Found - One-Click Deployment Guide

echo "🚀 BMSCE Lost & Found - Production Deployment"
echo "=============================================="

echo ""
echo "📋 STEP 1: Create MongoDB Atlas Account"
echo "1. Go to: https://www.mongodb.com/atlas"
echo "2. Sign up for free account"
echo "3. Create new cluster (free tier)"
echo "4. Get connection string"
echo ""

echo "📋 STEP 2: Deploy to Vercel"
echo "1. Go to: https://vercel.com"
echo "2. Sign up with GitHub"
echo "3. Import this repository"
echo "4. Set environment variables:"
echo "   MONGODB_URI=your_atlas_connection_string"
echo "   JWT_SECRET=BMSCE_LostFound_SuperSecret_ProductionKey_2024"
echo "   NODE_ENV=production"
echo "   NEXT_PUBLIC_API_URL=https://your-app.vercel.app/api"
echo ""

echo "📋 STEP 3: Initialize Database"
echo "1. After deployment, run production seed"
echo "2. Admin will be created automatically"
echo ""

echo "✅ READY TO GO!"
echo "Admin Login: admin@bmsce.ac.in / admin123"
echo "Student Login: arjun.kumar@bmsce.ac.in / student123"