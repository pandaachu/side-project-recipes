'use client';
// import DialogWrapper from '@/components/dialog/Dialog'
// import SignUpClient from '@/components/page/auth/SignUpClient'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  // DialogTrigger,
} from '@/components/ui/dialog';

export default function SignUpModal() {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => {
    setIsOpen(false);
    router.push('/');
  };
  // const openModal = () => setIsOpen(true);
  useEffect(() => {
    // 當路由變為 /signup 時，開啟 Dialog
    if (router.pathname === '/login') {
      setIsOpen(true);
    }
  }, [router.pathname]);
  return (
    // <DialogWrapper open={true}>
    //   <SignUpClient />
    // </DialogWrapper>
    <Dialog open={isOpen} onOpenChange={closeModal}>
      {/* <DialogTrigger>Open</DialogTrigger> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>LoginModal</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your data from our
            servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
