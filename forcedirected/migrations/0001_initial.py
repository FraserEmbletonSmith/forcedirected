# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Edge',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Node',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=128)),
                ('time', models.IntegerField(default=0)),
                ('chronology', models.IntegerField(default=0)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Text',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=128)),
                ('text', models.FileField(upload_to=b'node_texts', blank=True)),
                ('author', models.ForeignKey(to='forcedirected.Node')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='edge',
            name='source',
            field=models.ForeignKey(related_name=b'source', to='forcedirected.Node', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='edge',
            name='target',
            field=models.ForeignKey(related_name=b'target', to='forcedirected.Node', null=True),
            preserve_default=True,
        ),
    ]
