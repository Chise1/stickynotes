import json
import time

import jwt
from django.contrib import auth
from django.contrib.auth.models import User
from django.db.models import QuerySet
from django.http import JsonResponse
from django.shortcuts import render
from TODo.settings import SECRET_KEY
# Create your views here.
from django.views import View
import requests
from TODo.settings import WX_APPID, WX_APPSECRET
from UserManager.models import UserOtherInfo, UserWxInfo
import string

# 登录过期时间
out_line = 3600 * 24 * 7

import uuid
def ranstr(num):
    """生成随机字符串"""
    return str(uuid.uuid4()).replace('-','')


class Login(View):
    """一般情况的登录"""

    def post(self, request):
        """
        接口情况：
            username,secret
        :param request:
        :return:
        """
        res = json.loads(request.body)
        user = auth.authenticate(username=res['account'], password=res['password'])
        if user is not None and user.is_active:
            auth.login(request, user)
            encoded_jwt = jwt.encode(
                {"userName": user.username, "timeout": int(time.time() + out_line)}, SECRET_KEY)
            return JsonResponse({"code": 0, "userName": user.username, "msg": "success", "jwt": encoded_jwt.decode()})
        else:
            return JsonResponse({"code": -1, "msg": "错误或未注册"})


import random


class WxLogin(View):
    """微信方式的登录"""

    def post(self, request):
        """
        接口情况：
            username,secret
        :param request:
        :return:
        """
        res = json.loads(request.body)
        userInfo = res['userInfo']
        code = res['code']
        # {'code': 'the code is a mock one',
        #  'flag': "wx", 'userinfo':
        #      {'nickName': '喻小菲',
        #       'avatarUrl': 'http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eoWmfFfLK2wK1E86jIuDIqSY78QtLKRAzib0wPIXheajJySQW52icLwNRrZaC1kNfauGuDKHwPxyL4Q/132',
        #       'gender': 2, 'province': 'Chongqing',
        #       'city': 'South Bank'}}
        if res['flag'] == 'wx':
            code = res['code']
            code2Session_url = "https://api.weixin.qq.com/sns/jscode2session"
            # res.openid	string	用户唯一标识
            # res.session_key	string	会话密钥
            res = requests.get(code2Session_url, params={"appid": WX_APPID, "secret": WX_APPSECRET, "js_code": code,
                                                         "grant_type": "authorization_code"}).json()

            try:
                # 查看该微信用户是否已注册
                # 该用户已注册
                wx_user = UserOtherInfo.objects.get(wx_openid=res['openid'])
                if wx_user.wx_session_key != res['session_key']:
                    wx_user.wx_session_key = res['session_key']
                    wx_user.save()
            except:
                # 该用户没注册
                # 随机生成一个user
                username=ranstr(128)
                password=ranstr(128)

                ran_user = User.objects.create_user(username=ranstr(128), password=ranstr(128))
                wx_user = UserOtherInfo.objects.create(wx_openid=res['openid'], wx_session_key=res['session_key'],
                                                       user_id=ran_user.id)
            finally:
                try:
                    wx_info = UserWxInfo.objects.get(other_info_id=wx_user.id)
                    wx_info.save(**userInfo)
                except Exception as e:
                    print(e)
                    wx_info = UserWxInfo.objects.create(other_info_id=wx_user.id, **userInfo)
                encoded_jwt = jwt.encode(
                    {"userName": wx_user.user.username, "timeout": int(time.time() + out_line), "flag": "wx"},
                    SECRET_KEY)
                auth.login(request, wx_user.user)
                return JsonResponse({"code": 0, "userName": userInfo['nickName'], "jwt": encoded_jwt.decode()})
        else:
            return JsonResponse({"code": -1, "msg": "未知登录信息"})


class Register(View):
    def post(self, request):
        """
        微信注册
        :param request:
        :return:
        """
        res = json.loads(request.body)
        print(res)
        try:
            user = User.objects.create_user(username=res['account'], password=res['password'], email=res['email'])
            encoded_jwt = jwt.encode(
                {"username": user.username, "timeout": int(time.time() + 3600 * 24 * 7), "flag": "account"},
                SECRET_KEY)
            return JsonResponse({"code": 0, "userName": user.username, "jwt": encoded_jwt.decode(), "msg": 'success'})
        except Exception as e:
            print(e)
            return JsonResponse({"code": -1, "msg": "该账户已注册"})


class UserInfo(View):
    """获取小程序上传的客户信息"""

    def post(self, request):
        # 得到的结果
        # res = {'errMsg': 'getUserInfo:ok',
        #        'rawData': '{"nickName":"喻小菲","gender":2,"language":"zh_CN","city":"South Bank","province":"Chongqing","country":"China","avatarUrl":"https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqc6viaVqBcxf5pU4jmCO8aQCU4aPdibXyyoPN68XJExufnsbZXP6rdO8XWicjc4zKzmhIVu6hicaFicXQ/132"}',
        #        'signature': '5d56c82118685ee5671f021b6a5cf499c8930151',
        #        'encryptedData': 'FgG92byNJ4BFrURb+UxL90k1NuF2iYnEOrHGPCq2D1ExW1fuuYX66fVEcJsah6LsCG6MFWskW8tYIMyMhjGJ2ajLdnKz1E3CMxQivyqe5G/fA3j3GIwFst1pTK3cqYsKxYE/2D506FQBYxVE/LNX3cOxwSYJicKn8dX+Xw5tBJGXqekjIebrKcnHJsQm27ZOMmJn83titMUo5YIZs0KZIHEVhJk6p8vYg50tCS5HXp5I7cNEpfSgaRMw4sHXr4e+tC24J6PHJVL0YRr1YnBNEfPFbMeq9l8We8y4IMjdnRpW59MF4Yhye+nZWQpYsVSk2rXyFJxpleEYHyuwE78dPlb3udW9BLDjMLw7OtzLrE9GgbAA5chDMKRAHZPWQAsh+ifWkjD0YwgD0jye6Eqs9zQENde81GzjUKiOQyYSzZNvQROkLdVNr2D3EkG1a/0rRjI+b7cM6FQQO4nz6Dw/ECAiEk+rRAyvYoxRbfcm3Gg=',
        #        'iv': 'vR515wAimUVm3QTHZmQMtg==',
        #        'userInfo': {'nickName': '喻小菲', 'gender': 2, 'language': 'zh_CN', 'city': 'South Bank',
        #                     'province': 'Chongqing', 'country': 'China',
        #                     'avatarUrl': 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqc6viaVqBcxf5pU4jmCO8aQCU4aPdibXyyoPN68XJExufnsbZXP6rdO8XWicjc4zKzmhIVu6hicaFicXQ/132'}}

        res = json.loads(request.body)

        print(res)
        return JsonResponse({"code": 0})
from django.core.mail import send_mail  
from TODo.settings import EMAIL_HOST_USER
def test_email(request):
    # send_mail的参数分别是  邮件标题，邮件内容，发件箱(settings.py中设置过的那个)，收件箱列表(可以发送给多个人),失败静默(若发送失败，报错提示我们)
    send_mail('Subject here', 'Here is the message.',  EMAIL_HOST_USER,  ['531189371@qq.com'], fail_silently=False)
    return JsonResponse({"code":0})