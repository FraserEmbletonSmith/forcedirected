# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('forcedirected', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='text',
            old_name='author',
            new_name='name',
        ),
        migrations.RemoveField(
            model_name='text',
            name='title',
        ),
        migrations.AddField(
            model_name='node',
            name='author',
            field=models.CharField(default=b'noname', max_length=128),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='node',
            name='type',
            field=models.CharField(default=b'T', max_length=1, choices=[(b'T', b'Text'), (b'C', b'Character')]),
            preserve_default=True,
        ),
    ]
