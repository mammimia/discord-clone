import ChatHeader from '@/components/chat/chat-header';
import ChatInput from '@/components/chat/chat-input';
import ChatMessages from '@/components/chat/chat-messages';
import { getConversation } from '@/lib/conversation';
import { getCurrentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

interface ConversationPageProps {
  params: {
    serverId: string;
    memberId: string;
  };
}

const ConversationPage = async ({ params }: ConversationPageProps) => {
  const profile = await getCurrentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const currentMember = await db.member.findFirst({
    where: {
      profileId: profile.id,
      serverId: params.serverId
    },
    include: {
      profile: true
    }
  });

  if (!currentMember) {
    return redirect('/');
  }

  const conversation = await getConversation(currentMember.id, params.memberId);

  if (!conversation) {
    return redirect(`/servers/${params.serverId}`);
  }

  const { memberOne, memberTwo } = conversation;

  const recipient = memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
      <ChatHeader
        imageUrl={recipient.profile.imageUrl}
        name={recipient.profile.name}
        serverId={params.serverId}
        type="conversation"
      />
      <ChatMessages
        member={currentMember}
        name={recipient.profile.name}
        chatId={conversation.id}
        type="conversation"
        apiUrl="/api/direct-messages"
        paramKey="conversationId"
        paramValue={conversation.id}
        socketUrl="/api/socket/direct-messages"
        socketQuery={{
          conversationId: conversation.id
        }}
      />
      <ChatInput
        name={recipient.profile.name}
        type="conversation"
        apiUrl="/api/socket/direct-messages"
        query={{ conversationId: conversation.id }}
      />
    </div>
  );
};

export default ConversationPage;
