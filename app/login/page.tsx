'use client';

import { useState } from 'react';
import { auth } from '../../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push('/planet');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black flex items-center justify-center">
      <div className="bg-black/50 backdrop-blur-md p-8 rounded-2xl w-96">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          {isLogin ? '🔐 Sign In' : '🌱 Sign Up'}
        </h1>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-3 bg-white/10 rounded-lg text-white placeholder-white/50"
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 bg-white/10 rounded-lg text-white placeholder-white/50"
            required
          />
          
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full font-bold text-white"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-4 text-white/70 text-sm hover:text-white"
        >
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
        </button>
        
        <Link href="/">
          <button className="w-full mt-4 py-2 bg-white/10 rounded-lg text-white/70 text-sm">
            ← Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}