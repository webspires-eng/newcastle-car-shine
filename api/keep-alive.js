import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
    // Only allow Vercel Cron or manual trigger
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && req.method !== "GET") {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const supabase = createClient(
            process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
            process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_KEY
        );

        // Simple select to keep the database active
        const { data, error } = await supabase
            .from("vehicle_inquiries")
            .select("id")
            .limit(1);

        if (error) {
            console.error("Supabase ping error:", error.message);
            return res.status(500).json({ error: error.message, timestamp: new Date().toISOString() });
        }

        console.log("Supabase ping successful:", new Date().toISOString());
        return res.status(200).json({
            success: true,
            message: "Supabase pinged successfully",
            timestamp: new Date().toISOString(),
            rows: data?.length || 0,
        });
    } catch (err) {
        console.error("Ping failed:", err.message);
        return res.status(500).json({ error: err.message });
    }
}
