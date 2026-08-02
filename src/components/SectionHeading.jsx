export default function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-8 max-w-2xl">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">{eyebrow}</p>
      <h2 className="text-3xl font-semibold text-brand-white sm:text-4xl">{title}</h2>
      <p className="mt-3 text-brand-gray">{description}</p>
    </div>
  );
}
