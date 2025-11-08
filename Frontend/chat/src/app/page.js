// "use client";
// import { useState, useRef } from "react";
// import { motion } from "framer-motion";

// export default function Page() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const chatRef = useRef();

//   const sendMessage = async () => {
//     if (!input.trim()) return;
//     const newMessages = [...messages, { role: "user", text: input }];
//     setMessages(newMessages);
//     setInput("");
//     setLoading(true);

//     const res = await fetch("/api/chat", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ message: input }),
//     });

//     const data = await res.json();
//     setMessages([...newMessages, { role: "ai", text: data.reply }]);
//     setLoading(false);

//     setTimeout(() => chatRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gray-900 text-white">
//       <header className="p-4 bg-gray-800 text-center text-lg font-semibold">
//         🤖 Gemini MCP Agent
//       </header>

//       <main className="flex-1 overflow-y-auto p-4 space-y-4">
//         {messages.map((m, i) => (
//           <motion.div
//             key={i}
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
//           >
//             <div
//               className={`px-4 py-3 rounded-2xl max-w-[70%] ${
//                 m.role === "user" ? "bg-blue-600" : "bg-gray-700"
//               }`}
//             >
//               {m.text}
//             </div>
//           </motion.div>
//         ))}
//         <div ref={chatRef} />
//       </main>

//       <footer className="flex p-4 bg-gray-800 gap-2">
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           placeholder="Type your message..."
//           className="flex-1 p-3 bg-gray-700 rounded-lg focus:outline-none"
//         />
//         <button
//           onClick={sendMessage}
//           disabled={loading}
//           className="bg-blue-600 px-4 py-2 rounded-lg disabled:opacity-50"
//         >
//           {loading ? "..." : "Send"}
//         </button>
//       </footer>
//     </div>
//   );
// }






// "use client";
// import { useState, useRef } from "react";
// import { motion } from "framer-motion";

// export default function Page() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const chatRef = useRef();

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     // Add user message instantly
//     const newMessages = [...messages, { role: "user", text: input }];
//     setMessages(newMessages);
//     setInput("");
//     setLoading(true);

//     try {
//       // Send to backend
//       const res = await fetch("/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: input }),
//       });

//       const data = await res.json();
//       const replyText = data.reply || "⚠️ No response received.";

//       // Add AI reply
//       setMessages([...newMessages, { role: "ai", text: replyText }]);
//     } catch (error) {
//       setMessages([
//         ...newMessages,
//         { role: "ai", text: "❌ Something went wrong sending your message." },
//       ]);
//     }

//     setLoading(false);
//     setTimeout(() => chatRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gray-900 text-white">
//       <header className="p-4 bg-gray-800 text-center text-lg font-semibold">
//         🤖 Gemini MCP Chat
//       </header>

//       <main className="flex-1 overflow-y-auto p-4 space-y-4">
//         {messages.map((m, i) => (
//           <motion.div
//             key={i}
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
//           >
//             <div
//               className={`px-4 py-3 rounded-2xl max-w-[70%] ${
//                 m.role === "user"
//                   ? "bg-blue-600"
//                   : m.text.startsWith("✅")
//                   ? "bg-green-600"
//                   : m.text.startsWith("❌")
//                   ? "bg-red-600"
//                   : "bg-gray-700"
//               }`}
//             >
//               {m.text}
//             </div>
//           </motion.div>
//         ))}

//         {loading && (
//           <div className="flex justify-start">
//             <div className="bg-gray-700 px-4 py-3 rounded-2xl text-gray-300 animate-pulse">
//               Thinking...
//             </div>
//           </div>
//         )}

//         <div ref={chatRef} />
//       </main>

//       <footer className="flex p-4 bg-gray-800 gap-2">
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           placeholder="Type your message..."
//           className="flex-1 p-3 bg-gray-700 rounded-lg focus:outline-none"
//         />
//         <button
//           onClick={sendMessage}
//           disabled={loading}
//           className="bg-blue-600 px-4 py-2 rounded-lg disabled:opacity-50"
//         >
//           {loading ? "..." : "Send"}
//         </button>
//       </footer>
//     </div>
//   );
// }









"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SendHorizonal, Sparkles } from "lucide-react";

export default function Page() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef();

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const replyText = data.reply || "⚠️ No response received.";
      setMessages([...newMessages, { role: "ai", text: replyText }]);
    } catch {
      setMessages([
        ...newMessages,
        { role: "ai", text: "❌ Something went wrong sending your message." },
      ]);
    }

    setLoading(false);
    setTimeout(() => chatRef.current?.scrollIntoView({ behavior: "smooth" }), 150);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-cyan-500 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-600 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative flex flex-col h-[90vh] w-full max-w-md bg-black/60 border border-gray-800 rounded-[2rem] backdrop-blur-xl text-white shadow-[0_0_40px_rgba(0,255,255,0.15)] overflow-hidden">
        <header className="p-4 text-center border-b border-gray-800 bg-black/70">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg font-semibold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"
          >
            GEMINI MCP AGENT
          </motion.h1>
          <p className="text-xs text-gray-400 tracking-widest">AUTONOMOUS INTELLIGENCE</p>
        </header>

        <main className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-800">
          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`relative px-4 py-3 rounded-2xl max-w-[80%] text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white"
                      : m.text.startsWith("✅")
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                      : m.text.startsWith("❌")
                      ? "bg-gradient-to-r from-red-600 to-pink-700 text-white"
                      : "bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100 border border-gray-700"
                  }`}
                >
                  <div className="absolute inset-0 rounded-2xl blur-xl opacity-20 bg-gradient-to-r from-cyan-400 to-purple-500"></div>
                  <span className="relative z-10">{m.text}</span>
                </div>
              </motion.div>
            ))}

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="px-4 py-3 rounded-2xl max-w-[60%] bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 animate-pulse text-gray-300">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin-slow text-cyan-400" />
                    Thinking...
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={chatRef} />
        </main>

        <footer className="flex items-center gap-2 p-3 bg-black/70 border-t border-gray-800">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your command..."
            className="flex-1 p-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-blue-600 hover:to-cyan-400 p-3 rounded-xl transition-all shadow-[0_0_10px_rgba(0,200,255,0.3)] disabled:opacity-50"
          >
            {loading ? (
              <motion.div className="w-5 h-5 border-2 border-white/50 border-t-transparent rounded-full animate-spin mx-auto" />
            ) : (
              <SendHorizonal className="w-5 h-5 mx-auto" />
            )}
          </button>
        </footer>
      </div>
    </div>
  );
}
