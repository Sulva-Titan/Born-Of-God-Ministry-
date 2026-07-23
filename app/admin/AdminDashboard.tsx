'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard, Video, BookOpen, Calendar, Heart, MapPin, Award,
  Quote, Mail, LogOut, Plus, Trash2, Pencil, X, Loader2, Save, Menu,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { uploadFile } from '@/lib/supabase/storage';

/* ------------------------------------------------------------------ */
/* Field / resource configuration                                      */
/* ------------------------------------------------------------------ */
type FieldType = 'text' | 'number' | 'textarea' | 'checkbox' | 'file' | 'select';
interface Field {
  key: string;
  label: string;
  type?: FieldType;
  placeholder?: string;
  optional?: boolean;
  options?: string[];
  accept?: string; // for file
}
interface Resource {
  key: string;
  title: string;
  table: string;
  icon: React.ComponentType<{ className?: string }>;
  fields: Field[];
  orderColumn: string;
  ascending?: boolean;
  generateId?: () => string;
  primaryLabel: string; // column used as the row's headline in the list
}

const RESOURCES: Resource[] = [
  {
    key: 'sermons', title: 'Sermons', table: 'sermons', icon: Video,
    orderColumn: 'created_at', primaryLabel: 'title',
    fields: [
      { key: 'title', label: 'Title' },
      { key: 'speaker', label: 'Speaker' },
      { key: 'date', label: 'Date', placeholder: 'e.g. Jan 12, 2026', optional: true },
      { key: 'duration', label: 'Duration', placeholder: 'e.g. 45 mins', optional: true },
      { key: 'youtubeId', label: 'YouTube video ID', placeholder: 'the 11-char ID after ?v=' },
    ],
  },
  {
    key: 'books', title: 'Library', table: 'books', icon: BookOpen,
    orderColumn: 'created_at', primaryLabel: 'title',
    generateId: () => 'b' + Date.now(),
    fields: [
      { key: 'title', label: 'Title' },
      { key: 'author', label: 'Author' },
      { key: 'category', label: 'Category', optional: true },
      { key: 'pages', label: 'Pages', type: 'number', optional: true },
      { key: 'format', label: 'Format', type: 'select', options: ['PDF', 'EPUB', 'MOBI'], optional: true },
      { key: 'description', label: 'Description', type: 'textarea', optional: true },
      { key: 'cover', label: 'Cover image', type: 'file', accept: 'image/*', optional: true },
      { key: 'file_url', label: 'Book file (download)', type: 'file', accept: '.pdf,.epub,.mobi', optional: true },
    ],
  },
  {
    key: 'events', title: 'Events', table: 'events', icon: Calendar,
    orderColumn: 'created_at', primaryLabel: 'title',
    fields: [
      { key: 'title', label: 'Title' },
      { key: 'date', label: 'Date', placeholder: 'e.g. Aug 15, 2026' },
      { key: 'time', label: 'Time', placeholder: 'e.g. 09:00 AM' },
      { key: 'location', label: 'Location' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'is_major', label: 'Feature as major event', type: 'checkbox', optional: true },
    ],
  },
  {
    key: 'branches', title: 'Branches', table: 'branches', icon: MapPin,
    orderColumn: 'created_at', primaryLabel: 'name',
    fields: [
      { key: 'name', label: 'Branch name' },
      { key: 'location', label: 'Location', optional: true },
      { key: 'pastor', label: 'Pastor', optional: true },
      { key: 'members', label: 'Members', type: 'number', optional: true },
    ],
  },
  {
    key: 'leadership', title: 'Leadership', table: 'leadership', icon: Award,
    orderColumn: 'sort_order', ascending: true, primaryLabel: 'name',
    fields: [
      { key: 'name', label: 'Name' },
      { key: 'role', label: 'Role', optional: true },
      { key: 'bio', label: 'Bio', type: 'textarea', optional: true },
      { key: 'image', label: 'Photo', type: 'file', accept: 'image/*', optional: true },
      { key: 'sort_order', label: 'Sort order', type: 'number', optional: true },
    ],
  },
  {
    key: 'testimonials', title: 'Testimonials', table: 'testimonials', icon: Quote,
    orderColumn: 'created_at', primaryLabel: 'name',
    fields: [
      { key: 'name', label: 'Name' },
      { key: 'location', label: 'Location', optional: true },
      { key: 'quote', label: 'Quote', type: 'textarea' },
      { key: 'image', label: 'Photo', type: 'file', accept: 'image/*', optional: true },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Main dashboard                                                      */
/* ------------------------------------------------------------------ */
export function AdminDashboard({ email }: { email: string }) {
  const router = useRouter();
  const [active, setActive] = useState('Dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const nav = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Homepage', icon: LayoutDashboard },
    ...RESOURCES.map((r) => ({ name: r.title, icon: r.icon })),
    { name: 'Prayer Requests', icon: Heart },
    { name: 'Subscribers', icon: Mail },
  ];

  const activeResource = RESOURCES.find((r) => r.title === active);

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white font-sans flex">
      {/* Sidebar */}
      <aside
        className={`fixed md:static z-40 inset-y-0 left-0 w-64 bg-[#121215] border-r border-white/10 flex flex-col transition-transform ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5 border-b border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg overflow-hidden border border-brand/30 relative">
            <Image src="/logo.jpeg" alt="Logo" fill className="object-cover" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-sm leading-none">BOG Admin</h1>
            <span className="text-[9px] text-brand uppercase tracking-wider font-semibold">Portal</span>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {nav.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                setActive(item.name);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active === item.name
                  ? 'bg-brand text-black font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.name}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <div className="px-3 py-2 text-xs text-gray-500 truncate">{email}</div>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main */}
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 bg-[#0B0B0D]/90 backdrop-blur border-b border-white/10 px-6 py-4 flex items-center gap-3">
          <button className="md:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="font-heading font-bold text-lg">{active}</h2>
        </header>

        <div className="p-6 max-w-5xl">
          {active === 'Dashboard' && <Overview />}
          {active === 'Homepage' && <HomepagePanel />}
          {activeResource && <ResourcePanel key={activeResource.key} resource={activeResource} />}
          {active === 'Prayer Requests' && <PrayersPanel />}
          {active === 'Subscribers' && <SubscribersPanel />}
        </div>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Overview — live counts                                              */
/* ------------------------------------------------------------------ */
function Overview() {
  const [counts, setCounts] = useState<Record<string, number | null>>({});
  useEffect(() => {
    const tables = ['sermons', 'books', 'events', 'branches', 'leadership', 'testimonials', 'prayers', 'subscribers'];
    Promise.all(
      tables.map(async (t) => {
        const { count } = await supabase.from(t).select('*', { count: 'exact', head: true });
        return [t, count ?? 0] as const;
      })
    ).then((rows) => setCounts(Object.fromEntries(rows)));
  }, []);

  const cards = [
    { t: 'sermons', label: 'Sermons' }, { t: 'books', label: 'Books' },
    { t: 'events', label: 'Events' }, { t: 'branches', label: 'Branches' },
    { t: 'leadership', label: 'Leaders' }, { t: 'testimonials', label: 'Testimonials' },
    { t: 'prayers', label: 'Prayer Requests' }, { t: 'subscribers', label: 'Subscribers' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.t} className="bg-[#16161A] border border-white/10 rounded-xl p-5">
          <div className="text-3xl font-heading font-bold text-brand">
            {counts[c.t] === undefined ? '—' : counts[c.t]}
          </div>
          <div className="text-sm text-gray-400 mt-1">{c.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Generic resource CRUD                                               */
/* ------------------------------------------------------------------ */
function blankForm(resource: Resource): Record<string, any> {
  const f: Record<string, any> = {};
  resource.fields.forEach((fl) => {
    f[fl.key] = fl.type === 'checkbox' ? false : fl.type === 'number' ? '' : '';
  });
  return f;
}

function ResourcePanel({ resource }: { resource: Resource }) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null); // row being edited, or {} for new, or null (closed)
  const [form, setForm] = useState<Record<string, any>>({});
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from(resource.table)
      .select('*')
      .order(resource.orderColumn, { ascending: resource.ascending ?? false });
    if (error) setError(error.message);
    setRows(data ?? []);
    setLoading(false);
  }, [resource]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const openNew = () => {
    setForm(blankForm(resource));
    setFiles({});
    setEditing({});
    setError(null);
  };
  const openEdit = (row: any) => {
    const f: Record<string, any> = {};
    resource.fields.forEach((fl) => (f[fl.key] = row[fl.key] ?? (fl.type === 'checkbox' ? false : '')));
    setForm(f);
    setFiles({});
    setEditing(row);
    setError(null);
  };
  const close = () => setEditing(null);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload: Record<string, any> = {};
      for (const fl of resource.fields) {
        if (fl.type === 'file') {
          const file = files[fl.key];
          if (file) {
            const path = `${resource.table}/${Date.now()}-${file.name}`;
            const url = await uploadFile('media', path, file);
            if (!url) throw new Error(`Upload failed for ${fl.label}`);
            payload[fl.key] = url;
          } else if (editing && editing[fl.key]) {
            payload[fl.key] = editing[fl.key]; // keep existing on edit
          }
          continue;
        }
        let v = form[fl.key];
        if (fl.type === 'number') v = v === '' || v === null ? null : Number(v);
        if (!fl.optional && (v === '' || v === null || v === undefined)) {
          throw new Error(`${fl.label} is required`);
        }
        payload[fl.key] = v;
      }

      const isNew = editing && !editing[resource.orderColumn] && !editing.id;
      if (isNew) {
        if (resource.generateId) payload.id = resource.generateId();
        const { error } = await supabase.from(resource.table).insert(payload);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(resource.table).update(payload).eq('id', editing.id);
        if (error) throw error;
      }
      close();
      await load();
    } catch (err: any) {
      setError(err.message ?? 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row: any) => {
    if (!confirm(`Delete "${row[resource.primaryLabel]}"? This cannot be undone.`)) return;
    const { error } = await supabase.from(resource.table).delete().eq('id', row.id);
    if (error) { setError(error.message); return; }
    setRows((r) => r.filter((x) => x.id !== row.id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <p className="text-sm text-gray-400">{rows.length} item{rows.length === 1 ? '' : 's'}</p>
        <button onClick={openNew} className="inline-flex items-center gap-2 bg-brand text-black font-semibold text-sm px-4 py-2 rounded-lg hover:bg-brand-light">
          <Plus className="w-4 h-4" /> Add {resource.title.replace(/s$/, '')}
        </button>
      </div>

      {error && !editing && <ErrorBox msg={error} />}

      {loading ? (
        <Loading />
      ) : rows.length === 0 ? (
        <Empty label={resource.title} />
      ) : (
        <div className="space-y-2">
          {rows.map((row) => (
            <div key={row.id} className="flex items-center gap-4 bg-[#16161A] border border-white/10 rounded-xl px-4 py-3">
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{row[resource.primaryLabel] || '(untitled)'}</div>
                <div className="text-xs text-gray-500 truncate">
                  {resource.fields.slice(1, 3).map((f) => row[f.key]).filter(Boolean).join(' · ')}
                </div>
              </div>
              <button onClick={() => openEdit(row)} className="p-2 text-gray-400 hover:text-brand" aria-label="Edit">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => remove(row)} className="p-2 text-gray-400 hover:text-red-400" aria-label="Delete">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <Modal onClose={close} title={`${editing.id ? 'Edit' : 'New'} ${resource.title.replace(/s$/, '')}`}>
          <form onSubmit={save} className="space-y-4">
            {error && <ErrorBox msg={error} />}
            {resource.fields.map((fl) => (
              <FieldInput
                key={fl.key}
                field={fl}
                value={form[fl.key]}
                existing={editing[fl.key]}
                onChange={(v) => setForm((f) => ({ ...f, [fl.key]: v }))}
                onFile={(file) => setFiles((s) => ({ ...s, [fl.key]: file }))}
              />
            ))}
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-brand text-black font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-brand-light disabled:opacity-60">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
              </button>
              <button type="button" onClick={close} className="px-5 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/5">Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function FieldInput({
  field, value, existing, onChange, onFile,
}: {
  field: Field; value: any; existing: any;
  onChange: (v: any) => void; onFile: (f: File | null) => void;
}) {
  const label = (
    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
      {field.label}{field.optional ? '' : ' *'}
    </label>
  );
  const cls = 'w-full bg-[#202026] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-brand';

  if (field.type === 'checkbox') {
    return (
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="rounded border-white/20 bg-[#202026] text-brand" />
        <span className="text-sm text-gray-300">{field.label}</span>
      </label>
    );
  }
  if (field.type === 'file') {
    return (
      <div>
        {label}
        {existing && <div className="text-xs text-gray-500 mb-1 truncate">Current: {String(existing)}</div>}
        <input type="file" accept={field.accept} onChange={(e) => onFile(e.target.files?.[0] ?? null)} className="w-full text-sm text-gray-300 file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-white" />
      </div>
    );
  }
  if (field.type === 'textarea') {
    return (
      <div>{label}<textarea value={value ?? ''} onChange={(e) => onChange(e.target.value)} rows={3} placeholder={field.placeholder} className={cls} /></div>
    );
  }
  if (field.type === 'select') {
    return (
      <div>{label}
        <select value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={cls}>
          <option value="">—</option>
          {field.options?.map((o) => <option key={o} value={o} className="bg-[#202026]">{o}</option>)}
        </select>
      </div>
    );
  }
  return (
    <div>{label}
      <input
        type={field.type === 'number' ? 'number' : 'text'}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className={cls}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Homepage single-row panel                                           */
/* ------------------------------------------------------------------ */
function HomepagePanel() {
  const [form, setForm] = useState<Record<string, any>>({
    stats_churches: '', stats_pastors: '', stats_lives: '', stats_countries: '',
    hero_headline: '', hero_subheadline: '', hero_image_url: '',
  });
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('homepage_content').select('*').eq('id', 1).maybeSingle().then(({ data }) => {
      if (data) setForm(data);
      setLoading(false);
    });
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(null); setMsg(null);
    try {
      let heroUrl = form.hero_image_url;
      if (heroFile) {
        const url = await uploadFile('media', `homepage/${Date.now()}-${heroFile.name}`, heroFile);
        if (!url) throw new Error('Hero image upload failed');
        heroUrl = url;
      }
      const payload = { ...form, id: 1, hero_image_url: heroUrl };
      const { error } = await supabase.from('homepage_content').upsert(payload, { onConflict: 'id' });
      if (error) throw error;
      setForm(payload);
      setMsg('Saved.');
    } catch (err: any) {
      setError(err.message ?? 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;
  const cls = 'w-full bg-[#202026] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand';
  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <form onSubmit={save} className="space-y-6 max-w-2xl">
      {error && <ErrorBox msg={error} />}
      {msg && <div className="rounded-lg bg-green-500/10 border border-green-500/30 px-3 py-2.5 text-sm text-green-300">{msg}</div>}

      <section>
        <h3 className="font-heading font-semibold mb-3">Hero</h3>
        <div className="space-y-4">
          <div><L>Headline</L><input value={form.hero_headline ?? ''} onChange={(e) => set('hero_headline', e.target.value)} className={cls} /></div>
          <div><L>Sub-headline</L><textarea value={form.hero_subheadline ?? ''} onChange={(e) => set('hero_subheadline', e.target.value)} rows={2} className={cls} /></div>
          <div>
            <L>Hero image</L>
            {form.hero_image_url && <div className="text-xs text-gray-500 mb-1 truncate">Current: {form.hero_image_url}</div>}
            <input type="file" accept="image/*" onChange={(e) => setHeroFile(e.target.files?.[0] ?? null)} className="w-full text-sm text-gray-300 file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-white" />
          </div>
        </div>
      </section>

      <section>
        <h3 className="font-heading font-semibold mb-3">Impact stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <div><L>Churches</L><input value={form.stats_churches ?? ''} onChange={(e) => set('stats_churches', e.target.value)} className={cls} /></div>
          <div><L>Pastors</L><input value={form.stats_pastors ?? ''} onChange={(e) => set('stats_pastors', e.target.value)} className={cls} /></div>
          <div><L>Lives</L><input value={form.stats_lives ?? ''} onChange={(e) => set('stats_lives', e.target.value)} className={cls} /></div>
          <div><L>Countries</L><input value={form.stats_countries ?? ''} onChange={(e) => set('stats_countries', e.target.value)} className={cls} /></div>
        </div>
      </section>

      <button type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-brand text-black font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-brand-light disabled:opacity-60">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
      </button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Prayer requests                                                     */
/* ------------------------------------------------------------------ */
const PRAYER_STATUSES = ['Pending', 'Answered', 'Prophetic Action'];
function PrayersPanel() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await supabase.from('prayers').select('*').order('created_at', { ascending: false });
    setRows(data ?? []);
    setLoading(false);
  }, []);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const setStatus = async (id: string, status: string) => {
    await supabase.from('prayers').update({ status }).eq('id', id);
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
  };
  const remove = async (id: string) => {
    if (!confirm('Delete this prayer request?')) return;
    await supabase.from('prayers').delete().eq('id', id);
    setRows((r) => r.filter((x) => x.id !== id));
  };

  if (loading) return <Loading />;
  if (rows.length === 0) return <Empty label="prayer requests" />;
  return (
    <div className="space-y-3">
      {rows.map((p) => (
        <div key={p.id} className="bg-[#16161A] border border-white/10 rounded-xl p-4">
          <div className="flex justify-between gap-3">
            <div className="min-w-0">
              <div className="font-medium">{p.name} {p.branch && <span className="text-xs text-gray-500">· {p.branch}</span>}</div>
              <p className="text-sm text-gray-300 mt-1">{p.request}</p>
              <div className="text-xs text-gray-600 mt-1">{new Date(p.created_at).toLocaleString()}</div>
            </div>
            <button onClick={() => remove(p.id)} className="p-2 text-gray-400 hover:text-red-400 h-fit"><Trash2 className="w-4 h-4" /></button>
          </div>
          <div className="flex gap-2 mt-3">
            {PRAYER_STATUSES.map((s) => (
              <button key={s} onClick={() => setStatus(p.id, s)} className={`text-xs px-2.5 py-1 rounded-full border ${p.status === s ? 'bg-brand text-black border-brand font-semibold' : 'border-white/15 text-gray-400 hover:text-white'}`}>{s}</button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Subscribers                                                         */
/* ------------------------------------------------------------------ */
function SubscribersPanel() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await supabase.from('subscribers').select('*').order('created_at', { ascending: false });
    setRows(data ?? []);
    setLoading(false);
  }, []);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const remove = async (id: string) => {
    await supabase.from('subscribers').delete().eq('id', id);
    setRows((r) => r.filter((x) => x.id !== id));
  };
  const exportCsv = () => {
    const csv = ['email,subscribed_at', ...rows.map((r) => `${r.email},${r.created_at}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'subscribers.csv';
    a.click();
  };

  if (loading) return <Loading />;
  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <p className="text-sm text-gray-400">{rows.length} subscriber{rows.length === 1 ? '' : 's'}</p>
        {rows.length > 0 && <button onClick={exportCsv} className="text-sm px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15">Export CSV</button>}
      </div>
      {rows.length === 0 ? <Empty label="subscribers" /> : (
        <div className="space-y-2">
          {rows.map((r) => (
            <div key={r.id} className="flex items-center gap-4 bg-[#16161A] border border-white/10 rounded-xl px-4 py-3">
              <div className="flex-1 min-w-0 truncate">{r.email}</div>
              <div className="text-xs text-gray-600">{new Date(r.created_at).toLocaleDateString()}</div>
              <button onClick={() => remove(r.id)} className="p-2 text-gray-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Small shared UI                                                     */
/* ------------------------------------------------------------------ */
function L({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">{children}</label>;
}
function Loading() {
  return <div className="flex items-center gap-2 text-gray-500 py-10 justify-center"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>;
}
function Empty({ label }: { label: string }) {
  return <div className="text-center text-gray-500 py-16 border border-dashed border-white/10 rounded-xl">No {label} yet.</div>;
}
function ErrorBox({ msg }: { msg: string }) {
  return <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2.5 text-sm text-red-300">{msg}</div>;
}
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 md:p-10 bg-black/60 overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-lg bg-[#16161A] border border-white/10 rounded-2xl p-6 my-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-heading font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
