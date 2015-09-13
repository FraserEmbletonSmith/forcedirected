from django.conf.urls import patterns, include, url
from forcedirected import views

urlpatterns = patterns('',
    url(r'^$', views.home, name='home'),
    url(r'^graphs/$', views.graph, name='graphs'),
    url(r'^api/$', views.getJSON, name='JSON'),
    url(r'^graphs/(?P<author>[A-Za-z]+)/$', views.text, name='text'),
)