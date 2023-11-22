from django.db import models

class Airport(models.Model):
    airport_id = models.AutoField(primary_key=True)
    airport_name = models.CharField("Airport name", max_length=240)
    city = models.CharField("City", max_length=40)
    country = models.CharField("Country", max_length=40)

    def __str__(self):
        return self.name