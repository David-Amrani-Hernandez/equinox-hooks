from django.db import models


class Application(models.Model):
    name = models.CharField(max_length=100, default="Default name")
    app_id = models.CharField(max_length=400)
    secret = models.CharField(max_length=400)
    account_id = models.CharField(max_length=200, null=True)

    def __str__(self):
        return self.name


class Hook(models.Model):
    name = models.CharField(max_length=100, default="Default name")
    description = models.CharField(max_length=400, default="Default description", null=True)
    application = models.ForeignKey(Application)
    latch_status = models.BooleanField(default=True)
    regex = models.CharField(max_length=400, default="", null=True)
    method = models.CharField(max_length=20)
    url = models.CharField(max_length=400)
    body = models.CharField(max_length=800, null=True)

    method2 = models.CharField(max_length=20, null=True)
    url2 = models.CharField(max_length=400, null=True)
    body2 = models.CharField(max_length=800, null=True)
    regex2 = models.CharField(max_length=400, default="", null=True)

    response = models.CharField(max_length=2000, null=True)

    def __str__(self):
        return self.name


class Header(models.Model):
    name = models.CharField(max_length=400)
    value = models.CharField(max_length=2000)
    hook = models.ForeignKey(Hook)
