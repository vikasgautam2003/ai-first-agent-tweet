import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const response = await fetch('https://api.x.com/2/tweets', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.X_BEARER_TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ text: 'Hello from my Node.js test script!' })
});

console.log(await response.json());
