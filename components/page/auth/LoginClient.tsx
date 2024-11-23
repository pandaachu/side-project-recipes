'use client';
// import type { FormProps } from 'antd';
import { Button, Form, Input, message } from 'antd';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { FaGithub, FaGoogle, FaLine } from 'react-icons/fa';
// import { z } from 'zod';

// import { CALLBACK_URL } from '@/constants/common';

// const loginSchema = z.object({
//   email: z.string({ required_error: 'Email 為必填欄位' }).email('請輸入正確的 Email'),
//   password: z.string({ required_error: 'Password 為必填欄位' }),
// });

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginClient() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Define  form.
  const [form] = Form.useForm<LoginFormValues>();

  const onFinish = async (values: LoginFormValues) => {
    console.log('Success:', values);
    setIsLoading(true);
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);

    signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl: '/',
      // callbackUrl: CALLBACK_URL,
    })
      .then((callback) => {
        setIsLoading(true);
        if (callback?.error) {
          const errorMessage = callback.error === 'Invalid credentials' && '帳號或密碼錯誤';
          message.success(errorMessage || '登入失敗');
        } else {
          // message.success('登入成功！');
          // window.location.href = CALLBACK_URL;
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
      await signIn(socialType, {
        callbackUrl: '/',
        // callbackUrl: CALLBACK_URL,
      });
      // message.success('登入成功！');
    } catch (error) {
      console.log('🚀 ~ handleSocialLogIn ~ error:', error);
      message.success('登入失敗');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <main className="">
        <h3 className="mb-3 text-center font-bold">Login</h3>
        <Form
          name="login"
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: 600 }}
          // initialValues={{ remember: true }}
          onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="on"
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="email"
            rules={[
              { required: true, message: '請輸入您的電子郵件' },
              { type: 'email', message: '請輸入有效的電子郵件地址' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="密碼"
            rules={[
              { required: true, message: '請輸入您的密碼' },
              { min: 8, message: '密碼至少需要 8 個字符' },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button block type="primary" htmlType="submit">
              登入
            </Button>
          </Form.Item>
        </Form>
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => handleSocialLogIn('github')} disabled={isLoading} icon={<FaGithub />}>
            GitHub
          </Button>
          <Button onClick={() => handleSocialLogIn('google')} disabled={isLoading} icon={<FaGoogle />}>
            Google
          </Button>
          <Button onClick={() => handleSocialLogIn('line')} disabled={isLoading} icon={<FaLine />}>
            Line
          </Button>
        </div>
      </main>
    </div>
  );
}
