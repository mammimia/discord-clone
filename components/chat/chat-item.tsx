'use client';

import ActionTooltip from '@/components/action-tooltip';
import UserAvatar from '@/components/ui/user-avatar';
import { cn } from '@/lib/utils';
import { Member, MemberRole, Profile } from '@prisma/client';
import { Edit, FileIcon, ShieldAlert, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timestamp: string;
  fileUrl?: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="ml-0.5 h-4 w-4 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="ml-0.5 h-4 w-4 text-rose-500" />
};

const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fileType = fileUrl?.split('.').pop();

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;

  const isDeletable = !deleted && (isAdmin || isModerator || isOwner);
  const isEditable = !deleted && isOwner && !fileUrl;
  const isPDF = fileType === 'pdf';
  const isImage = fileUrl && !isPDF;

  return (
    <div
      className="group relative flex w-full
    items-center p-4 transition hover:bg-black/5"
    >
      <div className="group flex w-full items-start gap-x-2">
        <div className="cursor-pointer transition hover:drop-shadow-md">
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className="flex w-full flex-col">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p className="cursor-pointer text-sm font-semibold hover:underline">
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-mb bg-secondary-500 relative mt-2 flex aspect-square
              h-48 w-48 items-center overflow-hidden border"
            >
              <Image
                src={fileUrl}
                alt={content}
                fill
                className="object-cover"
              />
            </a>
          )}
          {isPDF && (
            <div className="relative mt-2 flex items-center rounded-md bg-background/10 p-2">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={fileUrl || ''}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 hover:underline dark:text-indigo-400"
              >
                PDF File
              </a>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                'text-sm text-zinc-600 dark:text-zinc-300',
                deleted &&
                  'mt-1 text-xs italic text-zinc-500 dark:text-zinc-400'
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="dark:test-zinc-400 mx-2 text-[10px] text-zinc-500">
                  (edited)
                </span>
              )}
            </p>
          )}
        </div>
      </div>
      {isDeletable && (
        <div
          className="absolute -top-2 right-5 hidden items-center gap-x-2 rounded-sm
          border bg-white p-1 group-hover:flex dark:bg-zinc-800"
        >
          {isEditable && (
            <ActionTooltip label="Edit">
              <Edit
                className="ml-auto h-4 w-4 cursor-pointer text-zinc-500
              transition hover:text-zinc-600 dark:hover:text-zinc-300"
              />
            </ActionTooltip>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatItem;
