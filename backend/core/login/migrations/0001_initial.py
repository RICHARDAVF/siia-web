# Generated by Django 5.1.2 on 2024-10-23 16:10

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Clients',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('document', models.CharField(max_length=20, verbose_name='Nro Documento')),
                ('company_name', models.CharField(max_length=255, verbose_name='Nombre de la empresa')),
                ('db_host', models.CharField(max_length=255, verbose_name='Host de la BD')),
                ('db_name', models.CharField(max_length=255, verbose_name='Nombre de la Base de datos')),
                ('db_port', models.CharField(max_length=10, verbose_name='Numero de puerto')),
                ('db_pass', models.CharField(max_length=100, verbose_name='Contraseña')),
            ],
            options={
                'verbose_name': 'Cliente',
                'verbose_name_plural': 'Clientes',
                'db_table': 'clientes',
            },
        ),
    ]
