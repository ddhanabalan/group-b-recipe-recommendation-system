FROM python:3.12

WORKDIR /app

RUN apt-get update && apt-get install -y python3-dev default-libmysqlclient-dev build-essential pkg-config && \
   rm -rf /var/lib/apt/lists/*

COPY ./requirements.txt /app/

# #RUN pip install --no-cache-dir -r baserequirements.txt
# # RUN pipenv install --system --deploy
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

EXPOSE 8000

# CMD ["python", "manage.py","runserver"]