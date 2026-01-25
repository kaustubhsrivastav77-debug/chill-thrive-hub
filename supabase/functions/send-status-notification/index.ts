import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface StatusNotificationRequest {
  customerName: string;
  customerEmail: string;
  serviceName: string;
  bookingDate: string;
  timeSlot: string;
  status: "confirmed" | "completed";
  googleMapsUrl?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      console.log("RESEND_API_KEY not configured - email not sent");
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Email service not configured. Please add RESEND_API_KEY secret." 
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { 
      customerName, 
      customerEmail, 
      serviceName, 
      bookingDate, 
      timeSlot,
      status,
      googleMapsUrl
    }: StatusNotificationRequest = await req.json();

    const resend = new Resend(RESEND_API_KEY);

    let subject = "";
    let content = "";

    if (status === "confirmed") {
      subject = "Your Booking is Confirmed! - Chill & Thrive";
      content = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0ea5e9, #06b6d4); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
            .detail-row:last-child { border-bottom: none; }
            .label { color: #64748b; }
            .value { font-weight: 600; color: #0f172a; }
            .footer { text-align: center; margin-top: 20px; color: #64748b; font-size: 14px; }
            .success-badge { display: inline-block; background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">❄️ Chill & Thrive</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Booking Confirmed</p>
            </div>
            <div class="content">
              <div style="text-align: center; margin-bottom: 20px;">
                <span class="success-badge">✓ Confirmed</span>
              </div>
              <h2 style="color: #0f172a; margin-top: 0;">Great news, ${customerName}! 🎉</h2>
              <p>Your booking has been confirmed by our team. We're excited to see you!</p>
              
              <div class="booking-details">
                <div class="detail-row">
                  <span class="label">Service</span>
                  <span class="value">${serviceName}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Date</span>
                  <span class="value">${bookingDate}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Time</span>
                  <span class="value">${timeSlot}</span>
                </div>
              </div>
              
              <h3 style="color: #0f172a;">What to bring:</h3>
              <ul style="color: #475569;">
                <li>Comfortable swimwear</li>
                <li>Towel (or we provide one)</li>
                <li>Positive mindset! ❄️💪</li>
              </ul>
              
              <p style="color: #475569;">Please arrive 10 minutes before your scheduled time.</p>
              
              <div class="footer">
                <p>© ${new Date().getFullYear()} Chill & Thrive. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (status === "completed") {
      const reviewLink = googleMapsUrl || "https://www.google.com/search?q=chill+thrive";
      subject = "Thank You for Visiting! - Share Your Experience";
      content = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0ea5e9, #06b6d4); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; margin-top: 20px; color: #64748b; font-size: 14px; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #0ea5e9, #06b6d4); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .stars { font-size: 32px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">❄️ Chill & Thrive</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Session Complete</p>
            </div>
            <div class="content">
              <h2 style="color: #0f172a; margin-top: 0; text-align: center;">Thank You, ${customerName}! 🙏</h2>
              <p style="text-align: center;">We hope you had an amazing ${serviceName} experience with us.</p>
              
              <div style="text-align: center;">
                <div class="stars">⭐⭐⭐⭐⭐</div>
                <p style="font-size: 18px; color: #0f172a; font-weight: 600;">How was your experience?</p>
                <p style="color: #64748b;">Your feedback helps us serve you better and helps others discover our services.</p>
                <a href="${reviewLink}" class="cta-button" style="color: white;">Leave a Review on Google</a>
              </div>
              
              <p style="text-align: center; color: #64748b; margin-top: 30px;">
                We'd love to see you again soon! Book your next session and continue your wellness journey.
              </p>
              
              <div class="footer">
                <p>© ${new Date().getFullYear()} Chill & Thrive. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "Chill & Thrive <onboarding@resend.dev>",
      to: [customerEmail],
      subject,
      html: content,
    });

    console.log("Status notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-status-notification:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
