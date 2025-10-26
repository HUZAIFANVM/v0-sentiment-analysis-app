# Deployment Guide

## Frontend Deployment (Vercel)

The Next.js frontend is deployed to Vercel automatically. No additional setup needed.

## Backend Deployment (Separate Server)

Since PyTorch is memory-intensive, the FastAPI backend must run on a separate server.

### Option 1: Run Locally (Development)

\`\`\`bash
# Install dependencies
pip install -r requirements.txt

# Run the backend
python -m uvicorn api.main:app --reload --port 8000
\`\`\`

Then set `NEXT_PUBLIC_API_URL=http://localhost:8000` in your `.env.local`

### Option 2: Deploy to Railway, Render, or Heroku

1. Create a new project on [Railway](https://railway.app), [Render](https://render.com), or [Heroku](https://heroku.com)
2. Connect your GitHub repository
3. Set the start command to: `python -m uvicorn api.main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables if needed
5. Deploy and get your backend URL (e.g., `https://your-backend.railway.app`)
6. Update `NEXT_PUBLIC_API_URL` in Vercel project settings to point to your backend

### Option 3: Docker Deployment

\`\`\`bash
docker build -t sentiment-api .
docker run -p 8000:8000 sentiment-api
\`\`\`

## Environment Variables

Set these in your Vercel project settings:

- `NEXT_PUBLIC_API_URL` - Your backend URL (e.g., `https://your-backend.railway.app` or `http://localhost:8000`)

## Model Files

Your model files (`sentiment_model.pt` and `stoi.pt`) are stored in the `models/` directory and will be loaded by the backend when it starts.
\`\`\`

```env.local file=".env.local"
# <CHANGE> Updated to use a placeholder for backend URL
# For local development, use: http://localhost:8000
# For production, use your deployed backend URL
NEXT_PUBLIC_API_URL=http://localhost:8000
