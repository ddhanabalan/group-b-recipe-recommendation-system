# FROM python:3.12-slim

# WORKDIR /app

# RUN apt-get update && apt-get install -y python3-dev default-libmysqlclient-dev build-essential pkg-config && \
#    rm -rf /var/lib/apt/lists/*

# COPY ./requirements.txt /app/

# # #RUN pip install --no-cache-dir -r baserequirements.txt
# # # RUN pipenv install --system --deploy
# RUN pip install --no-cache-dir -r requirements.txt

# # Download NLTK 'punkt' , 'wordnet' and 'stopwords' data
# RUN python -m nltk.downloader punkt wordnet stopwords

# COPY . /app

# EXPOSE 8000

# # CMD ["python", "manage.py","runserver"]

FROM python:3.12-slim

# Create a non-root user
RUN useradd -ms /bin/bash celeryuser

WORKDIR /app

RUN apt-get update && apt-get install -y python3-dev default-libmysqlclient-dev build-essential pkg-config && \
   rm -rf /var/lib/apt/lists/*

COPY ./requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Download NLTK data
RUN mkdir -p /usr/share/nltk_data && \
    python -m nltk.downloader -d /usr/share/nltk_data punkt wordnet stopwords

COPY . /app

# Change ownership of the application files
RUN chown -R celeryuser:celeryuser /app

# Switch to the non-root user
USER celeryuser

EXPOSE 8000
