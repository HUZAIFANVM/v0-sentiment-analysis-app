# Build stage
# Build stage
FROM python:3.11-slim as backend

WORKDIR /app

# Install git and git-lfs (to fetch large model files)

# Install Python dependencies
COPY requirements-backend.txt .
RUN pip install --no-cache-dir -r requirements-backend.txt


# Copy API code and models
COPY api/ ./api/
COPY models/ ./models/

EXPOSE 8000

# Run the FastAPI app using uvicorn
CMD ["python", "-m", "uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]

