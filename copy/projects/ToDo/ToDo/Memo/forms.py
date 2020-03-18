# -*- encoding: utf-8 -*-
"""
@File    : forms.py
@Time    : 2020/3/17 13:55
@Author  : chise
@Email   : chise123@live.com
@Software: PyCharm
@info    :
"""
from django import  forms
from .models import Memo
class MemoForm(forms.ModelForm):

    class Meta:
        model=Memo
        fields="__all__"
