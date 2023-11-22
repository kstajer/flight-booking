from django.db import models

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
    from_airport_id = models.ForeignKey(Airport, on_delete=models.CASCADE, related_name="From_Airport")
    to_airport_id = models.ForeignKey(Airport, on_delete=models.CASCADE, related_name="To_Airport")
    departure_time = models.DateTimeField()
    arrival_time = models.DateTimeField()
    seats = models.IntegerField(default=100)
    ticket_price = models.FloatField(default=0)

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

class Client(models.Model):
    client_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=250)
    last_name = models.CharField(max_length=250)
    email = models.EmailField(max_length=250)

    class Meta:
        verbose_name_plural = "List of clients"

    def __str__(self):
        return str(f"{self.first_name} {self.last_name}")
    

class Booking(models.Model):
    booking_id = models.AutoField(primary_key=True)
    flight_id = models.ForeignKey(Flight, on_delete=models.CASCADE)
    client_id = models.ForeignKey(Client, on_delete=models.CASCADE)
    seats = models.IntegerField(default=1)
    status = models.CharField(max_length=2, choices=(('0','Booked'),('1','Confirmed'), ('2','Cancelled')), default = 0)
    booking_time = models.DateTimeField(auto_now = True)

    class Meta:
        verbose_name_plural = "List of bookings"

    def __str__(self):
        return str(f"Flight {self.flight_id.flight_id} - {self.client_id.first_name} {self.client_id.last_name}")
    
    def name(self):
        return str(f"{self.last_name}, {self.first_name} {self.middle_name}")