'use client';

import { ClockCircleOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, message, Select, Space } from 'antd';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import ImageUpload from '@/components/ui/ImageUpload';
import { Recipe } from '@/types/recipe';

const { Option } = Select;

interface RecipeFormValues {
  title: string;
  coverImage: string;
  forPeople: string;
  cookingTime: number | null;
  ingredients: Array<{ ingredient: string; quantity: string }>;
  steps: Array<string>;
  tags: string;
  refUrl: string;
  cookingTool: string;
  note: string;
}

interface RecipeFormProps {
  initialData?: Recipe;
  mode: 'create' | 'edit';
}

export default function RecipeForm({ initialData, mode }: RecipeFormProps) {
  const [form] = Form.useForm<RecipeFormValues>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>(initialData?.coverImage || '');

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        title: initialData.title,
        forPeople: initialData.forPeople,
        cookingTime: initialData.cookingTime,
        ingredients: initialData.ingredients || [],
        steps: initialData.steps || [],
        tags: initialData.tags || undefined,
        cookingTool: initialData.cookingTool || undefined,
        refUrl: initialData.refUrl || undefined,
        note: initialData.note || undefined,
      });
      setImageUrl(initialData.coverImage);
    }
  }, [initialData, form]);

  const handleUploadSuccess = (url: string) => {
    setImageUrl(url);
  };

  const onFinish = async (values: RecipeFormValues) => {
    if (!imageUrl) {
      message.error('請上傳食譜圖片');
      return;
    }
    setIsLoading(true);
    try {
      const payload = { ...values, coverImage: imageUrl };
      if (mode === 'edit' && initialData) {
        await axios.put(`/api/recipes/${initialData.id}`, payload);
        message.success('食譜已更新');
      } else {
        await axios.post('/api/recipes', payload);
        message.success('食譜已建立');
      }
      router.push('/member/recipes');
      router.refresh();
    } catch (error: any) {
      const errorMessage = error.response?.data || '操作失敗';
      message.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form className="w-full" form={form} onFinish={onFinish} layout="vertical">
      <Form.Item label="標題" name="title" rules={[{ required: true, message: '請輸入標題' }]}>
        <Input size="large" placeholder="食譜名稱" />
      </Form.Item>

      <Form.Item label="封面圖片" name="coverImage">
        <div>
          <ImageUpload onUploadSuccess={handleUploadSuccess} />
          {imageUrl && (
            <div className="relative mt-3 aspect-[16/10] w-full max-w-[400px] overflow-hidden">
              <Image src={imageUrl} alt="封面預覽" fill className="object-cover" />
            </div>
          )}
        </div>
      </Form.Item>

      <div className="grid grid-cols-2 gap-4">
        <Form.Item label="份量" name="forPeople" rules={[{ required: true, message: '請輸入份量' }]}>
          <Input size="large" addonAfter="人" />
        </Form.Item>

        <Form.Item label="烹調時間" name="cookingTime">
          <InputNumber size="large" addonBefore={<ClockCircleOutlined />} suffix="分鐘" style={{ width: '100%' }} />
        </Form.Item>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Form.Item label="分類" name="tags">
          <Select size="large" placeholder="請選擇" allowClear>
            <Option value="美式">美式</Option>
            <Option value="中式">中式</Option>
            <Option value="日式">日式</Option>
            <Option value="韓式">韓式</Option>
            <Option value="台式">台式</Option>
            <Option value="甜點">甜點</Option>
          </Select>
        </Form.Item>

        <Form.Item label="烹調工具" name="cookingTool">
          <Select size="large" placeholder="請選擇" allowClear>
            <Option value="鑄鐵鍋">鑄鐵鍋</Option>
            <Option value="電鍋">電鍋</Option>
            <Option value="電子鍋">電子鍋</Option>
            <Option value="烤箱">烤箱</Option>
            <Option value="微波爐">微波爐</Option>
            <Option value="氣炸鍋">氣炸鍋</Option>
          </Select>
        </Form.Item>
      </div>

      {/* Ingredients */}
      <div className="mb-6 border border-[#EEEEEE] p-6">
        <p className="mb-4 text-sm font-medium">食材</p>
        <Form.List name="ingredients">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} className="mb-2 flex" align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'ingredient']}
                    rules={[{ required: true, message: '請輸入食材' }]}
                  >
                    <Input placeholder="食材" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'quantity']}>
                    <Input placeholder="份量" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                新增食材
              </Button>
            </>
          )}
        </Form.List>
      </div>

      {/* Steps */}
      <div className="mb-6 border border-[#EEEEEE] p-6">
        <p className="mb-4 text-sm font-medium">步驟</p>
        <Form.List name="steps">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} className="mb-2 flex" align="baseline">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-black text-xs">
                    {name + 1}
                  </span>
                  <Form.Item
                    {...restField}
                    name={name}
                    rules={[{ required: true, message: '請輸入步驟' }]}
                    className="flex-1"
                  >
                    <Input placeholder="步驟說明" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                新增步驟
              </Button>
            </>
          )}
        </Form.List>
      </div>

      <Form.Item label="參考網址" name="refUrl">
        <Input size="large" placeholder="https://..." />
      </Form.Item>

      <Form.Item label="備註" name="note">
        <Input.TextArea rows={4} placeholder="其他補充說明..." />
      </Form.Item>

      <Form.Item>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 border-none bg-black py-3 text-sm tracking-[1px] text-white transition-all duration-300 hover:bg-[#424242] disabled:opacity-50"
          >
            {isLoading ? '處理中...' : mode === 'edit' ? '更新食譜' : '建立食譜'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="border border-black bg-transparent px-8 py-3 text-sm tracking-[1px] text-black transition-all duration-300 hover:bg-black hover:text-white"
          >
            取消
          </button>
        </div>
      </Form.Item>
    </Form>
  );
}
