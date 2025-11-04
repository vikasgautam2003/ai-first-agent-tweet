




import express from 'express';
import { z } from 'zod';
import dotenv from 'dotenv';
import { TwitterApi } from 'twitter-api-v2';
import path from 'path';

dotenv.config({ path: path.resolve('../.env') });

const app = express();
app.use(express.json());

// --- Check environment keys ---
console.log('🔍 Loaded Twitter ENV:', {
  X_API_KEY: !!process.env.X_API_KEY,
  X_API_SECRET: !!process.env.X_API_SECRET,
  X_ACCESS_TOKEN: !!process.env.X_ACCESS_TOKEN,
  X_ACCESS_SECRET: !!process.env.X_ACCESS_SECRET
});

// --- Initialize Twitter client (OAuth 1.0a user context) ---
const twitterClient = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET
});

// --- Tools registry ---
const tools = {};

// 🧩 Tool 1: Echo
tools.echo = async ({ message }) => {
  const output = { echo: `Tool echo: ${message}` };
  return {
    content: [{ type: 'text', text: JSON.stringify(output) }],
    structuredContent: output
  };
};

// 🧩 Tool 2: Add two numbers
tools.addTwoNumbers = async ({ a, b }) => {
  const sum = a + b;
  return {
    content: [{ type: 'text', text: `The sum of ${a} and ${b} is ${sum}` }],
    structuredContent: { sum }
  };
};




// tools.tweetOnX = async (args = {}) => {
//   // 🧩 Normalize all possible argument shapes
//   const text =
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


tools.tweetOnX = async (args = {}) => {
  // 🧩 Normalize all possible argument shapes (camelCase, snake_case, etc.)
  const text =
  args.tweetText ||  
    args.tweet_content ||   // snake_case (from your manual calls)
    args.tweetContent ||    // camelCase (from Gemini/LLM)
    args.text ||            // generic text key
    args.message ||         // fallback
    args.content ||         // generic content key
    (typeof args === 'string' ? args : undefined);

  console.log('🐦 [TweetOnX] Received args:', args);
  console.log('🐦 [TweetOnX] Attempting to tweet:', text);

  // 🚨 Validate
  if (!text || text.trim().length === 0) {
    console.error('❌ [TweetOnX] Missing text input.');
    return {
      content: [{ type: 'text', text: 'Error: No text provided to tweet.' }],
      structuredContent: { success: false, tweet: null, error: 'No text provided' }
    };
  }

  try {
    // 🐦 Attempt to post
    const tweet = await twitterClient.v2.tweet(text);
    console.log('✅ [TweetOnX] Successfully posted:', tweet.data);

    return {
      content: [{ type: 'text', text: `Tweeted successfully: "${text}"` }],
      structuredContent: { success: true, tweet: text }
    };
  } catch (err) {
    console.error('❌ [TweetOnX] Failed to tweet:', err.message);
    return {
      content: [{ type: 'text', text: `Failed to tweet: ${err.message}` }],
      structuredContent: { success: false, tweet: text, error: err.message }
    };
  }
};



// --- MCP endpoint ---
app.post('/mcp', async (req, res) => {
  try {
    const { method, id, params } = req.body;

    if (method === 'listTools') {
      return res.json({
        jsonrpc: '2.0',
        id,
        result: {
          tools: Object.keys(tools).map((name) => ({
            name,
            description:
              name === 'echo'
                ? 'Echoes back your message'
                : name === 'addTwoNumbers'
                ? 'Adds two numbers together'
                : 'Posts a tweet using your Twitter account'
          }))
        }
      });
    }

    if (method === 'callTool') {
      const { name, arguments: args } = params;
      const fn = tools[name];
      if (!fn) {
        return res.status(404).json({
          jsonrpc: '2.0',
          id,
          error: { code: -32601, message: `Tool '${name}' not found` }
        });
      }

      const result = await fn(args);
      return res.json({ jsonrpc: '2.0', id, result });
    }

    res.status(400).json({
      jsonrpc: '2.0',
      id,
      error: { code: -32600, message: 'Invalid Request' }
    });
  } catch (err) {
    console.error('🔥 MCP Error:', err);
    res.status(500).json({
      jsonrpc: '2.0',
      error: { code: -32603, message: 'Internal Server Error' }
    });
  }
});

// --- Start server ---
const port = parseInt(process.env.PORT || '3000', 10);
app.listen(port, () =>
  console.log(`✅ MCP Server running on http://127.0.0.1:${port}/mcp`)
);
