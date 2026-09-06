import { useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const openMailFallback = () => {
    const subject = encodeURIComponent(`FIT73 contact message from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    const mailtoUrl = `mailto:dsaimtm@gmail.com?subject=${subject}&body=${body}`;

    window.location.href = mailtoUrl;
    toast('Your email app was opened with the message ready to send.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = import.meta.env.VITE_CONTACT_URL || 'http://localhost:3001/contact';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const details = await res.json().catch(() => ({}));
        const error = new Error(details.error || 'Failed to send message');
        error.status = res.status;
        throw error;
      }
      toast.success('Message sent to FIT73.');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      const status = err?.status;
      const message = err?.message || '';

      if (status === 503 || message.includes('not configured') || message.includes('Email service')) {
        openMailFallback();
        return;
      }

      console.error(err);
      toast.error('Failed to send message — please try again or email directly.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-black px-4 py-16 text-brand-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Contact" title="Let’s talk training" description="Reach out for professional support or plan customization." />
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl rounded-[32px] border border-brand-white/10 bg-brand-white/8 p-8 backdrop-blur-xl">
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="mb-4 w-full rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 outline-none" />
          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="mb-4 w-full rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 outline-none" />
          <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Message" className="min-h-[180px] w-full rounded-2xl border border-brand-white/10 bg-brand-black/30 px-4 py-3 outline-none" />
          <button type="submit" className="mt-6 rounded-full bg-gradient-to-r from-brand-red to-brand-red px-6 py-3 font-semibold">Send Message</button>
        </form>
      </div>
    </div>
  );
}
