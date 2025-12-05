import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { to, subject, message, fromName } = await request.json();

    if (!to || !message) {
      return NextResponse.json(
        { success: false, error: 'Recipient email and message are required' },
        { status: 400 }
      );
    }

    const emailData = {
      from: process.env.FROM_EMAIL || 'noreply@yourdomain.com',
      to: [to],
      subject: `Re: ${subject}`,
      replyTo: process.env.ADMIN_EMAIL || 'admin@yourdomain.com',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-bottom: 10px;">Reply to your inquiry</h2>
            <p style="color: #666; margin-bottom: 20px;">${fromName || 'Admin'} has responded to your message:</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
            <div style="white-space: pre-wrap; color: #333; line-height: 1.6;">${message}</div>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background-color: #f1f3f4; border-radius: 8px;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              <strong>Please follow up if you have any questions or need further assistance.</strong>
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 10px;">
              This is an automated response from the portfolio contact system.
            </p>
          </div>
        </div>
      `
    };

    const { data, error } = await resend.emails.send(emailData);

    if (error) {
      console.error('Resend API error:', error);
      let errorMessage = error.message || JSON.stringify(error) || 'Failed to send email via Resend';
      
      // Provide helpful guidance for common errors
      if (errorMessage.includes('only send testing emails')) {
        errorMessage = 'Resend test domain limitation: You can only send test emails to your own email. To send to other recipients, you need to verify a domain at resend.com/domains and update your FROM_EMAIL in .env file.';
      }
      
      if (errorMessage.includes('domain is not verified')) {
        errorMessage = 'Domain ejceex.tk is not verified yet. Please wait for DNS verification to complete in Resend dashboard.';
      }
      
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 500 }
      );
    }

    console.log('Email sent successfully:', data);

    return NextResponse.json({ 
      success: true, 
      message: 'Reply sent successfully',
      data 
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send reply' },
      { status: 500 }
    );
  }
}
