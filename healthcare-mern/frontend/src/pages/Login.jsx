import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { errMsg } from '../api';

export default function Login() {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  if (user) return <Navigate to="/" replace />;

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) await register(form.name, form.email, form.password);
      else await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <div className="auth-wrap">
      <form className="card auth" onSubmit={submit}>
        <h2>{isRegister ? 'Create account' : 'Sign in'}</h2>
        {error && <p className="error">{error}</p>}
        {isRegister && (
          <label>Name<input name="name" value={form.name} onChange={change} required /></label>
        )}
        <label>Email<input type="email" name="email" value={form.email} onChange={change} required /></label>
        <label>Password<input type="password" name="password" minLength={6} value={form.password} onChange={change} required /></label>
        <button className="btn" type="submit">{isRegister ? 'Register' : 'Login'}</button>
        <p className="muted">
          {isRegister ? 'Already have an account?' : 'New here?'}{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); setIsRegister(!isRegister); setError(''); }}>
            {isRegister ? 'Sign in' : 'Create one'}
          </a>
        </p>
        {isRegister && <p className="muted small">The first account registered becomes the admin.</p>}
      </form>
    </div>
  );
}
