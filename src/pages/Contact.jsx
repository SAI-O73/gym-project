import { useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import { saveContactMessage } from '../services/supabase';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveContactMessage(form);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-black px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Contact" title="Let’s talk training" description="Reach out for professional support or plan customization." />
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl rounded-[32px] border border-white/10 bg-white/8 p-8 backdrop-blur-xl">
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="mb-4 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none" />
          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="mb-4 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none" />
          <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Message" className="min-h-[180px] w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none" />
          <button type="submit" className="mt-6 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-6 py-3 font-semibold">Send Message</button>
        </form>
      </div>
    </div>
  );
}
