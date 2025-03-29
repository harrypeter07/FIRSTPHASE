'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailLogin = async () => {
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      alert(`Error: ${result.error}`);
    } else {
      alert('Login successful!');
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Login</h1>

      {/* Email and Password Login */}
      <input
        type="email"
        placeholder="Email"
        className="p-2 border rounded mb-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="p-2 border rounded mb-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="p-2 bg-green-600 text-white rounded" onClick={handleEmailLogin}>
        Sign in with Email
      </button>
    </div>
  );
}
