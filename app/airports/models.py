from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=30, unique=True)
    password = models.CharField(max_length=128)
    is_active = models.BooleanField(default=True)

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_set',
        related_query_name='customuser',
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_set',
        related_query_name='customuser',
        blank=True,
    )

    def __str__(self):
        return self.username

    
class Airport(models.Model):
    airport_id = models.AutoField(primary_key=True)
    code = models.CharField("Airport code", max_length=4, default='XXX')
    airport_name = models.CharField("Airport name", max_length=240)
    city = models.CharField("City", max_length=40)
    country = models.CharField("Country", max_length=40)

    def __str__(self):
        return self.name

class Flight(models.Model):
    flight_id = models.AutoField(primary_key=True)
    from_airport = models.ForeignKey(Airport, on_delete=models.CASCADE, related_name="From_Airport")
    to_airport = models.ForeignKey(Airport, on_delete=models.CASCADE, related_name="To_Airport")
    departure_time = models.DateTimeField()
    arrival_time = models.DateTimeField(null=True, blank=True) 
    duration = models.DurationField(null=True, blank=True)
    seats = models.IntegerField(default=100)
    ticket_price = models.FloatField(default=0)
    available_seats = models.IntegerField(default=95)

    class Meta:
        verbose_name_plural = "List of flights"

    def save(self, *args, **kwargs):
        if not self.duration:
            duration_object = FlightDuration.objects.get(from_airport=self.from_airport, to_airport=self.to_airport)
            self.duration = duration_object.duration
            self.arrival_time = self.departure_time + timezone.timedelta(seconds=self.duration.total_seconds())
        super().save(*args, **kwargs)

    def __str__(self):
        return str(f"[{self.from_airport.name} -> {self.to_airport.name}]")


class FlightDuration(models.Model):
    from_airport = models.ForeignKey(Airport, on_delete=models.CASCADE, related_name="flight_durations_from")
    to_airport = models.ForeignKey(Airport, on_delete=models.CASCADE, related_name="flight_durations_to")
    duration = models.DurationField()

    def __str__(self):
        return f"{self.from_airport} to {self.to_airport} - {self.duration}"

class Booking(models.Model):
    booking_id = models.AutoField(primary_key=True)
    flight_id = models.ForeignKey(Flight, on_delete=models.CASCADE)
    client_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    seats = models.IntegerField(default=1)
    status = models.CharField(max_length=2, choices=(('0','Booked'),('1','Confirmed'), ('2','Cancelled')), default = 0)
    booking_time = models.DateTimeField(auto_now = True)

    class Meta:
        verbose_name_plural = "List of bookings"

    def __str__(self):
        return str(f"Flight {self.flight_id.flight_id} - {self.client_id.first_name} {self.client_id.last_name}")
