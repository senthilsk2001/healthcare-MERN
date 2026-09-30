import { useEffect, useState } from 'react';
import api from '../api';

export default function Dashboard() {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    ['patients', 'doctors', 'appointments'].forEach(async (r) => {
      const { data } = await api.get(`/${r}`, { params: { limit: 1 } });
      setCounts((c) => ({ ...c, [r]: data.total }));
    });
  }, []);

  return (
    <>
      <h2>Dashboard</h2>
      <div className="stats">
        {['patients', 'doctors', 'appointments'].map((r) => (
          <div className="card stat" key={r}>
            <span className="muted">{r}</span>
            <strong>{counts[r] ?? '…'}</strong>
          </div>
        ))}
      </div>
    </>
  );
}
