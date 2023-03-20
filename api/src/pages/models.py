from django.db import models

class DestinationSearchRecord(models.Model):
  destination = models.TextField()
  time_of_search = models.TextField()
  origin = models.TextField()