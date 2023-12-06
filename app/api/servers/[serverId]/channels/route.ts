import { getCurrentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { MemberRole } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await getCurrentProfile();

    if (!profile) {
      return new Response('Not Authorized', { status: 401 });
    }

    const { name, type } = await req.json();

    if (!params?.serverId || name === 'general') {
      return new Response('Bad Request', { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR]
            }
          }
        }
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            name,
            type
          }
        }
      }
    });

    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.log('[CHANNEL_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
