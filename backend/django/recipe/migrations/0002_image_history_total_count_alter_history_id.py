# Generated by Django 5.0.3 on 2024-06-02 15:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recipe', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='')),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.AddField(
            model_name='history',
            name='total_count',
            field=models.IntegerField(default=1),
        ),
        migrations.AlterField(
            model_name='history',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
