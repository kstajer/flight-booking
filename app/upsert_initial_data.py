import django

django.setup()

from django.db import transaction
from airports.models import FlightDuration, Airport
from datetime import timedelta


def upsert_flight_durations(flight_durations_data):
    """
    Upsert flight durations data into the FlightDuration model.
    The data should be a list of dictionaries, each containing 'from_airport_code',
    'to_airport_code', and 'duration' keys.
    """
    with transaction.atomic():
        for duration_data in flight_durations_data:
            from_airport_id = duration_data['from_airport']
            to_airport_id = duration_data['to_airport']
            duration_value = timedelta(minutes=duration_data['duration'])

            from_airport = Airport.objects.get(pk=from_airport_id)
            to_airport = Airport.objects.get(pk=to_airport_id)

            flight_duration, created = FlightDuration.objects.get_or_create(
                from_airport=from_airport,
                to_airport=to_airport,
                defaults={'duration': duration_value}
            )

            if not created:
                flight_duration.duration = duration_value
                flight_duration.save()

if __name__ == "__main__":
    flight_durations_data = [
        {'from_airport': 1, 'to_airport': 2, 'duration': 30}, # duration w minutach
        {'from_airport': 1, 'to_airport': 3, 'duration': 120},
        {'from_airport': 1, 'to_airport': 4, 'duration': 180},
        {'from_airport': 2, 'to_airport': 1, 'duration': 30},
        {'from_airport': 2, 'to_airport': 3, 'duration': 150},
        {'from_airport': 2, 'to_airport': 4, 'duration': 200},
        {'from_airport': 3, 'to_airport': 1, 'duration': 120},
        {'from_airport': 3, 'to_airport': 2, 'duration': 150},
        {'from_airport': 3, 'to_airport': 4, 'duration': 200},
        {'from_airport': 4, 'to_airport': 1, 'duration': 180},
        {'from_airport': 4, 'to_airport': 2, 'duration': 200},
        {'from_airport': 4, 'to_airport': 3, 'duration': 200},
    ]

    upsert_flight_durations(flight_durations_data)
