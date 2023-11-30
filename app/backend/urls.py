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
from django.urls import path, re_path, include
from django.views.generic import TemplateView
from airports import views
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from rest_framework_simplejwt import views as jwt_views


urlpatterns = [
    path('home/', views.HomeView.as_view(), name ='home'),
    path('token/', 
        jwt_views.TokenObtainPairView.as_view(), 
        name ='token_obtain_pair'),
    path('token/refresh/', 
        jwt_views.TokenRefreshView.as_view(), 
        name ='token_refresh'),
    path('admin/', admin.site.urls),
    path('accounts/', include('django.contrib.auth.urls')),
    re_path(r'^api/airports/$', views.airports_list, name='list of airports'),
    path('api/find_flights/', views.find_flights_between_airports,  name='find_flights'),
    path('api/create_flight/', views.create_flight, name='create_flight'),
    path('api/create_booking/', views.create_booking, name='create_booking'),
    path('api/create_client/', views.create_client, name='create_client'),
    path('api/create_airport/', views.create_airport, name='create_airport'),
    path('api/bookings/', views.bookings_list, name='get_bookings'),
    path('api/flights/', views.flights_list, name='get_flights'),
    path('api/delete_flight/', views.delete_flight, name='delete_flight'),
    path('api/delete_booking/', views.delete_booking, name='delete_booking'),
    path('api/get_flight_details/', views.get_flight_details, name='get_flight_details'),
    path('api/confirm_booking/', views.confirm_booking, name='confirm_booking'),
    path('api/cancel_booking/', views.cancel_booking, name='cancel_booking'),
    path('api/modify_flight/', views.modify_flight, name='modify_flight'),
    path('api/get_bookings_for_client/', views.get_bookings_for_client, name='get_bookings_for_client'),
    re_path('.*', TemplateView.as_view(template_name='index.html')),
]

urlpatterns += staticfiles_urlpatterns()