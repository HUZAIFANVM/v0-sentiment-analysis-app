# Backend Setup Guide

Since the FastAPI backend with PyTorch is too memory-intensive for Vercel's serverless environment, you need to run it separately.

## Option 1: Run Locally (Development)

\`\`\`bash
# Install Python dependencies
pip install fastapi uvicorn pydantic python-multipart torch

# Run the backend
python -m uvicorn api.main:app --reload --port 8000
\`\`\`

Then set `NEXT_PUBLIC_API_URL=http://localhost:8000` in your `.env.local`

## Option 2: Deploy Backend to Railway

1. Go to https://railway.app
2. Create a new project
3. Connect your GitHub repository
4. Add environment variables if needed
5. Railway will automatically detect and run the FastAPI app

## Option 3: Deploy Backend to Render

1. Go to https://render.com
2. Create a new Web Service
3. Connect your GitHub repository
4. Set the build command: `pip install -r requirements-backend.txt`
5. Set the start command: `uvicorn api.main:app --host 0.0.0.0 --port 8000`

## Option 4: Run with Docker Locally

\`\`\`bash
docker build -t sentiment-api .
docker run -p 8000:8000 sentiment-api
\`\`\`

## Environment Variables

Set `NEXT_PUBLIC_API_URL` in your Vercel project settings to point to your backend:
- Local: `http://localhost:8000`
- Railway/Render: `https://your-backend-url.railway.app` or `https://your-backend-url.onrender.com`
