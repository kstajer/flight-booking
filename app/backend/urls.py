"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path
from airports import views

urlpatterns = [
    path('admin/', admin.site.urls),
    re_path(r'^api/airports/$', views.airports_list, name='list of airports'),
    path('api/find_flights/', views.find_flights_between_airports,  name='find_flights'),
    path('api/create_flight/', views.create_flight, name='create_flight'),
    path('api/create_booking/', views.create_booking, name='create_booking'),
    path('api/create_client/', views.create_client, name='create_client'),
    path('api/create_airport/', views.create_airport, name='create_airport'),
    path('api/bookings/', views.bookings_list, name='get_bookings'),
    path('api/get_flight_availability/', views.get_flight_availability, name='get_flight_availability'),
]

