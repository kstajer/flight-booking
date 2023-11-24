from datetime import timedelta
from django.utils import timezone
from celery import shared_task
from .models import Booking

@shared_task
def check_and_update_bookings():
    now = timezone.now()
    fifteen_minutes_ago = now - timedelta(minutes=1)
    bookings_to_cancel = Booking.objects.filter(
        status='0',  # booked
        booking_time__lt=fifteen_minutes_ago
    )

    for booking in bookings_to_cancel:
        booking.status = '2'  # cancelled
        booking.save()
