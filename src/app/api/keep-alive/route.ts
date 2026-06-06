import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      return NextResponse.json({ error: "Supabase env not configured" }, { status: 500 });
    }
    const supabase = createClient(url, key);

    const { data, error } = await supabase
      .from("vehicle_inquiries")
      .select("id")
      .limit(1);

    if (error) {
      console.error("Supabase ping error:", error.message);
      return NextResponse.json(
        { error: error.message, timestamp: new Date().toISOString() },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Supabase pinged successfully",
      timestamp: new Date().toISOString(),
      rows: data?.length || 0,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Ping failed";
    console.error("Ping failed:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
