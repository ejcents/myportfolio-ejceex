import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    console.log('DELETE request received for portfolio:', resolvedParams.id);
    
    // Get user from token
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      console.log('No token provided');
      return NextResponse.json(
        { error: 'Authorization required - no token provided' },
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
        { error: 'Invalid token format' },
        { status: 401 }
      );
    }

    // Check if portfolio exists and belongs to user
    const portfolio = await prisma.portfolioPost.findUnique({
      where: { id: resolvedParams.id }
    });

    if (!portfolio) {
      console.log('Portfolio not found:', resolvedParams.id);
      return NextResponse.json(
        { error: `Portfolio not found with ID: ${resolvedParams.id}` },
        { status: 404 }
      );
    }

    console.log('Portfolio found, owner:', portfolio.ownerId, 'requester:', userId);

    if (portfolio.ownerId !== userId) {
      console.log('Unauthorized: portfolio owner does not match requester');
      return NextResponse.json(
        { error: 'Unauthorized - you can only delete your own portfolios' },
        { status: 403 }
      );
    }

    console.log('Deleting portfolio...');
    // Delete the portfolio
    await prisma.portfolioPost.delete({
      where: { id: resolvedParams.id }
    });

    console.log('Portfolio deleted successfully');
    return NextResponse.json({ message: 'Portfolio deleted successfully' });

  } catch (error) {
    console.error('Portfolio deletion error:', error);
    return NextResponse.json(
      { error: `Failed to delete portfolio: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    console.log('GET request for portfolio:', resolvedParams.id);
    
    // First, check if portfolio exists regardless of published status
    const anyPortfolio = await prisma.portfolioPost.findUnique({
      where: { id: resolvedParams.id },
      select: {
        id: true,
        title: true,
        published: true,
        ownerId: true
      }
    });

    console.log('Portfolio found (any status):', anyPortfolio);

    if (!anyPortfolio) {
      console.log('Portfolio not found at all');
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }

    if (!anyPortfolio.published) {
      console.log('Portfolio exists but not published');
      return NextResponse.json(
        { error: 'Portfolio not found or not published' },
        { status: 404 }
      );
    }

    // Get full portfolio details
    const portfolio = await prisma.portfolioPost.findUnique({
      where: { 
        id: resolvedParams.id,
        published: true
      },
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

    console.log('Published portfolio found:', portfolio ? 'YES' : 'NO');

    if (!portfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found or not published' },
        { status: 404 }
      );
    }

    // Get user info if token exists, otherwise treat as anonymous viewer
    let userId = null;
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (token) {
      try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        userId = decoded.split(':')[0];
      } catch (error) {
        console.log('Invalid token format, treating as anonymous viewer');
      }
    }

    // Create a unique identifier for the viewer (user ID or IP address)
    let viewerId = userId || 'anonymous';
    
    // Try to get IP address from various headers
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0] || realIp || 'anonymous';
    
    if (!userId) {
      viewerId = ip;
    }
    
    console.log('Viewer ID:', viewerId);

    // Simple view counting with session-based prevention
    // Use a shorter time window (5 minutes) and check without PortfolioView model
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    console.log('Viewer ID:', viewerId);
    console.log('Five minutes ago:', fiveMinutesAgo);

    if (!userId || portfolio.ownerId !== userId) {
      console.log('Viewer is not owner, checking if portfolio was recently updated...');
      
      // Check if the portfolio was updated recently (simple approach)
      const recentlyUpdated = portfolio.updatedAt && portfolio.updatedAt > fiveMinutesAgo;
      
      if (!recentlyUpdated) {
        console.log('No recent update found, incrementing count...');
        // Increment view count and update timestamp
        await prisma.portfolioPost.update({
          where: { id: resolvedParams.id },
          data: {
            views: {
              increment: 1
            },
            updatedAt: new Date()
          }
        });

        console.log('View count incremented for:', userId ? 'non-owner user' : 'anonymous viewer');
      } else {
        console.log('Portfolio recently updated - view count not incremented (rate limited)');
      }
    } else {
      console.log('Owner viewing their own portfolio - view count not incremented');
    }

    // Parse JSON strings for response
    const formattedPortfolio = {
      ...portfolio,
      images: portfolio.images ? JSON.parse(portfolio.images) : [],
      tags: portfolio.tags ? JSON.parse(portfolio.tags) : []
    };

    console.log('Returning portfolio data');
    return NextResponse.json(formattedPortfolio);

  } catch (error) {
    console.error('Portfolio fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    
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

    // Check if portfolio exists and belongs to user
    const existingPortfolio = await prisma.portfolioPost.findUnique({
      where: { id: resolvedParams.id }
    });

    if (!existingPortfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }

    if (existingPortfolio.ownerId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized to update this portfolio' },
        { status: 403 }
      );
    }

    const { title, description, content, images, tags, category, published, featured } = await request.json();

    // Update portfolio
    const updatedPortfolio = await prisma.portfolioPost.update({
      where: { id: resolvedParams.id },
      data: {
        title,
        description,
        content,
        images: images || '[]',
        tags: tags || '[]',
        category,
        published: published !== undefined ? published : existingPortfolio.published,
        featured: featured !== undefined ? featured : existingPortfolio.featured
      },
      include: {
        owner: {
          select: {
            username: true,
            avatar: true
          }
        }
      }
    });

    // Parse JSON strings for response
    const formattedPortfolio = {
      ...updatedPortfolio,
      images: updatedPortfolio.images ? JSON.parse(updatedPortfolio.images) : [],
      tags: updatedPortfolio.tags ? JSON.parse(updatedPortfolio.tags) : []
    };

    return NextResponse.json(formattedPortfolio);

  } catch (error) {
    console.error('Portfolio update error:', error);
    return NextResponse.json(
      { error: 'Failed to update portfolio' },
      { status: 500 }
    );
  }
}
