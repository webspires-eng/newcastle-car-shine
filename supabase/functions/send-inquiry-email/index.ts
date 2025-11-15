import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ELASTIC_EMAIL_API_KEY = Deno.env.get('ELASTIC_EMAIL_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const inquiryData: InquiryData = await req.json();
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
                <span class="value">${inquiryData.name}</span>
              </div>
              <div class="field">
                <span class="label">Email:</span>
                <span class="value">${inquiryData.email}</span>
              </div>
              <div class="field">
                <span class="label">Phone:</span>
                <span class="value">${inquiryData.phone}</span>
              </div>
              
              <h2>Vehicle Details</h2>
              <div class="field">
                <span class="label">Registration:</span>
                <span class="value">${inquiryData.registrationNumber}</span>
              </div>
              <div class="field">
                <span class="label">Make:</span>
                <span class="value">${inquiryData.make}</span>
              </div>
              <div class="field">
                <span class="label">Model:</span>
                <span class="value">${inquiryData.model}</span>
              </div>
              <div class="field">
                <span class="label">Mileage:</span>
                <span class="value">${inquiryData.mileage.toLocaleString()} miles</span>
              </div>
              ${inquiryData.notes ? `
              <div class="field">
                <span class="label">Additional Notes:</span>
                <div class="value">${inquiryData.notes}</div>
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
