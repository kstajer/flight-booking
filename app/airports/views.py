from django.shortcuts import render, get_object_or_404

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from dateutil import parser as date_parser

from .models import Airport, Flight
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
    required_fields = ['from_airport_id', 'to_airport_id', 'date']
    for field in required_fields:
        if field not in request.data:
            return Response({'error': f'Required field "{field}" is missing from the request body.'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        date_obj = date_parser.parse(request.data['date']).date()
    except ValueError:
        return Response({'error': 'Invalid date format, use ISO datetime format.'}, status=status.HTTP_400_BAD_REQUEST)


    from_airport = get_object_or_404(Airport, pk=request.data['from_airport_id'])
    to_airport = get_object_or_404(Airport, pk=request.data['to_airport_id'])

    flights = Flight.objects.filter(
        from_airport_id=from_airport,
        to_airport_id=to_airport,
        departure_time__date=date_obj
    )
    serializer = FlightSerializer(flights, many=True)

    return Response(serializer.data)

@api_view(['POST'])
def create_flight(request):
    serializer = FlightSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)