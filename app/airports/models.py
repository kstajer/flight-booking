from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


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
    arrival_time = models.DateTimeField()
    seats = models.IntegerField(default=100)
    ticket_price = models.FloatField(default=0)
    available_seats = models.IntegerField(default=95)

    class Meta:
        verbose_name_plural = "List of flights"

    def __str__(self):
        return str(f"[{self.from_airport.name} -> {self.to_airport.name}]")

    # def b_slot(self):
    #     try:
    #         reservation = Reservation.objects.exclude(status = 2).filter(flight=self, type = 1).count()
    #         if reservation is None:
    #             reservation = 0

    #     except:
    #         reservation = 0

    #     return self.business_class_slots - reservation

    # def e_slot(self):
    #     try:
    #         reservation = Reservation.objects.exclude(status = 2).filter(flight=self, type = 2).count()
    #         if reservation is None:
    #             reservation = 0

    #     except:
    #         reservation = 0
    #     return self.economy_slots - reservation

# class Client(models.Model):
#     client_id = models.AutoField(primary_key=True)
#     first_name = models.CharField(max_length=250)
#     last_name = models.CharField(max_length=250)
#     email = models.EmailField(max_length=250)

#     class Meta:
#         verbose_name_plural = "List of clients"

#     def __str__(self):
#         return str(f"{self.first_name} {self.last_name}")
    

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
