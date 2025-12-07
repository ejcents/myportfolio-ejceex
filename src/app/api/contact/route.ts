import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    // Try to save to database first
    try {
      const contactMessage = await prisma.contactMessage.create({
        data: {
          name,
          email,
          subject,
          message,
          status: 'unread',
        },
      });
      return NextResponse.json({ success: true, data: contactMessage });
    } catch (dbError) {
      console.error('Database error, falling back to file storage:', dbError);
      
      // Fallback to file storage
      const messagesDir = join(process.cwd(), 'data');
      const messagesFile = join(messagesDir, 'messages.json');
      
      // Ensure data directory exists
      await mkdir(messagesDir, { recursive: true });
      
      // Read existing messages
      let messages = [];
      try {
        const existingData = await readFile(messagesFile, 'utf-8');
        messages = JSON.parse(existingData);
      } catch (fileError) {
        // File doesn't exist or is empty, start with empty array
        messages = [];
      }
      
      // Add new message
      const newMessage = {
        id: Date.now().toString(),
        name,
        email,
        subject,
        message,
        status: 'unread',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      messages.push(newMessage);
      
      // Write back to file
      await writeFile(messagesFile, JSON.stringify(messages, null, 2));
      
      return NextResponse.json({ success: true, data: newMessage });
    }
  } catch (error) {
    console.error('Error saving message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
