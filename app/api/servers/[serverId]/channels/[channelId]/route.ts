import { getCurrentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { MemberRole } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function DELETE(
  req: Request,
  { params }: { params: { serverId: string; channelId: string } }
) {
  try {
    const profile = await getCurrentProfile();

    if (!profile) {
      return new Response('Not Authorized', { status: 401 });
    }

    if (!params?.serverId || !params?.channelId) {
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
          delete: {
            id: params.channelId,
            name: {
              not: 'general'
            }
          }
        }
      }
    });

    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.log('[CHANNEL_ID_DELETE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string; channelId: string } }
) {
  try {
    const profile = await getCurrentProfile();
    const { name, type } = await req.json();

    if (!profile) {
      return new Response('Not Authorized', { status: 401 });
    }

    if (!params?.serverId || !params?.channelId || !name || !type) {
      return new Response('Bad Request', { status: 400 });
    }

    if (name === 'general') {
      return new Response('Name cannot be general', { status: 400 });
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
          update: {
            where: {
              id: params.channelId,
              name: {
                not: 'general'
              }
            },
            data: {
              name,
              type
            }
          }
        }
      }
    });

    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.log('[CHANNEL_ID_PATCH]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
