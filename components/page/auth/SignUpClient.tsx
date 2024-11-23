'use client';
import { Button, Form, Input, message } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { FaGithub, FaGoogle, FaLine } from 'react-icons/fa';

// import { CALLBACK_URL } from '@/constants/common';

interface SignUpFormValues {
  username: string;
  email: string;
  password: string;
  confirm: string;
}

export default function SignUpClient() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // 1. Define your form.
  const [form] = Form.useForm<SignUpFormValues>();

  // 2. Define a submit handler.
  const onFinish = async (values: SignUpFormValues) => {
    setIsLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirm, ...signUpData } = values;
      console.log('🚀 ~ onFinish ~ signUpData:', signUpData);
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
    signIn(socialType, {
      callbackUrl: '/',
      // callbackUrl: CALLBACK_URL,
    }).then((callback) => {
      if (callback?.ok) {
        message.success('註冊成功');
      } else {
        message.error('註冊失敗');
      }
    });
  };

  return (
    <div className="">
      <main className="">
        <h3 className="mb-3 text-center font-bold">Sign Up</h3>
        <Form
          name="signup"
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          autoComplete="on"
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="使用者名稱"
            rules={[
              { required: true, message: '請輸入您的使用者名稱' },
              { pattern: /^[a-zA-Z0-9_]*$/, message: '只能包含英文、數字及底線，不可包含空白及特殊符號' },
            ]}
          >
            <Input />
          </Form.Item>
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
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="確認密碼"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: '請確認密碼',
              },
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
            <Input.Password />
          </Form.Item>
          {/* <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
              },
            ]}
          >
            <Checkbox>
              I have read the <a href="">agreement</a>
            </Checkbox>
          </Form.Item> */}
          <Form.Item>
            <Button className="mt-4" block type="primary" htmlType="submit">
              Create account
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
          <Button onClick={() => handleSocialSignUp('github')} loading={isLoading} icon={<FaGithub />}>
            GitHub
          </Button>
          <Button onClick={() => handleSocialSignUp('google')} loading={isLoading} icon={<FaGoogle />}>
            Google
          </Button>
          <Button onClick={() => handleSocialSignUp('line')} loading={isLoading} icon={<FaLine />}>
            Line
          </Button>
        </div>
      </main>
    </div>
  );
}
