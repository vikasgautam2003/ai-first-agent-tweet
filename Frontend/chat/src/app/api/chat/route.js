



// // app/api/chat/route.js
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const { message } = await req.json();
//     console.log("💬 [Next.js Chat Route] Got message:", message);

//     // Construct the JSON-RPC payload for MCP
//     const payload = {
//       jsonrpc: "2.0",
//       id: Date.now().toString(),
//       method: "callTool",
//       params: {
//         name: "tweetOnX",
//         arguments: { tweetText: message },
//       },
//     };

//     // Send to MCP server
//     const response = await fetch("http://localhost:5000/mcp", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     // Parse the MCP JSON response
//     const data = await response.json();
//     const result = data?.result?.structuredContent;

//     console.log("📡 [Next.js Chat Route] MCP Response:", result);

//     // ✅ If tweet succeeded
//     if (result?.success) {
//       const tweetText = result?.tweet || message;
//       const reply = `✅ Tweet posted successfully!\n"${tweetText}"`;
//       return NextResponse.json({ reply });
//     }

//     // ❌ If tweet failed
//     const errorMsg =
//       result?.error?.includes("403")
//         ? "Twitter rejected the tweet (check permissions or duplicate)."
//         : result?.error || "Unknown error";

//     const reply = `❌ Failed to post tweet.\n(${errorMsg})`;
//     return NextResponse.json({ reply });
//   } catch (err) {
//     console.error("🔥 [Chat Error]:", err);
//     return NextResponse.json({
//       reply: "⚠️ Something went wrong while posting your tweet.",
//     });
//   }
// }






import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function POST(req) {
  try {
    const { message } = await req.json();
    console.log("💬 [Chat Route] Got message:", message);

    const systemPrompt = `
You are an intelligent AI assistant connected to an MCP tool that can post tweets on X.

User message: "${message}"

Decide one of two actions ONLY:
1️⃣ If the user clearly wants to post or tweet something (e.g. "Tweet this", "Post on X", "Publish this"), return JSON:
{"action":"tweet","topic":"<what to tweet about>"}

2️⃣ Otherwise, if the user is just chatting or asking normally, return JSON:
{"action":"chat","reply":"<natural AI reply>"}

Respond ONLY in JSON — no markdown, no code fences, no extra text.
    `;

    const decisionResp = await model.generateContent(systemPrompt);
    const rawDecision = decisionResp.response.text().trim();

    console.log("🧠 [Gemini Decision Raw]:", rawDecision);

    let decision;
    try {
      decision = JSON.parse(rawDecision);
    } catch {
      return NextResponse.json({ reply: rawDecision });
    }

    if (decision.action === "chat") {
      return NextResponse.json({ reply: decision.reply });
    }

    if (decision.action === "tweet") {
      const tweetPrompt = `
You are a professional social media copywriter creating posts for X (Twitter).
Write a single, powerful tweet based on the topic below:
"${decision.topic}"

Rules:
- ABSOLUTE MAXIMUM: 280 characters (not words).
- Ideal length: 240 – 270 characters.
- If exceeding 280 characters, truncate meaningfully to fit.
- One paragraph only.
- No markdown, no links, no bullet points.
- 0–2 relevant hashtags max.
- Avoid emojis unless essential.
- Keep it authentic, professional, and concise.
Output only the tweet text. Do not explain.
      `;

      const tweetGen = await model.generateContent(tweetPrompt);
      let tweetText = tweetGen.response.text().trim();

      if (tweetText.length > 280) {
        const shortenPrompt = `
Shorten this tweet to under 280 characters while preserving tone and meaning:
"${tweetText}"
        `;
        const shortResp = await model.generateContent(shortenPrompt);
        tweetText = shortResp.response.text().trim();
      }

      const payload = {
        jsonrpc: "2.0",
        id: Date.now().toString(),
        method: "callTool",
        params: {
          name: "tweetOnX",
          arguments: { tweetText },
        },
      };

      const response = await fetch("http://localhost:5000/mcp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      const result = data?.result?.structuredContent;

      if (result?.success) {
        return NextResponse.json({
          reply: `✅ Tweet posted successfully!\n"${tweetText}"`,
        });
      } else {
        return NextResponse.json({
          reply: `❌ Failed to post tweet. (${
            result?.error || "Unknown error"
          })\nGenerated tweet:\n"${tweetText}"`,
        });
      }
    }

    return NextResponse.json({ reply: "⚠️ I didn’t understand your request." });
  } catch (err) {
    console.error("🔥 [Chat Error]:", err);
    return NextResponse.json({
      reply: "⚠️ Something went wrong while processing your message.",
    });
  }
}
