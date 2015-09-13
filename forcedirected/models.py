from django.db import models
from django.template.defaultfilters import slugify

class Node(models.Model):
    name=models.CharField(max_length=128, unique=False)
    time=models.IntegerField(default=0)
    author=models.CharField(max_length=128, unique=False, default="noname")
    chronology=models.IntegerField(default=0)
    NODE_TYPES=(
        ('T','Text'),
        ('C','Character')
    )
    type=models.CharField(max_length=1, choices=NODE_TYPES, default='T')
    def __unicode__(self):
        return self.name
    class Meta:
        app_label="forcedirected"

class Edge(models.Model):
    source=models.ForeignKey(Node, null=True, related_name='source')
    target=models.ForeignKey(Node, null=True, related_name='target')

    def __unicode__(self):
        sourcetarget=self.source.name +" to " + self.target.name
        return sourcetarget
    class Meta:
        app_label="forcedirected"

class Text(models.Model):
    name=models.ForeignKey(Node)
    text=models.FileField(upload_to='node_texts', blank=True)
    def __unicode__(self):
        return self.name.name

    class Meta:
        app_label="forcedirected"

