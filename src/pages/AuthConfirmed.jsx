import { Link } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';

export default function AuthConfirmed() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16 text-brand-white sm:px-6">
      <div className="w-full max-w-lg rounded-[32px] border border-brand-white/10 bg-brand-white/8 p-8 text-center shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-red/15 text-brand-red">
          <FiCheckCircle size={34} />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-brand-red">FIT73</p>
        <h1 className="mt-3 text-3xl font-semibold">Your account is created</h1>
        <p className="mt-4 text-brand-gray">Your email has been verified successfully. Welcome to FIT73.</p>
        <Link to="/" className="mt-8 inline-flex rounded-full bg-brand-red px-6 py-3 font-semibold transition hover:bg-red-700">
          Continue to login
        </Link>
      </div>
    </div>
  );
}
