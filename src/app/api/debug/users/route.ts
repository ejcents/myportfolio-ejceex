import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // Create a test user if none exists
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('password123', 12);

    const testUser = await prisma.user.create({
      data: {
        username: 'testuser',
        email: 'test@example.com',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
        role: 'PUBLIC'
      }
    });

    // Create a portfolio owner
    const portfolioOwner = await prisma.user.create({
      data: {
        username: 'portfolioowner',
        email: 'owner@example.com',
        password: hashedPassword,
        firstName: 'Portfolio',
        lastName: 'Owner',
        role: 'PORTFOLIO_OWNER'
      }
    });

    // Create an admin
    const admin = await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Test users created successfully',
      users: [
        { id: testUser.id, username: testUser.username, email: testUser.email, role: testUser.role },
        { id: portfolioOwner.id, username: portfolioOwner.username, email: portfolioOwner.email, role: portfolioOwner.role },
        { id: admin.id, username: admin.username, email: admin.email, role: admin.role }
      ]
    });
  } catch (error) {
    console.error('Error creating test users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create test users' },
      { status: 500 }
    );
  }
}
