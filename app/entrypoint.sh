#!/bin/bash
export DJANGO_SETTINGS_MODULE=backend.settings
python manage.py makemigrations
python manage.py migrate
python upsert_initial_data.py
python manage.py collectstatic

exec "$@"