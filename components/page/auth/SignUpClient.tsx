'use client';

import { Button, Form, Input, message } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { FaGithub, FaGoogle, FaLine } from 'react-icons/fa';

interface SignUpFormValues {
  username: string;
  email: string;
  password: string;
  confirm: string;
}

export default function SignUpClient() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form] = Form.useForm<SignUpFormValues>();

  const onFinish = async (values: SignUpFormValues) => {
    setIsLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirm, ...signUpData } = values;
      await axios.post('/api/register', signUpData);
      message.success('註冊成功');
      router.push('/');
    } catch (error: any) {
      const errorMessage = error.response?.data || '註冊失敗';
      message.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = (socialType: string) => {
    signIn(socialType, { callbackUrl: '/' }).then((callback) => {
      if (callback?.ok) {
        message.success('註冊成功');
      } else {
        message.error('註冊失敗');
      }
    });
  };

  return (
    <div className="mx-auto w-full max-w-sm px-6 py-16">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-light tracking-wider">註冊</h1>
        <span className="text-xs tracking-[3px] text-[#9E9E9E]">SIGN UP</span>
      </div>

      <Form name="signup" form={form} wrapperCol={{ span: 24 }} onFinish={onFinish} autoComplete="on" layout="vertical">
        <Form.Item
          name="username"
          label="使用者名稱"
          rules={[
            { required: true, message: '請輸入您的使用者名稱' },
            { pattern: /^[a-zA-Z0-9_]*$/, message: '只能包含英文、數字及底線' },
          ]}
        >
          <Input size="large" />
        </Form.Item>
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
          hasFeedback
        >
          <Input.Password size="large" />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="確認密碼"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: '請確認密碼' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('密碼不一致'));
              },
            }),
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
            建立帳號
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
          onClick={() => handleSocialSignUp('github')}
          loading={isLoading}
          icon={<FaGithub />}
          className="flex-1"
          size="large"
        >
          GitHub
        </Button>
        <Button
          onClick={() => handleSocialSignUp('google')}
          loading={isLoading}
          icon={<FaGoogle />}
          className="flex-1"
          size="large"
        >
          Google
        </Button>
        <Button
          onClick={() => handleSocialSignUp('line')}
          loading={isLoading}
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
