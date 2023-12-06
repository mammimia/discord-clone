import { getCurrentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string; serverId: string } }
) {
  try {
    const profile = await getCurrentProfile();
    const { serverId, memberId } = params;
    const { role } = await req.json();

    if (!profile) return new NextResponse('Unauthorized', { status: 401 });

    if (!serverId || !memberId || !role)
      return new NextResponse('Bad Request', { status: 400 });

    const server = await db.server.update({
      where: { id: serverId, profileId: profile.id },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
              profileId: {
                not: profile.id
              }
            },
            data: { role }
          }
        }
      },
      include: {
        members: {
          include: { profile: true },
          orderBy: {
            role: 'asc'
          }
        }
      }
    });

    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.log('[MEMBERS_ID_PATCH]', error);
    return new NextResponse('Internal Error', {
      status: 500
    });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { memberId: string; serverId: string } }
) {
  try {
    const profile = await getCurrentProfile();
    const { serverId, memberId } = params;

    if (!profile) return new NextResponse('Unauthorized', { status: 401 });

    if (!serverId || !memberId)
      return new NextResponse('Bad Request', { status: 400 });

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id
      },
      data: {
        members: {
          deleteMany: {
            id: memberId,
            profileId: {
              not: profile.id
            }
          }
        }
      },
      include: {
        members: {
          include: { profile: true },
          orderBy: {
            role: 'asc'
          }
        }
      }
    });

    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.log('[MEMBERS_ID_DELETE]', error);
    return new NextResponse('Internal Error', {
      status: 500
    });
  }
}
