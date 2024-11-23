'use client';

import { ClockCircleOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
// import type { FormProps } from 'antd';
import { Button, Form, Input, InputNumber, message, Select, Space } from 'antd';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import ImageUpload from '@/components/ui/ImageUpload';
const { Option } = Select;

interface RecipeFormValues {
  title: string;
  coverImage: string;
  forPeople: string;
  cookingTime: string;
  ingredients: Array<object>;
  steps: Array<string>;
  tags: string;
  refUrl: string;
  cookingTool: string;
  note: string;
}
export default function LoginPage() {
  const [form] = Form.useForm<RecipeFormValues>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // upload
  const [imageUrl, setImageUrl] = useState<string>('');
  const handleUploadSuccess = (url: string) => {
    setImageUrl(url);
  };

  const onFinish = async (values: RecipeFormValues) => {
    console.log('🚀 ~ onFinish ~ values:', values);
    setIsLoading(true);
    try {
      const updateValues = { ...values, coverImage: imageUrl };
      await axios.post('/api/recipes', updateValues);
      message.success('成功');
      router.push('/');
    } catch (error: any) {
      const errorMessage = error.response?.data || '失敗';
      message.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="bg-grey-50 w-full">
      <div className="flex items-center justify-center pt-6">
        <Form className="w-full max-w-[400px]" form={form} onFinish={onFinish} layout="vertical">
          <Form.Item label="標題" name="title" rules={[{ required: true, message: 'Please input!' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="圖片" name="coverImage">
            <div>
              <ImageUpload onUploadSuccess={handleUploadSuccess} />
              {imageUrl && (
                <div style={{ position: 'relative', width: '300px', height: '200px' }}>
                  <Image src={imageUrl} alt="Uploaded" layout="fill" objectFit="contain" />
                </div>
              )}
            </div>
            {/* <Input /> */}
          </Form.Item>

          <Form.Item label="幾人份" name="forPeople" rules={[{ required: true, message: 'Please input!' }]}>
            <Input addonAfter="人" />
          </Form.Item>

          <Form.Item label="烹調時間" name="cookingTime" rules={[{ required: true, message: 'Please input!' }]}>
            <InputNumber addonBefore={<ClockCircleOutlined />} suffix="分鐘" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="tags" name="tags">
            <Select placeholder="請選擇">
              <Option value="美式">美式</Option>
              <Option value="中式">中式</Option>
              <Option value="日式">日式</Option>
              <Option value="韓式">韓式</Option>
            </Select>
          </Form.Item>
          <Form.Item label="烹調工具" name="cookingTool">
            <Select placeholder="請選擇">
              <Option value="鑄鐵鍋">鑄鐵鍋</Option>
              <Option value="電鍋">電鍋</Option>
              <Option value="電子鍋">電子鍋</Option>
              <Option value="烤箱">烤箱</Option>
              <Option value="微波爐">微波爐</Option>
            </Select>
          </Form.Item>

          <div className="mb-8 rounded-md bg-zinc-50 p-4">
            <Form.List name="ingredients">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'ingredient']}
                        rules={[{ required: true, message: 'Missing first name' }]}
                      >
                        <Input placeholder="食材" />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'quantity']}>
                        <Input placeholder="份量" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Add 食材
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </div>
          <div className="mb-8 rounded-md bg-zinc-50 p-4">
            <Form.List name="steps">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item {...restField} name={name} rules={[{ required: true, message: 'Missing' }]}>
                        <Input placeholder="步驟" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Add 步驟
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </div>
          <Form.Item label="參考網址" name="refUrl">
            <Input />
          </Form.Item>
          <Form.Item label="補充" name="note">
            <Input.TextArea />
          </Form.Item>

          <Form.Item>
            <Button loading={isLoading} block type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
