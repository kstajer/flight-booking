from rest_framework import serializers
from .models import Airport, Booking, Flight, CustomUser

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user_id'] = self.user.id if self.user else None
        return data

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'email', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = CustomUser.objects.create_user(**validated_data)
        
        if password is not None:
            user.set_password(password)
        
        user.is_active = True
        user.save()
        return user


class AirportSerializer(serializers.ModelSerializer):

    class Meta:
        model = Airport 
        fields = ('airport_id', 'code', 'airport_name', 'city', 'country')


class FlightSerializer(serializers.ModelSerializer):
    from_airport = serializers.CharField(source='from_airport.city', read_only=True)
    from_airport_code = serializers.CharField(source='from_airport.code', read_only=True)
    to_airport = serializers.CharField(source='to_airport.city', read_only=True)
    to_airport_code = serializers.CharField(source='to_airport.code', read_only=True)

    class Meta:
        model = Flight 
        fields = ('flight_id', 'from_airport', 'from_airport_code', 'to_airport', 'to_airport_code', 'departure_time', 'arrival_time', 'seats', 'ticket_price', 'available_seats')

class BookingSerializer(serializers.ModelSerializer):

    class Meta:
        model = Booking 
        fields = ('booking_id', 'flight_id', 'client_id', 'seats', 'status', 'booking_time')