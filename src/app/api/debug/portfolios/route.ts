import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get all portfolios with their status
    const allPortfolios = await prisma.portfolioPost.findMany({
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

    // Format portfolios for display
    const formattedPortfolios = allPortfolios.map(portfolio => ({
      id: portfolio.id,
      title: portfolio.title,
      published: portfolio.published,
      featured: portfolio.featured,
      owner: portfolio.owner.username,
      createdAt: portfolio.createdAt
    }));

    return NextResponse.json({
      total: allPortfolios.length,
      published: allPortfolios.filter(p => p.published).length,
      portfolios: formattedPortfolios
    });

  } catch (error) {
    console.error('Debug portfolios error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch debug info' },
      { status: 500 }
    );
  }
}
