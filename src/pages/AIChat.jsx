import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend } from 'react-icons/fi';
import { askGemini } from '../services/gemini';

export default function AIChat() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hello! I can help with diet plans, workouts, protein, recovery, and gym guidance.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const nextMessages = [...messages, { from: 'user', text: input }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);
    const reply = await askGemini(input);
    setMessages([...nextMessages, { from: 'bot', text: reply }]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[36px] border border-white/10 bg-white/8 p-4 backdrop-blur-xl sm:p-6">
        <div className="mb-6 rounded-[24px] border border-cyan-400/20 bg-cyan-500/10 p-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">AI Fitness Agent</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Ask anything about workouts, nutrition, and recovery.</h2>
        </div>

        <div className="flex h-[520px] flex-col overflow-hidden rounded-[24px] border border-white/10 bg-black/30">
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`max-w-[80%] rounded-[20px] px-4 py-3 ${message.from === 'user' ? 'ml-auto bg-gradient-to-r from-cyan-500 to-fuchsia-500' : 'bg-white/10 text-slate-200'}`}>
                {message.text}
              </motion.div>
            ))}
            {loading ? <div className="max-w-[80%] rounded-[20px] bg-white/10 px-4 py-3 text-slate-300">Thinking...</div> : null}
          </div>
          <form onSubmit={handleSubmit} className="border-t border-white/10 p-4">
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-3 py-3">
              <input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 bg-transparent outline-none" placeholder="Ask about diet, training, protein, or recovery" />
              <button type="submit" className="rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 p-3 text-white">
                <FiSend />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
