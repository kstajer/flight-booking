from django.shortcuts import render, get_object_or_404

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from dateutil import parser as date_parser
from rest_framework import generics

from .models import Airport, Flight, Booking
from .serializers import *

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import CustomUser
from .serializers import CustomUserSerializer


from rest_framework import status

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class ListUsersAPIView(APIView):
    def get(self, request, *args, **kwargs):
        users = CustomUser.objects.all()
        serializer = CustomUserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserRegistrationAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = CustomUserSerializer(data=request.data)

        if serializer.is_valid():
            print(serializer.validated_data)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class HomeView(APIView):
    permission_classes = (IsAuthenticated, )
    def get(self, request):
        content = {'message': 'Welcome to the JWT Authentication page using React Js and Django!'}
        return Response(content)

@api_view(['GET', 'POST'])
def airports_list(request):
    if request.method == 'GET':
        data = Airport.objects.all()

        serializer = AirportSerializer(data, context={'request': request}, many=True)
        result = []
        for airport in serializer.data:
            result.append({
                'airport_id': airport['airport_id'], 
                'airport_name': airport['airport_name'],
                'code': airport['code'],
                'airport_full_name': f"{airport['city']} ({airport['code']})"
                })

        return Response(result)

    elif request.method == 'POST':
        serializer = AirportSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def find_flights_between_airports(request):
    from_airport_id = request.GET.get('from_airport_id')
    to_airport_id = request.GET.get('to_airport_id')
    date = request.GET.get('date')

    if not all([from_airport_id, to_airport_id, date]):
        return Response({'error': 'Missing required parameters in the query.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        date_obj = date_parser.parse(date+"+01:00").date()
    except ValueError:
        return Response({'error': 'Invalid date format, use ISO datetime format.'}, status=status.HTTP_400_BAD_REQUEST)

    from_airport = get_object_or_404(Airport, pk=from_airport_id)
    to_airport = get_object_or_404(Airport, pk=to_airport_id)

    flights = Flight.objects.filter(
        from_airport_id=from_airport,
        to_airport_id=to_airport,
        departure_time__date=date_obj
    )
    serializer = FlightSerializer(flights, many=True)

    data = serializer.data
    for flight_data in data:
        flight_data['from_airport'] = from_airport.airport_name
        flight_data['from_airport_code'] = from_airport.code
        flight_data['to_airport'] = to_airport.airport_name
        flight_data['to_airport_code'] = to_airport.code

    return Response(data)

@api_view(['POST'])
def create_flight(request):
    try:
        from_airport_id = int(request.GET.get('from_airport_id'))
        to_airport_id = int(request.GET.get('to_airport_id'))
        seats = int(request.GET.get('seats', 1))
        available_seats = seats
        departure_time = request.GET.get('departure_time')
        arrival_time = request.GET.get('arrival_time')
        ticket_price = float(request.GET.get('ticket_price', 100))

        airport_from = get_object_or_404(Airport, pk=from_airport_id)
        airport_to = get_object_or_404(Airport, pk=to_airport_id)

        flight = Flight.objects.create(
            from_airport=airport_from,
            to_airport=airport_to,
            seats=seats,
            available_seats=seats,
            departure_time=departure_time,
            arrival_time=arrival_time,
            ticket_price=ticket_price
        )
        serializer = FlightSerializer(flight)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def create_booking(request):
    try:
        flight_id = int(request.GET.get('flight_id'))
        client_id = int(request.GET.get('client_id'))
        seats = int(request.GET.get('seats', 1))
        flight_id = get_object_or_404(Flight, pk=flight_id)
        client_id = get_object_or_404(CustomUser, pk=client_id)

        booking = Booking.objects.create(
            flight_id=flight_id,
            client_id=client_id,
            seats=seats
        )

        serializer = BookingSerializer(booking)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['POST'])
# def create_client(request):
#     try:
#         first_name = request.GET.get('first_name')
#         last_name = request.GET.get('last_name')
#         email = request.GET.get('email')

#         client = Client.objects.create(
#                 first_name=first_name,
#                 last_name=last_name,
#                 email=email
#             )

#         serializer = ClientSerializer(client)

#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     except Exception as e:
#         return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def bookings_list(request):
    bookings = Booking.objects.all()
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def create_airport(request):
    try:
        airport_name = request.GET.get('airport_name')
        code = request.GET.get('code')
        city = request.GET.get('city')
        country = request.GET.get('country')

        airport = Airport.objects.create(
                airport_name=airport_name,
                code=code,
                city=city,
                country=country
            )

        serializer = AirportSerializer(airport)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_flight_details(request):

    flight_id = request.GET.get('flight_id')
    flight = get_object_or_404(Flight, pk=flight_id)

    serializer = FlightSerializer(flight)

    return Response(serializer.data)

@api_view(['POST'])
def confirm_booking(request):
    booking_id = request.GET.get('booking_id')

    if not booking_id:
        return Response({'error': 'booking_id is required in the query parameters.'}, status=status.HTTP_400_BAD_REQUEST)

    booking = get_object_or_404(Booking, pk=booking_id)
    booking.status = '1'
    booking.save()

    return Response({'message': f'Booking with id {booking_id} confirmed.'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def cancel_booking(request):
    booking_id = request.GET.get('booking_id')

    if not booking_id:
        return Response({'error': 'booking_id is required in the query parameters.'}, status=status.HTTP_400_BAD_REQUEST)

    booking = get_object_or_404(Booking, pk=booking_id)
    booking.status = '2'
    booking.save()

    return Response({'message': f'Booking with id {booking_id} cancelled.'}, status=status.HTTP_200_OK)


@api_view(['GET'])
def flights_list(request):
    flights = Flight.objects.all()
    serializer = FlightSerializer(flights, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['DELETE'])
def delete_flight(request):
    try:
        flight_id = request.GET.get('flight_id')
        flight = get_object_or_404(Flight, pk=flight_id)
        flight.delete()
        return Response({'message': f'Flight with id {flight_id} deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_booking(request):
    try:
        booking_id = request.GET.get('booking_id')
        booking = get_object_or_404(Booking, pk=booking_id)
        booking.delete()
        return Response({'message': f'Booking with id {booking_id} deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def modify_flight(request):
    try:
        flight_id = request.GET.get('flight_id')
        flight = get_object_or_404(Flight, pk=flight_id)
        departure = request.GET.get('departure')

        if not departure:
            return Response({'error': 'departure is required in the request data.'}, status=status.HTTP_400_BAD_REQUEST)

        new_departure_time = date_parser.parse(departure + "-01:00")
        delta = flight.arrival_time - flight.departure_time
        flight.departure_time = new_departure_time
        flight.arrival_time = new_departure_time + delta
        flight.save()

        serializer = FlightSerializer(flight)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_bookings_for_client(request):
    try:
        client_id = request.GET.get('client_id')
        client = get_object_or_404(CustomUser, pk=client_id)
        bookings = Booking.objects.filter(client_id=client)

        booking_data = []

        for booking in bookings:
            flight_info = {
                'departure_time': booking.flight_id.departure_time,
                'arrival_time': booking.flight_id.arrival_time,
                'from_airport': booking.flight_id.from_airport.airport_name,
                'from_airport_code': booking.flight_id.from_airport.code,
                'to_airport': booking.flight_id.to_airport.airport_name,
                'to_airport_code': booking.flight_id.to_airport.code,
            }

            booking_data.append({
                'booking_id': booking.booking_id,
                'seats': booking.seats,
                'flight_info': flight_info,
            })

        return Response(booking_data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
