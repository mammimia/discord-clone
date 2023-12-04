import ServerSidebar from '@/components/server/server-sidebar';
import { getCurrentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const ServerIdLayout = async ({
  children,
  params
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const profile = await getCurrentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  });

  if (!server) {
    return redirect('/');
  }

  return (
    <div className="h-full">
      <div className="z-60 fixed inset-y-0 hidden h-full w-60 flex-col md:flex">
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerIdLayout;
