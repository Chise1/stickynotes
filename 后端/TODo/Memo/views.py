import json

from django.contrib.auth.models import User
from django.forms import model_to_dict
from django.http import JsonResponse
from .models import Memo
from django.views import View

# 登录过期时间
out_line = 3600 * 24 * 7

from django.core.mail import send_mail
from TODo.settings import EMAIL_HOST_USER
from django.contrib.auth.decorators import login_required
# 需要登录之后才执行的函数上面可以加个@login_required
from .forms import MemoForm
import jwt
from typing import Optional
from TODo.settings import SECRET_KEY
def test_email(request):
    # send_mail的参数分别是  邮件标题，邮件内容，发件箱(settings.py中设置过的那个)，收件箱列表(可以发送给多个人),失败静默(若发送失败，报错提示我们)
    send_mail('Subject here', 'Here is the message.', EMAIL_HOST_USER, ['531189371@qq.com'], fail_silently=False)
    return JsonResponse({"code": 0})
def check_jwt(encoded_jwt)->(bool,Optional[dict]):
    # jwt.decode(encoded_jwt, 'secret_key', algorithms=['HS256'])
    try:
        res=jwt.decode(encoded_jwt, SECRET_KEY, algorithms=['HS256'])
        return True,res
    except:
        return False,None
class Data(View):
    """数据获取的接口"""
    def get(self, request):  # 获取所有的数据
        l=[]
        jwt=request.GET['jwt']
        flag, res = check_jwt(jwt)
        memos = Memo.objects.filter(author_name=res['userName'])
        for memo in memos:
            l.append(model_to_dict(memo))
        return JsonResponse({"code": 0, "msg": "success", "data": l})

    def post(self, request):  # 创建某条数据

        data=json.loads(request.body)
        flag,res=check_jwt(data['jwt'])
        if not flag:
            return JsonResponse({"code": -1, "msg": "账户错误"})
        userName=res['userName']
        memo=Memo.objects.create(content=data['content'],checked=data['checked'],author_name=userName)
        return JsonResponse({"code": 0,"data_id":memo.id, "msg": "success"})

    def update(self, request):  # 更新某一条数据
        pass

    def delete(self,request):
        pass
