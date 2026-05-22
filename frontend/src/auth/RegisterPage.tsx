import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { register } from '../api/authApi';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from './AuthContext';

export function RegisterPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    try {
      const response = await register(email, password, displayName);
      auth.setSession(response);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-panel" onSubmit={submit}>
        <h1>Create account</h1>
        {error && <div className="error">{error}</div>}
        <Input label="Display name" value={displayName} onChange={setDisplayName} />
        <Input label="Email" value={email} onChange={setEmail} type="email" />
        <Input label="Password" value={password} onChange={setPassword} type="password" />
        <Button type="submit" icon={<UserPlus size={18} />}>Register</Button>
        <Link to="/login">Back to sign in</Link>
      </form>
    </main>
  );
}
