import React, { useState } from 'react';
import Input from './ui/Input';
import Button from './ui/Button';
import { login, register } from '../services/authService';

interface AuthProps {
  onAuthSuccess: (token: string, username: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (mode === 'login') {
      const res = await login(username, password);
      if (res.token && res.username) {
        onAuthSuccess(res.token, res.username);
      } else {
        setError(res.error || 'Login fehlgeschlagen');
      }
    } else {
      const regRes = await register(username, password);
      if (regRes.success) {
        // Nach erfolgreicher Registrierung automatisch einloggen
        const loginRes = await login(username, password);
        if (loginRes.token && loginRes.username) {
          onAuthSuccess(loginRes.token, loginRes.username);
        } else {
          // Fallback: trotzdem weiterleiten, falls Registrierung erfolgreich war
          onAuthSuccess('', username);
        }
      } else {
        setError(regRes.error || 'Registrierung fehlgeschlagen');
      }
    }
    setLoading(false);
  };

  return (
    <div className="max-w-sm mx-auto mt-12 bg-white dark:bg-gray-800 p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">{mode === 'login' ? 'Login' : 'Registrieren'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Benutzername"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <Input
          label="Passwort"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Bitte warten...' : mode === 'login' ? 'Login' : 'Registrieren'}
        </Button>
      </form>
      <div className="mt-4 text-center">
        {mode === 'login' ? (
          <button className="text-blue-600 hover:underline" onClick={() => { setMode('register'); setError(''); }}>
            Noch keinen Account? Jetzt registrieren
          </button>
        ) : (
          <button className="text-blue-600 hover:underline" onClick={() => { setMode('login'); setError(''); }}>
            Bereits registriert? Zum Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Auth;
