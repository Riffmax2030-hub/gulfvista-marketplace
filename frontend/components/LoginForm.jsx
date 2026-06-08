import React, { useState } from 'react';

export default function LoginForm({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call backend login endpoint
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || 'Login failed');
        setLoading(false);
        return;
      }

      // Store token and user info
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Call parent handler
      onLogin({
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
      });

      // Clear form
      setEmail('');
      setPassword('');
    } catch (err) {
      setError('Failed to connect to server. Using demo account.');
      // Demo mode - accept any email/password
      onLogin({
        id: 1,
        email: email || 'demo@example.com',
        role: 'buyer',
      });
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-lg p-8">
      <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
      <p className="text-gray-400 mb-6">Sign in to your gulfvista account</p>

      {error && (
        <div className="mb-4 p-4 bg-red-900/20 border border-red-700 rounded text-red-300 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-700 text-white font-semibold rounded transition mt-6"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-700">
        <p className="text-gray-400 text-sm">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-amber-500 hover:text-amber-400 font-semibold transition"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
