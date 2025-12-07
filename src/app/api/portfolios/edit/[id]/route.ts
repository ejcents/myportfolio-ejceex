import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    console.log('EDIT GET request for portfolio:', resolvedParams.id);
    
    // Get user from token
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      console.log('No token provided for edit');
      return NextResponse.json(
        { error: 'Authorization required' },
        { status: 401 }
      );
    }

    console.log('Token found, decoding...');
    // Decode token to get user ID
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const userId = decoded.split(':')[0];
    
    console.log('Edit request from user:', userId);

    if (!userId) {
      console.log('Invalid token format');
      return NextResponse.json(
        { error: 'Invalid token format' },
        { status: 401 }
      );
    }

    console.log('Looking for portfolio with ID:', resolvedParams.id);
    
    // Check if portfolio exists and belongs to user (regardless of published status)
    const portfolio = await prisma.portfolioPost.findUnique({
      where: { id: resolvedParams.id },
      include: {
        owner: {
          select: {
            username: true,
            avatar: true,
            firstName: true,
            lastName: true,
            bio: true
          }
        }
      }
    });

    console.log('Portfolio query result:', portfolio);

    if (!portfolio) {
      console.log('Portfolio not found for editing:', resolvedParams.id);
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }

    console.log('Portfolio found, owner:', portfolio.ownerId, 'requester:', userId);

    if (portfolio.ownerId !== userId) {
      console.log('Unauthorized edit attempt');
      return NextResponse.json(
        { error: 'Unauthorized - you can only edit your own portfolios' },
        { status: 403 }
      );
    }

    console.log('Parsing JSON strings...');
    // Parse JSON strings for response
    const formattedPortfolio = {
      ...portfolio,
      images: portfolio.images ? JSON.parse(portfolio.images) : [],
      tags: portfolio.tags ? JSON.parse(portfolio.tags) : []
    };

    console.log('Returning portfolio for editing');
    return NextResponse.json(formattedPortfolio);

  } catch (error) {
    console.error('Portfolio edit fetch error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Failed to fetch portfolio for editing' },
      { status: 500 }
    );
  }
}
