'use client';

import { Button, Form, Input, message } from 'antd';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { FaGithub, FaGoogle, FaLine } from 'react-icons/fa';

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginClient() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form] = Form.useForm<LoginFormValues>();

  const onFinish = async (values: LoginFormValues) => {
    setIsLoading(true);

    signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl: '/',
    })
      .then((callback) => {
        if (callback?.error) {
          const errorMessage = callback.error === 'Invalid credentials' && '帳號或密碼錯誤';
          message.error(errorMessage || '登入失敗');
        } else {
          window.location.href = '/recipes';
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSocialLogIn = async (socialType: string) => {
    setIsLoading(true);
    try {
      await signIn(socialType, { callbackUrl: '/' });
    } catch (error) {
      console.error('Social login error:', error);
      message.error('登入失敗');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-sm px-6 py-16">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-light tracking-wider">登入</h1>
        <span className="text-xs tracking-[3px] text-[#9E9E9E]">LOGIN</span>
      </div>

      <Form name="login" form={form} wrapperCol={{ span: 24 }} onFinish={onFinish} autoComplete="on" layout="vertical">
        <Form.Item
          name="email"
          label="電子郵件"
          rules={[
            { required: true, message: '請輸入您的電子郵件' },
            { type: 'email', message: '請輸入有效的電子郵件地址' },
          ]}
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item
          name="password"
          label="密碼"
          rules={[
            { required: true, message: '請輸入您的密碼' },
            { min: 8, message: '密碼至少需要 8 個字符' },
          ]}
        >
          <Input.Password size="large" />
        </Form.Item>
        <Form.Item>
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full border-none bg-black py-3 text-sm tracking-[1px] text-white transition-all duration-300 hover:bg-[#424242] disabled:opacity-50"
          >
            登入
          </button>
        </Form.Item>
      </Form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[#EEEEEE]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-xs tracking-wider text-[#9E9E9E]">或</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={() => handleSocialLogIn('github')}
          disabled={isLoading}
          icon={<FaGithub />}
          className="flex-1"
          size="large"
        >
          GitHub
        </Button>
        <Button
          onClick={() => handleSocialLogIn('google')}
          disabled={isLoading}
          icon={<FaGoogle />}
          className="flex-1"
          size="large"
        >
          Google
        </Button>
        <Button
          onClick={() => handleSocialLogIn('line')}
          disabled={isLoading}
          icon={<FaLine />}
          className="flex-1"
          size="large"
        >
          Line
        </Button>
      </div>
    </div>
  );
}
