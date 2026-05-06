import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface DvlaData {
  year?: string | number;
  colour?: string;
  fuelType?: string;
  engineCapacity?: number;
  bodyType?: string;
  taxStatus?: string;
  taxDueDate?: string;
  motStatus?: string;
  co2Emissions?: number;
  euroStatus?: string;
}

interface EmailPayload {
  name: string;
  email: string;
  phone: string;
  postcode?: string;
  registrationNumber: string;
  make?: string;
  model?: string;
  mileage: string | number;
  transmission?: string;
  hpiClear?: string;
  condition?: string;
  notes?: string;
  dvlaData?: DvlaData;
}

export async function POST(req: Request) {
  let body: EmailPayload;
  try {
    body = (await req.json()) as EmailPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    name,
    email,
    phone,
    postcode,
    registrationNumber,
    make,
    model,
    mileage,
    transmission,
    hpiClear,
    condition,
    notes,
    dvlaData,
  } = body;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "2525", 10),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const dvlaRows = dvlaData
    ? `
      ${dvlaData.year ? `<tr><td style="padding:6px 12px;color:#666;">Year</td><td style="padding:6px 12px;font-weight:600;">${dvlaData.year}</td></tr>` : ""}
      ${dvlaData.colour ? `<tr><td style="padding:6px 12px;color:#666;">Colour</td><td style="padding:6px 12px;font-weight:600;">${dvlaData.colour}</td></tr>` : ""}
      ${dvlaData.fuelType ? `<tr><td style="padding:6px 12px;color:#666;">Fuel Type</td><td style="padding:6px 12px;font-weight:600;">${dvlaData.fuelType}</td></tr>` : ""}
      ${dvlaData.engineCapacity ? `<tr><td style="padding:6px 12px;color:#666;">Engine</td><td style="padding:6px 12px;font-weight:600;">${dvlaData.engineCapacity}cc</td></tr>` : ""}
      ${dvlaData.bodyType ? `<tr><td style="padding:6px 12px;color:#666;">Body Type</td><td style="padding:6px 12px;font-weight:600;">${dvlaData.bodyType}</td></tr>` : ""}
      ${dvlaData.taxStatus ? `<tr><td style="padding:6px 12px;color:#666;">Tax Status</td><td style="padding:6px 12px;font-weight:600;">${dvlaData.taxStatus}</td></tr>` : ""}
      ${dvlaData.taxDueDate ? `<tr><td style="padding:6px 12px;color:#666;">Tax Due</td><td style="padding:6px 12px;font-weight:600;">${dvlaData.taxDueDate}</td></tr>` : ""}
      ${dvlaData.motStatus ? `<tr><td style="padding:6px 12px;color:#666;">MOT Status</td><td style="padding:6px 12px;font-weight:600;">${dvlaData.motStatus}</td></tr>` : ""}
      ${dvlaData.co2Emissions ? `<tr><td style="padding:6px 12px;color:#666;">CO₂ Emissions</td><td style="padding:6px 12px;font-weight:600;">${dvlaData.co2Emissions} g/km</td></tr>` : ""}
      ${dvlaData.euroStatus ? `<tr><td style="padding:6px 12px;color:#666;">Euro Status</td><td style="padding:6px 12px;font-weight:600;">${dvlaData.euroStatus}</td></tr>` : ""}
    `
    : "";

  const htmlContent = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <div style="background:#000;color:#fff;padding:20px;border-radius:12px 12px 0 0;text-align:center;">
        <h1 style="margin:0;font-size:22px;">🚗 New Vehicle Valuation Request</h1>
      </div>
      <div style="background:#fff;border:1px solid #e5e5e5;padding:24px;border-radius:0 0 12px 12px;">
        <h2 style="font-size:16px;color:#000;margin:0 0 12px;border-bottom:2px solid #f5c518;padding-bottom:8px;">Contact Details</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <tr><td style="padding:6px 12px;color:#666;">Name</td><td style="padding:6px 12px;font-weight:600;">${name}</td></tr>
          <tr><td style="padding:6px 12px;color:#666;">Email</td><td style="padding:6px 12px;font-weight:600;">${email}</td></tr>
          <tr><td style="padding:6px 12px;color:#666;">Phone</td><td style="padding:6px 12px;font-weight:600;">${phone}</td></tr>
          <tr><td style="padding:6px 12px;color:#666;">Postcode</td><td style="padding:6px 12px;font-weight:600;">${postcode || "N/A"}</td></tr>
        </table>
        <h2 style="font-size:16px;color:#000;margin:0 0 12px;border-bottom:2px solid #f5c518;padding-bottom:8px;">Vehicle Details</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <tr><td style="padding:6px 12px;color:#666;">Registration</td><td style="padding:6px 12px;font-weight:600;">${registrationNumber}</td></tr>
          <tr><td style="padding:6px 12px;color:#666;">Make</td><td style="padding:6px 12px;font-weight:600;">${make || "N/A"}</td></tr>
          <tr><td style="padding:6px 12px;color:#666;">Model</td><td style="padding:6px 12px;font-weight:600;">${model || "N/A"}</td></tr>
          <tr><td style="padding:6px 12px;color:#666;">Mileage</td><td style="padding:6px 12px;font-weight:600;">${mileage}</td></tr>
          <tr><td style="padding:6px 12px;color:#666;">Transmission</td><td style="padding:6px 12px;font-weight:600;">${transmission || "N/A"}</td></tr>
          <tr><td style="padding:6px 12px;color:#666;">Condition</td><td style="padding:6px 12px;font-weight:600;">${condition || "N/A"}</td></tr>
          <tr><td style="padding:6px 12px;color:#666;">HPI Clear</td><td style="padding:6px 12px;font-weight:600;">${hpiClear || "N/A"}</td></tr>
          ${dvlaRows}
        </table>
        ${notes ? `
        <h2 style="font-size:16px;color:#000;margin:0 0 12px;border-bottom:2px solid #f5c518;padding-bottom:8px;">Additional Notes</h2>
        <p style="color:#333;line-height:1.6;margin:0 0 24px;padding:12px;background:#f9f9f9;border-radius:8px;">${notes}</p>
        ` : ""}
        <div style="text-align:center;padding:16px 0 0;border-top:1px solid #e5e5e5;">
          <p style="color:#999;font-size:12px;margin:0;">Sell My Car Newcastle &copy; ${new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  `;

  try {
    const adminSubject = `New Valuation Request - ${registrationNumber} ${make || ""} ${model || ""}`.trim();
    const adminFrom = '"Sell My Car Newcastle" <mail@webspires.co.uk>';

    await transporter.sendMail({
      from: adminFrom,
      to: "Group961sales@gmail.com",
      subject: adminSubject,
      html: htmlContent,
    });

    try {
      await transporter.sendMail({
        from: adminFrom,
        to: "webspires@gmail.com",
        subject: adminSubject,
        html: htmlContent,
      });
    } catch (copyErr) {
      console.error("Webspires copy email failed (non-critical):", copyErr);
    }

    await transporter.sendMail({
      from: adminFrom,
      to: email,
      subject: `[No Reply] Your Car Valuation Request - ${registrationNumber}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <div style="background:#000;color:#fff;padding:20px;border-radius:12px 12px 0 0;text-align:center;">
            <h1 style="margin:0;font-size:22px;">Thank You, ${name.split(" ")[0]}!</h1>
          </div>
          <div style="background:#fff;border:1px solid #e5e5e5;padding:24px;border-radius:0 0 12px 12px;">
            <p style="color:#333;font-size:15px;line-height:1.6;">We&apos;ve received your valuation request for <strong>${registrationNumber}</strong>${make ? ` (${make}${model ? ` ${model}` : ""})` : ""}.</p>
            <p style="color:#333;font-size:15px;line-height:1.6;">Our team will review your details and get back to you shortly with a valuation.</p>
            <div style="background:#f5c518;color:#000;padding:12px 24px;border-radius:8px;text-align:center;margin:24px 0;">
              <strong>What happens next?</strong><br/>
              We&apos;ll contact you within 24 hours with your valuation.
            </div>
            <p style="color:#999;font-size:12px;text-align:center;margin:16px 0 0;">Sell My Car Newcastle &copy; ${new Date().getFullYear()}</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email send error:", error);
    const message = error instanceof Error ? error.message : "Email send failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
