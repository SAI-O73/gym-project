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
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const nextMessages = [...messages, { from: 'user', text: trimmedInput }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    const reply = await askGemini(trimmedInput);
    setMessages([...nextMessages, { from: 'bot', text: reply }]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-brand-black px-4 py-16 text-brand-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[36px] border border-brand-white/10 bg-brand-white/8 p-4 backdrop-blur-xl sm:p-6">
        <div className="mb-6 rounded-[24px] border border-brand-red/20 bg-brand-red/10 p-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-red">AI Fitness Agent</p>
          <h2 className="mt-2 text-3xl font-semibold text-brand-white">Ask anything about workouts, nutrition, and recovery.</h2>
        </div>

        <div className="flex h-[520px] flex-col overflow-hidden rounded-[24px] border border-brand-white/10 bg-brand-black/30">
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`max-w-[80%] rounded-[20px] px-4 py-3 ${message.from === 'user' ? 'ml-auto bg-gradient-to-r from-brand-red to-brand-red' : 'bg-brand-white/10 text-brand-offwhite'}`}>
                {message.text}
              </motion.div>
            ))}
            {loading ? <div className="max-w-[80%] rounded-[20px] bg-brand-white/10 px-4 py-3 text-brand-gray">Thinking...</div> : null}
          </div>
          <form onSubmit={handleSubmit} className="border-t border-brand-white/10 p-4">
            <div className="flex items-center gap-3 rounded-full border border-brand-white/10 bg-brand-white/10 px-3 py-3">
              <input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 bg-transparent outline-none" placeholder="Ask about diet, training, protein, or recovery" />
              <button type="submit" className="rounded-full bg-gradient-to-r from-brand-red to-brand-red p-3 text-brand-white">
                <FiSend />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
