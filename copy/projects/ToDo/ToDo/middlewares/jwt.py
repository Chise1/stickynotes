#!/usr/bin/env python3
# -*- coding:utf-8 -*-
from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse
import jwt
from TODo.settings import SECRET_KEY
class JwtAuthorizationMiddleware(MiddlewareMixin):
    """
    用户需要通过请求头的方式来进行传输token，例如：
    Authorization:jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NzM1NTU1NzksInVzZXJuYW1lIjoid3VwZWlxaSIsInVzZXJfaWQiOjF9.xj-7qSts6Yg5Ui55-aUOHJS4KSaeLq5weXMui2IIEJU
    """

    def process_request(self, request):
        #如果访问的时候user为空，且携带了jwt，则转换为user
        if request.user==
        try:

            auth=jwt.decode( request.POST['jwt'],SECRET_KEY)


        token = auth[1]
        result = parse_payload(token)
        if not result['status']:
            return JsonResponse(result)
        request.user_info = result['data']
