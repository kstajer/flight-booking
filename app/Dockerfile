FROM  python:3.8.13-bullseye

ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN pip install django django-cors-headers djangorestframework python-dateutil

COPY . . 

EXPOSE 8000