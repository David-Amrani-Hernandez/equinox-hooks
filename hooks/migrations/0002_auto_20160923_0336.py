# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2016-09-23 01:36
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hooks', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='application',
            name='account_id',
            field=models.CharField(max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='hook',
            name='description',
            field=models.CharField(default=b'Default description', max_length=400, null=True),
        ),
        migrations.AlterField(
            model_name='hook',
            name='regex',
            field=models.CharField(default=b'', max_length=400, null=True),
        ),
    ]
