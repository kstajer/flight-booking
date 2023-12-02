from datetime import timedelta
from django.utils import timezone
from celery import shared_task
from .models import Booking, Flight
from django.db import models 

@shared_task
def check_and_update_bookings():
    now = timezone.now()
    delta = now - timedelta(minutes=10)
    bookings_to_cancel = Booking.objects.filter(
        status='0',  # booked
        booking_time__lt=delta
    )

    for booking in bookings_to_cancel:
        booking.status = '2'  # cancelled
        booking.save()

@shared_task
def update_available_seats():
    flights = Flight.objects.all()

    for flight in flights:
        total_reserved_seats = Booking.objects.filter(
            flight_id=flight.flight_id, 
            status__in=['0', '1']
            ).aggregate(
                total_seats=models.Sum('seats')
                )['total_seats'] or 0
        
        flight.available_seats = flight.seats - total_reserved_seats
        flight.save()
