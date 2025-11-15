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

    // Format the email body with inquiry details
    const emailBody = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1a472a; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; margin-top: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #1a472a; }
            .value { margin-left: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Vehicle Inquiry</h1>
            </div>
            <div class="content">
              <h2>Customer Information</h2>
              <div class="field">
                <span class="label">Name:</span>
                <span class="value">${escapeHtml(inquiryData.name)}</span>
              </div>
              <div class="field">
                <span class="label">Email:</span>
                <span class="value">${escapeHtml(inquiryData.email)}</span>
              </div>
              <div class="field">
                <span class="label">Phone:</span>
                <span class="value">${escapeHtml(inquiryData.phone)}</span>
              </div>
              
              <h2>Vehicle Details</h2>
              <div class="field">
                <span class="label">Registration:</span>
                <span class="value">${escapeHtml(inquiryData.registrationNumber)}</span>
              </div>
              <div class="field">
                <span class="label">Make:</span>
                <span class="value">${escapeHtml(inquiryData.make)}</span>
              </div>
              <div class="field">
                <span class="label">Model:</span>
                <span class="value">${escapeHtml(inquiryData.model)}</span>
              </div>
              <div class="field">
                <span class="label">Mileage:</span>
                <span class="value">${escapeHtml(inquiryData.mileage.toLocaleString())} miles</span>
              </div>
              ${inquiryData.notes ? `
              <div class="field">
                <span class="label">Additional Notes:</span>
                <div class="value">${escapeHtml(inquiryData.notes)}</div>
              </div>
              ` : ''}
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email via Elastic Email API
    const formData = new URLSearchParams();
    formData.append('apikey', ELASTIC_EMAIL_API_KEY!);
    formData.append('from', 'noreply@sellmycar.com');
    formData.append('fromName', 'Sell My Car Newcastle');
    formData.append('to', 'sales@sellmycar.com'); // Replace with your actual sales email
    formData.append('subject', `New Vehicle Inquiry - ${inquiryData.make} ${inquiryData.model}`);
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
