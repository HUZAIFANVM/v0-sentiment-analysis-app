"""
Script to create placeholder model and stoi files for sentiment analysis.
This creates a simple neural network model and vocabulary dictionary.
"""

import torch
import torch.nn as nn
import os
from pathlib import Path

# Create models directory
models_dir = Path("models")
models_dir.mkdir(exist_ok=True)

# Define a simple sentiment analysis model
class SentimentModel(nn.Module):
    def __init__(self, vocab_size, embedding_dim=100, hidden_dim=128):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embedding_dim, padding_idx=0)
        self.lstm = nn.LSTM(embedding_dim, hidden_dim, batch_first=True, bidirectional=True)
        self.fc1 = nn.Linear(hidden_dim * 2, 64)
        self.fc2 = nn.Linear(64, 2)  # Binary classification: Negative (0) or Positive (1)
        self.dropout = nn.Dropout(0.3)
        self.relu = nn.ReLU()
    
    def forward(self, x):
        embedded = self.dropout(self.embedding(x))
        lstm_out, _ = self.lstm(embedded)
        # Use the last output
        last_output = lstm_out[:, -1, :]
        hidden = self.relu(self.fc1(last_output))
        hidden = self.dropout(hidden)
        logits = self.fc2(hidden)
        return logits

# Create a vocabulary (stoi - string to index mapping)
# This includes common words and special tokens
common_words = [
    "the", "a", "and", "to", "of", "in", "is", "it", "that", "for",
    "was", "on", "be", "with", "as", "by", "at", "from", "or", "an",
    "this", "but", "his", "not", "are", "have", "has", "had", "do", "does",
    "good", "great", "excellent", "amazing", "wonderful", "fantastic", "love", "best",
    "bad", "terrible", "awful", "horrible", "hate", "worst", "poor", "disappointing",
    "product", "service", "quality", "price", "value", "customer", "support", "delivery",
    "fast", "slow", "easy", "difficult", "simple", "complex", "clean", "dirty",
    "new", "old", "broken", "working", "perfect", "fine", "okay", "okay",
    "highly", "very", "really", "quite", "extremely", "absolutely", "definitely", "probably",
    "recommend", "would", "should", "could", "will", "can", "may", "might"
]

stoi = {
    "<PAD>": 0,
    "<UNK>": 1,
}

# Add common words to vocabulary
for idx, word in enumerate(common_words, start=2):
    stoi[word] = idx

vocab_size = len(stoi)

print(f"[v0] Creating sentiment model with vocabulary size: {vocab_size}")

# Create and save the model
model = SentimentModel(vocab_size=vocab_size)
model_path = models_dir / "sentiment_model.pt"
torch.save(model, model_path)
print(f"[v0] Model saved to {model_path}")

# Save the stoi dictionary
stoi_path = models_dir / "stoi.pt"
torch.save(stoi, stoi_path)
print(f"[v0] Stoi dictionary saved to {stoi_path}")

print(f"[v0] Placeholder files created successfully!")
print(f"[v0] Model path: {model_path}")
print(f"[v0] Stoi path: {stoi_path}")
print(f"[v0] Vocabulary size: {vocab_size}")
