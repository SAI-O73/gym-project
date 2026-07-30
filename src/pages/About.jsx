import SectionHeading from '../components/SectionHeading';

const trainers = [
  { name: 'Maya Chen', role: 'Performance Coach', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80' },
  { name: 'Jordan Cole', role: 'Nutrition Specialist', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-black px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="About FIT73" title="A premium training experience built for modern athletes" description="We blend evidence-based coaching, smart nutrition, and AI guidance into one elevated platform." />
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[32px] border border-white/10 bg-white/8 p-8 backdrop-blur-xl">
            <h3 className="text-2xl font-semibold">Mission</h3>
            <p className="mt-4 text-slate-300">To make elite fitness coaching accessible through clean design, adaptive plans, and intelligent recommendations.</p>
            <h3 className="mt-8 text-2xl font-semibold">Vision</h3>
            <p className="mt-4 text-slate-300">To build the most intuitive performance experience for people seeking healthier, stronger, and more consistent lifestyles.</p>
          </div>
          <div className="grid gap-4">
            {trainers.map((trainer) => (
              <div key={trainer.name} className="flex items-center gap-4 rounded-[24px] border border-white/10 bg-white/8 p-4 backdrop-blur-xl">
                <img src={trainer.image} alt={trainer.name} className="h-16 w-16 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-white">{trainer.name}</p>
                  <p className="text-sm text-slate-400">{trainer.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
