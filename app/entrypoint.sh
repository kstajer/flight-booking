#!/bin/bash
export DJANGO_SETTINGS_MODULE=backend.settings
# wait for react npm run build
while [ ! -f /frontend/build/index.html ]; do
    sleep 2
done

python manage.py makemigrations
python manage.py migrate
python upsert_initial_data.py
python manage.py collectstatic

exec "$@"