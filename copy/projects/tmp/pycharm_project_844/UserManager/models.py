from django.contrib.auth.models import User
from django.db import models


# Create your models here.
class UserOtherInfo(models.Model):
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING, verbose_name="绑定用户")
    wx_openid = models.CharField(max_length=64, verbose_name="微信唯一标识", null=True, unique=True)
    wx_session_key = models.CharField(max_length=64, verbose_name="微信会话秘钥", null=True)


# 微信信息
class UserWxInfo(models.Model):
    other_info = models.OneToOneField(UserOtherInfo, on_delete=models.DO_NOTHING,related_name='wx_info')
    nickName = models.CharField(max_length=32, verbose_name="用户昵称", null=True)
    gender = models.IntegerField(choices=((0, "未知"), (1, "男"), (2, "女")))
    country = models.CharField(verbose_name="用户所在国家", max_length=32, null=True)
    province = models.CharField(verbose_name="用户所在省份", max_length=32, null=True)
    city = models.CharField(verbose_name="用户所在城市", max_length=32, null=True)
    language = models.CharField(max_length=8, verbose_name="语言",
                                choices=(('en', '英文'), ('zh_CN', '简体中文'), ('zh_TW', '繁体中文')), null=True)
    avatarUrl = models.URLField(verbose_name="头像链接", null=True)
