import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const { status } = await request.json();

    // Validate status
    if (!['unread', 'read'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Try to use database
    try {
      const { prisma } = await import('@/lib/prisma');
      
      const updatedMessage = await prisma.contactMessage.update({
        where: { id },
        data: { status },
      });

      return NextResponse.json({ success: true, data: updatedMessage });
    } catch (dbError) {
      console.error('Database error updating message status:', dbError);
      return NextResponse.json(
        { success: false, error: 'Failed to update message status' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update message' },
      { status: 500 }
    );
  }
}
