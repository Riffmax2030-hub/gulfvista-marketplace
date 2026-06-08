import React, { useState } from 'react';

export default function RegisterForm({ onRegister, onSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const [agentLicense, setAgentLicense] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    // Validate agent license if agent
    if (role === 'agent' && !agentLicense.trim()) {
      setError('Agent license number is required for agents');
      return;
    }

    setLoading(true);

    try {
      // Call backend register endpoint
      const response = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          role,
          agent_license: role === 'agent' ? agentLicense : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || 'Registration failed');
        setLoading(false);
        return;
      }

      // Store token and user info
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Call parent handler
      onRegister({
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
      });

      // Clear form
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setAgentLicense('');
    } catch (err) {
      setError('Failed to connect to server. Using demo account.');
      // Demo mode - accept registration
      onRegister({
        id: Math.random(),
        email,
        role,
      });
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-lg p-8">
      <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
      <p className="text-gray-400 mb-6">Join gulfvista today</p>

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
            Account Type
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-amber-500"
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="agent">Real Estate Agent</option>
          </select>
        </div>

        {role === 'agent' && (
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Agent License Number
            </label>
            <input
              type="text"
              value={agentLicense}
              onChange={(e) => setAgentLicense(e.target.value)}
              placeholder="Your license number"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        )}

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
          <p className="text-gray-500 text-xs mt-1">Minimum 8 characters</p>
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-700">
        <p className="text-gray-400 text-sm">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-amber-500 hover:text-amber-400 font-semibold transition"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
