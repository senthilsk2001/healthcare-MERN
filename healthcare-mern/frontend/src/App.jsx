import { Navigate, NavLink, Outlet, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { Patients, Doctors, Appointments } from './pages/Resources.jsx';

function Private() {
  const { user, loading, logout } = useAuth();
  if (loading) return <p className="center">Loading…</p>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <>
      <header className="nav">
        <strong className="brand">+ MediCare</strong>
        <nav>
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/patients">Patients</NavLink>
          <NavLink to="/doctors">Doctors</NavLink>
          <NavLink to="/appointments">Appointments</NavLink>
        </nav>
        <span className="user">
          {user.name} ({user.role})
          <button className="btn ghost" onClick={logout}>Logout</button>
        </span>
      </header>
      <main className="container"><Outlet /></main>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Private />}>
        <Route index element={<Dashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="appointments" element={<Appointments />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
