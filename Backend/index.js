







import readline from 'readline/promises';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

const MCP_URL = 'http://127.0.0.1:3000/mcp';

// 🛰️ Helper 1: List available tools from the MCP server
async function listAvailableTools() {
  console.log('\n🛰️ [Step 1] Requesting tool list from MCP server...');
  const response = await fetch(MCP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'listTools'
    })
  });

  const data = await response.json();
  const tools = data.result?.tools || [];
  console.log('📦 [Step 1.1] Tools received from MCP server:\n', tools);
  return tools;
}

// ⚙️ Helper 2: Call a tool via MCP server
async function callMcpTool(toolName, params) {
  console.log(`\n⚙️ [Step 4] Calling MCP tool: ${toolName} with params:`, params);

  const response = await fetch(MCP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'callTool',
      params: { name: toolName, arguments: params }
    })
  });

  const data = await response.json();

  if (data.error) {
    console.error('❌ [Step 4.1] MCP Tool Error:', data.error);
    throw new Error(data.error.message);
  }

  console.log('✅ [Step 4.2] MCP Tool Response received:', data.result);
  return data.result?.structuredContent || data.result;
}

// 💡 Helper 3: Ask Gemini what to do next (decide tool or respond)
async function askGeminiToDecide(question, tools) {
  console.log('\n💡 [Step 2] Asking Gemini how to handle the user question...');

  const prompt = `
You are an intelligent AI assistant that can use tools through an MCP server.

Here are the tools you have access to:
${JSON.stringify(tools, null, 2)}

User asked: "${question}"

If you need to use a tool, respond ONLY with valid JSON (no markdown, no code blocks):
{
  "action": "tool",
  "tool": "<toolName>",
  "params": { ... }
}

If no tool is needed, respond ONLY with:
{
  "action": "respond",
  "text": "<your message>"
}

Important:
- Return ONLY raw JSON.
- Do NOT include markdown or code fences like \`\`\`json or \`\`\`.
`;

  const result = await model.generateContent(prompt);
  let text = result.response.text().trim();

  console.log('🧠 [Step 2.1] Gemini raw decision output:\n', text);

  // 🧹 Strip markdown formatting if it still appears
  text = text.replace(/```json|```/g, '').trim();

  try {
    const parsed = JSON.parse(text);
    console.log('✅ [Step 2.2] Parsed Gemini decision:', parsed);
    return parsed;
  } catch {
    console.error('⚠️ [Step 2.3] Invalid JSON from Gemini after cleanup:\n', text);
    return { action: 'respond', text: "I'm sorry, I couldn't understand that." };
  }
}

// 💬 Main Chat Loop
async function chatLoop() {
  console.log('\n────────────────────────────────────────────');
  const question = await rl.question('🧍 You: ');

  // Step 1: Fetch tools
  const tools = await listAvailableTools();

  // Step 2: Ask Gemini what to do
  const decision = await askGeminiToDecide(question, tools);

  // Step 3: Handle Gemini's decision
  if (decision.action === 'tool') {
    console.log(`\n🤖 [Step 3] Gemini decided to use a tool → "${decision.tool}"`);

    try {
      const result = await callMcpTool(decision.tool, decision.params);

      // Step 5: Feed result back to Gemini for natural language output
      console.log('\n🧩 [Step 5] Sending tool result back to Gemini for a natural reply...');
      const followUpPrompt = `
The MCP tool "${decision.tool}" returned this result:
${JSON.stringify(result, null, 2)}

Respond naturally to the user, using this information.`;

      const followUpResponse = await model.generateContent(followUpPrompt);
      const reply = followUpResponse.response.text();

      console.log('\n💬 [Step 6] Gemini final reply:\n', reply);
    } catch (err) {
      console.error('❌ [Step 4.3] MCP tool call failed:', err.message);
    }
  } else {
    console.log('\n💬 [Step 3] Gemini responded directly:\n', decision.text);
  }

  await chatLoop(); // loop continues
}

// 🚀 Start the program
console.log('🚀 [INIT] Connecting to Gemini + MCP server...\n');
await chatLoop();
