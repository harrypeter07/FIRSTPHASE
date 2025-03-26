'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert('Check your email for confirmation link.');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <input
        type="email"
        placeholder="Email"
        className="p-2 border rounded"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="p-2 border rounded mt-2"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="p-2 bg-green-600 text-white rounded mt-2" onClick={handleRegister}>
        Register
      </button>
    </div>
  );
}
