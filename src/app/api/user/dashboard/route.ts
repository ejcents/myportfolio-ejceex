import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface DashboardData {
  savedPortfolios: any[];
  viewedPortfolios: any[];
  following: any[];
}

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

    // Get user's viewed portfolios (this would need a separate table in a real app)
    // For now, we'll return empty arrays as these features aren't fully implemented
    const savedPortfolios: any[] = [];
    const viewedPortfolios: any[] = [];
    const following: any[] = [];

    const dashboardData: DashboardData = {
      savedPortfolios,
      viewedPortfolios,
      following
    };

    return NextResponse.json(dashboardData);

  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
