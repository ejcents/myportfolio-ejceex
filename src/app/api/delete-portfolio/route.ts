import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('DELETE-PORTFOLIO POST request received');
    
    // Get user from token
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      console.log('No token provided');
      return NextResponse.json(
        { success: false, error: 'Authorization required - no token provided' },
        { status: 401 }
      );
    }

    console.log('Token found, decoding...');
    // Decode token to get user ID
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const userId = decoded.split(':')[0];
    
    console.log('User ID from token:', userId);

    if (!userId) {
      console.log('Invalid token format');
      return NextResponse.json(
        { success: false, error: 'Invalid token format' },
        { status: 401 }
      );
    }

    // Get portfolio ID from request body
    const { portfolioId } = await request.json();
    
    if (!portfolioId) {
      console.log('No portfolio ID provided');
      return NextResponse.json(
        { success: false, error: 'Portfolio ID is required' },
        { status: 400 }
      );
    }

    console.log('Deleting portfolio:', portfolioId);

    // Check if portfolio exists and belongs to user
    const portfolio = await prisma.portfolioPost.findUnique({
      where: { id: portfolioId }
    });

    if (!portfolio) {
      console.log('Portfolio not found:', portfolioId);
      return NextResponse.json(
        { success: false, error: `Portfolio not found with ID: ${portfolioId}` },
        { status: 404 }
      );
    }

    console.log('Portfolio found, owner:', portfolio.ownerId, 'requester:', userId);

    if (portfolio.ownerId !== userId) {
      console.log('Unauthorized: portfolio owner does not match requester');
      return NextResponse.json(
        { success: false, error: 'Unauthorized - you can only delete your own portfolios' },
        { status: 403 }
      );
    }

    console.log('Deleting portfolio...');
    // Delete the portfolio
    await prisma.portfolioPost.delete({
      where: { id: portfolioId }
    });

    console.log('Portfolio deleted successfully');
    return NextResponse.json({ 
      success: true, 
      message: 'Portfolio deleted successfully' 
    });

  } catch (error) {
    console.error('Portfolio deletion error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: `Failed to delete portfolio: ${error instanceof Error ? error.message : 'Unknown error'}` 
      },
      { status: 500 }
    );
  }
}
