'use client';

import { Input, message, Modal, Rate } from 'antd';
import axios from 'axios';
import { useState } from 'react';

interface CookLogButtonProps {
  recipeId: string;
  onLogged: () => void;
}

// "I cooked this" button — opens a modal to log a cook with optional rating/note
export default function CookLogButton({ recipeId, onLogged }: CookLogButtonProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [note, setNote] = useState('');

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await axios.post(`/api/recipes/${recipeId}/cook`, {
        ...(rating > 0 && { rating }),
        ...(note.trim() && { note: note.trim() }),
      });
      message.success('已記錄這次料理');
      setOpen(false);
      setRating(0);
      setNote('');
      onLogged();
    } catch {
      message.error('記錄失敗');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="border border-black bg-black px-6 py-2.5 text-sm tracking-[1px] text-white transition-all duration-300 hover:bg-[#424242]"
      >
        我煮了這道 🍳
      </button>

      <Modal
        title="記錄這次料理"
        open={open}
        onOk={handleSubmit}
        onCancel={() => setOpen(false)}
        okText="記錄"
        cancelText="取消"
        confirmLoading={isLoading}
      >
        <div className="py-4">
          <p className="mb-2 text-sm text-[#616161]">好吃程度（選填）</p>
          <Rate value={rating} onChange={setRating} />
          <p className="mt-6 mb-2 text-sm text-[#616161]">心得（選填）</p>
          <Input.TextArea
            rows={3}
            maxLength={500}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="火候、調味的調整…"
          />
        </div>
      </Modal>
    </>
  );
}
