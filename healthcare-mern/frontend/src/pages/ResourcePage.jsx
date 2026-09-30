import { useCallback, useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Reusable CRUD page.
 *  columns: [{ key, label, render?(row) }]
 *  fields:  [{ name, label, type, required?, options?, ref?, refLabel?, default? }]
 *           type: text | number | date | time | email | textarea | select | checkbox
 *           ref:  endpoint name to load <select> options from (e.g. "patients")
 */
export default function ResourcePage({ title, endpoint, columns, fields }) {
  const { user } = useAuth();
  const [data, setData] = useState({ items: [], pages: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [refs, setRefs] = useState({});
  const [form, setForm] = useState(null); // null = modal closed
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await api.get(`/${endpoint}`, { params: { page, search } });
      setData(res.data);
    } catch (e) {
      setError(errMsg(e));
    }
  }, [endpoint, page, search]);

  useEffect(() => { load(); }, [load]);

  // Load options for fields that reference another collection
  useEffect(() => {
    fields.filter((f) => f.ref).forEach(async (f) => {
      const res = await api.get(`/${f.ref}`, { params: { limit: 100 } });
      setRefs((r) => ({ ...r, [f.ref]: res.data.items }));
    });
  }, [fields]);

  const openNew = () => {
    const defaults = {};
    fields.forEach((f) => { defaults[f.name] = f.default ?? (f.type === 'checkbox' ? false : ''); });
    setEditingId(null);
    setForm(defaults);
    setError('');
  };

  const openEdit = (row) => {
    const values = {};
    fields.forEach((f) => {
      let v = row[f.name];
      if (f.ref) v = v?._id ?? v;
      if (f.type === 'date' && v) v = String(v).slice(0, 10);
      values[f.name] = v ?? (f.type === 'checkbox' ? false : '');
    });
    setEditingId(row._id);
    setForm(values);
    setError('');
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) await api.put(`/${endpoint}/${editingId}`, form);
      else await api.post(`/${endpoint}`, form);
      setForm(null);
      load();
    } catch (err) {
      setError(errMsg(err));
    }
  };

  const remove = async (row) => {
    if (!window.confirm('Delete this record? This cannot be undone.')) return;
    try {
      await api.delete(`/${endpoint}/${row._id}`);
      load();
    } catch (err) {
      setError(errMsg(err));
    }
  };

  const setValue = (f, e) =>
    setForm({ ...form, [f.name]: f.type === 'checkbox' ? e.target.checked : e.target.value });

  const renderInput = (f) => {
    const common = { value: form[f.name], onChange: (e) => setValue(f, e), required: f.required };
    if (f.type === 'textarea') return <textarea rows={3} {...common} />;
    if (f.type === 'checkbox')
      return <input type="checkbox" checked={!!form[f.name]} onChange={(e) => setValue(f, e)} />;
    if (f.type === 'select' || f.ref) {
      const opts = f.ref
        ? (refs[f.ref] || []).map((o) => ({ value: o._id, label: o[f.refLabel || 'name'] }))
        : f.options.map((o) => ({ value: o, label: o || '—' }));
      return (
        <select {...common}>
          <option value="">Select…</option>
          {opts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      );
    }
    return <input type={f.type || 'text'} {...common} />;
  };

  return (
    <>
      <div className="toolbar">
        <h2>{title}</h2>
        <input
          className="search"
          placeholder="Search…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <button className="btn" onClick={openNew}>+ Add</button>
      </div>

      {error && !form && <p className="error">{error}</p>}

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((c) => <th key={c.key}>{c.label}</th>)}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.items.length === 0 && (
              <tr><td colSpan={columns.length + 1} className="muted center">No records found</td></tr>
            )}
            {data.items.map((row) => (
              <tr key={row._id}>
                {columns.map((c) => (
                  <td key={c.key}>{c.render ? c.render(row) : String(row[c.key] ?? '—')}</td>
                ))}
                <td className="actions">
                  <button className="btn small" onClick={() => openEdit(row)}>Edit</button>
                  {user.role === 'admin' && (
                    <button className="btn small danger" onClick={() => remove(row)}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pager">
        <button className="btn ghost small" disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
        <span>Page {data.page ?? page} of {data.pages} · {data.total} total</span>
        <button className="btn ghost small" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Next</button>
      </div>

      {form && (
        <div className="overlay" onClick={() => setForm(null)}>
          <form className="card modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
            <h3>{editingId ? 'Edit' : 'Add'} {title.replace(/s$/, '')}</h3>
            {error && <p className="error">{error}</p>}
            {fields.map((f) => (
              <label key={f.name} className={f.type === 'checkbox' ? 'inline' : ''}>
                {f.label}
                {renderInput(f)}
              </label>
            ))}
            <div className="row-end">
              <button type="button" className="btn ghost" onClick={() => setForm(null)}>Cancel</button>
              <button type="submit" className="btn">Save</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
