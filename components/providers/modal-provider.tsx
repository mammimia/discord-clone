'use client';

import CreateChannelModal from '@/components/modals/create-channel-modal';
import CreateServerModal from '@/components/modals/create-server-modal';
import DeleteChannelModal from '@/components/modals/delete-channel-modal';
import DeleteServerModal from '@/components/modals/delete-server-modal';
import EditServerModal from '@/components/modals/edit-server-modal';
import InviteModal from '@/components/modals/invite-modal';
import LeaveServerModal from '@/components/modals/leave-server-modal';
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
      <CreateChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <DeleteChannelModal />
    </>
  );
};

export default ModalProvider;
