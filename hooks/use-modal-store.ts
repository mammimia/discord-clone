import { Server } from '@prisma/client';
import { create } from 'zustand';

export type ModalType = 'createServer' | 'invite';

interface ModalData {
  server?: Server;
}

export interface ModalStore {
  type: ModalType | null;
  data?: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ data, type, isOpen: true }),
  onClose: () => set({ data: {}, type: null, isOpen: false })
}));
