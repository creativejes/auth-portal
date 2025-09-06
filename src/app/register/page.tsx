// src/app/register/page.tsx
'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setOk(false);
    setPending(true);

    const form = e.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    setPending(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Registration failed');
      return;
    }

    setOk(true);
    setTimeout(() => router.push('/login'), 700);
  }

  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="text-2xl font-bold mb-4">Create account</h1>

      {error && <p className="mb-3 text-red-600">{error}</p>}
      {ok && <p className="mb-3 text-green-700">Account created! Redirecting…</p>}

      <form onSubmit={onSubmit} className="space-y-3">
        <input name="name" placeholder="Full name" className="w-full rounded border p-2" />
        <input name="email" type="email" placeholder="Email" required className="w-full rounded border p-2" />
        <input name="password" type="password" placeholder="Password (min 6)" required className="w-full rounded border p-2" />
        <button disabled={pending} className="w-full rounded bg-black text-white py-2">
          {pending ? 'Creating…' : 'Register'}
        </button>
      </form>

      <p className="mt-4 text-sm">
        Already have an account? <a className="underline" href="/login">Log in</a>
      </p>
    </main>
  );
}
