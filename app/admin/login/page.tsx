'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const sb = createClient();
    const { error } = await sb.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/admin');
      router.refresh(); // Refresh to apply middleware cookies
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <form onSubmit={handleLogin} className="w-full max-w-sm rounded-3xl bg-cream-card p-8 ring-1 ring-black/5 shadow-soft">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl text-ink">Admin Login</h1>
          <p className="text-sm text-olive-dark mt-1">Cakes by Aspeya</p>
        </div>

        {error && <div className="mb-4 rounded-lg bg-burgundy/10 p-3 text-sm text-burgundy">{error}</div>}

        <label className="block mb-4">
          <span className="mb-1 block text-sm font-medium text-ink">Email</span>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="input" 
            required 
          />
        </label>

        <label className="block mb-6">
          <span className="mb-1 block text-sm font-medium text-ink">Password</span>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="input" 
            required 
          />
        </label>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full rounded-full bg-burgundy py-3 font-medium text-cream hover:bg-burgundy-dark transition disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
    </div>
  );
}