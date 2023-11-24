from django.shortcuts import render, get_object_or_404

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from dateutil import parser as date_parser

from .models import Airport, Flight, Client, Booking
from .serializers import *

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
        client_id = get_object_or_404(Client, pk=client_id)

        booking = Booking.objects.create(
            flight_id=flight_id,
            client_id=client_id,
            seats=seats
        )

        serializer = BookingSerializer(booking)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def create_client(request):
    try:
        first_name = request.GET.get('first_name')
        last_name = request.GET.get('last_name')
        email = request.GET.get('email')

        client = Client.objects.create(
                first_name=first_name,
                last_name=last_name,
                email=email
            )

        serializer = ClientSerializer(client)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

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

    # airport_from = get_object_or_404(Airport, pk=flight.airport_from)
    # airport_to = get_object_or_404(Airport, pk=flight.airport_to)

    serializer = FlightSerializer(flight)

    return Response(serializer.data)