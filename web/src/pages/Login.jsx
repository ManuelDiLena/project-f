import { useState } from 'react';
import { auth, provider } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
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
      <h2 className='text-xl font-semibold'>Sign In</h2>
      <form onSubmit={handleLogin} className='space-y-2'>
        <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} className='w-full border rounded p-2' />
        <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} className='w-full border rounded p-2' />
        <button className='w-full bg-blue-600 text-white py-2 rounded'>Sign In</button>
      </form>
      <button onClick={handleGoogle} className='w-full border py-2 rounded'>Sign In with Google</button>
      {error && <p className='text-red-500 text-sm'>{error}</p>}
    </div>
  );
}