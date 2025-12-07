import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get user from token
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization required' },
        { status: 401 }
      );
    }

    // Decode token to get user ID
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const userId = decoded.split(':')[0];

    // Get user's portfolios
    const portfolios = await prisma.portfolioPost.findMany({
      where: {
        ownerId: userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(portfolios);

  } catch (error) {
    console.error('My portfolios fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
