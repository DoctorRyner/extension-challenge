from django.urls import path

from pages import views

urlpatterns = [
    path("", views.home, name="home"),
    path("sustainability_score", views.sustainability_score, name="sustainability_score")
]
