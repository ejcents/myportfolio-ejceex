import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const featuredPortfolios = await prisma.portfolioPost.findMany({
      where: {
        published: true,
        featured: true
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
    const formattedPortfolios = featuredPortfolios.map((portfolio: any) => ({
      ...portfolio,
      images: portfolio.images ? JSON.parse(portfolio.images) : [],
      tags: portfolio.tags ? JSON.parse(portfolio.tags) : []
    }));

    return NextResponse.json(formattedPortfolios);

  } catch (error) {
    console.error('Error fetching featured portfolios:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured portfolios' },
      { status: 500 }
    );
  }
}
