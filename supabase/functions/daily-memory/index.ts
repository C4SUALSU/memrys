import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY")
const MASTER_TONE = "You are a warm, slightly quirky memory curator for a private couple/partnership. Your goal is to look at a shared memory and provide a short, heartwarming, or funny reflection that strengthens their bond."

serve(async (req) => {
    const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    )

    // 1. Fetch all active partnerships
    const { data: partnerships } = await supabase
        .from("partnerships")
        .select("id")
        .eq("status", "active")

    if (!partnerships) return new Response("No active partnerships", { status: 200 })

    for (const partnership of partnerships) {
        // 2. Select a random post for this partnership
        const { data: post } = await supabase
            .from("posts")
            .select("*")
            .eq("partnership_id", partnership.id)
            .limit(1)
            .order("created_at", { ascending: false }) // In a real app, maybe pick truly random or "on this day"
            .single()

        if (!post) continue

        // 3. Call OpenRouter
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "openai/gpt-3.5-turbo", // or similar
                messages: [
                    { role: "system", content: MASTER_TONE },
                    { role: "user", content: `Here is a memory caption: "${post.caption || "A beautiful moment."}". Generate a quirky message about this.` }
                ]
            })
        })

        const aiData = await response.json()
        const aiMessage = aiData.choices[0].message.content

        // 4. Store the daily memory
        await supabase.from("daily_memories").insert({
            partnership_id: partnership.id,
            post_id: post.id,
            ai_message: aiMessage
        })
    }

    return new Response("Daily memories generated", { status: 200 })
})
