import os

from django import get_version
from django.conf import settings
from django.shortcuts import render
from django.http import JsonResponse
import json
from .models import DestinationSearchRecord
import random

error_invalid_method = JsonResponse(
    {'status': 'error', 'message': 'Invalid request method'})


def home(request):
    context = {
        "debug": settings.DEBUG,
        "django_ver": get_version(),
        "python_ver": os.environ["PYTHON_VERSION"],
    }

    return render(request, "pages/home.html", context)


def sustainability_score(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        origin = data.get('origin')
        time_of_search = data.get('time_of_search')
        destination = data.get('destination')
        sustainability_score = random.randint(0, 100)
        record = DestinationSearchRecord(
            origin=origin,
            time_of_search=time_of_search,
            destination=destination)

        record.save()

        return JsonResponse({
            'sustainability_score': sustainability_score,
            'destination': destination
        })

    return error_invalid_method
