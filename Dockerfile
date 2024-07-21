FROM python:3.12-slim

# Set environment variables. This prevents Python from writing pyc files to disc
# and buffers stdout and stderr.
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install pip requirements
WORKDIR /app

COPY ./requirements.txt requirements.txt


ADD --chmod=755 https://astral.sh/uv/install.sh install.sh
RUN apt-get update && apt-get install -y curl && chmod +x ./install.sh && ./install.sh && rm ./install.sh
 
COPY requirements.txt /requirements.txt
 
RUN /root/.cargo/bin/uv pip install --system --no-cache -r requirements.txt
# Copy the FastAPI application code
COPY ./app.py app.py

# Run the application with gunicorn and uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0"]
