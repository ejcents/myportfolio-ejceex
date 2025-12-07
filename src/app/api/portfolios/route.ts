import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const portfolios = await prisma.portfolioPost.findMany({
      where: {
        published: true
      },
      include: {
        owner: {
          select: {
            username: true,
            avatar: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Parse JSON strings for images and tags
    const formattedPortfolios = portfolios.map(portfolio => ({
      ...portfolio,
      images: portfolio.images ? JSON.parse(portfolio.images) : [],
      tags: portfolio.tags ? JSON.parse(portfolio.tags) : []
    }));

    return NextResponse.json(formattedPortfolios);

  } catch (error) {
    console.error('Error fetching portfolios:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolios' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const { title, description, content, images, tags, category, published, featured } = await request.json();

    // Validate required fields
    if (!title || !description || !category) {
      return NextResponse.json(
        { error: 'Title, description, and category are required' },
        { status: 400 }
      );
    }

    // Create portfolio post
    const portfolio = await prisma.portfolioPost.create({
      data: {
        title,
        description,
        content,
        images: images || '[]',
        tags: tags || '[]',
        category,
        ownerId: userId,
        published: published || false,
        featured: featured || false
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
      ...portfolio,
      images: portfolio.images ? JSON.parse(portfolio.images) : [],
      tags: portfolio.tags ? JSON.parse(portfolio.tags) : []
    };

    return NextResponse.json(formattedPortfolio);

  } catch (error) {
    console.error('Error creating portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to create portfolio' },
      { status: 500 }
    );
  }
}
