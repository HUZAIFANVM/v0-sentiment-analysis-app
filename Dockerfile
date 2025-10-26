# Build stage
FROM python:3.11-slim as backend

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy API code
COPY api/ ./api/
COPY models/ ./models/

EXPOSE 8000

CMD ["python", "-m", "uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
