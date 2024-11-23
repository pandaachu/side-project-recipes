import { Button } from 'antd';
import { CldUploadWidget } from 'next-cloudinary';
import { useState } from 'react';

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
}
const ImageUpload: React.FC<ImageUploadProps> = ({ onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadSuccess = async (result: any) => {
    const url = result.info.secure_url;
    setIsUploading(true);

    // 保存圖片元數據到資料庫
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Image metadata saved:', data);
        // 調用父元件的回調函數
        onUploadSuccess(url);
      } else {
        console.error('Failed to save image metadata');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <CldUploadWidget uploadPreset="recipe_demo" onSuccess={handleUploadSuccess}>
        {({ open }) => (
          <Button onClick={() => open()} disabled={isUploading}>
            {isUploading ? '上傳中...' : '上傳圖片'}
          </Button>
        )}
      </CldUploadWidget>
      {/* {imageUrl && <img src={imageUrl} alt="Uploaded" width={300} />} */}
    </div>
  );
};

export default ImageUpload;
