import { useState } from 'react';
import { auth, provider } from '../firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='max-w-sm space-y-4'>
      <h2 className='text-xl font-semibold'>Sign Up</h2>
      <form onSubmit={handleRegister} className='space-y-2'>
        <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} className='w-full border rounded p-2' />
        <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} className='w-full border rounded p-2' />
        <button className='w-full bg-blue-500 text-white p-2 rounded'>Sign Up</button>
      </form>
      <button onClick={handleGoogle} className='w-full border py-2 rounded'>Sign Up with Google</button>
      {error && <p className='text-red-500 text-sm'>{error}</p>}
    </div>
  );
}