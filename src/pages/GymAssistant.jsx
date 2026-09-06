import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMessageCircle, FiRefreshCw, FiSend, FiTrash2 } from 'react-icons/fi';
import { askGemini } from '../services/gemini';
import toast from 'react-hot-toast';

export default function AIChat() {
  const welcomeMessage = { from: 'bot', text: 'Hello! I can answer questions about FIT73 pages, features, account setup, diet, workouts, protein, recovery, and more.' };
  const [messages, setMessages] = useState([
    welcomeMessage,
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastUserMessage, setLastUserMessage] = useState('');
  const [lastErrorStatus, setLastErrorStatus] = useState(null);
  const quickPrompts = ['Build me a 3-day workout', 'How much protein do I need?', 'Create a weight-loss meal plan', 'How should I recover?'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput) return;
    const nextMessages = [...messages, { from: 'user', text: trimmedInput }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);
    setLastUserMessage(trimmedInput);
    setLastErrorStatus(null);

    try {
      const reply = await askGemini(trimmedInput);
      setMessages((m) => [...nextMessages, { from: 'bot', text: reply }]);
    } catch (err) {
      const status = err?.status || err?.response?.status;
      setLastErrorStatus(status || 500);
      if (status === 429) {
        toast.error('Rate limit reached. Retrying once in 3 seconds...');
        await new Promise((r) => setTimeout(r, 3000));
        try {
          const retryReply = await askGemini(trimmedInput);
          setMessages((m) => [...nextMessages, { from: 'bot', text: retryReply }]);
          setLastErrorStatus(null);
          setLoading(false);
          return;
        } catch (err2) {
          toast.error('Still rate-limited. Please check billing or try later.');
          setMessages((m) => [...nextMessages, { from: 'bot', text: 'AI coach is currently rate-limited. Please try again later.' }]);
          setLoading(false);
          return;
        }
      }

      toast.error('AI coach is unavailable right now.');
      console.error('AIChat error', err);
      setMessages((m) => [...nextMessages, { from: 'bot', text: 'The AI coach is unavailable right now.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async () => {
    if (!lastUserMessage) return;
    setLoading(true);
    const nextMessages = [...messages, { from: 'user', text: lastUserMessage }];
    setMessages(nextMessages);
    try {
      const reply = await askGemini(lastUserMessage);
      setMessages((m) => [...nextMessages, { from: 'bot', text: reply }]);
      setLastErrorStatus(null);
    } catch (err) {
      const status = err?.status || err?.response?.status;
      setLastErrorStatus(status || 500);
      toast.error('Retry failed. Please check billing or try later.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (prompt) => {
    setInput(prompt);
  };

  const clearChat = () => {
    setMessages([welcomeMessage]);
    setLastUserMessage('');
    setLastErrorStatus(null);
  };

  return (
    <div className="min-h-screen bg-brand-black px-4 py-16 text-brand-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[36px] border border-brand-white/10 bg-brand-white/8 p-4 backdrop-blur-xl sm:p-6">
        <div className="mb-6 flex flex-col gap-5 rounded-[24px] border border-brand-red/20 bg-brand-red/10 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.35em] text-brand-red"><FiMessageCircle /> AI Fitness Agent</div>
            <h2 className="mt-2 text-2xl font-semibold text-brand-white sm:text-3xl">Your personal training desk</h2>
            <p className="mt-2 text-sm text-brand-gray">Ask for practical guidance on workouts, food, protein, or recovery.</p>
          </div>
          <button type="button" onClick={clearChat} className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-white/15 px-4 py-2 text-sm text-brand-gray transition hover:border-brand-red/50 hover:text-brand-white"><FiTrash2 /> Clear chat</button>
        </div>

        <div className="flex h-[520px] flex-col overflow-hidden rounded-[24px] border border-brand-white/10 bg-brand-black/30">
          <div className="flex flex-wrap gap-2 border-b border-brand-white/10 p-4">
            {quickPrompts.map((prompt) => <button key={prompt} type="button" onClick={() => handleQuickPrompt(prompt)} className="rounded-full border border-brand-white/15 px-3 py-2 text-xs text-brand-gray transition hover:border-brand-red/50 hover:text-brand-white">{prompt}</button>)}
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`max-w-[80%] rounded-[20px] px-4 py-3 ${message.from === 'user' ? 'ml-auto bg-gradient-to-r from-brand-red to-brand-red' : 'bg-brand-white/10 text-brand-offwhite'}`}>
                {message.text}
              </motion.div>
            ))}
            {loading ? <div className="max-w-[80%] rounded-[20px] bg-brand-white/10 px-4 py-3 text-brand-gray">Thinking...</div> : null}
          </div>
          <form onSubmit={handleSubmit} className="border-t border-brand-white/10 p-4">
            <div className="flex items-end gap-3 rounded-3xl border border-brand-white/10 bg-brand-white/10 px-3 py-3 focus-within:border-brand-red/50">
              <textarea value={input} onChange={(e) => setInput(e.target.value)} rows="1" className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 outline-none" placeholder="Ask about diet, training, protein, or recovery" />
              <button type="submit" disabled={loading} aria-label="Send message" className="rounded-full bg-brand-red p-3 text-brand-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50">
                <FiSend />
              </button>
              {(lastErrorStatus === 429) ? (
                <button type="button" onClick={handleRetry} aria-label="Retry message" className="ml-2 rounded-full border border-brand-white/10 p-2 text-sm text-brand-white"><FiRefreshCw /></button>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
