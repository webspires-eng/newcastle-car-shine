import { NextResponse } from "next/server";
import { createBooking, saveBooking } from "@/lib/db";
import type { BookingEmail } from "@/types";

const ADMIN_EMAIL = "support@sellmycarnewcastle.co.uk";
const SITE_URL = "https://www.sellmycarnewcastle.uk";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const booking = await createBooking({
      reg: String(body.reg ?? "").toUpperCase(),
      make: String(body.make ?? ""),
      model: String(body.model ?? ""),
      year: body.year ?? "",
      mileage: body.mileage ?? "",
      condition: String(body.condition ?? ""),
      colour: String(body.colour ?? ""),
      serviceHistory: String(body.serviceHistory ?? ""),
      firstName: String(body.firstName ?? ""),
      lastName: String(body.lastName ?? ""),
      email: String(body.email ?? ""),
      phone: String(body.phone ?? ""),
      postcode: String(body.postcode ?? ""),
      estimatedValue: Number(body.estimatedValue ?? 0),
    });

    const fullName = `${booking.firstName} ${booking.lastName}`.trim();

    const userBody = `Hi ${booking.firstName || "there"},

Thanks for getting your free valuation with Sell My Car Newcastle.

Booking reference: ${booking.id}

Vehicle:
  Reg:        ${booking.reg}
  Make/Model: ${booking.make} ${booking.model}
  Year:       ${booking.year}
  Mileage:    ${booking.mileage}
  Condition:  ${booking.condition}
  Colour:     ${booking.colour}
  Service:    ${booking.serviceHistory}

Estimated value: £${booking.estimatedValue.toLocaleString("en-GB")}

Next steps:
  1. A member of our team will contact you within 1 hour during business hours (9am–6pm Mon–Sat).
  2. We will confirm a final offer based on your vehicle's exact condition.
  3. If you accept, we arrange free collection and same-day payment.

If you have questions, reply to this email or call us on the number on our site.

— Sell My Car Newcastle
${SITE_URL}`;

    const adminBody = `New valuation booking received.

Booking ID: ${booking.id}
Submitted:  ${booking.createdAt}
Admin:      ${SITE_URL}/admin

Customer:
  Name:     ${fullName}
  Email:    ${booking.email}
  Phone:    ${booking.phone}
  Postcode: ${booking.postcode}

Vehicle:
  Reg:        ${booking.reg}
  Make/Model: ${booking.make} ${booking.model}
  Year:       ${booking.year}
  Mileage:    ${booking.mileage}
  Condition:  ${booking.condition}
  Colour:     ${booking.colour}
  Service:    ${booking.serviceHistory}

Estimated value: £${booking.estimatedValue.toLocaleString("en-GB")}

Open the booking: ${SITE_URL}/admin`;

    const sentAt = new Date().toISOString();
    const emails: BookingEmail[] = [
      {
        type: "user",
        to: booking.email,
        subject: `Your car valuation – ${booking.reg} (${booking.id})`,
        body: userBody,
        sentAt,
      },
      {
        type: "admin",
        to: ADMIN_EMAIL,
        subject: `New booking: ${booking.reg} – ${fullName} (${booking.id})`,
        body: adminBody,
        sentAt,
      },
    ];

    /* ============================================================
     * EMAIL SENDING — TODO: wire up the chosen provider.
     * Provider not confirmed yet, so we only persist the email
     * bodies to the booking record. Pick ONE option below:
     *
     * ---- Option A: Resend ----
     * import { Resend } from "resend";
     * const resend = new Resend(process.env.RESEND_API_KEY!);
     * await resend.emails.send({
     *   from: "Sell My Car Newcastle <noreply@sellmycarnewcastle.uk>",
     *   to: booking.email,
     *   subject: emails[0].subject,
     *   text: emails[0].body,
     * });
     * await resend.emails.send({
     *   from: "Sell My Car Newcastle <noreply@sellmycarnewcastle.uk>",
     *   to: ADMIN_EMAIL,
     *   subject: emails[1].subject,
     *   text: emails[1].body,
     * });
     *
     * ---- Option B: Nodemailer (SMTP) ----
     * import nodemailer from "nodemailer";
     * const transporter = nodemailer.createTransport({
     *   host: process.env.SMTP_HOST,
     *   port: Number(process.env.SMTP_PORT ?? 587),
     *   secure: false,
     *   auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
     * });
     * await transporter.sendMail({ from: "...", to: booking.email, subject: emails[0].subject, text: emails[0].body });
     * await transporter.sendMail({ from: "...", to: ADMIN_EMAIL,    subject: emails[1].subject, text: emails[1].body });
     *
     * ---- Option C: SendGrid ----
     * import sgMail from "@sendgrid/mail";
     * sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
     * await sgMail.send({ from: "...", to: booking.email, subject: emails[0].subject, text: emails[0].body });
     * await sgMail.send({ from: "...", to: ADMIN_EMAIL,    subject: emails[1].subject, text: emails[1].body });
     * ============================================================ */

    booking.emails = emails;
    await saveBooking(booking);

    return NextResponse.json({ success: true, bookingId: booking.id });
  } catch (err) {
    console.error("Valuation submission failed:", err);
    return NextResponse.json(
      { success: false, error: "Failed to submit valuation" },
      { status: 500 }
    );
  }
}
