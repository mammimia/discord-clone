'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useModal } from '@/hooks/use-modal-store';

const ManageMembersModal = () => {
  const { isOpen, onOpen, onClose, type, data } = useModal();

  const isModalOpen = type === 'manageMembers' && isOpen;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Manage Members
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center text-zinc-500">
          Manage members and roles for your server.
        </DialogDescription>
        <div className="p-6"></div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageMembersModal;
