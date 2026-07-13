import { useState, type ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { Spinner } from '../components/ui/Spinner';

export function AuthPage({ mode }: { mode: 'signin' | 'signup' }) {
  const { signIn, signUp } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSignUp = mode === 'signup';
  const from = (location.state as { from?: string })?.from ?? '/account';

  useDocumentTitle(isSignUp ? 'Create account' : 'Sign in');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = isSignUp
        ? await signUp(email, password, fullName)
        : await signIn(email, password);
      if (res.error) {
        setError(res.error);
      } else if (isSignUp) {
        push('Account created. Welcome to Maison.', 'success');
        navigate(from);
      } else {
        push('Welcome back.', 'success');
        navigate(from);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-ink-200 shadow-card dark:border-ink-800 lg:grid-cols-2">
        {/* Visual panel */}
        <div className="relative hidden lg:block">
          <img
            src="https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=1000"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/30 to-transparent" />
          <div className="absolute bottom-0 left-0 p-10 text-white">
            <p className="font-display text-3xl font-semibold">Maison</p>
            <p className="mt-2 max-w-xs text-sm text-white/80">Considered goods, delivered. Join for faster checkout, order tracking, and exclusive offers.</p>
          </div>
        </div>

        {/* Form panel */}
        <div className="p-8 sm:p-12">
          <h1 className="text-h2 font-display font-semibold">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">
            {isSignUp ? 'Join Maison in less than a minute.' : 'Sign in to continue shopping.'}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {isSignUp && (
              <Field label="Full name" icon={<UserIcon size={18} />}>
                <input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-ink-400"
                  autoComplete="name"
                />
              </Field>
            )}
            <Field label="Email" icon={<Mail size={18} />}>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent text-sm outline-none placeholder:text-ink-400"
                autoComplete="email"
              />
            </Field>
            <Field label="Password" icon={<Lock size={18} />}>
              <input
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSignUp ? 'At least 6 characters' : 'Your password'}
                className="w-full bg-transparent text-sm outline-none placeholder:text-ink-400"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                minLength={6}
              />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="text-ink-400 hover:text-ink-600" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </Field>

            {error && (
              <p className="rounded-xl bg-error-500/10 px-4 py-2.5 text-sm text-error-600 dark:text-error-500">{error}</p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Spinner size={18} /> : <>{isSignUp ? 'Create account' : 'Sign in'} <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500 dark:text-ink-400">
            {isSignUp ? (
              <>Already have an account? <Link to="/signin" className="font-medium text-ink-900 link-underline dark:text-white">Sign in</Link></>
            ) : (
              <>New to Maison? <Link to="/signup" className="font-medium text-ink-900 link-underline dark:text-white">Create an account</Link></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon, children }: { label: string; icon: ReactNode; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-ink-600 dark:text-ink-400">{label}</span>
      <div className="flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-4 py-3 transition focus-within:border-ink-900 focus-within:ring-2 focus-within:ring-ink-900/10 dark:border-ink-700 dark:bg-ink-900 dark:focus-within:border-ink-300">
        <span className="text-ink-400">{icon}</span>
        {children}
      </div>
    </label>
  );
}
