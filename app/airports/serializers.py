from rest_framework import serializers
from .models import Airport, Booking, Client, Flight

class AirportSerializer(serializers.ModelSerializer):

    class Meta:
        model = Airport 
        fields = ('airport_id', 'code', 'airport_name', 'city', 'country')


class FlightSerializer(serializers.ModelSerializer):

    class Meta:
        model = Flight 
        fields = ('flight_id', 'from_airport_id', 'to_airport_id', 'departure_time', 'arrival_time', 'seats', 'ticket_price')

class ClientSerializer(serializers.ModelSerializer):

    class Meta:
        model = Client 
        fields = ('client_id', 'first_name', 'last_name', 'email')

class BookingSerializer(serializers.ModelSerializer):

    class Meta:
        model = Booking 
        fields = ('booking_id', 'flight_id', 'client_id', 'seats', 'status', 'booking_time')