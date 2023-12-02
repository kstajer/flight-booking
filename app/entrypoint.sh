#!/bin/bash
export DJANGO_SETTINGS_MODULE=backend.settings
python manage.py makemigrations
python manage.py migrate --no-input
python upsert_initial_data.py
python manage.py collectstatic --no-input --clear

exec "$@"