'use client';

import CreateServerModal from '@/components/modals/create-server-modal';
import EditServerModal from '@/components/modals/edit-server-modal';
import InviteModal from '@/components/modals/invite-modal';
import ManageMembersModal from '@/components/modals/manage-members-modal';
import { useEffect, useState } from 'react';

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateServerModal />
      <EditServerModal />
      <InviteModal />
      <ManageMembersModal />
    </>
  );
};

export default ModalProvider;
