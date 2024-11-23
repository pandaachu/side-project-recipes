'use client';

import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { RecipeCardProps } from '@/types/recipe';
const { Meta } = Card;

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/recipes/${recipe.id}`);
  };

  return (
    <Card
      hoverable
      className="w-full cursor-pointer shadow-md"
      onClick={handleCardClick}
      cover={
        <div className="relative h-48 w-full overflow-hidden">
          <Image src={recipe.coverImage} alt={recipe.title} fill className="object-cover" />
        </div>
      }
      actions={[
        <SettingOutlined key="setting" onClick={(e) => e.stopPropagation()} />,
        <EditOutlined key="edit" onClick={(e) => e.stopPropagation()} />,
        <EllipsisOutlined key="ellipsis" onClick={(e) => e.stopPropagation()} />,
      ]}
    >
      <Meta
        avatar={<Avatar src={recipe.authorImage || 'https://api.dicebear.com/7.x/miniavs/svg?seed=8'} />}
        title={recipe.title}
        description={
          <div className="space-y-2">
            <div className="text-gray-500">
              <span>👥 {recipe.forPeople}人份</span>
              {recipe.cookingTime && <span className="ml-4">⏰ {recipe.cookingTime}分鐘</span>}
            </div>
            {recipe.tags && <div className="text-gray-500">🏷️ {recipe.tags}</div>}
            <div className="text-sm text-gray-500">作者：{recipe.authorName || '匿名'}</div>
          </div>
        }
      />
    </Card>
  );
};

export default RecipeCard;
