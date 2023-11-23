from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Flight

@receiver(post_save, sender=Flight)
def update_available_seats(sender, instance, created, **kwargs):
    if created:
        instance.available_seats = instance.seats
        instance.save()