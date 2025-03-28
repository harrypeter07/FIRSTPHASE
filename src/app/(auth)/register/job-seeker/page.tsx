'use client';
import { useState } from 'react';

export default function RegisterJobSeeker() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleRegister = async () => {
    const res = await fetch('/api/auth/register/job-seeker', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName }),
    });
    const result = await res.json();
    alert(result.message || result.error);
  };

  return (
    <div>
      <h1>Register as Job Seeker</h1>
      <input type="text" placeholder="Full Name" onChange={(e) => setFullName(e.target.value)} />
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
