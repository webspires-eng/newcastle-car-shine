import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const ELASTIC_EMAIL_API_KEY = Deno.env.get('ELASTIC_EMAIL_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const inquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().min(10, "Phone must be at least 10 characters").max(20, "Phone must be less than 20 characters").regex(/^[\d\s+()-]+$/, "Phone contains invalid characters"),
  registrationNumber: z.string().trim().min(1, "Registration number is required").max(20, "Registration number must be less than 20 characters"),
  make: z.string().trim().min(1, "Make is required").max(50, "Make must be less than 50 characters"),
  model: z.string().trim().min(1, "Model is required").max(50, "Model must be less than 50 characters"),
  mileage: z.number().int("Mileage must be an integer").positive("Mileage must be positive"),
  hpiClear: z.enum(["yes", "no", "unsure"]).optional(),
  condition: z.enum(["excellent", "good", "bad"]).optional(),
  notes: z.string().trim().max(1000, "Notes must be less than 1000 characters").optional(),
});

interface InquiryData {
  name: string;
  email: string;
  phone: string;
  registrationNumber: string;
  make: string;
  model: string;
  mileage: number;
  hpiClear?: "yes" | "no" | "unsure";
  condition?: "excellent" | "good" | "bad";
  notes?: string;
}

// HTML escape function to prevent XSS
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawData = await req.json();
    
    // Validate input data
    const validationResult = inquirySchema.safeParse(rawData);
    
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error);
      return new Response(
        JSON.stringify({ error: 'Invalid input data', details: validationResult.error.issues }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    const inquiryData: InquiryData = validationResult.data;
    console.log('Received inquiry email request for:', inquiryData.email);

    // Format the email body with inquiry details - Professional design
    const emailBody = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6; 
              color: #333;
              background-color: #f4f4f4;
              padding: 20px;
            }
            .email-container { 
              max-width: 650px; 
              margin: 0 auto; 
              background: white;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header { 
              background: linear-gradient(135deg, #1a472a 0%, #2d6a3f 100%);
              color: white; 
              padding: 40px 30px;
              text-align: center;
            }
            .header h1 { 
              font-size: 28px;
              font-weight: 700;
              margin-bottom: 8px;
            }
            .header p {
              font-size: 14px;
              opacity: 0.9;
            }
            .badge {
              display: inline-block;
              background: rgba(255, 255, 255, 0.2);
              padding: 6px 16px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              margin-top: 10px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .content { 
              padding: 40px 30px;
            }
            .section {
              margin-bottom: 35px;
            }
            .section-title {
              font-size: 18px;
              font-weight: 700;
              color: #1a472a;
              margin-bottom: 20px;
              padding-bottom: 10px;
              border-bottom: 2px solid #f0f0f0;
              display: flex;
              align-items: center;
              gap: 10px;
            }
            .icon {
              width: 24px;
              height: 24px;
              background: #1a472a;
              border-radius: 6px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 14px;
            }
            .info-grid {
              display: grid;
              gap: 16px;
            }
            .info-item {
              background: #f9fafb;
              padding: 16px;
              border-radius: 8px;
              border-left: 3px solid #1a472a;
            }
            .info-label {
              font-size: 12px;
              font-weight: 600;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 6px;
            }
            .info-value {
              font-size: 16px;
              font-weight: 600;
              color: #111827;
            }
            .highlight-box {
              background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
              padding: 20px;
              border-radius: 10px;
              border: 2px solid #fbbf24;
              margin: 25px 0;
            }
            .highlight-box .reg-number {
              font-size: 32px;
              font-weight: 900;
              color: #92400e;
              text-align: center;
              letter-spacing: 4px;
              padding: 10px;
              background: white;
              border-radius: 6px;
              margin-top: 10px;
            }
            .notes-box {
              background: #f3f4f6;
              padding: 20px;
              border-radius: 8px;
              border-left: 4px solid #9ca3af;
              margin-top: 15px;
            }
            .notes-box p {
              color: #4b5563;
              font-size: 14px;
              line-height: 1.8;
              white-space: pre-wrap;
            }
            .footer {
              background: #f9fafb;
              padding: 25px 30px;
              text-align: center;
              border-top: 1px solid #e5e7eb;
            }
            .footer p {
              font-size: 13px;
              color: #6b7280;
              margin-bottom: 8px;
            }
            .cta-button {
              display: inline-block;
              background: #1a472a;
              color: white;
              padding: 12px 30px;
              border-radius: 8px;
              text-decoration: none;
              font-weight: 600;
              margin-top: 15px;
              transition: background 0.3s;
            }
            @media only screen and (max-width: 600px) {
              .email-container { margin: 10px; }
              .header, .content, .footer { padding: 25px 20px; }
              .header h1 { font-size: 24px; }
              .highlight-box .reg-number { font-size: 24px; letter-spacing: 2px; }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>🚗 New Vehicle Inquiry</h1>
              <p>Someone wants to sell their car!</p>
              <div class="badge">New Lead</div>
            </div>
            
            <div class="content">
              <div class="highlight-box">
                <p style="text-align: center; font-size: 14px; font-weight: 600; color: #92400e; margin-bottom: 5px;">VEHICLE REGISTRATION</p>
                <div class="reg-number">${escapeHtml(inquiryData.registrationNumber)}</div>
              </div>

              <div class="section">
                <div class="section-title">
                  <span class="icon">🚙</span>
                  Vehicle Information
                </div>
                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-label">Make & Model</div>
                    <div class="info-value">${escapeHtml(inquiryData.make)} ${escapeHtml(inquiryData.model)}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Mileage</div>
                    <div class="info-value">${escapeHtml(inquiryData.mileage.toLocaleString())} miles</div>
                  </div>
                  ${inquiryData.hpiClear ? `
                  <div class="info-item">
                    <div class="info-label">HPI Clear</div>
                    <div class="info-value">${inquiryData.hpiClear === 'yes' ? '✅ Yes' : inquiryData.hpiClear === 'no' ? '❌ No' : '❓ Not Sure'}</div>
                  </div>
                  ` : ''}
                  ${inquiryData.condition ? `
                  <div class="info-item">
                    <div class="info-label">Condition</div>
                    <div class="info-value">${inquiryData.condition === 'excellent' ? '⭐ Excellent - Perfect condition' : inquiryData.condition === 'good' ? '👍 Good - Few scratches' : '⚠️ Bad - Multiple scratches'}</div>
                  </div>
                  ` : ''}
                </div>
              </div>

              <div class="section">
                <div class="section-title">
                  <span class="icon">👤</span>
                  Customer Contact Details
                </div>
                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-label">Full Name</div>
                    <div class="info-value">${escapeHtml(inquiryData.name)}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Email Address</div>
                    <div class="info-value">
                      <a href="mailto:${escapeHtml(inquiryData.email)}" style="color: #1a472a; text-decoration: none;">
                        ${escapeHtml(inquiryData.email)}
                      </a>
                    </div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Phone Number</div>
                    <div class="info-value">
                      <a href="tel:${escapeHtml(inquiryData.phone)}" style="color: #1a472a; text-decoration: none;">
                        ${escapeHtml(inquiryData.phone)}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              ${inquiryData.notes ? `
              <div class="section">
                <div class="section-title">
                  <span class="icon">📝</span>
                  Additional Notes
                </div>
                <div class="notes-box">
                  <p>${escapeHtml(inquiryData.notes)}</p>
                </div>
              </div>
              ` : ''}
            </div>
            
            <div class="footer">
              <p><strong>⏰ Received:</strong> ${new Date().toLocaleString('en-GB', { 
                dateStyle: 'full', 
                timeStyle: 'short' 
              })}</p>
              <p style="margin-top: 15px; font-size: 12px;">
                This is an automated notification from Sell My Car Newcastle
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email via Elastic Email API
    const formData = new URLSearchParams();
    formData.append('apikey', ELASTIC_EMAIL_API_KEY!);
    formData.append('from', 'mail@webspires.co.uk');
    formData.append('fromName', 'Sell My Car Newcastle - New Inquiry');
    formData.append('to', 'webspires@gmail.com');
    formData.append('subject', `🚗 New Lead: ${inquiryData.make} ${inquiryData.model} - ${inquiryData.registrationNumber}`);
    formData.append('bodyHtml', emailBody);
    formData.append('isTransactional', 'true');

    const response = await fetch('https://api.elasticemail.com/v2/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('Elastic Email API error:', result);
      throw new Error(result.error || 'Failed to send email');
    }

    console.log('Email sent successfully:', result);

    return new Response(
      JSON.stringify({ success: true, messageId: result.data?.messageid }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in send-inquiry-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to send email notification' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
