from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
import os
from pathlib import Path

app = FastAPI(title="Sentiment Analysis API")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
MAX_LEN = 128
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Global variables for model and stoi
model = None
stoi = None

class SentimentRequest(BaseModel):
    text: str

class SentimentResponse(BaseModel):
    text: str
    sentiment: str
    confidence: float
    probabilities: dict
    vocab_coverage: float

def simple_tokenize(text):
    """Simple tokenization - split by whitespace and lowercase"""
    return text.lower().split()

def load_model_and_stoi():
    """Load model and stoi from files"""
    global model, stoi
    
    try:
        model_path = os.getenv("MODEL_PATH", "models/sentiment_model.pt")
        stoi_path = os.getenv("STOI_PATH", "models/stoi.pt")
        
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at {model_path}")
        if not os.path.exists(stoi_path):
            raise FileNotFoundError(f"Stoi file not found at {stoi_path}")
        
        # Load stoi dictionary
        stoi = torch.load(stoi_path, map_location=DEVICE)
        
        # Load model - placeholder for your actual model architecture
        # You'll need to define your model class here
        model = torch.load(model_path, map_location=DEVICE)
        model.eval()
        
        print("Model and stoi loaded successfully")
    except Exception as e:
        print(f"Error loading model: {e}")
        raise

@app.on_event("startup")
async def startup_event():
    """Load model on startup"""
    load_model_and_stoi()

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "stoi_loaded": stoi is not None
    }

@app.post("/predict", response_model=SentimentResponse)
async def predict_sentiment(request: SentimentRequest):
    """Predict sentiment for a given text"""
    
    if model is None or stoi is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        text = request.text.strip()
        if not text:
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        # Tokenize
        tokens = simple_tokenize(text)
        known = sum([1 for t in tokens if t in stoi])
        coverage = 100 * known / len(tokens) if tokens else 0
        
        # Convert tokens to indices
        indices = [stoi.get(t, stoi.get("<UNK>", 0)) for t in tokens]
        
        # Pad or truncate
        if len(indices) < MAX_LEN:
            indices += [stoi.get("<PAD>", 0)] * (MAX_LEN - len(indices))
        else:
            indices = indices[:MAX_LEN]
        
        # Prepare tensor
        xb = torch.tensor([indices]).to(DEVICE)
        
        # Predict
        with torch.no_grad():
            logits = model(xb)
            probs = torch.softmax(logits, dim=1)
            pred = torch.argmax(probs, dim=1).item()
        
        labels = ["Negative", "Positive"]
        sentiment = labels[pred]
        
        # Get probabilities
        prob_values = probs[0].cpu().numpy()
        probabilities = {
            "negative": float(prob_values[0]),
            "positive": float(prob_values[1])
        }
        
        confidence = float(prob_values[pred])
        
        return SentimentResponse(
            text=text,
            sentiment=sentiment,
            confidence=confidence,
            probabilities=probabilities,
            vocab_coverage=coverage
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/batch-predict")
async def batch_predict(requests: list[SentimentRequest]):
    """Predict sentiment for multiple texts"""
    results = []
    for req in requests:
        result = await predict_sentiment(req)
        results.append(result)
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
