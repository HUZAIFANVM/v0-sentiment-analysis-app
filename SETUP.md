# Sentiment Analysis Application - Setup Guide

This is a full-stack sentiment analysis application with a FastAPI backend and Next.js React frontend.

## Project Structure

\`\`\`
├── api/
│   └── main.py                 # FastAPI backend with sentiment analysis endpoints
├── components/
│   ├── sentiment-analyzer.tsx  # Main sentiment analysis component
│   ├── sentiment-result.tsx    # Result display component
│   ├── batch-analyzer.tsx      # Batch analysis component
│   ├── header.tsx              # Header component
│   └── ui/                     # shadcn/ui components
├── app/
│   ├── page.tsx                # Home page
│   ├── layout.tsx              # Root layout
│   ├── globals.css             # Global styles
│   └── api/
│       └── proxy/
│           └── route.ts        # API proxy endpoint
├── scripts/
│   └── create_model_placeholders.py  # Script to generate model files
└── models/                     # Directory for model files (created by script)
    ├── sentiment_model.pt      # PyTorch model
    └── stoi.pt                 # String-to-index vocabulary
\`\`\`

## Prerequisites

- Python 3.8+
- Node.js 18+
- pip (Python package manager)
- npm or yarn

## Installation & Setup

### 1. Backend Setup (FastAPI)

\`\`\`bash
# Install Python dependencies
pip install fastapi uvicorn torch pydantic python-multipart

# Create models directory and generate placeholder files
python scripts/create_model_placeholders.py

# Start the FastAPI server
python -m uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
\`\`\`

The backend will be available at `http://localhost:8000`

### 2. Frontend Setup (Next.js)

\`\`\`bash
# Install dependencies
npm install

# Create .env.local file with backend URL
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start the development server
npm run dev
\`\`\`

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Health Check
- **GET** `/health`
- Returns the status of the model and stoi loading

### Single Sentiment Prediction
- **POST** `/predict`
- Request body: `{ "text": "Your text here" }`
- Response: Sentiment prediction with confidence and probabilities

### Batch Sentiment Prediction
- **POST** `/batch-predict`
- Request body: `[{ "text": "Text 1" }, { "text": "Text 2" }]`
- Response: Array of sentiment predictions

## Features

- **Single Review Analysis**: Analyze individual customer reviews or feedback
- **Batch Analysis**: Process multiple reviews at once
- **Confidence Scores**: Get confidence percentages for predictions
- **Probability Breakdown**: See detailed positive/negative probability distributions
- **Vocabulary Coverage**: Track how many words in the input are in the model's vocabulary
- **Real-time Analysis**: Instant sentiment classification

## Model Information

The placeholder model is a bidirectional LSTM neural network with:
- Embedding layer (100 dimensions)
- Bidirectional LSTM (128 hidden units)
- Fully connected layers for classification
- Dropout for regularization
- Binary classification (Negative/Positive)

The vocabulary includes common English words and special tokens for padding and unknown words.

## Customization

### Using Your Own Model

To use your own trained model:

1. Replace `models/sentiment_model.pt` with your model file
2. Replace `models/stoi.pt` with your vocabulary dictionary
3. Ensure your model outputs logits for binary classification
4. Update the `MAX_LEN` constant in `api/main.py` if needed

### Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API URL (default: `http://localhost:8000`)
- `MODEL_PATH`: Path to the PyTorch model file (default: `models/sentiment_model.pt`)
- `STOI_PATH`: Path to the vocabulary file (default: `models/stoi.pt`)

## Troubleshooting

### Backend Connection Issues
- Ensure FastAPI server is running on port 8000
- Check that `NEXT_PUBLIC_API_URL` is correctly set in `.env.local`
- Verify CORS is enabled in the FastAPI app

### Model Loading Errors
- Run `python scripts/create_model_placeholders.py` to generate placeholder files
- Check that the `models/` directory exists
- Verify file permissions for model files

### Port Already in Use
- FastAPI: `lsof -i :8000` and kill the process, or use a different port
- Next.js: `lsof -i :3000` and kill the process, or use a different port

## Development

### Running Tests
\`\`\`bash
# Frontend tests
npm test

# Backend tests
pytest api/
\`\`\`

### Building for Production
\`\`\`bash
# Frontend build
npm run build
npm start

# Backend production
gunicorn -w 4 -k uvicorn.workers.UvicornWorker api.main:app
\`\`\`

## License

MIT
