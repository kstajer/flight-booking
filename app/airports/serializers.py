from rest_framework import serializers
from .models import Airport, Booking, Client, Flight

class AirportSerializer(serializers.ModelSerializer):

    class Meta:
        model = Airport 
        fields = ('airport_id', 'code', 'airport_name', 'city', 'country')


class FlightSerializer(serializers.ModelSerializer):
    from_airport = serializers.CharField(source='from_airport.airport_full_name', read_only=True)
    from_airport_code = serializers.CharField(source='from_airport.code', read_only=True)
    to_airport = serializers.CharField(source='to_airport.airport_full_name', read_only=True)
    to_airport_code = serializers.CharField(source='to_airport.code', read_only=True)

    class Meta:
        model = Flight 
        fields = ('flight_id', 'from_airport', 'from_airport_code', 'to_airport', 'to_airport_code', 'departure_time', 'arrival_time', 'seats', 'ticket_price', 'available_seats')

class ClientSerializer(serializers.ModelSerializer):

    class Meta:
        model = Client 
        fields = ('client_id', 'first_name', 'last_name', 'email')

class BookingSerializer(serializers.ModelSerializer):

    class Meta:
        model = Booking 
        fields = ('booking_id', 'flight_id', 'client_id', 'seats', 'status', 'booking_time')