# Generated by Django 5.1.2 on 2024-10-23 16:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0002_clients_user'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='clients',
            name='user',
        ),
    ]
