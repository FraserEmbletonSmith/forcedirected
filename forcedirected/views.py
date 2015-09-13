from django.shortcuts import render
from forcedirected.models import Node,Edge, Text
from django.http import JsonResponse, HttpResponse
import json
from django.core import serializers

def byteify(input):
    if isinstance(input, dict):
        return {byteify(key):byteify(value) for key,value in input.iteritems()}
    elif isinstance(input, list):
        return [byteify(element) for element in input]
    elif isinstance(input, unicode):
        return input.encode('utf-8')
    else:
        return input

def home(request):
    return render(request, 'home.html', {})

def graph(request):
    texts=Node.objects.filter(type="T")
    characters=Node.objects.filter(type="C")
    edges=Edge.objects.all()
    context_dict={"characters":characters,"texts":texts,"edges":edges}
    return render(request, 'graphs.html', context_dict)

def getJSON(request):
    nodes=serializers.serialize('python', Node.objects.all())
    edges=serializers.serialize('python', Edge.objects.all())
    for k in nodes:
        object=Node.objects.get(name=k['fields']['name'])
        k['fields']['id']=object.pk
    for k in edges:
        source=Node.objects.get(pk=k['fields']['source'])
        target=Node.objects.get(pk=k['fields']['target'])
        k['fields']['targetname']=target.name
        k['fields']['sourcename']=source.name
        k['fields']['value']=1
    nodes=[j['fields'] for j in nodes]
    edges=[j['fields'] for j in edges]
    data={'nodes':nodes,'edges':edges}
    data=byteify(data)
    #data=serializers.serialize('json',data)
    data=json.dumps(data)
    data=data.replace("\\","")
    return HttpResponse(data, content_type='application/json')

# def texttxt(request,author):
#     text=Text.objects.get(author__name= author)
#     text=text.text.read()
#     return render(request, 'text.html', {'text':text})

def text(request, author):
    try:
        pdf=Text.objects.get(name__name= author)
        pdf=pdf.text
        response=HttpResponse(pdf.read(),content_type='application/pdf')
        return response
    except Text.DoesNotExist:
        return render(request, 'text.html', {})