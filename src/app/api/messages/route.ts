import { NextResponse } from 'next/server';

// Mock data for when database is not available
const mockMessages = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Project Inquiry',
    message: 'I would like to discuss a potential project with you.',
    status: 'unread',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    subject: 'Collaboration Opportunity',
    message: 'Your portfolio looks great! Let\'s collaborate on a project.',
    status: 'read',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '5');
    const skip = (page - 1) * limit;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';

    // Try to use database (SQLite for local, PostgreSQL for production)
    try {
      const { prisma } = await import('@/lib/prisma');
      
      // Build where clause for search and filtering
      const where: any = {};
      
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { subject: { contains: search, mode: 'insensitive' } },
          { message: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      if (status !== 'all') {
        where.status = status;
      }

      const [messages, total] = await Promise.all([
        prisma.contactMessage.findMany({
          where,
          orderBy: {
            createdAt: 'desc'
          },
          skip,
          take: limit,
        }),
        prisma.contactMessage.count({ where })
      ]);

      return NextResponse.json({ 
        success: true, 
        data: {
          messages,
          total,
          page,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (dbError) {
      console.warn('Database not available, using mock data:', dbError);
      
      // Filter mock data
      let filteredMessages = mockMessages;
      
      if (search) {
        filteredMessages = filteredMessages.filter(msg => 
          msg.name.toLowerCase().includes(search.toLowerCase()) ||
          msg.email.toLowerCase().includes(search.toLowerCase()) ||
          msg.subject.toLowerCase().includes(search.toLowerCase()) ||
          msg.message.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      if (status !== 'all') {
        filteredMessages = filteredMessages.filter(msg => msg.status === status);
      }
      
      const total = filteredMessages.length;
      const paginatedMessages = filteredMessages.slice(skip, skip + limit);

      return NextResponse.json({ 
        success: true, 
        data: {
          messages: paginatedMessages,
          total,
          page,
          totalPages: Math.ceil(total / limit)
        }
      });
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();

    // Try to use Prisma, fallback to mock data
    try {
      const { prisma } = await import('@/lib/prisma');
      
      const updatedMessage = await prisma.contactMessage.update({
        where: { id },
        data: { status }
      });

      return NextResponse.json({ success: true, data: updatedMessage });
    } catch (dbError) {
      console.warn('Database not available, updating mock data:', dbError);
      
      // Update mock data
      const messageIndex = mockMessages.findIndex(msg => msg.id === id);
      if (messageIndex !== -1) {
        mockMessages[messageIndex].status = status;
        mockMessages[messageIndex].updatedAt = new Date().toISOString();
        return NextResponse.json({ success: true, data: mockMessages[messageIndex] });
      }
      
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error updating message status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update message' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Message ID is required' },
        { status: 400 }
      );
    }

    // Try to use Prisma, fallback to mock data
    try {
      const { prisma } = await import('@/lib/prisma');
      
      await prisma.contactMessage.delete({
        where: { id }
      });

      return NextResponse.json({ success: true });
    } catch (dbError) {
      console.warn('Database not available, deleting from mock data:', dbError);
      
      // Delete from mock data
      const messageIndex = mockMessages.findIndex(msg => msg.id === id);
      if (messageIndex !== -1) {
        mockMessages.splice(messageIndex, 1);
        return NextResponse.json({ success: true });
      }
      
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}
