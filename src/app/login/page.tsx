// src/app/login/page.tsx
'use client';

import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(search.get('error'));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setPending(false);

    if (res?.error) {
      setError('Invalid email or password');
      return;
    }
    router.push('/dashboard');
  }

  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="text-2xl font-bold mb-4">Log in</h1>

      {error && <p className="mb-3 text-red-600">{error}</p>}

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="w-full rounded border p-2"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="w-full rounded border p-2"
        />
        <button
          disabled={pending}
          className="w-full rounded bg-black text-white py-2"
        >
          {pending ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p className="mt-4 text-sm">
        No account? <a className="underline" href="/register">Register</a>
      </p>
    </main>
  );
}
