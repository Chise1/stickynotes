from django.db import models
from datetime import datetime


# Create your models here.
class Memo(models.Model):
    """客户的标签数据"""
    content = models.CharField(max_length=64, verbose_name="记录信息")
    checked = models.BooleanField(default=False, verbose_name="完成")
    is_actived = models.BooleanField(default=True)  # 为false代表数据被删除
    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    modify_time = models.DateTimeField(default=datetime.now, verbose_name="修改时间")
    author_name = models.CharField(verbose_name="作者账户名", max_length=128)
