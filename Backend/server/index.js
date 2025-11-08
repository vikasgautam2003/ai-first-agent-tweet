// import express from 'express';
// import { z } from 'zod';
// import dotenv from 'dotenv';
// import { TwitterApi } from 'twitter-api-v2';
// import path from 'path';

// dotenv.config({ path: path.resolve('../.env') });

// const app = express();
// app.use(express.json());

// console.log('🔍 Loaded Twitter ENV:', {
//   X_API_KEY: !!process.env.X_API_KEY,
//   X_API_SECRET: !!process.env.X_API_SECRET,
//   X_ACCESS_TOKEN: !!process.env.X_ACCESS_TOKEN,
//   X_ACCESS_SECRET: !!process.env.X_ACCESS_SECRET
// });

// const twitterClient = new TwitterApi({
//   appKey: process.env.X_API_KEY,
//   appSecret: process.env.X_API_SECRET,
//   accessToken: process.env.X_ACCESS_TOKEN,
//   accessSecret: process.env.X_ACCESS_SECRET
// });

// const tools = {};

// tools.echo = async ({ message }) => {
//   const output = { echo: `Tool echo: ${message}` };
//   return {
//     content: [{ type: 'text', text: JSON.stringify(output) }],
//     structuredContent: output
//   };
// };

// tools.addTwoNumbers = async ({ a, b }) => {
//   const sum = a + b;
//   return {
//     content: [{ type: 'text', text: `The sum of ${a} and ${b} is ${sum}` }],
//     structuredContent: { sum }
//   };
// };

// tools.tweetOnX = async (args = {}) => {
//   const text =
//     args.tweetText ||
//     args.tweet_content ||
//     args.tweetContent ||
//     args.text ||
//     args.message ||
//     args.content ||
//     (typeof args === 'string' ? args : undefined);

//   console.log('🐦 [TweetOnX] Received args:', args);
//   console.log('🐦 [TweetOnX] Attempting to tweet:', text);

//   if (!text || text.trim().length === 0) {
//     console.error('❌ [TweetOnX] Missing text input.');
//     return {
//       content: [{ type: 'text', text: 'Error: No text provided to tweet.' }],
//       structuredContent: { success: false, tweet: null, error: 'No text provided' }
//     };
//   }

//   try {
//     const tweet = await twitterClient.v2.tweet(text);
//     console.log('✅ [TweetOnX] Successfully posted:', tweet.data);
//     return {
//       content: [{ type: 'text', text: `Tweeted successfully: "${text}"` }],
//       structuredContent: { success: true, tweet: text }
//     };
//   } catch (err) {
//     console.error('❌ [TweetOnX] Failed to tweet:', err.message);
//     return {
//       content: [{ type: 'text', text: `Failed to tweet: ${err.message}` }],
//       structuredContent: { success: false, tweet: text, error: err.message }
//     };
//   }
// };

// app.post('/mcp', async (req, res) => {
//   try {
//     const { method, id, params } = req.body;

//     if (method === 'listTools') {
//       return res.json({
//         jsonrpc: '2.0',
//         id,
//         result: {
//           tools: Object.keys(tools).map((name) => ({
//             name,
//             description:
//               name === 'echo'
//                 ? 'Echoes back your message'
//                 : name === 'addTwoNumbers'
//                 ? 'Adds two numbers together'
//                 : 'Posts a tweet using your Twitter account'
//           }))
//         }
//       });
//     }

//     if (method === 'callTool') {
//       const { name, arguments: args } = params;
//       const fn = tools[name];
//       if (!fn) {
//         return res.status(404).json({
//           jsonrpc: '2.0',
//           id,
//           error: { code: -32601, message: `Tool '${name}' not found` }
//         });
//       }

//       const result = await fn(args);
//       return res.json({ jsonrpc: '2.0', id, result });
//     }

//     res.status(400).json({
//       jsonrpc: '2.0',
//       id,
//       error: { code: -32600, message: 'Invalid Request' }
//     });
//   } catch (err) {
//     console.error('🔥 MCP Error:', err);
//     res.status(500).json({
//       jsonrpc: '2.0',
//       error: { code: -32603, message: 'Internal Server Error' }
//     });
//   }
// });

// const port = parseInt(process.env.PORT || '3000', 10);
// app.listen(port, () =>
//   console.log(`✅ MCP Server running on http://127.0.0.1:${port}/mcp`)
// );
















// import express from 'express';
// import { z } from 'zod';
// import dotenv from 'dotenv';
// import { TwitterApi } from 'twitter-api-v2';
// import path from 'path';
// import { GoogleGenerativeAI } from '@google/generative-ai';

// dotenv.config({ path: path.resolve('../.env') });

// const app = express();
// app.use(express.json());

// // ------------------------------
// // 🔑 Environment & Clients Setup
// // ------------------------------
// console.log('🔍 Loaded Twitter ENV:', {
//   X_API_KEY: !!process.env.X_API_KEY,
//   X_API_SECRET: !!process.env.X_API_SECRET,
//   X_ACCESS_TOKEN: !!process.env.X_ACCESS_TOKEN,
//   X_ACCESS_SECRET: !!process.env.X_ACCESS_SECRET
// });

// const twitterClient = new TwitterApi({
//   appKey: process.env.X_API_KEY,
//   appSecret: process.env.X_API_SECRET,
//   accessToken: process.env.X_ACCESS_TOKEN,
//   accessSecret: process.env.X_ACCESS_SECRET
// });

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
// const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// // ------------------------------
// // 🧩 Tool Registry
// // ------------------------------
// const tools = {
//   echo: async ({ message }) => {
//     const output = { echo: `Tool echo: ${message}` };
//     return {
//       content: [{ type: 'text', text: JSON.stringify(output) }],
//       structuredContent: output
//     };
//   },

//   addTwoNumbers: async ({ a, b }) => {
//     const sum = a + b;
//     return {
//       content: [{ type: 'text', text: `The sum of ${a} and ${b} is ${sum}` }],
//       structuredContent: { sum }
//     };
//   },

//   tweetOnX: async (args = {}) => {
//     const text =
//       args.tweetText ||
//       args.tweet_content ||
//       args.tweetContent ||
//       args.text ||
//       args.message ||
//       args.content ||
//       (typeof args === 'string' ? args : undefined);

//     console.log('🐦 [TweetOnX] Received args:', args);
//     console.log('🐦 [TweetOnX] Attempting to tweet:', text);

//     if (!text?.trim()) {
//       console.error('❌ [TweetOnX] Missing text input.');
//       return {
//         content: [{ type: 'text', text: 'Error: No text provided to tweet.' }],
//         structuredContent: { success: false, tweet: null, error: 'No text provided' }
//       };
//     }

//     try {
//       const tweet = await twitterClient.v2.tweet(text);
//       console.log('✅ [TweetOnX] Successfully posted:', tweet.data);
//       return {
//         content: [{ type: 'text', text: `Tweeted successfully: "${text}"` }],
//         structuredContent: { success: true, tweet: text }
//       };
//     } catch (err) {
//       console.error('❌ [TweetOnX] Failed to tweet:', err.message);
//       return {
//         content: [{ type: 'text', text: `Failed to tweet: ${err.message}` }],
//         structuredContent: { success: false, tweet: text, error: err.message }
//       };
//     }
//   }
// };

// // ------------------------------
// // 🧠 MCP Endpoints
// // ------------------------------
// app.post('/mcp', async (req, res) => {
//   try {
//     const { method, id, params } = req.body;

//     if (method === 'listTools') {
//       const toolList = Object.keys(tools).map((name) => ({
//         name,
//         description:
//           name === 'echo'
//             ? 'Echoes back your message'
//             : name === 'addTwoNumbers'
//             ? 'Adds two numbers together'
//             : 'Posts a tweet using your Twitter account'
//       }));

//       return res.json({ jsonrpc: '2.0', id, result: { tools: toolList } });
//     }

//     if (method === 'callTool') {
//       const { name, arguments: args } = params;
//       const fn = tools[name];
//       if (!fn) {
//         return res.status(404).json({
//           jsonrpc: '2.0',
//           id,
//           error: { code: -32601, message: `Tool '${name}' not found` }
//         });
//       }

//       const result = await fn(args);
//       return res.json({ jsonrpc: '2.0', id, result });
//     }

//     res.status(400).json({
//       jsonrpc: '2.0',
//       id,
//       error: { code: -32600, message: 'Invalid Request' }
//     });
//   } catch (err) {
//     console.error('🔥 [MCP Error]:', err);
//     res.status(500).json({
//       jsonrpc: '2.0',
//       error: { code: -32603, message: 'Internal Server Error' }
//     });
//   }
// });

// // ------------------------------
// // 💬 Chat Endpoint (Gemini + Tools)
// // ------------------------------
// app.post('/chat', async (req, res) => {
//   try {
//     const { message } = req.body;
//     if (!message) return res.status(400).json({ reply: 'Message is required.' });

//     console.log('\n💬 [Chat] Incoming message:', message);

//     const toolList = Object.keys(tools);
//     const systemPrompt = `
// You are an intelligent AI assistant connected to an MCP tool system.

// Available tools:
// ${JSON.stringify(toolList, null, 2)}

// Strict rules:
// 1. NEVER use the "tweetOnX" tool unless the user **clearly** says they want to post or tweet something.
//    Examples that ALLOW tool use:
//      - "Tweet this..."
//      - "Post on X..."
//      - "Publish this..."
//    Examples that DO NOT allow tool use:
//      - "Hi", "Hello", "Hey", "How are you", "Hii", or any small talk.
// 2. For greetings, casual talk, or general questions — DO NOT use tools. Just reply naturally.
// 3. Only call tools when they’re explicitly mentioned or the action is clear.
// 4. Always return ONLY one of the two JSON objects below:

// If you want to use a tool:
// {"action":"tool","tool":"<toolName>","params":{...}}

// If you just want to chat:
// {"action":"respond","text":"<friendly reply>"}

// No markdown, no code fences, no other text.

// User message: "${message}"
// `;

//     const geminiResponse = await model.generateContent(systemPrompt);
//     let text = geminiResponse.response.text().replace(/```json|```/g, '').trim();

//     console.log('🧠 [Gemini Decision Raw]:', text);

//     let decision;
//     try {
//       decision = JSON.parse(text);
//     } catch {
//       console.warn('⚠️ [Chat] Invalid JSON from Gemini. Returning raw reply.');
//       return res.json({ reply: text });
//     }

//     if (decision.action === 'tool' && tools[decision.tool]) {
//       console.log(`🛠 [Chat] Executing tool: ${decision.tool}`, decision.params);

//       const result = await tools[decision.tool](decision.params);

// //       const followUpPrompt = `
// // The tool "${decision.tool}" returned:
// // ${JSON.stringify(result, null, 2)}

// // Respond to the user naturally and conversationally about this result.
// // `;

// //       const followupResponse = await model.generateContent(followUpPrompt);
// //       const reply = followupResponse.response.text();

// //       console.log('💬 [Chat Reply via Tool]:', reply);
// //       return res.json({ reply });
// //     }

// //     console.log('💬 [Chat Reply Direct]:', decision.text);
// //     res.json({ reply: decision.text });


//     const followUpPrompt = `
// The tool "${decision.tool}" returned:
// ${JSON.stringify(result, null, 2)}

// Respond to the user naturally and conversationally about this result.
// `;

// const followupResponse = await model.generateContent(followUpPrompt);
// let reply = followupResponse.response.text().trim();

// // ✅ Add clear message for tweet success/failure
// if (decision.tool === 'tweetOnX') {
//   const success = result?.structuredContent?.success;
//   if (success) {
//     reply = `✅ Tweeted successfully on X! 🎉\n${reply}`;
//   } else {
//     const errorMsg = result?.structuredContent?.error || 'Unknown error';
//     reply = `❌ Failed to post tweet. (${errorMsg})`;
//   }
// }

// console.log('💬 [Chat Reply via Tool]:', reply);
// return res.json({ reply });
//     }

//   } catch (err) {
//     console.error('🔥 [Chat Error]:', err);
//     res.status(500).json({ reply: 'Internal server error.' });
//   }
// });

// // ------------------------------
// // 🚀 Server Start
// // ------------------------------
// const port = parseInt(process.env.PORT || '5000', 10);
// app.listen(port, () => {
//   console.log(`✅ MCP Server running on http://127.0.0.1:${port}/mcp`);
// });







// // index.js
// import express from 'express';
// import dotenv from 'dotenv';
// import path from 'path';
// import { TwitterApi } from 'twitter-api-v2';

// dotenv.config({ path: path.resolve('../.env') });

// const app = express();
// app.use(express.json());

// // ------------------------------
// // 🔑 Environment & Clients Setup
// // ------------------------------
// console.log('🔍 Loaded Twitter ENV:', {
//   X_API_KEY: !!process.env.X_API_KEY,
//   X_API_SECRET: !!process.env.X_API_SECRET,
//   X_ACCESS_TOKEN: !!process.env.X_ACCESS_TOKEN,
//   X_ACCESS_SECRET: !!process.env.X_ACCESS_SECRET
// });

// const twitterClient = new TwitterApi({
//   appKey: process.env.X_API_KEY,
//   appSecret: process.env.X_API_SECRET,
//   accessToken: process.env.X_ACCESS_TOKEN,
//   accessSecret: process.env.X_ACCESS_SECRET
// });

// // ------------------------------
// // 🧩 Tool Registry
// // ------------------------------
// const tools = {
//   echo: async ({ message }) => {
//     const output = { echo: `Tool echo: ${message}` };
//     return {
//       content: [{ type: 'text', text: JSON.stringify(output) }],
//       structuredContent: output
//     };
//   },

//   addTwoNumbers: async ({ a, b }) => {
//     const sum = a + b;
//     return {
//       content: [{ type: 'text', text: `The sum of ${a} and ${b} is ${sum}` }],
//       structuredContent: { sum }
//     };
//   },

//   tweetOnX: async (args = {}) => {
//     const text =
//       args.tweetText ||
//       args.tweet_content ||
//       args.tweetContent ||
//       args.text ||
//       args.message ||
//       args.content ||
//       (typeof args === 'string' ? args : undefined);

//     console.log('🐦 [TweetOnX] Received args:', args);
//     console.log('🐦 [TweetOnX] Attempting to tweet:', text);

//     if (!text?.trim()) {
//       console.error('❌ [TweetOnX] Missing text input.');
//       return {
//         content: [{ type: 'text', text: 'Error: No text provided to tweet.' }],
//         structuredContent: { success: false, tweet: null, error: 'No text provided' }
//       };
//     }

//     try {
//       const tweet = await twitterClient.v2.tweet(text);
//       console.log('✅ [TweetOnX] Successfully posted:', tweet.data);
//       return {
//         content: [{ type: 'text', text: `Tweeted successfully: "${text}"` }],
//         structuredContent: { success: true, tweet: text }
//       };
//     } catch (err) {
//       console.error('❌ [TweetOnX] Failed to tweet:', err.message);
//       return {
//         content: [{ type: 'text', text: `Failed to tweet: ${err.message}` }],
//         structuredContent: { success: false, tweet: text, error: err.message }
//       };
//     }
//   }
// };

// // ------------------------------
// // 🧠 MCP Endpoints
// // ------------------------------
// app.post('/mcp', async (req, res) => {
//   try {
//     const { method, id, params } = req.body;

//     if (method === 'listTools') {
//       const toolList = Object.keys(tools).map((name) => ({
//         name,
//         description:
//           name === 'echo'
//             ? 'Echoes back your message'
//             : name === 'addTwoNumbers'
//             ? 'Adds two numbers together'
//             : 'Posts a tweet using your Twitter account'
//       }));

//       return res.json({ jsonrpc: '2.0', id, result: { tools: toolList } });
//     }

//     if (method === 'callTool') {
//       const { name, arguments: args } = params;
//       const fn = tools[name];
//       if (!fn) {
//         return res.status(404).json({
//           jsonrpc: '2.0',
//           id,
//           error: { code: -32601, message: `Tool '${name}' not found` }
//         });
//       }

//       const result = await fn(args);
//       return res.json({ jsonrpc: '2.0', id, result });
//     }

//     res.status(400).json({
//       jsonrpc: '2.0',
//       id,
//       error: { code: -32600, message: 'Invalid Request' }
//     });
//   } catch (err) {
//     console.error('🔥 [MCP Error]:', err);
//     res.status(500).json({
//       jsonrpc: '2.0',
//       error: { code: -32603, message: 'Internal Server Error' }
//     });
//   }
// });

// // ------------------------------
// // 🚀 Server Start
// // ------------------------------
// const port = parseInt(process.env.PORT || '5000', 10);
// app.listen(port, () => {
//   console.log(`✅ MCP Server running on http://127.0.0.1:${port}/mcp`);
// });




// index.js
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { TwitterApi } from 'twitter-api-v2';

dotenv.config({ path: path.resolve('../.env') });

const app = express();
app.use(express.json());

// ------------------------------
// 🔑 Environment & Clients Setup
// ------------------------------
console.log('🔍 Loaded Twitter ENV:', {
  X_API_KEY: !!process.env.X_API_KEY,
  X_API_SECRET: !!process.env.X_API_SECRET,
  X_ACCESS_TOKEN: !!process.env.X_ACCESS_TOKEN,
  X_ACCESS_SECRET: !!process.env.X_ACCESS_SECRET
});

// Ensure all required credentials exist
if (
  !process.env.X_API_KEY ||
  !process.env.X_API_SECRET ||
  !process.env.X_ACCESS_TOKEN ||
  !process.env.X_ACCESS_SECRET
) {
  console.error('❌ Missing Twitter API credentials in .env file!');
  process.exit(1);
}

const twitterClient = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET
});

// ------------------------------
// 🧩 Helper Functions
// ------------------------------

// Clean and sanitize tweet text to avoid invalid characters
function sanitizeText(text = '') {
  return text
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/—/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

// Consistent structured response for all tools
function structuredResponse(success, message, extra = {}) {
  return {
    content: [{ type: 'text', text: message }],
    structuredContent: { success, ...extra }
  };
}

// ------------------------------
// 🧩 Tool Registry
// ------------------------------
const tools = {
  echo: async ({ message }) => {
    const output = { echo: `Tool echo: ${message}` };
    return structuredResponse(true, JSON.stringify(output), output);
  },

  addTwoNumbers: async ({ a, b }) => {
    const sum = Number(a) + Number(b);
    if (isNaN(sum))
      return structuredResponse(false, '❌ Invalid numbers provided.', { error: 'NaN input' });
    return structuredResponse(true, `The sum of ${a} and ${b} is ${sum}`, { sum });
  },

  tweetOnX: async (args = {}) => {
    try {
      const textInput =
        args.tweetText ||
        args.tweet_content ||
        args.tweetContent ||
        args.text ||
        args.message ||
        args.content ||
        (typeof args === 'string' ? args : '');

      const text = sanitizeText(textInput);
      console.log('🐦 [TweetOnX] Received args:', args);
      console.log('🐦 [TweetOnX] Cleaned tweet text:', text);

      if (!text.trim()) {
        console.error('❌ [TweetOnX] Missing text input.');
        return structuredResponse(false, 'Error: No text provided to tweet.', {
          tweet: null,
          error: 'No text provided'
        });
      }

      if (text.length > 280) {
        console.error('❌ [TweetOnX] Tweet too long:', text.length);
        return structuredResponse(false, 'Error: Tweet exceeds 280 characters.', {
          tweet: text,
          error: 'Tweet too long'
        });
      }

      const tweet = await twitterClient.v2.tweet(text);
      console.log('✅ [TweetOnX] Successfully posted:', tweet.data);

      return structuredResponse(true, `Tweeted successfully: "${text}"`, {
        tweet: text
      });
    } catch (err) {
      const errorMsg = err?.message || 'Unknown error';
      console.error('❌ [TweetOnX] Failed to tweet:', errorMsg);
      return structuredResponse(false, `Failed to tweet: ${errorMsg}`, {
        tweet: args?.tweetText || '',
        error: errorMsg
      });
    }
  }
};

// ------------------------------
// 🧠 MCP Endpoints
// ------------------------------
app.post('/mcp', async (req, res) => {
  try {
    const { method, id, params } = req.body || {};

    if (!method) {
      return res.status(400).json({
        jsonrpc: '2.0',
        id: id || null,
        error: { code: -32600, message: 'Invalid Request (no method)' }
      });
    }

    if (method === 'listTools') {
      const toolList = Object.keys(tools).map((name) => ({
        name,
        description:
          name === 'echo'
            ? 'Echoes back your message'
            : name === 'addTwoNumbers'
            ? 'Adds two numbers together'
            : 'Posts a tweet using your Twitter account'
      }));
      return res.json({ jsonrpc: '2.0', id, result: { tools: toolList } });
    }

    if (method === 'callTool') {
      const { name, arguments: args } = params || {};
      const fn = tools[name];
      if (!fn) {
        console.error(`⚠️ Tool not found: ${name}`);
        return res.status(404).json({
          jsonrpc: '2.0',
          id,
          error: { code: -32601, message: `Tool '${name}' not found` }
        });
      }

      const result = await fn(args || {});
      return res.json({ jsonrpc: '2.0', id, result });
    }

    console.warn('⚠️ Invalid MCP method:', method);
    res.status(400).json({
      jsonrpc: '2.0',
      id,
      error: { code: -32600, message: 'Invalid MCP method' }
    });
  } catch (err) {
    console.error('🔥 [MCP Error]:', err);
    res.status(500).json({
      jsonrpc: '2.0',
      error: { code: -32603, message: 'Internal Server Error' }
    });
  }
});

// ------------------------------
// 🚀 Server Start
// ------------------------------
const port = parseInt(process.env.PORT || '5000', 10);
app.listen(port, () => {
  console.log(`✅ MCP Server running on http://127.0.0.1:${port}/mcp`);
});
