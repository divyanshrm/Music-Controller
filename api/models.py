from django.db import models
import random,string
# Create your models here.

    
def generate_unique_code(length=6):
    while True:
        characters = string.ascii_uppercase
        code = ''.join(random.choice(characters) for i in range(length))
        if Room.objects.filter(code=code).count()==0:
            return code
class Room(models.Model):
    code=models.CharField(max_length=8,default=generate_unique_code,unique=True)
    host=models.CharField(max_length=50,unique=True)
    guest_can_pause=models.BooleanField(null=False,default=False)
    votes_to_skip=models.IntegerField(null=False,default=1)
    created_at=models.DateTimeField(auto_now_add=True)
    current_song = models.CharField(max_length=50, null=True)
    def __str__(self):
        return self.code
