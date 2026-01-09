import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingEmailRequest {
  customerName: string;
  customerEmail: string;
  serviceName: string;
  bookingDate: string;
  timeSlot: string;
  bookingId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
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
      bookingId 
    }: BookingEmailRequest = await req.json();

    const resend = new Resend(RESEND_API_KEY);
    const emailResponse = await resend.emails.send({
      from: "Chill & Thrive <onboarding@resend.dev>",
      to: [customerEmail],
      subject: "Booking Confirmation - Chill & Thrive",
      html: `
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
            .cta { display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">❄️ Chill & Thrive</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Booking Confirmation</p>
            </div>
            <div class="content">
              <h2 style="color: #0f172a; margin-top: 0;">Hello ${customerName}! 👋</h2>
              <p>Thank you for booking with Chill & Thrive! Your session has been confirmed.</p>
              
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
                <div class="detail-row">
                  <span class="label">Booking ID</span>
                  <span class="value">${bookingId.slice(0, 8).toUpperCase()}</span>
                </div>
              </div>
              
              <h3 style="color: #0f172a;">What to bring:</h3>
              <ul style="color: #475569;">
                <li>Comfortable swimwear</li>
                <li>Towel (or we provide one)</li>
                <li>Positive mindset! ❄️💪</li>
              </ul>
              
              <p style="color: #475569;">Please arrive 10 minutes before your scheduled time. If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
              
              <div class="footer">
                <p>Questions? Reply to this email or contact us</p>
                <p style="margin-top: 15px;">© ${new Date().getFullYear()} Chill & Thrive. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-booking-confirmation:", error);
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
