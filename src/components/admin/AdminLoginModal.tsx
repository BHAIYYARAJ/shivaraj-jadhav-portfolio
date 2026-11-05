import React, { useState } from 'react';
import { Lock, Mail, AlertCircle, X, Shield, ArrowRight } from 'lucide-react';
import { api } from '../../services/api.js';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState('jadhavbhaiyyaraj@gmail.com');
  const [password, setPassword] = useState('Shivaraj@2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.login(email, password);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-orange-600/20 text-orange-400 border border-orange-500/30 flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white font-heading">
            Admin Portal
          </h2>
          <p className="text-xs text-zinc-400">
            Exclusive administration dashboard for <span className="text-white font-medium">Shivaraj Jadhav</span>.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-950/60 border border-red-500/50 flex items-center gap-2.5 text-red-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Authorized Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jadhavbhaiyyaraj@gmail.com"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">
              Default password: <code className="text-orange-400">Shivaraj@2026!</code> (can be changed inside Settings)
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-xl text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Access Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-zinc-900 text-center">
          <p className="text-[11px] text-zinc-500">
            Protected with server-side HMAC &amp; salted PBKDF2 cryptography. Public registration is disabled.
          </p>
        </div>
      </div>
    </div>
  );
};
